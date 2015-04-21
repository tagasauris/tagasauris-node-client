/* Retrieve the results for a job - results are paginated, so to retrieve additional
   pages pass the page parameter */

var Client = require('../index.js');

client = new Client({api_key: "API_KEY", 
                    login: "API_LOGIN"});

var printMe = function(error, response, body) {
  console.log(body);
  body.objects.forEach(function(object, index, obj_array) {
    console.log(object.data);
  });
}

client.getResults({job_id: 'JOB_ID'},
                   function(error, response, body) {
                     body.objects.forEach(function(object, index, obj_array) {
                        console.log('ID: ' + String(object.media_object_external_id));
                        console.log(object.data);
                     });
                   }
);