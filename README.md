# tagasauris-node-client
Node Client for the Tagasauris API

### Installation
The easiest way to download the code is to clone this repo.  Make sure a current version of node and npm are installed, and run <code>npm install</code> to install library dependencies.

### Requirements
In order to use this client, you will need your API login and API key, which can be found by logging into your [http://photo.tagasauris.com](http://photo.tagasauris.com) account and clicking on the API section.

### Endpoints
This client wraps the API methods found in the [http://photo.tagasauris.com](http://photo.tagasauris.com) api documentation, and fully supports all parameters and endpoints.  An additional descriptions is available there as well.  Since your API key is private, please avoid using any of these methods on public facing web pages, run them on a secure server and proxy the results if necessary.  All enpoints require that you include the client, and all endpoints provide a callback function which will be executed after the tagasauris server has responded (asynchronously).

#### Include the client:
```javascript
var Client = require('tagasauris-node-client');
                    
client = new Client({api_key: "API_KEY", 
                    login: "API_LOGIN"});
```

#### Callback Format
```javascript
function(error, response, body) {
    if (!error) {
        console.log(body);
    } else {
        console.log('Something went wrong: ' + error);
    }
    
    console.log('Response Details: ' + String(response));
}
```

#### Login
Login is automatically handled by the client, so all endpoints that need authentication are already taken care of.  That said, if you find the need to login manually, there is an endpoint to do that.
##### Parameters
* None

```javascript
client.authorize(callback_function);
```

Success Response:
```
{"login": "done"}
```

Error Response - login or key missing:
```
'Missing parameter'
```

Error Response - bad credentials:
```
'Invalid login or password'
```

The authorize endpoint accepts no parameters, and simply authorizes the account, storing the appropriate tokens.  The client handles calling this as needed for the rest of the endpoints, so there will rarely be a need to call this yourself.

#### Workflow Definitions
List workflows available for use.  The ```id``` field can be used later to create jobs of a specific type.  
##### Paramters
* None

```javascript
client.workflowDefinition(
    function(error, response, body) {
        //do something with result
    }    
);
```

Sample Response:
```
[
    {
        "name": "Moderation",
        "options": [
            {
                "help_2": "Click here if there is no inappropriate content in this photo",
                "help_1": "Click here if there is inappropriate content in this photo",
                "option": "Determine if there is any inappropriate content",
                "question": "Is there any inappropriate content in these photos (e.g. nudity and illicit drugs)?",
                "answer_2": "No",
                "answer_1": "Yes"
            },
            {
                "help_2": "Click here if no faces are visible in this photo",
                "help_1": "Click here if any faces are visible in this photo",
                "option": "Determine if there are visible faces",
                "question": "Are there any visible faces in these photos?",
                "answer_2": "No Faces",
                "answer_1": "Faces"
            }
        ],
        "prices": [
            {
                "description": "5¢ per image",
                "value": 5
            }
        ],
        "id": "mediagrid",
        "description": {
            "short": "Select this task type to either screen images for pre-determined content, such as any undesirable, or harmful content or categorize images into one of two categories that you specify, such as exterior or interior, faces or no faces, day or night.",
            "long": "Long media grid description"
        }
    },
    {
        "name": "Standard Tagging",
        "prices": [
            {
                "description": "29¢ per image",
                "value": 29
            }
        ],
        "id": "tagging",
        "description": {
            "short": "Select this task type to get tags that include main subject and actions, photo orientations, photographic style, dominate colors, geographical location, emotion, time of day, interior/exterior, people/no people, number, age and gender of people plus many more.",
            "long": "Long tagging description"
        }
    }
]
```

#### List Jobs
List jobs currently running.

##### Required Parameters
* None

##### Optional Parameters
* ```per_page``` - defaults to unlimited, used to limit entries displayed

```javascript
client.listJobs(
    function(error, response, body) {
        // do something with result
    }    
);
```

Sample Response:
```
[
    {
        "description": "My first tagging job",
        "billing": {
            "price": 29,
            "total": 290
        },
        "title": "First tagging",
        "created": "2012-09-20T10:26:12",
        "state": "started",
        "progress": {
            "mediaobject_all": 10,
            "mediaobject_done": 1
        },
        "type": {
            "id": "tagging",
            "name": "Standard Tagging"
        },
        "id": "7fab2ee7da2d590c0a53491d8f982509"
    }
]
```

#### Get Job Details
Get details and progress for a specific job

##### Required Parameters
* ```job_id``` - the id of the job to return details about

##### Optional Parameters
* None

```javascript
client.getJob('JOB_ID', 
      function(error, response, body) {
        // do something with result
      }
);
```

Sample Response:
```
{
    "description": "My first tagging job",
    "billing": {
        "price": 29,
        "total": 290
    },
    "title": "First tagging",
    "created": "2012-09-20T10:26:12",
    "state": "started",
    "progress": {
        "mediaobject_all": 10,
        "mediaobject_done": 1
    },
    "type": {
        "id": "tagging",
        "name": "Standard Tagging"
    },
    "id": "7fab2ee7da2d590c0a53491d8f982509"
}
```

#### Create Job
Create a job with one of the available workflows

##### URL Parameters
* None

##### JSON Parameters
This method accepts a properly formatted JSON object that contains the specifications for the job to be created.

```
{
    task: {
        workflow: "workflow_id", // string, required
        title: "title of workflow", // string, optional
        instruction: "Tagger Instructions" // string, optional
    },
    mediaobjects: [ // array of objects to include in job
        id: "media_id", // string, required
        title: "media_title", // string, required - can be same as id
        url: "media_public_url", // string, required - publicly accessible url of media
        mimetype: "media_mimetype" // string, required - needs to be a proper mimetype ex. image/jpeg
    ],
    options: // optional - some workflows require additional information - this will be specified in the workflow
};
```

Call the method with this json object:
```javascript
client.createJob(job_json, 
     function(error, response, body) {
        // do something with response keys
     }
);
```

Sample Response:
```
{
    "id" : "c32503e90235ccbabae8ce6285dc3799",
    "keys": ["49bb9cf8-03f1-11e2-a290-3cd92b6e758e",
             "4a57dc94-03f1-11e2-882d-3cd92b6e758e"]
}
```
In the response, the ```id``` is the id of the newly created job, the 2 keys can be used to track the progress of importing (first one), and the progress of the job (second one).

#### Get Job Results
Get the results of tagging job(s)

##### Parameters
This method supports a JSON object that supports result filtering, and is optional.

```
{
    job_id: "Job ID", // string, optional - limit results to a specific job
    created: "created time", // string, format YYYY-MM-DDThh:mm:ssZ - UTC based time, ISO format ex. 2012-02-25T17:53:15Z
    correct: "type of results to get", // string, optional, options include: correct, incorrect, both, null, all
    page: Number, // Int, optional - page number to retrieve (results can be paginated)
    per_page: Number // Int, optional - results per page, defaults to 50
}
```

Call this method with optional parameters:
```javascript
client.getResults({job_id: 'JOB_ID'},
   function(error, response, body) {
     body.objects.forEach(function(object, index, obj_array) {
        console.log('ID: ' + String(object.media_object_external_id));
        console.log(object.data);
     });
   }
);
```

Sample Response:
```
{
    "per_page": 50,
    "total": 3,
    "page": 1,
    "objects": [
        {
            "media_object_external_id": "ID1234",
            "data": [
                {
                    "data": {
                        "tag": "George Washington",
                        "id": "/en/george_washington",
                        "synonyms": ""
                    },
                    "correct": "correct",
                    "type": "Tags",
                    "time": "2012-02-09T16:28:07Z"
                },
                {
                    "data": {
                        "tag": "Coffee",
                        "id": "/en/coffee",
                        "synonyms": "Expresso Tea"
                    },
                    "correct": "incorrect",
                    "type": "Tags",
                    "time": "2012-02-09T17:53:15Z"
                }
            ]
        },
        {
            "media_object_external_id": "ID3456",
            "data": [
                {
                    "data": {
                        "tag": "Tagasauris",
                        "id": "/m/0hn9gc4"
                    },
                    "type": "Tags",
                    "correct": null,
                    "time": "2012-02-09T16:28:07Z"
                }
            ]
        }
    ]
}
```

### Contributions
Contributions are always welcome, just fork this repo and submit a pull request with your code.  Make sure to run the automated tests, and to include new tests for any additional functionality exposed.


### Testing
Unit tests are run through the Mocha test runner
```javascript
npm test
```