'use strict'

var should = require('should'),
    nock   = require('nock'),
    Client = require('./index.js'),
    md5 = require('MD5');


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
    
    it('return authroization, and store cookie in jar', function(done) {
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
    
    it('return workflow definitions', function(done) {
      var client = new Client(credentials),
      returnFunc = function(error, response, body) {
        body[0].id.should.equal('wd1');
        stable_mock.isDone().should.equal(true);
        done()
      };
      stable_mock
        .post('/api/2/login/')
        .reply(200, {login: "done"})
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
  
  describe('<List Jobs>', function() {
    var stable_mock,
        credentials;
    beforeEach(function(done) {
      stable_mock = nock('https://stable.tagasauris.com'),
      credentials = { login: 'user1234',
                      api_key: 'key1234'};
      done();
    });
    
    it('return list of jobs for authorized client', function(done) {
      var client = new Client(credentials),
      returnFunc = function(error, response, body) {
        body[1].id.should.equal('job_2');
        stable_mock.isDone().should.equal(true);
        done();
      };
      stable_mock
        .post('/api/2/login/')
        .reply(200, {login: "done"})
        .get('/api/2/job/')
        .reply(200, [{title: 'Job1',
                      id: 'job_1'},
                     {title: 'Job2',
                      id: 'job_2'}]);
      
      // Everything's setup - so run client
      client.listJobs(returnFunc);
      
    });
  });
  
  describe('<Get Job>', function() {
    var stable_mock,
        credentials,
        job_id;
    beforeEach(function(done) {
      stable_mock = nock('https://stable.tagasauris.com'),
      credentials = { login: 'user1234',
                      api_key: 'key1234'},
      job_id = 'job_1';
      done();
    });
    
    it('return a specific job for authorized client', function(done) {
      var client = new Client(credentials),
      returnFunc = function(error, response, body) {
        body.id.should.equal('job_1');
        stable_mock.isDone().should.equal(true);
        done();
      };
      stable_mock
        .post('/api/2/login/')
        .reply(200, {login: "done"})
        .get('/api/2/job/' + job_id)
        .reply(200, {title: 'Job1',
                      id: 'job_1'});
      
      // Everything's setup - so run client
      client.getJob(job_id, returnFunc);
      
    });
  });
  
  describe('<Create Job>', function() {
    var stable_mock,
        credentials,
        images;
    beforeEach(function(done) {
      stable_mock = nock('https://stable.tagasauris.com'),
      credentials = { login: 'user1234',
                      api_key: 'key1234'},
      images = ['http://www.example.image.1.com/12345.jpg',
                'http://www.example.image.2.com/23456.jpg',
                'http://www.example.image.3.com/34567.jpg'];
      done();
    });
    
    it('create a job for authorized client', function(done) {
      var client = new Client(credentials),
      returnFunc = function(error, response, body) {
        body.id.should.equal('34567c');
        stable_mock.isDone().should.equal(true);
        done();
      };
      stable_mock
        .post('/api/2/login/')
        .reply(200, {login: "done"})
        .post('/api/2/job/create/')
        .reply(200, {keys: ["12345a", "23456b"],
                      id: "34567c"});
      
      // We need to compile the proper object to pass to function
      // this would be the responsibility of the caller - 
      // included here for demonstration
      
      var media_objects = [],
          title = '';
      
      images.forEach(function(image, index, image_array) {
        title = image.split('/');
        title = title[title.length - 1]
        media_objects.push({ id: md5(image),
                       mimetype: 'image/jpeg',
                       title: title,
                       url: image });
      });
      
      var job_json = {
        task: {
          workflow: "example_workflow_id",
          title: "My First Job",
          instruction: "Tagging Job"
        },
        mediaobjects: media_objects,
        
      };
      // Everything's setup - so run client
      client.createJob(job_json, returnFunc);
      
    });
  });
  
  
  describe('<Get Job Results>', function() {
    var stable_mock,
        credentials,
        job_filter;
    beforeEach(function(done) {
      stable_mock = nock('https://stable.tagasauris.com'),
      credentials = { login: 'user1234',
                      api_key: 'key1234'},
      job_filter = {job_id : 'job_1'};
      done();
    });
    
    it('return any results for a specific job for authorized client', function(done) {
      var client = new Client(credentials),
      returnFunc = function(error, response, body) {
        body.objects[0].media_object_external_id.should.equal('img1234');
        stable_mock.isDone().should.equal(true);
        done();
      };
      stable_mock
        .post('/api/2/login/')
        .reply(200, {login: "done"})
        .get('/api/3/transformresult?job_id=job_1')
        .reply(200, {
          per_page: 50,
          total: 3,
          page: 1,
          objects: [{
            media_object_external_id: "img1234",
            data: [{
              data: {
                tag: "tag1",
                id: "tag1_id",
                synonyms: ""
              },
              correct: "correct",
              type: "Tags"
            }]
          }]
        });
      
      // Everything's setup - so run client
      client.getResults(job_filter, returnFunc);
      
    });
  });




});