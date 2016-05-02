var proxyquire = require('proxyquire')
var assert = require('assert');
var log4jsStub = require('./stubs/log4js').stub;
//This is a skeleton
var resStub = {
  json: function(jsonInstance) {
    return jsonInstance;
  }
};
var reqStub = {
  'query': {
    'question': 'Where can I get confidential advice?'
  }
};

var questionAnswer = proxyquire('../services/questionAnswer', {
  'log4js': log4jsStub,
  'res': resStub
});

describe('Services', function() {
  describe('Question & Answer', function() {
    it('should .. fill in what this function should do', function() {
      var response = questionAnswer.answerQueries(reqStub, resStub,
        function(err, res) {
          if (err) {
            throw err;
          }

          console.log(JSON.stringify(res));
          //assert.equal(res.Status, 'OK');
          done();
        });


    })
  })
})
