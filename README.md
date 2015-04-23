# tagasauris-node-client
Node Client for the Tagasauris API

<h3>Installation</h3>
<p>The easiest way to download the code is to clone this repo.  Make sure a current version of node and npm are installed, and run <code>npm install</code> to install library dependencies.</p>

<h3>Requirements</h3>
<p>In order to use this client, you will need your API login and API key, which can be found by logging into your <a href="http://www.photo.tagasauris.com">www.photo.tagasauris.com</a> account and clicking on the API section.</p>

<h3>Endpoints</h3>
<p>This client wraps the API methods found in the <A href="http://www.photo.tagasauris.com">www.photo.tagasauris.com</a> api documentation, and fully supports all parameters and endpoints.  An additional descriptions is available there as well.  Since your API key is private, please avoid using any of these methods on public facing web pages, run them on a secure server and proxy the results if necessary.  All enpoints require that you include the client, and all endpoints provide a callback function which will be executed after the tagasauris server has responded (asynchronously).<p>

<h4>Include the client:</h4>
<code>
var Client = require('tagasauris-node-client');
                    
client = new Client({api_key: "API_KEY", 
                    login: "API_LOGIN"});
</code>

<h4>Callback Format</h4>
<code>
function(error, response, body) {
    if (!error) {
        console.log(body);
    } else {
        console.log('Something went wrong: ' + error);
    }
    
    console.log('Response Details: ' + String(response));
}
</code>

<h4>Login</h4>
<p>Login is automatically handled by the client, so all endpoints that need authentication are already taken care of.  That said, if you find the need to login manually, there is an endpoint to do that.<p>
<code>
client.authorize(callback_function);
<code>
<p>The authorize endpoint accepts no parameters, and simply authorizes the account, storing the appropriate tokens.  The client handles calling this as needed for the rest of the endpoints, so there will rarely be a need to call this yourself.</p>



<h3>Testing</h3>
<p>Unit tests are run through the Mocha test runner</p>
<code>npm test</code>