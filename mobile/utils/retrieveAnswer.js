//Declare logger
var log4js = require('log4js');
log4js.loadAppender('file');
log4js.addAppender(log4js.appenders.file('logs/service.log'), 'retrieveAnswer');
var logger = log4js.getLogger('questionAnswer');
//export function to be available in app
// Expecting a GET request like /api/questionAnswer?question=services
// This is a skeleton

function retrieveAnswers(question){
	logger.info("retrieveAnswer matching query");
	var sendData = [];
	if(question.toLowerCase().indexOf("depression") != -1){
		logger.info("retrieveAnswer matched depression");
		sendData.push("{Service Name: Black Dog Institute, Web Address: http://www.blackdoginstitute.org.au}");
		sendData.push("{Service Name: Beyond Blue and YBBLUE, Web Address: http://www.ybblue.com.au, Helpline: 1300 22 4636}");
		sendData.push("{Service Name: Reach Out!, Web Address: http://www.reachout.com.au}");
	}
	else
		if(question.toLowerCase().indexOf("homeless") != -1){
			logger.info("retrieveAnswer matched homeless");
			sendData.push("{Service Name: The Drum Youth Resource Centre, Address: 6-8 Iolanthe Street Campbelltown 2560, Phone: (02) 4628 3199 P}");
			sendData.push("{Service Name: Personal Helpers & Mentors Program, Address: Level 8, 138 Queen Street Campbelltown 2560, Phone: (02) 4621 8400}");
			sendData.push("{Service Name: Homeless Person Information Centre, Phone: 1800 234 566}");
		}
		else{
			sendData.push("{Service Name: Community Links, Web Address: http://www.communitylinks.org.au/}");
		}
	return sendData;
}
module.exports = retrieveAnswers;