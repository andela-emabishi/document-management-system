// Create a test suite called `User`.
// Write a test that validates that a new user created is unique.
// Write a test that validates that a new user created has a role defined.
// Write a test that validates that a new user created both first and last names.
// Write a test that validates that all users are returned.


const app = require('../../index');
const request = require('supertest')(app);

describe('User tests', () => {
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
});
