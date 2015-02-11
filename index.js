'use strict';

/**
 * Copyright 2015 Tagasauris
 * Author: Raymond Klass <ray@tagasauris.com>
 *
 * Tagasauris Node Client
 *
 * This client works with the Tagasauris API
**/

var request = require('request'),
    async   = require('async');

// We'll need request to keep cookies in a jar
request.defaults({jar: true});

var API_BASE_URL = 'https://stable.tagasauris.com'
  


var Client = function(config) {
  this.config = config;
  this.API_KEY = config.api_key;
  this.LOGIN = config.login;
  this.cookie_jar = request.jar(),
  this.is_authorized = false;
  
  if (config.hasOwnProperty('api_base_url')) {
      this.api_base_url = config.api_base_url;
  } else {
      this.api_base_url = API_BASE_URL;
  }
  
};


// Execute requests in series so Authorization can be performed before request.
Client.prototype._execute_query = function(request_params, funcProxy) {
  var self = this,
      queries = [];
  
  // Load the Auth Query first    
  if (!self.is_authorized) {
    var _func = function(callback) {
      var returnAuth = function(error, response, body) {
        callback(error, body);
      };
      self.authorize(returnAuth);
    };
    queries.push(_func);
  }
  
  // Load the new Request
  var _func = function(callback) {
    request(request_params, 
            function(error, response, body) {
              try {
                body = JSON.parse(body);
              } catch (e) {
                // pass - we'll just send the body as it is
              }
              funcProxy(error, response, body);
              callback(error, body);
    });
  };
  queries.push(_func);
  
  if( queries.length ) {
    async.series(queries); 
  } 
};


// Authorize the User - takes a function to pass the results to (so other functions can be run in series)
Client.prototype.authorize = function(funcProxy) {
  var self = this;

  request({
      uri: self.api_base_url + "/api/2/login/",
      method: "POST",
      jar: self.cookie_jar,
      form: {
        login: self.LOGIN,
        password: self.API_KEY
      }
    }, function(error, response, body) {
      if (!error) {
        self.is_authorized = true;
      }
      funcProxy(error, response, body);
  });
};


// Retrieve workflow definitions available to the authorized user
Client.prototype.workflowDefinition = function(funcProxy) {
  var self = this,
      request_params = {
        uri: self.api_base_url + "/api/2/workflowdefinition/",
        method: "GET",
        jar: self.cookie_jar
      };
  self._execute_query(request_params, funcProxy);
};


// Retrieves the list of jobs for the authorized client - or 401 Error (unauthorized)
Client.prototype.listJobs = function(funcProxy) {
  var self = this,
      request_params = {
        uri: self.api_base_url + "/api/2/job/",
        method: "GET",
        jar: self.cookie_jar,
      };
  self._execute_query(request_params, funcProxy);
};


// Get Job Details for the specified job - or 400 (not found) or 401 (unauthorized)
Client.prototype.getJob = function(job_id, funcProxy) {
  var self = this,
      request_params = {
        uri: self.api_base_url + "/api/2/job/" + job_id,
        method: "GET",
        jar: self.cookie_jar,
      };
  self._execute_query(request_params, funcProxy);
};


// Create Job - or 400 (bad request)
Client.prototype.createJob = function(job_data_json, funcProxy) {
  var self = this,
      request_params = {
        uri: self.api_base_url + "/api/2/job/create/",
        method: "POST",
        jar: self.cookie_jar,
        json: job_data_json
      };
  self._execute_query(request_params, funcProxy);
}


// Get Job Results - or return 400 (bad request)
Client.prototype.getResults = function(results_filter, funcProxy) {
  var self = this,
      request_params = {
        uri: self.api_base_url + "/api/3/transformresult",
        method: "GET",
        qs: results_filter,
        jar: self.cookie_jar
      };
  self._execute_query(request_params, funcProxy);
};


module.exports = Client;
