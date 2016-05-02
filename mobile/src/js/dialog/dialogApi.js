'use strict';

angular.module('lbbApp.dialog')
	.factory('dialogApi', ['$http', '$q', function($http, $q){
		var pub = {
			startChat: startChat,
			sendChatMessage: sendChatMessage
		};
		var conversationId = '';
		var clientId = '';


		function startChat(){
			return $q(function(resolve, reject){
				$http.post('https://rm1-bluebook-watson.mybluemix.net/smartChat',{})
					.then(function successCallback(result){
						conversationId = result.data.dialogOutput.conversation_id;
						clientId = result.data.dialogOutput.client_id;
						resolve(result);
					}, function errorCallback(result){
						reject(result);
					});
			});
		}

		function sendChatMessage(input){
			var body = {
				conversation_id: conversationId,
				client_id: clientId,
				input: input
			}
			return $http.post('https://rm1-bluebook-watson.mybluemix.net/smartChat', body);

		}

		return pub;

	}]);