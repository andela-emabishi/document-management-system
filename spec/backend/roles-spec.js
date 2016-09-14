const app = require('../../index');
const request = require('supertest')(app);

describe('Role tests', () => {
  // Before each test, log in victor hugo
  let token;

  beforeAll((done) => {
    request
    .post('/api/login')
    .send({
      username: 'vichugo',
      password: 'victorhugo',
    })
    .end((err, res) => {
      token = res.body.token;
      done();
    });
  });

  it('Should validate that a new role created is unique', (done) => {
    request
      .post('/api/roles')
      .set('x-access-token', token)
      .send({
        title: 'editor',
        permission: 'readWrite',
      })
      .end((err, res) => {
        expect(res.body.message).toBe('Please provide a unique title');
        expect(res.status).not.toBe(201);
        done();
      });
  });

  it('Should validate that all roles are returned', (done) => {
    request
    .get('/api/roles')
    .set('x-access-token', token)
    .end((err, res) => {
      expect(res.status).toBe(200);
      expect(res.status).not.toBe(404);
      expect(res.body).toBeDefined();
      expect(Array.isArray(res.body)).toBe(true);
      done();
    });
  });

  it('Should validate that only a supra-admin can update role information', (done) => {
    request
    .put('/api/roles/65c975eb2c3d08864b51cd08')
    .set('x-access-token', token)
    .send({
      title: 'super-editor',
    })
    .end((err, res) => {
      expect(res.status).toBe(200);
      expect(res.status).not.toBe(401);
      expect(res.body).toBeDefined();
      expect(res.body.message).toBe('Role details updated successfully');
      done();
    });
  });

  it('Should validate that a user is able to get a role by its id', () => {
    request
    .get('/api/users/45c975eb2c3d08864b51cd09')
    .set('x-access-token', token)
    .end((err, res) => {
      expect(res.status).toBe(200);
      expect(res.body.message).not.toBe('Error fetching role');
    });
  });

  it('Should validate that a role can be deleted', (done) => {
    request
    .delete('/api/roles/45c975eb2c3d08864b51cd08')
    .set('x-access-token', token)
    .end((err, res) => {
      expect(res.status).toBe(200);
      expect(res.body.status).not.toBe('401: Unauthorised');
      expect(res.body.message).toBe('Role deleted successfully');
      done();
    });
  });
});
