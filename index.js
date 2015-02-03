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
  
var Client = function(config) {
  this.config = config;
  this.API_KEY = config.api_key;
  this.LOGIN = config.login;
  this.cookie_jar = request.jar(),
  this.is_authorized = false;
  
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
      uri: "https://stable.tagasauris.com/api/2/login/",
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
        uri: "https://stable.tagasauris.com/api/2/workflowdefinition/",
        method: "Get",
        jar: self.cookie_jar
      };
  self._execute_query(request_params, funcProxy);
};


// Retrieves the list of jobs for the authorized client - or 401 Error (unauthorized)
Client.prototype.listJobs = function(funcProxy) {
  var self = this,
      request_params = {
        uri: "https://stable.tagasauris.com/api/2/job/",
        method: "Get",
        jar: self.cookie_jar,
      };
  self._execute_query(request_params, funcProxy);
};


// Get Job Details for the specified job - or 400 (not found) or 401 (unauthorized)
Client.prototype.getJob = function(job_id, funcProxy) {
  var self = this;
      request_params = {
        uri: "https://stable.tagasauris.com/api/2/job/" + job_id,
        method: "Get",
        jar: self.cookie_jar,
      };
  self._execute_query(request_params, funcProxy);
};


module.exports = Client;