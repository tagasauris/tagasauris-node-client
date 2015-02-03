'use strict'

var should = require('should'),
    nock   = require('nock'),
    Client = require('./index.js');


describe('<Unit Tests>', function() {
  describe('<Authorization>', function() {
    var auth_mock,
        credentials;
    beforeEach( function(done) {
      auth_mock = nock('https://stable.tagasauris.com');
      credentials = {login: 'user1234',
                        api_key: 'key1234'};
      done();
    });
    
    it('Return Auth Statement For Success Auth', function(done) {
      var client = new Client(credentials),
      returnFunc = function(error, response, body) {
        JSON.parse(body).login.should.equal('done');
        should.not.exist(error);
        auth_mock.isDone().should.equal(true);
        done();  
      };
      
      auth_mock
        .post('/api/2/login/')
        .reply(200, {login: "done"});
      
      client.authorize(returnFunc);
      
    });
  });
  
  describe('<Workflow Definition>', function() {
    var stable_mock,
        credentials;
    beforeEach( function(done) {
      stable_mock = nock('https://stable.tagasauris.com');
      credentials = { login: 'user1234',
                      api_key: 'key1234' };
      done();
    });
    
    it('Return Workflow Definitions', function(done) {
      var client = new Client(credentials),
      returnFunc = function(error, response, body) {
        var parsed_body = JSON.parse(body);
        parsed_body[0].id.should.equal('wd1');
        stable_mock.isDone().should.equal(true);
        done()
      };
      stable_mock
        .post('/api/2/login/')
        .reply(200, {login: "done"});
      
      stable_mock
        .get('/api/2/workflowdefinition/')
        .reply(200, [{isExternal: true,
                      description: {short: "A Short Description",
                                    long: "A Long Description"},
                      id: "wd1",
                      name: "workflow definition 1"
                    },{
                      isExternal: true,
                      description: {short: "A Short Description2",
                                    long: "A Long Description2"},
                      id: "wd2",
                      name: "workflow definition 2"
                    }]);
      
      // Now that everything is setup let's call the client
      client.workflowDefinition(returnFunc);
      
    });
  });
});