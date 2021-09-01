const express = require('express');
const index = require('../routes/index');
const person = require('../routes/person');
const movie = require('../routes/movie');
const relationship = require('../routes/relationship');
const error = require('../middleware/error');

module.exports = function(app) {
  app.use(express.json());
  app.use('/', index);
  app.use('/api/person', person);
  app.use('/api/movie', movie);
  app.use('/api/relationship', relationship);
  app.use(error);
};
