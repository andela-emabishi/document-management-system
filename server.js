/* eslint-disable no-console */

const express = require('express'),
  app = express(),
  port = process.env.PORT || 8080;

app.listen(port, function() {
  console.log('Server is listening at port 8080');
});
