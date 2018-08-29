var outlook = require('node-outlook');
var q = require('q');

async function getUser(token) {
    // Set the API endpoint to use the v2.0 endpoint
    outlook.base.setApiEndpoint('https://outlook.office.com/api/v2.0');

	// Set up oData parameters
	var queryParams = {
		'$select': 'DisplayName, EmailAddress',
    };
	var userQ = q.defer();

    outlook.base.getUser({token: token, odataParams: queryParams}, function(error, user){
		if (error) {
			userQ.reject(new Error(error));
		} else {
			console.log("returning user");
			userQ.resolve(user);
		}
    });
	return userQ.promise;
}

exports.getUser = getUser;