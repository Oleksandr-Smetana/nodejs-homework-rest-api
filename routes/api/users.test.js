// 1. ответ должен иметь статус-код 200
// 2. в ответе должен возвращаться токен
// 3. в ответе должен возвращаться объект user с 2 полями email и subscription, имеющие тип данных String

const mongoose = require('mongoose');
const request = require('supertest');
require('dotenv').config();

// test database
const { DB_TEST_HOST } = process.env;
const app = require('../../app');

describe('test users', () => {
  // server test
  let server;
  beforeAll(() => (server = app.listen(3000)));
  afterAll(() => server.close());

  // connect and disconnect with database
  beforeEach(done => {
    mongoose.connect(DB_TEST_HOST).then(() => done());
  });
  afterEach(done => {
    // -------- case without database cleaning --------
    mongoose.connection.close(() => done());

    // -------- case with database cleaning (?) --------
    // mongoose.connection.db.dropDatabase(() => {
    //   mongoose.connection.close(() => done());
    // });
  });

  // login test
  test('test login route', async () => {
    const testUser = {
      email: 'alex@mail.com',
      password: '1234567890',
    };

    const response = await request(app)
      .post('/api/users/login')
      .send(testUser);
    // statuscode test
    expect(response.statusCode).toBe(200);
    // token field test
    expect(response.body.token).toBeTruthy();
    // email field test
    expect(typeof response.body.user.email).toBe('string');
    // subscription field test
    expect(typeof response.body.user.subscription).toBe('string');
  });
});
