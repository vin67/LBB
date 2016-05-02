//Angular App Module and Controller
angular.module('lbbApp.detail')
	.controller('DetailController', ['$scope', '$http', '$stateParams', function ($scope, $http, $stateParams) {

	$scope.id = $stateParams.id;
	console.log($scope.id);
	
	$scope.httpUrl = 'http://lbb-swagger.au-syd.mybluemix.net/api/LLBServices?filter[where][id]=' + $scope.id;
	
	
	$http.get(
      $scope.httpUrl
    ).then(
      function(resp) {
		  console.log(resp);
        var result = [];
        for (var i = 0; i < resp.data.length; i++) {
          var record = {};

          var serviceType = resp.data[i]['ServiceType'];
          record['ServiceName'] = resp.data[i]['ServiceName'];
          record['ServiceType'] = serviceType;
          //record['AdditionalInfo'] = resp.data[i]['AdditionalInfo'];
          record['URL'] = resp.data[i]['ServiceURL'];
          record['Telephone'] = resp.data[i]['TelephoneNumber'];
		  record['DescriptionHealth'] = resp.data[i]['DescriptionHealth'];
		  record['DescriptionTele'] = resp.data[i]['DescriptionTele'];
		  record['DescriptionWeb'] = resp.data[i]['DescriptionWeb'];
		  record['DescriptionYouth'] = resp.data[i]['DescriptionYouth'];	
		  record['ServiceInformation'] = resp.data[i]['ServiceInformation'];
		  record['ServiceCarer'] = resp.data[i]['ServiceCarer'];
		  record['ServiceCounsel'] = resp.data[i]['ServiceCounsel'];
		  record['ServiceMedicare'] = resp.data[i]['ServiceMedicare'];
		  record['ServiceMultilingual'] = resp.data[i]['ServiceMultilingual'];
		  record['ServiceResources'] = resp.data[i]['ServiceResources'];
		  record['ServiceSocial'] = resp.data[i]['ServiceSocial'];
		  record['ServiceSupport'] = resp.data[i]['ServiceSupport'];
		  record['ServiceYouth'] = resp.data[i]['ServiceYouth'];
		  record['ServiceReferTo'] = resp.data[i]['ServiceReferTo'];
		  record['ServiceReferFrom'] = resp.data[i]['ServiceReferFrom'];
		  
		  record['CloseMon'] = resp.data[i]['CloseMon'];
		  record['CloseTues'] = resp.data[i]['CloseTues']; 
		  record['CloseWed'] = resp.data[i]['CloseWed'];
		  record['CloseThurs'] = resp.data[i]['CloseThurs'];
		  record['CloseFri'] = resp.data[i]['CloseFri'];
		  record['CloseSat'] = resp.data[i]['CloseSat'];
		  record['CloseSun'] = resp.data[i]['CloseSun'];
		  
		  record['OpenMon'] = resp.data[i]['OpenMon'];
		  record['OpenTues'] = resp.data[i]['OpenTues']; 
		  record['OpenWed'] = resp.data[i]['OpenWed'];
		  record['OpenThurs'] = resp.data[i]['OpenThurs'];
		  record['OpenFri'] = resp.data[i]['OpenFri'];
		  record['OpenSat'] = resp.data[i]['OpenSat'];
		  record['OpenSun'] = resp.data[i]['OpenSun'];
		  
		  
	      record['ServicePhone'] = resp.data[i]['ServicePhone'];
		  record['ServiceURL'] = resp.data[i]['ServiceURL'];
	
		record['CategoryHealth'] = resp.data[i]['CategoryHealth'];
		record['CategoryTelephone'] = resp.data[i]['CategoryTelephone'];
		record['CategoryWeb'] = resp.data[i]['CategoryWeb'];
		record['CategoryYouth'] = resp.data[i]['CategoryYouth'];




	
	

		  record['id'] = resp.data[i]['id'];
         		  
          result.push(record);
		  console.log(result);
        }
		
        $scope.qaResponse = result;
      },
      function(err) {
        console.error('ERR', err);
        // err.status will contain the status code
      });
	
	}]);
