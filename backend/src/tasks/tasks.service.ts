import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Like, Repository } from 'typeorm';
import { Task } from './task.entity';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { UsersService } from '../users/users.service';
import { NotificationsGateway } from '../notifications/notifications.gateway';

@Injectable()
export class TasksService {
  constructor(
    @InjectRepository(Task) private readonly repo: Repository<Task>,
    private readonly usersService: UsersService,
    private readonly notifications: NotificationsGateway,
  ) {}

  async findAll(params: { q?: string; status?: string; assigneeId?: number }) {
    const where: any = {};
    if (params.status) where.status = params.status;
    if (params.assigneeId) where.assignee = { id: params.assigneeId };

    if (params.q) {
      // search title or description
      return this.repo.find({
        where: [
          { ...where, title: Like(`%${params.q}%`) },
          { ...where, description: Like(`%${params.q}%`) },
        ],
        order: { createdAt: 'DESC' },
      });
    }

    return this.repo.find({ where, order: { createdAt: 'DESC' } });
  }

  async findOne(id: number) {
    const task = await this.repo.findOne({ where: { id } });
    if (!task) throw new NotFoundException('Task not found');
    return task;
  }

  async create(dto: CreateTaskDto) {
    const task = this.repo.create({
      title: dto.title,
      description: dto.description,
      dueDate: dto.dueDate ? new Date(dto.dueDate) : undefined,
      status: dto.status,
    });
    if (dto.assigneeId) {
      const user = await this.usersService.findById(dto.assigneeId);
      if (user) task.assignee = user;
    }
    const saved = await this.repo.save(task);
    this.notifications.taskCreated(saved);
    return saved;
  }

  async update(id: number, dto: UpdateTaskDto) {
    const task = await this.findOne(id);
    if (dto.title !== undefined) task.title = dto.title;
    if (dto.description !== undefined) task.description = dto.description;
    if (dto.dueDate !== undefined) task.dueDate = dto.dueDate ? new Date(dto.dueDate) : null;
    if (dto.status !== undefined) task.status = dto.status as any;
    if (dto.assigneeId !== undefined) {
      const user = dto.assigneeId ? await this.usersService.findById(dto.assigneeId) : null;
      task.assignee = user ?? null;
    }
    const saved = await this.repo.save(task);
    this.notifications.taskUpdated(saved);
    return saved;
  }

  async remove(id: number) {
    const task = await this.findOne(id);
    await this.repo.remove(task);
    return { deleted: true };
  }
}
