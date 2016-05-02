#Development Guidelines
This application is initialized with the required modules and folders it should have. However, it is flexible to change as proper when we got new good idea.
## Project structure

This project is formed the folder and file structure as below:
* common - Store common functions use across the application
* logs - Store log files
* public - Store UI related files
* services - Store service files. One service per file
* tests - Store test unit test files
* app.js - High level integrate with services


## Development
First time installation
- Run: npm install

Development
- Run: gulp dev
- Run: node app

Production
- Run: gulp
- Run: node app

## Linting
Eslint has been configured for this project
Please configure your IDE/texteditor to work with it



## Services Implementation
When a service (REST service) need to be created, put it in service file, add logger as proper and export the function as below.
The export function will then used in app.js

```
//The code below is in location.js
//Declare logger
var log4js = require('log4js');
log4js.loadAppender('file');
log4js.addAppender(log4js.appenders.file('logs/stub.log'), 'stub');
var logger = log4js.getLogger('stub');
//export function to be available in app
exports.nearestService = function(req, res) {
  logger.info("nearestService is invoked");
  return res.json({
    "Status": 'OK'
  });
};
```
# Service Unit Testing
In your service may have many service dependencies, you can test logic you implement in your service and stub the service dependencies by using "proxyquire". See the example below:

```
var proxyquire = require('proxyquire')
var assert = require('assert');
//import the log4j stub service
//please refer to the stub service in stub folder
//the other stub services will be implemented in the same fashion

var log4jsStub = require('./stubs/log4js').stub;
//create res stub. it is used in the real service
var resStub = {
  json: function(jsonInstance) {
    return jsonInstance;
  }
};

//import the service to be tested and supply all service dependencies as stub
var location = proxyquire('../services/location', {
  'log4js': log4jsStub,
  'res': resStub
});

describe('Services', function() {
	describe('Geolocation', function() {
		it('should take a longitude/latitude within lat 90 to -90 and long 180 to -180', function () {
			var reqStub = {
				'query': {
					'latitude': -80.12345678,
					'longitude': 176.12345678
				}
			};
			//Invoke the service
			var response = geolocation.nearestServices(reqStub, resStub);

			//Assert the response
			assert.equal(response.Status, 'OK');
		})
	})
})
```

Then change directory to test folder and run command (requires [mocha](http://mochajs.org) installation)
```
mocha
```

##Integrate services
To integrate services, perform the following steps:
* Open the app.js, import the service that you implemented in services folder

```
var location = require('./services/location');
```
* Add REST method and path then supply the service exported function

```
app.get('/nearestService', location.nearestService);
```
