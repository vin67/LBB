//Declare logger
var log4js = require('log4js');
log4js.loadAppender('file');
log4js.addAppender(log4js.appenders.file('logs/service.log'), 'geolocation');
var logger = log4js.getLogger('geolocation');

//export function to be available in app
// Expecting a GET request like /api/geolocation?latitude=40.33&longitude=122.332
// Latitude and longitude can go to 8 decimal places
// Latitude valid values are from -90 to 90
// Longitude valid values are from -180 to 180
exports.nearestServices = function(req, res) {
	
  	logger.info("nearestServices is invoked with longitude: "+ req.query.longitude + ", latitude: " + req.query.latitude);
 
	return res.json({
  		"Status": 'OK',
  		"data": [
  			{
				'S_ID': '',
				'S_name': '',
				'C_youth': '',
				'C_health': '',
				'C_web': '',
				'C_tele': '',
				'A_unitnum': '',
				'A_streetnum': '',
				'A_street': '',
				'A_Suburb': '',
				'A_State': '',
				'A_Postcode': '',
				'A_phone': '',
				'A_fax': '',
				'A_mobile': '',
				'A_tty': '',
				'A_lat': '',
				'A_long': '',
				'O_monstart': '',
				'O_monend': '',
				'O_tuestart': '',
				'O_tueend': '',
				'O_wedstart': '',
				'O_wedend': '',
				'O_thustart': '',
				'O_thuend': '',
				'O_fristart': '',
				'O_friend': '',
				'O_satstart': '',
				'O_satend': '',
				'O_sunstart': '',
				'O_sunend': '',
				'S_url': '',
				'S_agemin': '',
				'S_agemax': '',
				'I_info': '',
				'I_support': '',
				'I_counsel': '',
				'I_social': '',
				'I_carer': '',
				'I_referto': '',
				'I_multilingual': '',
				'I_resources': '',
				'I_referfrom': '',
				'I_youth': '',
				'I_medicare': '',
				'D_youth': '',
				'D_health': '',
				'D_web': '',
				'D_tele': ''
		  	},
		  	{
				'S_ID': '',
				'S_name': '',
				'C_youth': '',
				'C_health': '',
				'C_web': '',
				'C_tele': '',
				'A_unitnum': '',
				'A_streetnum': '',
				'A_street': '',
				'A_Suburb': '',
				'A_State': '',
				'A_Postcode': '',
				'A_phone': '',
				'A_fax': '',
				'A_mobile': '',
				'A_tty': '',
				'A_lat': '',
				'A_long': '',
				'O_monstart': '',
				'O_monend': '',
				'O_tuestart': '',
				'O_tueend': '',
				'O_wedstart': '',
				'O_wedend': '',
				'O_thustart': '',
				'O_thuend': '',
				'O_fristart': '',
				'O_friend': '',
				'O_satstart': '',
				'O_satend': '',
				'O_sunstart': '',
				'O_sunend': '',
				'S_url': '',
				'S_agemin': '',
				'S_agemax': '',
				'I_info': '',
				'I_support': '',
				'I_counsel': '',
				'I_social': '',
				'I_carer': '',
				'I_referto': '',
				'I_multilingual': '',
				'I_resources': '',
				'I_referfrom': '',
				'I_youth': '',
				'I_medicare': '',
				'D_youth': '',
				'D_health': '',
				'D_web': '',
				'D_tele': ''
		  	}
		]
	});
};
