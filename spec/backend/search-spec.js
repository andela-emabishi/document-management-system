const app = require('../../index');
const request = require('supertest')(app);

describe('Document tests', () => {
  // Before each test, log in Victor Hugo
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

  describe('Search tests', () => {
    it('Should return all documents limited by a specific number that can be accessed by a specified role', (done) => {
      request
      .get('/api/search/role?role=55c975eb2c3d08864b51cd08&limit=1')
      .set('x-access-token', token)
      .end((err, res) => {
        expect(res.status).toBe(200);
        expect(res.status).not.toBe(404);
        expect(res.body).toBeDefined();
        expect((Object.keys(res.body)).length).toBe(1);
        done();
      });
    });
  });

  it('Should return documents published on a specific date when searched by publishing date', (done) => {
    request
    .get('/api/search/date?date=2016-09-15')
    .set('x-access-token', token)
    .end((err, res) => {
      expect(res.status).toBe(200);
      expect(res.body).toBeDefined();
      expect(Array.isArray(res.body)).toBe(true);
      expect(res.body.length).not.toBe(0);
      done();
    });
  });

  it('Should return a message if documents published on a specific date when searched were not found', (done) => {
    request
    .get('/api/search/date?date=2000-09-15')
    .set('x-access-token', token)
    .end((err, res) => {
      expect(res.status).toBe(404);
      expect(res.body.status).toBe('404: Resource Not Found');
      done();
    });
  });
});