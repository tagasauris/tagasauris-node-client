var Client = require('../index.js');

client = new Client({api_key: 'my_api_key', 
                    login: 'my_api_user'});

var printMe = function(error, response, body) {
  console.log(body);
}

client.getJob('607f15c18fd592e67989912ec8c04fcb', printMe);