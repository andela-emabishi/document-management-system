const app = require('../../index');
const request = require('supertest')(app);
const Role =  require('../../server/models/role');

describe('Role tests', () => {

  // Before each test, log in victor hugo
  let token;

  beforeAll((done) => {
    request
    .post('/api/login')
    .send({
      username: 'vichugo',
      password: 'victorhugo'
    })
    .end((err, res) => {
      token = res.body.token;
      done();
    });
  });

  it('Should validate that a new role created is unique', (done) => {
    request
      .post('/api/roles')
      .set('x-access-token',token)
      .send({
        title: 'editor',
        permission: 'readWrite'
      })
      .end((err, res) => {
        expect(res.body.message).toBe('Please provide a unique title');
        expect(res.status).not.toBe(201);
        done();
      });
  });

  // it('Should validate that all users are returned', (done) => {
  //   request
  //   .get('/api/users')
  //   .set('x-access-token', token)
  //   .end((err, res) => {
  //     expect(res.status).toBe(200);
  //     expect(res.status).not.toBe(401);
  //     // expect(res.body.title).toBe('supra-admin');
  //     expect(res.body).toBeDefined();
  //     expect(Array.isArray(res.body)).toBe(true);
  //     done();
  //   });
  // });

  // it('Should get a user by their id', () => {
  //   request
  //   .get('/api/users/57c942a8517ca48c9e5af010')
  //   .set('x-access-token', token)
  //   .end((err, res) => {
  //     expect(res.status).toBe(200);
  //     expect(res.status).not.toBe(404);
  //     expect(res.body).toBeDefined();
  //     expect((res.body)._id).toBeDefined();
  //     expect((Object.keys(res.body)).length).toBeGreaterThan(0);
  //   });
  // });

  // it('Should validate that a user can update their own information', (done) => {
  //   request
  //   .put('/api/users/57c94278517ca48c9e5af00f')
  //   .set('x-access-token', token)
  //   .send({
  //     username: 'victorhugo'
  //   })
  //   .end((err, res) => {
  //     expect(res.status).toBe(200);
  //     expect(res.status).not.toBe(401);
  //     expect(res.body).toBeDefined();
  //     expect(res.body.message).toBe('User details updated successfully');
  //     done();
  //   });
  // });

  // it('Should validate that a user can be deleted by their id', (done) => {
  //   request
  //   .delete('/api/users/57d05aea1cd5386e0d2ca88b')
  //   .set('x-access-token', token)
  //   .end((err, res) => {
  //     expect(res.status).toBe(200);
  //     expect(res.body.status).not.toBe('401: Unauthorised');
  //     expect(res.body.message).toBe('User deleted successfully');
  //     done();
  //   });
  // });

  // it('Should return an error if a user was not found', () => {
  //   request
  //   .get('/api/users/65c975eb2c4d08864b51cd08')
  //   .set('x-access-token', token)
  //   .end((err, res) => {
  //     expect(res.status).toBe(404);
  //     expect(res.body.status).toBe('404: Resource Not Found');
  //   });
  // });

});
