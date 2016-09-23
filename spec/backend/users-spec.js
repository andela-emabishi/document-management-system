const app = require('../../index');
const request = require('supertest')(app);
const User = require('../../server/models/user');
const sinon = require('sinon');

describe('User tests', () => {
  // Before each test, log in victor hugo
  let token;

  beforeAll((done) => {
    request
    .post('/api/users/login')
    .send({
      username: 'vichugo',
      password: 'victorhugo',
    })
    .end((err, res) => {
      token = res.body.token;
      done();
    });
  });

  it('Should validate that a new user created is unique', (done) => {
    request
      .post('/api/users')
      .send({
        firstname: 'Charlotte',
        lastname: 'Bronte',
        username: 'charl',
        password: 'charlottebronte',
        email: 'charlote@bronte.com',
      })
      .end((err, res) => {
        const username = User.schema.path('username');
        expect(username.options.unique).toBe(true);
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
      expect(res.body).toBeDefined();
      expect((res.body)._id).toBeDefined();
      expect((Object.keys(res.body)).length).toBeGreaterThan(0);
    });
  });

  it('Should validate that a user can update their own information', (done) => {
    request
    .put('/api/users/57c94278517ca48c9e5af00f')
    .set('x-access-token', token)
    .send({
      username: 'victorhugo',
    })
    .end((err, res) => {
      expect(res.status).toBe(200);
      expect(res.body).toBeDefined();
      expect(res.body.user.username).toBe('victorhugo');
      expect(res.body.message).toBe('User details updated successfully');
      done();
    });
  });

  it('Should validate that only a user can update their own details', (done) => {
    request
    .put('/api/users/57d05aea1cd5386e0d2ca88a')
    .set('x-access-token', token)
    .send({
      username: 'zod',
    })
    .end((err, res) => {
      expect(res.status).toBe(401);
      expect(res.body.status).toBe('401: Unauthorised');
      expect(res.body.message).toBe('Cannot update another users details');
      done();
    });
  });

  it('Should validate that a user can be deleted by their id', (done) => {
    request
    .delete('/api/users/57d05aea1cd5386e0d2ca88b')
    .set('x-access-token', token)
    .end((err, res) => {
      expect(res.status).toBe(200);
      expect(res.body.message).toBe('User and document details deleted successfully');
      done();
    });
  });

  it('Should return an error if a user was not found', (done) => {
    request
    .get('/api/users/57c942a8517ca48c9e5af012')
    .set('x-access-token', token)
    .end((err, res) => {
      expect(res.status).toBe(404);
      expect(res.body.status).toBe('404: Resource Not Found');
      done();
    });
  });

  it('Should validate that a new user created has a role defined', (done) => {
    request
    .get('/api/users/me/role')
    .set('x-access-token', token)
    .end((err, res) => {
      expect(res.body.title).toBeDefined();
      expect(res.body.title).toBe('supra-admin');
      expect(res.status).toBe(200);
      done();
    });
  });

  it('Should throw an error when the getAll function is called and there are no users', (done) => {
    sinon.stub(User, 'find', (callback, err) => {
      callback({ error: err });
    });
    request
    .get('/api/users')
    .set('x-access-token', token)
    .end((err, res) => {
      expect(res.status).toBe(500);
      expect(res.body.error).toBeDefined();
      done();
      User.find.restore();
    });
  });

  it('Should throw an error when the findById function is called and there'
  + 'is a server error', (done) => {
    sinon.stub(User, 'findById', (callback, err) => {
      callback({ error: err });
    });
    request
    .get('/api/users/57c942a8517ca48c9e5af010')
    .set('x-access-token', token)
    .end((err, res) => {
      expect(res.status).toBe(500);
      done();
      User.findById.restore();
    });
  });
});
