var Client = require('../index.js');
                    
client = new Client({api_key: "API_KEY", 
                    login: "API_LOGIN"});


var images = [{id: 'media_id_1',	
               url: 'media_url_1'},
              {id: 'media_id_2',
               url: 'media_url_2'},
              {id: 'media_id_3',
               url: 'media_url_3'}],
    media_objects = [],
    title = '';

    
images.forEach(function(image, index, image_array) {
    title = image.url.split('/');
    title = title[title.length - 1]
    media_objects.push({id: image.id,
                        mimetype: 'image/jpeg',
                        title: title,
                        url: image.url});
});

var job_json = {
    task: {
        workflow: "workflow_name",
        title: "First Tag Job",
        instruction: "Tagger Instructions"
    },
    mediaobjects: media_objects
};

client.createJob(job_json, 
     function(error, response, body) {
        console.log(body);
     }
);