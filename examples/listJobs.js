/* Print jobs for client - Job IDs can be used later to create a job of a specific type */
var Client = require('../index.js');
                    
client = new Client({api_key: "API_KEY", 
                    login: "API_LOGIN"});


client.listJobs(
    function(error, response, body) {
        console.log(body);
    }    
);