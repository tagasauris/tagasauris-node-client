'use strict'

var should = require('should'),
    nock   = require('nock'),
    Client = require('./index.js');

// Global_Mocks
var auth_mock,
    credentials;

describe('<Unit Tests>', function() {
  describe('<Authorization>', function() {
    beforeEach( function(done) {
      auth_mock = nock('https://stable.tagasauris.com');
      credentials = {login: 'user1234',
                        api_key: 'key1234'};
      done();
    });
    
    it('Return Auth Statement For Success Auth', function(done) {
      var client = new Client(credentials),
      returnFunc = function(error, response, body) {
        body.should.equal('{"login":"done"}');
        should.not.exist(error);
        done();  
      };
      
      auth_mock
        .post('/api/2/login/')
        .reply(200, {login: "done"})
        .log(console.log);
      
      client.authorize(returnFunc);
      
    });
  });
});