import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User, UserAvailability } from './user.entity';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly usersRepository: Repository<User>,
  ) {}

  findAll() {
    return this.usersRepository.find();
  }

  findById(id: number) {
    return this.usersRepository.findOne({ where: { id } });
  }

  findByEmail(email: string) {
    // Include passwordHash explicitly; it's excluded by default via select:false
    return this.usersRepository.findOne({
      where: { email },
      select: {
        id: true,
        email: true,
        fullName: true,
        availability: true,
        passwordHash: true,
      },
    });
  }

  async toggleAvailability(id: number) {
    const user = await this.findById(id);
    if (!user) {
      throw new NotFoundException('User not found');
    }
    user.availability =
      user.availability === UserAvailability.AVAILABLE
        ? UserAvailability.UNAVAILABLE
        : UserAvailability.AVAILABLE;
    return this.usersRepository.save(user);
  }

  async create(user: Partial<User>) {
    const entity = this.usersRepository.create(user);
    if (user.passwordHash && !user.passwordHash.startsWith('$2')) {
      // If a raw password accidentally passed as passwordHash, hash it.
      entity.passwordHash = await bcrypt.hash(String(user.passwordHash), 10);
    }
    return this.usersRepository.save(entity);
  }
}
