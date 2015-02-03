var Client = require('../index.js')
    async = require('async'),
    md5 = require('MD5');

client = new Client({api_key: 'my_api_key', 
                    login: 'my_api_user'});

var printMe = function(error, response, body) {
  console.log(body);
}


var images = ['http://www.example.com/imageDataBase/large/1242235462.jpg',
          'http://www.example.com/imageDataBase/large/1242235352.jpg',
          'http://www.example.com/imageDataBase/large/1242235330.jpg'],
    media_objects = [],
    title         = '';

images.forEach(function(image, index, image_array) {
  title = image.split('/');
  title = title[title.length - 1];
  media_objects.push({ id: md5(image),
                       mimetype: 'image/jpeg',
                       title: title,
                       url: image });
});

var job_json = {
  task: {
    workflow: "stockphototagging",
    title: "My First Tagging Job",
    instruction: "Tagging Backgrounds"
  },
  mediaobjects: media_objects,
  
};
