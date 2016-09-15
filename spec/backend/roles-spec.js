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

  it('Should validate that a new role can be created', (done) => {
    request
    .post('/api/roles')
    .set('x-access-token', token)
    .send({
      title: 'manager',
      permission: 'readWrite',
    })
    .end((err, res) => {
      expect(res.status).toBe(201);
      expect(res.body.status).toBe('201: Resource Created');
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

  it('Should validate that a supra-admin can update role information', (done) => {
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

  it('Should validate that a user is able to get a role by its id', (done) => {
    request
    .get('/api/roles/65c975eb2c3d08864b51cd08')
    .set('x-access-token', token)
    .end((err, res) => {
      expect(res.status).toBe(200);
      expect(res.body.message).not.toBe('Error fetching role');
      done();
    });
  });

  it('Should return a message if no role by a user provided id is not found', (done) => {
    request
    .get('/api/roles/65c975eb2c4d08864b51cd08')
    .set('x-access-token', token)
    .end((err, res) => {
      expect(res.status).toBe(404);
      expect(res.body.message).toBe('No role by that id found');
      done();
    });
  });

  it('Should validate that a role can be deleted', (done) => {
    request
    .delete('/api/roles/57da83ac2f1cc5c32bedb1db')
    .set('x-access-token', token)
    .end((err, res) => {
      expect(res.status).toBe(200);
      expect(res.body.status).not.toBe('401: Unauthorised');
      expect(res.body.message).toBe('Role deleted successfully');
      done();
    });
  });
});
