'use strict';


angular.module('lbbApp.map')
	.factory('mapApi', ['$http', function($http){
		var pub = {
			getGeocode: getGeocode,
			getServiceInfo: getServiceInfo
		};

		function getGeocode(address){
			return $http.get('https://maps.googleapis.com/maps/api/geocode/json?address=' + address);
		}

		function getServiceInfo(){
			return $http.get('https://littlebluebook_backend.mybluemix.net/getServiceInformation');
		}

		return pub;
	}]);