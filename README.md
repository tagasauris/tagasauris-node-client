# tagasauris-node-client
Node Client for the Tagasauris API

### Installation
The easiest way to download the code is to clone this repo.  Make sure a current version of node and npm are installed, and run <code>npm install</code> to install library dependencies.

### Requirements
In order to use this client, you will need your API login and API key, which can be found by logging into your [www.photo.tagasauris.com](http://www.photo.tagasauris.com) account and clicking on the API section.

### Endpoints
This client wraps the API methods found in the [www.photo.tagasauris.com](http://www.photo.tagasauris.com) api documentation, and fully supports all parameters and endpoints.  An additional descriptions is available there as well.  Since your API key is private, please avoid using any of these methods on public facing web pages, run them on a secure server and proxy the results if necessary.  All enpoints require that you include the client, and all endpoints provide a callback function which will be executed after the tagasauris server has responded (asynchronously).

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

```javascript
client.authorize(callback_function);
```

The authorize endpoint accepts no parameters, and simply authorizes the account, storing the appropriate tokens.  The client handles calling this as needed for the rest of the endpoints, so there will rarely be a need to call this yourself.

#### Workflow Definitions
List workflows available for use.  The ```id``` field can be used later to create jobs of a specific type.  
##### Paramters
*none

```javascript
client.workflowDefinition(
    function(error, response, body) {
        //do something with result
    }    
);
```

#### List Jobs
List jobs currently running.
##### Paramters
*none

```javascript
client.listJobs(
    function(error, response, body) {
        // do something with result
    }    
);
```



### Testing
Unit tests are run through the Mocha test runner
```javascript
npm test
```