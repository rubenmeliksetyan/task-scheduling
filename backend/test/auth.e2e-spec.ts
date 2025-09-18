import request from 'supertest';
import { INestApplication } from '@nestjs/common';
import { createTestingApp } from './utils';
import { UsersService } from '../src/users/users.service';

describe('Auth e2e', () => {
  let app: INestApplication;
  let users: UsersService;

  beforeAll(async () => {
    const setup = await createTestingApp();
    app = setup.app;
    users = setup.users;
    await users.create({ email: 'admin@example.com', passwordHash: 'changeme', fullName: 'Admin' });
  });

  afterAll(async () => {
    await app.close();
  });

  it('logs in and returns a JWT', async () => {
    const res = await request(app.getHttpServer())
      .post('/api/auth/login')
      .send({ email: 'admin@example.com', password: 'changeme' })
      .expect(200);

    expect(res.body).toHaveProperty('access_token');
    expect(typeof res.body.access_token).toBe('string');
  });
});

