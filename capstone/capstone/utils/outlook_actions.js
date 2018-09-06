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

async function sendMail(token, subject, importance, body, recipients, userEmail) {
	var emailQ = q.defer();
    // Set the API endpoint to use the v2.0 endpoint
    outlook.base.setApiEndpoint('https://outlook.office.com/api/v2.0');
	
	var recipientsFormatted = [];
	for (var i = 0; i < recipients.length; i++) {
		recipientsFormatted.push({EmailAddress: {Address: recipients[i]}});
	}
	
	var newMsg = {
		Subject: subject,
		Importance: importance,
		Body: {
			ContentType: 'HTML',
			Content: body
		},
		ToRecipients: recipientsFormatted
    };
	
	var userInfo = {
		email: userEmail
    };

    outlook.mail.sendNewMessage({token: token, message: newMsg, user: userInfo},
		function(error, result){
			if (error) {
				emailQ.reject(new Error(error));
			}
			else if (result) {
				console.log(JSON.stringify(result, null, 2));
				emailQ.resolve(result);
			}
		});
}

exports.sendMail = sendMail;