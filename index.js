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
  this.cookie_jar = request.jar();
  
};


// Authorize the User - takes a function to pass the results to (so other functions can be run in series)
Client.prototype.authorize = function(funcProxy) {
  console.log('starting');
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
      funcProxy(error, response, body);
  });
};


Client.prototype.workflowDefinition = function(funcProxy) {
  var self = this;
  
  async.series([
  function(callback) {
    var returnAuth = function(error, response, body) {
      callback(error, body);
    };
    self.authorize(returnAuth);
  },
  function(callback) {
    request({
      uri: "https://stable.tagasauris.com/api/2/workflowdefinition/",
      method: "Get",
      jar: self.cookie_jar
    }, function(error, response, body) {
      funcProxy(error, response, body);
      callback(error, body);
    });
  }]);
};

module.exports = Client;
