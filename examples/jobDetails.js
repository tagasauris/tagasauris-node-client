/* Get the details of a specific job */

var Client = require('../index.js');
                    
client = new Client({api_key: "API_KEY", 
                    login: "API_LOGIN"});

client.getJob('JOB_ID', 
      function(error, response, body) {
        console.log(body);
      }
);