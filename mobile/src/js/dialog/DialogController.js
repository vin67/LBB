'use strict';

angular.module('lbbApp.dialog')
	.controller('DialogController', ['$ionicScrollDelegate', '$stateParams', 'dialogApi', 
	function($ionicScrollDelegate, $stateParams, dialogApi){
		var vm = this;
		var ERROR_MESSAGE = 'Error please try again later.';
		var LOADING_MESSAGE = '<span>Loading</span><span class="loading-ellipses"><span class="one">.</span><span class="two">.</span><span class="three">.</span></span>';

		//variables
		vm.loading = true;
		vm.conversation = [];
		vm.userInput = '';

		//functions
		vm.askQuestion = askQuestion;

	
		_init()


		//*** PUBLIC FUNCTIONS ***//

		function askQuestion(){
			var input = vm.userInput;
			vm.userInput = '';
			_sendChatMessage(input);
		}


		//*** PRIVATE FUNCTIONS ***//

		function _init(){
			var input = $stateParams.question;
			if(input){			
				_insertMessage(_messageFactory([input],{watson:false}));
				dialogApi.startChat()
					.then(function successCallback(result){
						_sendChatMessageNoVisual(input);
					}, function errorCallback(result){
						_done();
						_insertMessage(_messageFactory([ERROR_MESSAGE],{watson:true}));
					});
			} else {
				_loading();
				dialogApi.startChat()
					.then(function successCallback(result){
						_done();
						_insertMessage(_messageFactory(result.data.dialogOutput.response,{watson:true}));
					}, function errorCallback(result){
						_done();
						_insertMessage(_messageFactory([ERROR_MESSAGE],{watson:true}));
					});				
				}
		}

		function _sendChatMessage(input){
			_insertMessage(_messageFactory([input],{watson:false}));
			_sendChatMessageNoVisual(input);
		}

		function _sendChatMessageNoVisual(input){
			_loading(); //loading inserts a message
			dialogApi.sendChatMessage(input)
				.then(function successCallback(result){	
					var data = result.data;
					_done();
					if(data.records){
						_insertRecords(data.records);
					}
					_insertMessage(_messageFactory(result.data.dialogOutput.response,{watson:true}));
				}, function errorCallback(result){
					_done();
					_insertMessage(_messageFactory([ERROR_MESSAGE],{watson:true}));
				});
		}


		function _insertRecords(records){
			records.forEach(function(record){
				var response = ['<strong>'+record.ServiceName+'</strong>'];
				if(record.ServicePhone){
					response.push('Phone Number: '+record.ServicePhone);
				}
				if(record.ServiceURL){
					response.push('Website: '+record.ServiceURL);
				}
				if(record.ServiceEmail){
					response.push('Email: '+record.email);
				}
				// console.log('response', response);
				_insertMessage(_messageFactory(response,{watson:true, link:true}));
			});
		}


		function _messageFactory(response, meta){
			return {response: response, meta:meta};
		}

		function _insertMessage(message){
			vm.conversation.push(message);
			$ionicScrollDelegate.scrollBottom();
		}

		function _deleteLastMessage(){
			delete vm.conversation[--vm.conversation.length];
		}


		function _loading(){
			vm.loading = true;
			_insertMessage(_messageFactory([LOADING_MESSAGE],{watson:true}));
		}

		function _done(){
			vm.loading = false;
			_deleteLastMessage();
		}

	}]);