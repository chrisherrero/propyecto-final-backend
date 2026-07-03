const request = require('supertest');
const app = require('../src/app');
const child_process = require('child_process');

jest.mock('child_process');

describe('Test de endpoints de Adopciones', () => {
    const originalEnv = process.env;

    beforeEach(() => {
        jest.clearAllMocks();
        process.env = { ...originalEnv };
    });

    afterAll(() => {
        process.env = originalEnv;
    });

    describe('GET /adoptions', () => {
        it('tiene que devolver todas las adopciones y un status 200', async () => {
            const response = await request(app).get('/adoptions');
            expect(response.status).toBe(200);
            expect(Array.isArray(response.body)).toBeTruthy();
        });
    });

    describe('GET /adoptions/:id', () => {
        it('tiene que devolver una adopcion especifica segun su id', async () => {
            const response = await request(app).get('/adoptions/1');
            expect(response.status).toBe(200);
            expect(response.body.id).toBe(1);
        });

        it('tira error 404 si le paso un id que no existe', async () => {
            const response = await request(app).get('/adoptions/999');
            expect(response.status).toBe(404);
            expect(response.body.error).toBe('Adoption not found');
        });
    });

    describe('POST /adoptions', () => {
        it('falla con status 400 si le mando un body incompleto', async () => {
            const response = await request(app).post('/adoptions').send({ petId: 123 });
            expect(response.status).toBe(400);
        });

        it('crea la adopcion directo si la variable de entorno esta en skip', async () => {
            process.env.VALIDATION_MODE = 'skip';
            const response = await request(app)
                .post('/adoptions')
                .send({ petId: 125, userId: 458 });
            
            expect(response.status).toBe(201);
            expect(response.body.petId).toBe(125);
        });

        it('crea la adopcion si el proceso de validacion externo da el ok', async () => {
            process.env.VALIDATION_MODE = 'strict';
            
            const mockStdout = {
                on: jest.fn((event, cb) => {
                    if (event === 'data') {
                        cb(Buffer.from(JSON.stringify({ valid: true })));
                    }
                })
            };
            child_process.spawn.mockReturnValue({ stdout: mockStdout });

            const response = await request(app)
                .post('/adoptions')
                .send({ petId: 126, userId: 459 });

            expect(response.status).toBe(201);
            expect(child_process.spawn).toHaveBeenCalled();
        });

        it('rechaza la adopcion con 403 si el proceso externo falla', async () => {
            process.env.VALIDATION_MODE = 'strict';
            
            const mockStdout = {
                on: jest.fn((event, cb) => {
                    if (event === 'data') {
                        cb(Buffer.from(JSON.stringify({ valid: false })));
                    }
                })
            };
            child_process.spawn.mockReturnValue({ stdout: mockStdout });

            const response = await request(app)
                .post('/adoptions')
                .send({ petId: 127, userId: 460 });

            expect(response.status).toBe(403);
            expect(response.body.error).toBe('Validation failed');
        });
    });
});