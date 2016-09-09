// TODO: Write a test that validates that a new user created has a role defined.


const app = require('../../index');
const request = require('supertest')(app);
const User =  require('../../server/models/user');

describe('User tests', () => {

  // Before each test, log in victor hugo
  let token;
  let id;
  let title;

  beforeAll((done) => {
    request
    .post('/api/login')
    .send({
      username: 'vichugo',
      password: 'victorhugo'
    })
    .end((err, res) => {
      token = res.body.token;
      title = res.body.title;
      id = res.body.id;
      done();
    });
  });

  it('Should validate that a new user created is unique', (done) => {
    request
      .post('/api/signup')
      .send({
        firstname: 'Charlotte',
        lastname: 'Bronte',
        username: 'charl',
        password: 'charlottebronte',
        email: 'charlote@bronte.com',
      })
      .end((err, res) => {
        expect(res.body.message).toBe('Please provide a unique username');
        done();
      });
  });

  it('Should validate that a new user created has both a firstname and a lastname', (done) => {
    const firstname = User.schema.path('firstname');
    const lastname = User.schema.path('lastname');
    expect(firstname.options.required).toBe(true);
    expect(lastname.options.required).toBe(true);
    done();
  });

  it('Should validate that all users are returned', (done) => {
    request
    .get('/api/users')
    .set('x-access-token', token)
    .end((err, res) => {
      expect(res.status).toBe(200);
      expect(res.status).not.toBe(401);
      // expect(res.body.title).toBe('supra-admin');
      expect(res.body).toBeDefined();
      expect(Array.isArray(res.body)).toBe(true);
      done();
    });
  });

  it('Should get a user by their id', () => {
    request
    .get('/api/users/57c942a8517ca48c9e5af010')
    .set('x-access-token', token)
    .end((err, res) => {
      expect(res.status).toBe(200);
      expect(res.status).not.toBe(404);
      expect(res.body).toBeDefined();
      expect((res.body)._id).toBeDefined();
    });
  });

});
