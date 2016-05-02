angular.module('lbbApp.qa')
  .controller('QAController', ['$scope', '$http', '$state', '$ionicModal', 'userService',
  function($scope, $http, $state, $ionicModal, userService) {

    //This is the correct format. Will be activted with Watson Q&A
    // Create the login modal that we will use later
    $scope.question = {};

    // $ionicModal.fromTemplateUrl('templates/login.html', {
    //   scope: $scope
    // }).then(function(modal) {
    //   $scope.modal = modal;
    // });

    $scope.category = userService.getCategory(); // Get the default category
    $scope.type = userService.getType(); // Get the default type

    // When the category is changed in search, update the data for the filter
    $scope.updateCategory = function () {
        $scope.category = this.category
        userService.setCategory(this.category);
    }
    
    // Set which search type is being done (Watson/Category)
    $scope.updateType = function(type) {
      if(type == 'Category') {
        userService.setType('Category');
      } else if(type == 'Watson') {
        userService.setType('Watson');
      }
    }

    var httpUrl = 'https://littlebluebook_backend.mybluemix.net/api/questionAnswer?question=depression';
    if($scope.type == 'Category') {
      //httpUrl = 'http://localhost:6001/api/questionAnswerCat?question=depression';
      httpUrl = 'https://littlebluebook_backend.mybluemix.net/api/questionAnswerCat?question=depression';
    } else {
      httpUrl = 'https://littlebluebook_backend.mybluemix.net/api/questionAnswer?question=depression';
    }

    $http.get(
      httpUrl
    ).then(
      function(resp) {
        var result = [];
        for (var i = 0; i < resp.data.length; i++) {
          var record = {};

          var serviceType = resp.data[i]['ServiceType'];
          record['ServiceName'] = resp.data[i]['ServiceName'];
          record['ServiceType'] = serviceType;
          record['AdditionalInfo'] = resp.data[i]['AdditionalInfo'];
          record['WebAddress'] = resp.data[i]['URL'];
          record['Telephone'] = resp.data[i]['TelephoneNumber'];
          /*
          if (serviceType == 'Web') {
            record['WebAddress'] = resp.data[i]['URL'];
          } else {
            record['Telephone'] = resp.data[i]['TelephoneNumber'];
          }
          */
          result.push(record);
        }
        $scope.qaResponse = result;
      },
      function(err) {
        console.error('ERR', err);
        // err.status will contain the status code
      });

    $scope.question = {};
    $scope.askQuestion = function() {
      // Passing an ID value of -1 will be interpreted as a newly created sensor.

      console.log(JSON.stringify($scope.question));
      $state.go('app.searchresults', question);
      $scope.question = {};
    };



  }]);
