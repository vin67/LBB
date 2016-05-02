/*jshint node:true*/

//------------------------------------------------------------------------------
// node.js starter application for Bluemix
//------------------------------------------------------------------------------

// This application uses express as it's web server
// for more info, see: http://expressjs.com
var express = require('express');
var log4js = require('log4js');
var bodyParser = require('body-parser');
var location = require('./services/location');
var geolocation = require('./services/geolocation');
var database = require('./services/cloudantDB');

var questionAnswer = require('./services/questionAnswer');
var https = require('https');
var fs = require('fs');
var request = require('request');

// cfenv provides access to your Cloud Foundry environment
// for more info, see: https://www.npmjs.com/package/cfenv
var cfenv = require('cfenv');

// create a new express server
var app = express();

app.use(bodyParser.urlencoded({
  extended: true
}));
// serve the files out of ./public as our main files
app.use(express.static(__dirname + '/public/build'));

// get the app environment from Cloud Foundry
var appEnv = cfenv.getAppEnv();

//console log is loaded by default, so you won't normally need to do this
//log4js.loadAppender('console');
log4js.loadAppender('file');
//log4js.addAppender(log4js.appenders.console());
log4js.addAppender(log4js.appenders.file('logs/app.log'), 'app');

var logger = log4js.getLogger('app');
//The log level will be read from environment variable and replace the hardcode one
// logger.setLevel('DEBUG');
//
// logger.debug('Debug log entry');
// logger.info('Info log entry');
// logger.warn('Warn log entry');
// logger.error('Error log entry');

var allowCrossDomain = function(req, res, next) {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
  res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  // intercept OPTIONS method
  if ('OPTIONS' == req.method) {
    res.send(200);
  } else {
    next();
  }
};
app.use(allowCrossDomain);

database.initDBConnection();

//Get and Post methods implement here. REQUIRES parameter (address searching near) /nearestService?address=IBM+Southgate
app.get('/nearestService', location.nearestService);
app.get('/getServiceInformation', location.getServiceInformation);

// Takes a GET request like /api/geolocation?latitude=40.33&longitude=122.332
app.get('/api/geolocation', geolocation.nearestServices);
app.get('/api/questionAnswer',questionAnswer.answerQueries);
app.get('/api/questionAnswerCat',questionAnswer.answerQueriesCat);
// start server on the specified port and binding host
app.listen(appEnv.port, appEnv.bind, function() {

  // print a message when the server starts listening
  logger.info("Server starting on " + appEnv.url);
});
