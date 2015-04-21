/* Get the details of a specific job */

var Client = require('../index.js');
                    
client = new Client({api_key: "API_KEY", 
                    login: "API_LOGIN"});

var printMe = function(error, response, body) {
  console.log(body);
  body.objects.forEach(function(object, index, obj_array) {
    console.log(object.data);
  });
}

client.getJob('JOB_ID', 
              function(error, response, body) {
                console.log(body);
              }
);