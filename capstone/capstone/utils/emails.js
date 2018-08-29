const HtmlEmail = require('html-email');

async function generateTeamEmail(project_name, team_name) {
	var email = new HtmlEmail('teams-projectallocation', 'en');
	var emailBody = email.body({
						team_name: team_name
					});
	var emailSubject = email.subject({
		    project_name: project_name
		});
	
	return {emailBody: emailBody, emailSubject:emailSubject};
}

exports.generateTeamEmail = generateTeamEmail;

async function generatePartnerEmail() {
	var email = new HtmlEmail('partners-projectallocation', 'en');
	var emailBody = email.body({
						
					});
	var emailSubject = email.subject({
		    
		});
	
	return {emailBody: emailBody, emailSubject:emailSubject};
}

exports.generatePartnerEmail = generatePartnerEmail;