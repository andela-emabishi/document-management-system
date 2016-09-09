// Write a test that validates that all documents are returned, limited by a specified number, when Documents.all is called with a query parameter limit.
// Write a test that also employs the limit above with an offset as well (pagination). So documents could be fetched in chunks e.g 1st 10 document, next 10 documents (skipping the 1st 10) and so on.
// Write a test that validates that all documents are returned in order of their published dates, starting from the most recent when Documents.all is called.
// Write a test that validates that all documents, limited by a specified number and ordered by published date, that can be accessed by a specified role.
// Write a test that validates that all documents, limited by a specified number, that were published on a certain date.

const app = require('../../index');
const request = require('supertest')(app);
const Document =  require('../../server/models/document');

describe('Document tests', () => {

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
      privacy: 'private'
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
      content: 'It was the best of times, it was the worst of times. It was the age of wisdom, it was the age of...'
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
      content: 'It was the best of times, it was the worst of times.'
    })
    .end((err, res) => {
      expect(res.status).toBe(401);
      done();
    });
  });


  it('Should return all documents created by a user using their user id', (done) => {
    request
    .get('/api/users/57c94278517ca48c9e5af00f/documents')
    .end((err, res) => {
      // expect(res.status).toBe(200);
      expect(res.status).not.toBe(404);
      expect(res.body).toBeDefined();
      expect((Object.keys(res.body)).length).toBeGreaterThan(0);
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
