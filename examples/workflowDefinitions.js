/* Prints the available workflows to choose from when starting a job */

var Client = require('../index.js');
                    
client = new Client({api_key: "API_KEY", 
                    login: "API_LOGIN"});

client.workflowDefinition(
    function(error, response, body) {
        console.log(body);
    }
);
