const app = require('../../index');
const request = require('supertest')(app);

describe('Authentication tests', () => {
  it('Displays a welcome message', (done) => {
    request
    .get('/api')
    .expect('Welcome to the DOCHERO api', done);
  });

  // Assert that a user can signup
  it('Signs up a user', (done) => {
    request
      .post('/api/users')
      .send({
        firstname: 'Ada',
        lastname: 'Lovelace',
        username: 'ada',
        password: 'analyticalengine',
        email: 'ada@lovelace.com',
        title: 'admin',
      })
      .end((err, res) => {
        expect(res.status).toBe(201);
        expect((res.body.user._id).length).toBe(24);
        expect(res.body.token).toBeDefined();
        expect(res.body.user.firstname).toBeDefined();
        expect(res.body.message).toBe('User created successfully');
        done();
      });
  });

  it('A user should be able to log in', (done) => {
    request
      .post('/api/users/login')
      .send({
        username: 'ada',
        password: 'analyticalengine',
      })
      .end((err, res) => {
        expect(res.body.user).toBeDefined();
        expect((res.body.user._id).length).toBe(24);
        expect(res.body.token).toBeDefined();
        expect(res.body.token).toBeDefined();
        expect(res.status).toBe(200);
        expect(res.body.message).toBe('Enjoy your token! You\'ve just been logged in');
        done();
      });
  });

  it('Should detect a wrong password entry', (done) => {
    request
      .post('/api/users/login')
      .send({
        username: 'ada',
        password: 'analyticalengines',
      })
      .end((err, res) => {
        expect(res.status).toBe(401);
        expect(res.body.token).not.toBeDefined();
        expect(res.body.message).toBe('Wrong password. Failed to authenticate');
        done();
      });
  });

  it('Should not log in an unregistered user', (done) => {
    request
      .post('/api/users/login')
      .send({
        username: 'cbabbage',
        password: 'charlesbabbage',
      })
      .end((err, res) => {
        expect(res.status).toBe(404);
        expect(res.body.token).not.toBeDefined();
        expect(res.body.message).toBe('User not found');
        done();
      });
  });

  it('Should fail to authenticate a user with an invalid token', (done) => {
    request
      .post('/api/documents')
      .set('x-access-token', 'abcdefghijk')
      .end((err, res) => {
        expect(res.body.message).toBe('Failed to authenticate token');
        expect(res.status).toBe(401);
        done();
      });
  });
});
