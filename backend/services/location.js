//Declare logger
var log4js = require('log4js');
log4js.loadAppender('file');
log4js.addAppender(log4js.appenders.file('logs/service.log'), 'location');
var logger = log4js.getLogger('location');
//var request = require('request');
var Promise = require('bluebird');
var request = Promise.promisify(require("request"));

//var async = require('async');
//export function to be available in app

exports.nearestService = function(req, res) {

	var dbCredentials = {
		dbName: 'lbb_db'
	};

	//Parse VCAP_SERVICES cloudantNoSQLDB
	// if (process.env.VCAP_SERVICES) {
	// 	var vcapServices = JSON.parse(process.env.VCAP_SERVICES);
	// 	if (vcapServices.cloudantNoSQLDB) {
	// 		dbCredentials.host = vcapServices.cloudantNoSQLDB[0].credentials.host;
	// 		dbCredentials.port = vcapServices.cloudantNoSQLDB[0].credentials.port;
	// 		dbCredentials.user = vcapServices.cloudantNoSQLDB[0].credentials.username;
	// 		dbCredentials.password = vcapServices.cloudantNoSQLDB[0].credentials.password;
	// 		dbCredentials.url = vcapServices.cloudantNoSQLDB[0].credentials.url;
	// 	}
	// 	console.log('VCAP Services: ' + JSON.stringify(process.env.VCAP_SERVICES));
	// }

	dbCredentials.host =
		"3c0bec67-e61c-428b-84dd-73437ebfcd12-bluemix.cloudant.com";
	dbCredentials.port = 443;
	dbCredentials.user = "3c0bec67-e61c-428b-84dd-73437ebfcd12-bluemix";
	dbCredentials.password =
		"208e5b89dc26dbfbbc81a2a6988c9dcf1f6227b532ce897ecd612d22298a0b7c";
	dbCredentials.url =
		"https://3c0bec67-e61c-428b-84dd-73437ebfcd12-bluemix:208e5b89dc26dbfbbc81a2a6988c9dcf1f6227b532ce897ecd612d22298a0b7c@3c0bec67-e61c-428b-84dd-73437ebfcd12-bluemix.cloudant.com";

	var serviceData = [];
	var addressData = [];
	var sendData = [];
	var locationMode = 0;
	var rowsLength = 0;
	var location = "";

	logger.info("nearestService is invoked");
	if (req.query.location) {
		location = req.query.location;
		logger.info("nearestService using Location: " + location);
		locationMode = 0;
	}
	if (req.query.longitude && req.query.latitude) {
		var LocationLongitude = req.query.longitude;
		var LocationLatitude = req.query.latitude;
		logger.info("nearestService using Longitude: " + LocationLongitude);
		logger.info("nearestService using Latitude: " + LocationLatitude);
		locationMode = 1;
	}


	var serviceURL =
		'https://' + dbCredentials.user +
		'.cloudant.com/lbb_db/_design/view/_view/allServices';

	var auth = "Basic " + new Buffer(dbCredentials.user + ":" + dbCredentials.password)
		.toString("base64");
	var cloudAntURL = {
		url: serviceURL,
		headers: {
			"Authorization": auth
		}
	};

	//	var requestGet = function()
	//	{
	//		request.get({
	//
	//			url: serviceURL,
	//			headers: {
	//				"Authorization": auth
	//			}
	//		},
	//		function(error, response, body) {
	//			if (!error && response.statusCode == 200) {
	//				console.log(" Response : " + JSON.stringify(body));
	//			}
	//		});
	//	};

	console.log("Request Bluebird");

	function ClientError(e) {
		return e.code >= 400 && e.code < 500;
	}

	request(cloudAntURL).then(function(contents) {
		var data = JSON.parse(contents[1]);
		console.log(" Data " + data.total_rows);
		var n = 0;
		var googleRequests = [];
		for (var i = 0; i < data.total_rows; ++i) {
			var address = data.rows[i].value.A_unitnum + " " + data.rows[i].value.A_streetnum +
				" " + data.rows[i].value.A_street +
				" " + data.rows[i].value.A_Suburb + " " + data.rows[i].value
				.A_State;
			var addressURL =
				'https://maps.googleapis.com/maps/api/directions/json?origin=' +
				location +
				'&destination=' + address;
			console.log(" URL " + addressURL);
			if (address.trim() != "") {
				googleRequests.push(request(addressURL));
			}
		}
		Promise.all(googleRequests).then(function(results) {
			console.log("All requests are called :" + JSON.stringify(results[0][0]));
			res.json(results[0][0]);
		});



		// var totalRecords = contents.total_rows;
		// console.log(" Total Records " + totalRecords);



	}).catch(ClientError, function(e) {
		//A client error like 400 Bad Request happened
	});

	// var requestGet = function() {
	// 	var deferred = Q.defer();
	// 	request.get(cloudAntURL, deferred.resolve);
	// 	return deferred.promise;
	// };


	//var result1 = Q.all([requestGet(cloudAntURL)]);

	//	var requestInstance = requestGet(cloudAntURL)
	//		.then(function(newsResponse) { //callback invoked on deferred.resolve
	//			console.log("URL : " + cloudAntURL.url);
	//			console.log("Positive" + JSON.stringify(newsResponse));
	//
	//		}, function(newsError) { //callback invoked on deferred.reject
	//			console.log("Negative" + JSON.stringify(newsError));
	//		});
	//	// requestGet(cloudAntURL)
	// 	.then(function(res) {
	// 		console.log("Response : " + JSON.stringify(res));
	// 	});
	// //
	// var requestInstance =
	// 	requestGet(cloudAntURL)
	// 	.then(function(res) {
	// 		console.log("Response : " + JSON.stringify(res));
	// 		return res;
	// 	}).fail(function(error) {
	// 		console.log("Error : " + JSON.stringify(error));
	// 		return error;
	// 	});

	// var result2 = Q.all([requestGet]).then(function(result) {
	// 	for (var i = 0, len = result.length; i < len; i++) {
	// 		if (Q.isPromise(result[i])) {
	// 			result[i] = result[i].valueOf();
	// 			console.log("Value : " + result[i]);
	// 		}
	// 	}
	//
	// 	// Next step!
	// });


	// 	return "Not Found";
	// });
	// .then(loadBody).fail(function(error) {
	// 	return "Not Found";
	// });

	// var texts = Q.all([
	// 	text,
	// 	text.post("toUpperCase"),
	// 	text.post("toLowerCase"),
	// ]);
	//
	//
	//
	// request.get({
	// 		url: serviceURL,
	// 		headers: {
	// 			"Authorization": auth
	// 		}
	// 	},
	// 	function(error, response, body) {
	// 		//console.log(" response " + JSON.stringify(response));
	//
	// 		if (!error && response.statusCode == 200) {
	// 			//aggregateGoogleInvocation(body);
	// 			// var a = theFunction()
	// 			// 	.then(function(data) {
	// 			// 		var result = [];
	// 			// 		for (var i = 0; i < body.rows.length; i++)(function(i) {
	// 			// 			result.push(secondFunc(body.rows[i])
	// 			// 				.then(function(data2) {
	// 			// 					//data[i].more = data2.item;
	// 			// 					return body.rows[i];
	// 			// 				}));
	// 			// 		})(i); // avoid the closure loop problem
	// 			// 		return Q.all(result);
	// 			// 	});
	//
	//
	// 			var response1 = theFunction()
	// 				.then(function(body) {
	// 					return Q.all(body.rows.map(
	// 						function(item) {
	// 							console.log("Item: " + JSON.stringify(item));
	// 							return secondFunc(item)
	// 								.then(function(data2) {
	// 									item.more = data2.item;
	// 									return item;
	// 								});
	// 						}));
	// 				});
	//
	//
	//
	// 		}
	// 		//
	// 		// var response1 = theFunction()
	// 		// 	.then(function(body) {
	// 		// 		return Q.all(body.rows.map(function(item) return secondFunc(item)
	// 		// 				.then(function(data2) {
	// 		// 					item.more = data2.item;
	// 		// 					return item;
	// 		// 				});
	// 		// 		});
	// 		// 	});
	//
	//
	//
	// 	}); //.auth(dbCredentials.user, dbCredentials.password, false);

};
//
// function aggregateGoogleInvocation()
// .then(function(data) {
// 	var result = [];
// 	for (var i = 0; i < body.rows.length; i++)(function(i) {
// 		result.push(secondFunc(body.rows[i])
// 			.then(function(data2) {
// 				//data[i].more = data2.item;
// 				return body.rows[i];
// 			}));
// 	})(i); // avoid the closure loop problem
// 	return Q.all(result);
// });


