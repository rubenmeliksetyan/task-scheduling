import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { UsersService } from './users/users.service';
import { UserAvailability } from './users/user.entity';
import { TasksService } from './tasks/tasks.service';
import { TaskStatus } from './tasks/task.entity';
import * as bcrypt from 'bcrypt';

async function bootstrap() {
  const app = await NestFactory.createApplicationContext(AppModule);
  const users = app.get(UsersService);
  const tasks = app.get(TasksService);

  const adminEmail = process.env.SEED_ADMIN_EMAIL || 'admin@example.com';
  const adminPassword = process.env.SEED_ADMIN_PASSWORD || 'changeme';

  let admin = await users.findByEmail(adminEmail);
  if (!admin) {
    admin = await users.create({
      email: adminEmail,
      passwordHash: await bcrypt.hash(adminPassword, 10),
      fullName: 'Admin User',
      availability: UserAvailability.AVAILABLE,
    });
    // eslint-disable-next-line no-console
    console.log('Seeded admin:', adminEmail);
  } else {
    // eslint-disable-next-line no-console
    console.log('Admin already exists:', adminEmail);
  }

  // additional demo users
  const demoUsers = [
    { email: 'alex@example.com', name: 'Alex Johnson' },
    { email: 'sam@example.com', name: 'Sam Lee' },
    { email: 'taylor@example.com', name: 'Taylor Kim' },
  ];
  for (const u of demoUsers) {
    if (!(await users.findByEmail(u.email))) {
      await users.create({
        email: u.email,
        passwordHash: await bcrypt.hash('password', 10),
        fullName: u.name,
        availability: UserAvailability.AVAILABLE,
      });
    }
  }

  const list = await users.findAll();
  const someone = list.find((u) => u.email !== adminEmail);
  if (someone) {
    await tasks.create({
      title: 'Inspect equipment',
      description: 'Check AC units on floor 2',
      status: TaskStatus.TODO,
      assigneeId: someone.id,
    });
    await tasks.create({
      title: 'Prepare housekeeping report',
      description: 'Compile daily housekeeping logs',
      status: TaskStatus.IN_PROGRESS,
      assigneeId: someone.id,
    });
  }

  await app.close();
}

bootstrap().catch((e) => {
  // eslint-disable-next-line no-console
  console.error(e);
  process.exit(1);
});

