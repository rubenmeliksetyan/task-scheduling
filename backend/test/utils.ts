import { INestApplication, ValidationPipe } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersModule } from '../src/users/users.module';
import { TasksModule } from '../src/tasks/tasks.module';
import { AuthModule } from '../src/auth/auth.module';
import { User } from '../src/users/user.entity';
import { Task } from '../src/tasks/task.entity';
import { UsersService } from '../src/users/users.service';

export async function createTestingApp(): Promise<{ app: INestApplication; users: UsersService }> {
  process.env.JWT_SECRET = process.env.JWT_SECRET || 'test-secret';
  process.env.JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '1h';

  const moduleRef = await Test.createTestingModule({
    imports: [
      TypeOrmModule.forRoot({
        type: 'sqlite',
        database: ':memory:',
        entities: [User, Task],
        synchronize: true,
      }),
      UsersModule,
      AuthModule,
      TasksModule,
    ],
  }).compile();

  const app = moduleRef.createNestApplication();
  app.setGlobalPrefix('api');
  app.useGlobalPipes(
    new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true, transform: true })
  );
  await app.init();
  const users = app.get(UsersService);
  return { app, users };
}