// function aggregateGoogleInvocation(data)
// .then(function(data) {
// 	return Q.all(data.map(function(item) return singleGoogleInvocation(item)
// 			.then(function(data2) {
// 				item.more = data2.item;
// 				return item;
// 			});
// 	});
// });

//
// function singleGoogleInvocation(addressURL) {
// 	return 12;
// 	// request.get(addressURL, function(error, response, body) {
// 	// 	var result;
// 	// 	if (!error && response.statusCode == 200) {
// 	//
// 	// 		var data = JSON.parse(body);
// 	// 		var distance = data.routes[0].legs[0].distance.value;
// 	// 		result = distance;
// 	//
// 	// 	}
// 	// 	return result;
// 	// });
// }

exports.getServiceInformation = function(req, res) {

	var dbCredentials = {
		dbName: 'lbb_db'
	};

	//Parse VCAP_SERVICES cloudantNoSQLDB
	// if (process.env.VCAP_SERVICES) {
	// 	var vcapServices = JSON.parse(process.env.VCAP_SERVICES);
	// 	if (vcapServices.cloudantNoSQLDB) {
	// 		dbCredentials.host = vcapServices.cloudantNoSQLDB[0].credentials.host;
	// 		dbCredentials.port = vcapServices.cloudantNoSQLDB[0].credentials.port;
	// 		dbCredentials.user = vcapServices.cloudantNoSQLDB[0].credentials.username;
	// 		dbCredentials.password = vcapServices.cloudantNoSQLDB[0].credentials.password;
	// 		dbCredentials.url = vcapServices.cloudantNoSQLDB[0].credentials.url;
	// 	}
	// 	console.log('VCAP Services: ' + JSON.stringify(process.env.VCAP_SERVICES));
	// }

	dbCredentials.host =
		"3c0bec67-e61c-428b-84dd-73437ebfcd12-bluemix.cloudant.com";
	dbCredentials.port = 443;
	dbCredentials.user = "3c0bec67-e61c-428b-84dd-73437ebfcd12-bluemix";
	dbCredentials.password =
		"208e5b89dc26dbfbbc81a2a6988c9dcf1f6227b532ce897ecd612d22298a0b7c";
	dbCredentials.url =
		"https://3c0bec67-e61c-428b-84dd-73437ebfcd12-bluemix:208e5b89dc26dbfbbc81a2a6988c9dcf1f6227b532ce897ecd612d22298a0b7c@3c0bec67-e61c-428b-84dd-73437ebfcd12-bluemix.cloudant.com";


	logger.info("getServiceInformation is invoked");

	var serviceURL =
		'https://' + dbCredentials.user +
		'.cloudant.com/lbb_db/_design/view/_view/allServices';

	var auth = "Basic " + new Buffer(dbCredentials.user + ":" + dbCredentials.password)
		.toString("base64");
	var cloudAntURL = {
		url: serviceURL,
		headers: {
			"Authorization": auth
		}
	};

	console.log("Request Bluebird");

	function ClientError(e) {
		return e.code >= 400 && e.code < 500;
	}

	request(cloudAntURL).then(function(contents) {
		var data = JSON.parse(contents[1]);
		console.log(data);
		res.json(data);
		// var totalRecords = contents.total_rows;
		// console.log(" Total Records " + totalRecords);
	}).catch(ClientError, function(e) {
		//A client error like 400 Bad Request happened
	});



}
