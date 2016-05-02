var proxyquire = require('proxyquire')
var assert = require('assert');
var log4jsStub = require('./stubs/log4js').stub;

var resStub = {
  json: function(jsonInstance) {
    return jsonInstance;
  }
};

var geolocation = proxyquire('../services/geolocation', {
  'log4js': log4jsStub,
  'res': resStub
});

describe('Services', function() {
  describe('Geolocation', function() {
    it(
      'should take a longitude/latitude within lat 90 to -90 and long 180 to -180',
      function() {
        var reqStub = {
          'query': {
            'latitude': -80.12345678,
            'longitude': 176.12345678
          }
        };
        var response = geolocation.nearestServices(reqStub, resStub,
          function(err, res) {
            if (err)
              return done(err);
            //res.should.have.length(3);
            assert.equal(response.Status, 'OK');
            done();
          });


      })
  })
})
