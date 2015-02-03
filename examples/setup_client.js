var Client = require('../index.js');

client = new Client({api_key: 'my_api_key', 
                    login: 'my_api_user'});

var printMe = function(error, response, body) {
  console.log('now Printing');
  console.log(body);
}

client.authorize(printMe);