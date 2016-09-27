module.exports = {
  development: {
    port: process.env.PORT || 3000,
    superSecret: 'iloveexistentialquestionslikewhydoweexist',
    database: 'mongodb://localhost:27017/27017',
  },
  test: {
    port: process.env.PORT || 8080,
    database: 'mongodb://localhost:27017/dochero-test',
    superSecret: 'iloveexistentialquestionslikewhydoweexist',
  },
};
