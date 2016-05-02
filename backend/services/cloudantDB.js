/*
This service sets up the database connection.
*/

//Declare logger
var log4js = require('log4js');
log4js.loadAppender('file');
log4js.addAppender(log4js.appenders.file('logs/service.log'), 'db');
var logger = log4js.getLogger('db');
//export function to be available in app

var dbCredentials = {
	dbName : 'lbb_db'
};

var cloudantDB;
var db;

exports.initDBConnection = function() {

	logger.info("Initialize Database Connection started.");

	//Use VCAP Services if available
	if(process.env.VCAP_SERVICES) {
		var vcapServices = JSON.parse(process.env.VCAP_SERVICES);
		if(vcapServices.cloudantNoSQLDB) {
			dbCredentials.host = vcapServices.cloudantNoSQLDB[0].credentials.host;
			dbCredentials.port = vcapServices.cloudantNoSQLDB[0].credentials.port;
			dbCredentials.user = vcapServices.cloudantNoSQLDB[0].credentials.username;
			dbCredentials.password = vcapServices.cloudantNoSQLDB[0].credentials.password;
			dbCredentials.url = vcapServices.cloudantNoSQLDB[0].credentials.url;
		}
		console.log('VCAP Services: '+JSON.stringify(process.env.VCAP_SERVICES));
	}
    else{
	//Hard-coded redundancies in the event no VCAP Services can be parsed
			dbCredentials.host = "3c0bec67-e61c-428b-84dd-73437ebfcd12-bluemix.cloudant.com";
			dbCredentials.port = 443;
			dbCredentials.user = "3c0bec67-e61c-428b-84dd-73437ebfcd12-bluemix";
			dbCredentials.password = "208e5b89dc26dbfbbc81a2a6988c9dcf1f6227b532ce897ecd612d22298a0b7c";
			dbCredentials.url = "https://3c0bec67-e61c-428b-84dd-73437ebfcd12-bluemix:208e5b89dc26dbfbbc81a2a6988c9dcf1f6227b532ce897ecd612d22298a0b7c@3c0bec67-e61c-428b-84dd-73437ebfcd12-bluemix.cloudant.com";

    }

	cloudantDB = require('nano')(dbCredentials.url);

	//check if DB exists if not create
//	cloudantDB.db.create(dbCredentials.dbName, function (err, res) {
//		if (err) { console.log('could not create db ', err); }
//    });

	db = cloudantDB.use(dbCredentials.dbName);

	logger.info("Using db: " + dbCredentials.dbName);
	logger.info("Database connection successful.");

}


exports.Insert = function() {

	/*db.insert({
			S_ID:'3',S_name:'The Dog Institute',C_youth:'',C_health:'',C_web:'1',C_tele:'',A_unitnum:'',A_streetnum:'',A_street:'',A_Suburb:'',A_State:'',A_Postcode:'',A_phone:'',A_fax:'',A_mobile:'',A_tty:'',A_lat:'',A_long:'',O_monstart:'',O_monend:'',O_tuestart:'',O_tueend:'',O_wedstart:'',O_wedend:'',O_thustart:'',O_thuend:'',O_fristart:'',O_friend:'',O_satstart:'',O_satend:'',O_sunstart:'',O_sunend:'',S_url:'www.blackdoginstitute.org.au',S_agemin:'',S_agemax:'',I_info:'1',I_support:'',I_counsel:'',I_social:'',I_carer:'',I_referto:'',I_multilingual:'',I_resources:'1',I_referfrom:'1',I_youth:'',I_medicare:'1',D_youth:'',D_health:'',D_web:'The Black Dog Institute studies mood disorders and has a public website with information on depression, bipolar disorder and when and where to get help. The institute, located at the Prince of Wales Hospital in Randwick, can be accessed for clinical services through a GP referral.',D_tele:'',
			}, function(err, body) {
	if (!err)
    console.log("Insert Successful");
	});*/

}
