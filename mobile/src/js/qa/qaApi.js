'use strict';


angular.module('lbbApp.qa')
	.factory('qaApi', ['$http', function($http){
		var pub = {
			getAll: getAll,
			getCategory: getCategory
		};

		function getAll(){
			return $http.get('https://lbb-swagger.au-syd.mybluemix.net/api/LLBServices');
		}

		function getCategory(category){
			return $http.get('https://lbb-swagger.au-syd.mybluemix.net/api/LLBServices?filter[where][Category' + category + ']=1');
		}

		return pub;
	}]);