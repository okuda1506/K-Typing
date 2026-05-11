import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { AppModule } from '../src/app.module';

describe('UserController (e2e)', () => {
    let app: INestApplication;

    beforeEach(async () => {
        const moduleFixture: TestingModule = await Test.createTestingModule({
            imports: [AppModule], // 本物のAppModuleを使う
        }).compile();

        app = moduleFixture.createNestApplication();
        await app.init();
    });

    afterEach(async () => {
        await app.close();
    });

    // GET /users
    it('/users (GET)', () => {
        return request(app.getHttpServer())
            .get('/users')
            .expect(200)
            .expect((res) => {
                expect(res.body).toBeInstanceOf(Array);
                expect(res.body.length).toBeGreaterThan(0);
            });
    });

    // GET /users/:id
    it('/users/1 (GET)', () => {
        return request(app.getHttpServer())
            .get('/users/1')
            .expect(200)
            .expect((res) => {
                expect(res.body).toHaveProperty('id', 1);
                expect(res.body).toHaveProperty('name');
            });
    });

    // GET /users/:id 存在しないID
    it('/users/999 (GET) - not found', () => {
        return request(app.getHttpServer())
            .get('/users/999')
            .expect(404);
    });

    // POST /users
    it('/users (POST)', () => {
        return request(app.getHttpServer())
            .post('/users')
            .send({ name: 'たくっち', email: 'takucchi@example.com' })
            .expect(201)
            .expect((res) => {
                expect(res.body).toHaveProperty('id');
                expect(res.body.name).toBe('たくっち');
            });
    });
});
