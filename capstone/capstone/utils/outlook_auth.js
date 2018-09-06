var credentials = {
  client: {
    id: 'c76685f3-6dc5-42a6-b063-ca6b6927671d',
    secret: 'ibhHOWEX97!@aqpePY018[-',
  },
  auth: {
    tokenHost: 'https://login.microsoftonline.com',
    authorizePath: 'common/oauth2/v2.0/authorize',
    tokenPath: 'common/oauth2/v2.0/token'
  }
};
var oauth2 = require('simple-oauth2').create(credentials);

var redirectUri = 'http://localhost:3000/officeauthorize';

// The scopes the app requires
var scopes = [ 'openid',
			   'offline_access',
               'https://outlook.office.com/mail.send' ];
    
async function getAuthUrl() {
  var returnVal = oauth2.authorizationCode.authorizeURL({
    redirect_uri: redirectUri,
    scope: scopes.join(' ')
  });
  console.log('Generated auth url: ' + returnVal);
  return returnVal;
}

exports.getAuthUrl = getAuthUrl;

async function getTokenFromCode(auth_code) {
  var token;
  var tokenConfig = {
    code: auth_code,
    redirect_uri: redirectUri,
    scope: scopes.join(' ')
  }
	try {
	    var result = await oauth2.authorizationCode.getToken(tokenConfig)
	    var token = oauth2.accessToken.create(result);
		return token;
	} catch (error) {
	    console.log('Access Token Error', error.message);
		return null;
	}
}

exports.getTokenFromCode = getTokenFromCode;

function getUserEmail(token, callback) {
  // Set the API endpoint to use the v2.0 endpoint
  outlook.base.setApiEndpoint('https://outlook.office.com/api/v2.0');

  // Set up oData parameters
  var queryParams = {
    '$select': 'DisplayName, EmailAddress',
  };

  outlook.base.getUser({token: token, odataParams: queryParams}, function(error, user){
    if (error) {
      callback(error, null);
    } else {
      callback(null, user.EmailAddress);
    }
  });
}

exports.getUserEmail = getUserEmail;