'use strict';

angular.module('lbbApp.qa')
	.controller('QaController', ['$state', '$ionicModal', 'userService', 'qaApi',
	function($state, $ionicModal, userService, qaApi) {
		var vm = this;
		//This is the correct format. Will be activted with Watson Q&A

		//variables
		vm.response = [];
		vm.question = '';
		vm.data = {};
		vm.category = userService.getCategory(); // Get the default category
		//$scope.type = userService.getType(); // Get the default type
		//functions
		vm.updateCategory = updateCategory;
		vm.updateType = updateType;
		vm.askQuestion = askQuestion;
		vm.goToBrowse = goToBrowse;
		vm.goToDialog = goToDialog;

		updateType();


		//** PUBLIC FUNCTIONS **//
		// When the category is changed in search, update the data for the filter
		
		function updateCategory() {
				userService.setCategory(vm.data.CatagorySelect);
				console.log('userService', userService.getCategory());
		}
		
		// Set which search type is being done (Watson/Category)
		function updateType() {
			if((userService.getCategory() === 'All')){
				_getServiceInformation(qaApi.getAll());
			} else {
				_getServiceInformation(qaApi.getCategory(userService.getCategory()));
			}
		}

		function askQuestion() {
			// Passing an ID value of -1 will be interpreted as a newly created sensor.

			console.log(JSON.stringify(vm.question));
			$state.go('app.searchresults', vm.question);
			vm.question = {};
		}

		function goToDialog(question){
			$state.go('app.dialog', {question:question}, {reload: true});
		}

		function goToBrowse(){
			updateType();
			$state.go('app.browse');
		}

		//** PRIVATE FUNCTIONS **//
		function _getServiceInformation(requestPromise) {

			requestPromise.then(
				function successCallback(result) {
					vm.response = result.data;
					console.log('vm.response', vm.response);
				},
				function errorCallback(err) {
					console.error('ERR', err);
					// err.status will contain the status code
				});

			vm.question = '';
		}

	}]);
