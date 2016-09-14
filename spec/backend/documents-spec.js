const app = require('../../index');
const request = require('supertest')(app);
const Document = require('../../server/models/document');

describe('Document tests', () => {
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

  it('Should validate that a new user document created has a published date defined', (done) => {
    const datePublished = Document.schema.path('createdAt');
    expect(datePublished).toBeDefined();
    done();
  });

  it('Should validate that a user can create documents', (done) => {
    request
    .post('/api/documents')
    .set('x-access-token', token)
    .send({
      title: 'An idea',
      content: 'Whose time has come',
      privacy: 'private',
    })
    .end((err, res) => {
      expect(res.status).toBe(201);
      expect(res.body.message).toBe('Document created successfully');
      done();
    });
  });

  it('Should validate that all public and the users\' own documents are returned', (done) => {
    request
    .get('/api/documents')
    .set('x-access-token', token)
    .end((err, res) => {
      expect(res.status).toBe(200);
      expect(res.body).toBeDefined();
      expect(Array.isArray(res.body)).toBe(true);
      done();
    });
  });

  it('Should get a document by its id provided it belongs to the logged in user ', () => {
    request
    .get('/api/documents/57c975eb2c3d08864b51cd08')
    .set('x-access-token', token)
    .end((err, res) => {
      expect(res.status).toBe(200);
      expect(res.status).not.toBe(401);
    });
  });

  it('Should validate that a user can update their own documents', (done) => {
    request
    .put('/api/documents/57c975eb2c3d08864b51cd08')
    .set('x-access-token', token)
    .send({
      content: 'It was the best of times, it was the worst of times. It was the age of wisdom, it was the age of...',
    })
    .end((err, res) => {
      expect(res.status).toBe(200);
      expect(res.status).not.toBe(401);
      expect(res.body).toBeDefined();
      expect(res.body.message).toBe('Document details updated successfully');
      done();
    });
  });

  it('Should validate that only a user can update their own details', (done) => {
    request
    .put('/api/documents/57c975eb2c3d08864b51cd0a')
    .set('x-access-token', token)
    .send({
      content: 'It was the best of times, it was the worst of times.',
    })
    .end((err, res) => {
      expect(res.status).toBe(404);
      expect(res.body.message).toBe('Could not update document by the id entered');
      done();
    });
  });


  it('Should return all documents created by a user using their user id', (done) => {
    request
    .get('/api/users/57c94278517ca48c9e5af00f/documents')
    .set('x-access-token', token)
    .end((err, res) => {
      expect(res.status).toBe(200);
      expect(res.status).not.toBe(404);
      expect(res.body).toBeDefined();
      expect((Object.keys(res.body)).length).toBeGreaterThan(0);
      done();
    });
  });

  it('Should return all documents, limited by a specified number', (done) => {
    request
    .get('/api/documents/limit/2')
    .set('x-access-token', token)
    .end((err, res) => {
      expect(res.status).toBe(200);
      expect(res.body).toBeDefined();
      expect(Array.isArray(res.body)).toBe(true);
      expect(res.body.length).toBe(2);
      done();
    });
  });

  it('Should return all documents in order of their publishing date', (done) => {
    request
    .get('/api/documents')
    .set('x-access-token', token)
    .end((err, res) => {
      expect(res.status).toBe(200);
      expect(res.body[0].createdAt).toBeGreaterThan(res.body[1].createdAt);
      done();
    });
  });

  it('Should have the ability to return paginated documents', (done) => {
    request
    .get('/api/documents/offset/1/1')
    .set('x-access-token', token)
    .end((err, res) => {
      expect(res.status).toBe(200);
      expect(res.status).not.toBe(400);
      expect(res.body.status).not.toBe('400: Bad request');
      expect(res.body.length).toBe(1);
      done();
    });
  });

  // Write a test that validates that all documents, limited by a specified number,
  //  that were published on a certain date.
  // it('Should return all documents published on a certain date, limited by a number', (done) => {
  //   request
  //   .get('/api/documents/date/2016-09-10T07:22:40.044Z/1')
  //   .set('x-access-token', token)
  //   .end((err, res) => {
  //     expect(res.status).toBe(200);
  //     expect(res.body[0].createdAt).toBe('2016-09-10T07:22:40.044Z');
  //     expect(res.body.length).toBe(1);
  //     done();
  //   });
  // });

  it('Should return all documents limited by a specific number that can be accessed by a specified role', (done) => {
    request
    .get('/api/documents/role/55c975eb2c3d08864b51cd08/1')
    .set('x-access-token', token)
    .end((err, res) => {
      expect(res.status).toBe(200);
      expect(res.status).not.toBe(401);
      expect(res.body).toBeDefined();
      expect((Object.keys(res.body)).length).toBe(1);
      done();
    });
  });

  it('Should return all documents that have been shared with someone', (done) => {
    request
    .get('/api/documents/share/57c94278517ca48c9e5af00f')
    .set('x-access-token', token)
    .end((err, res) => {
      expect(res.status).toBe(200);
      expect(res.body[0]).toBeDefined();
      done();
    });
  });

  it('Should validate that a document can be deleted by its id', (done) => {
    request
    .delete('/api/documents/57c975eb2c3d08864b51cd08')
    .set('x-access-token', token)
    .end((err, res) => {
      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      done();
    });
  });
});
