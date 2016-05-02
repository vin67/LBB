var proxyquire = require('proxyquire')
var assert = require('assert');
var log4jsStub = require('./stubs/log4js').stub;

var resStub = {
  json: function(jsonInstance) {
    return jsonInstance;
  }
};

var location = proxyquire('../services/location', {
  'log4js': log4jsStub,
  'res': resStub
});

describe('Services', function() {
  describe('Location', function() {
    it(
      'should take a longitude/latitude within lat 90 to -90 and long 180 to -180',
      function(done) {
        var reqStub = {
          'query': {
            'latitude': -80.12345678,
            'longitude': 176.12345678
          }
        };
        location.nearestService(reqStub, resStub, function(err, res) {
          if (err)
            throw err;
          assert.equal(res.Status, 'OK');
          done();
        });


      })
  })
})
