const app = require('../../index');
const request = require('supertest')(app);

// Assert that a user can signup
describe('Authentication tests', () => {
  it('Displays a welcome message', (done) => {
    request
    .get('/api')
    .expect('Welcome to the DOCHERO api', done);
  });

  it('Signs up a user', (done) => {
    request
      .post('/api/signup')
      .send({
        firstname: 'Ada',
        lastname: 'Lovelace',
        username: 'ada',
        password: 'analyticalengine',
        email: 'ada@lovelace.com',
        title: 'admin'
      })
      .end((err, res) => {
        expect(res.status).toBe(201);
        expect(res.body.message).toBe('User created successfully');
        done();
      });
  });

  it('A user should be able to login', (done) => {
    request
    .post('/api/login')
    .send({
      username: 'ada',
      password: 'analyticalengine'
    })
    .end((err, res) => {
      expect(res.body.message).toBe('Enjoy your token! You\'ve just been logged in');
      expect(res.body.token).toBeDefined();
      done();
    });
  });

  it('Should detect a wrong password entry', (done) => {
    request
      .post('/api/login')
      .send({
        username: 'ada',
        password: 'analyticalengines'
      })
      .end((err, res) => {
        expect(res.body.message).toBe('Wrong password. Failed to authenticate');
        expect(res.body.token).not.toBeDefined();
        done();
      });
  });

  it('Should not log in an unregistered user', (done) => {
    request
    .post('/api/login')
    .send({
      username: 'cbabbage',
      password: 'charlesbabbage'
    })
    .end((err, res) => {
      expect(res.body.message).toBe('Authentication failed. User not found');
      expect(res.body.token).not.toBeDefined();
      done();
    });
  });

  it('Should fail to authenticate a user with an invalid token', (done) => {
    request
    .get('/api/login')
    .set('x-access-token', 'abcdefghijklmnopqrst')
    .end((err, res) => {
      expect(res.body.message).toBe('Failed to authenticate token');
      done();
    });
  });

})
