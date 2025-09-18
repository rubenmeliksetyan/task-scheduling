import request from 'supertest';
import { INestApplication } from '@nestjs/common';
import { createTestingApp } from './utils';
import { UsersService } from '../src/users/users.service';

async function login(app: INestApplication, email: string, password: string): Promise<string> {
  const res = await request(app.getHttpServer())
    .post('/api/auth/login')
    .send({ email, password });
  return res.body.access_token as string;
}

describe('Tasks e2e', () => {
  let app: INestApplication;
  let users: UsersService;
  let token: string;

  beforeAll(async () => {
    const setup = await createTestingApp();
    app = setup.app;
    users = setup.users;
    await users.create({ email: 'admin@example.com', passwordHash: 'changeme', fullName: 'Admin' });
    await users.create({ email: 'alex@example.com', passwordHash: 'password', fullName: 'Alex' });
    token = await login(app, 'admin@example.com', 'changeme');
  });

  afterAll(async () => {
    await app.close();
  });

  it('rejects create with invalid assigneeId', async () => {
    await request(app.getHttpServer())
      .post('/api/tasks')
      .set('Authorization', `Bearer ${token}`)
      .send({ title: 'X', status: 'todo', assigneeId: 999 })
      .expect(404);
  });

  it('creates, updates, deletes a task', async () => {
    // create without assignee
    const created = await request(app.getHttpServer())
      .post('/api/tasks')
      .set('Authorization', `Bearer ${token}`)
      .send({ title: 'Test', description: 'Hello', status: 'todo' })
      .expect(201);
    expect(created.body.title).toBe('Test');
    const id = created.body.id as number;

    // update to assign a valid user (id 2)
    const updated = await request(app.getHttpServer())
      .patch(`/api/tasks/${id}`)
      .set('Authorization', `Bearer ${token}`)
      .send({ status: 'done', assigneeId: 2 })
      .expect(200);
    expect(updated.body.status).toBe('done');
    expect(updated.body.assignee?.id).toBe(2);

    // clear assignee with 0
    const cleared = await request(app.getHttpServer())
      .patch(`/api/tasks/${id}`)
      .set('Authorization', `Bearer ${token}`)
      .send({ assigneeId: 0 })
      .expect(200);
    expect(cleared.body.assignee).toBeNull();

    // delete
    await request(app.getHttpServer())
      .delete(`/api/tasks/${id}`)
      .set('Authorization', `Bearer ${token}`)
      .expect(200);
  });
});

