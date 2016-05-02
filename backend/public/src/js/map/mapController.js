//Angular App Module and Controller
angular.module('lbbApp.map')
	.controller('MapController', ['$scope', '$http', function ($scope, $http) {
		//Data
		var locations = [];

		$scope.newAddress = [];

		$scope.address = {
			addressInput:  ''
		}
		 
		 
		 $scope.update = function() {

			$http.get('https://maps.googleapis.com/maps/api/geocode/json?address=' + $scope.address.addressInput)
			.success(function(response) {
				$scope.newAddress = response.results;

				$scope.lat = $scope.newAddress[0].geometry.location.lat;
				$scope.lng = $scope.newAddress[0].geometry.location.lng;

				$scope.setCustomPosition();
			});

	     }

		 $scope.lat = "0";
	     $scope.lng = "0";



		$scope.services = [];

		//Get Service Information with HTTP Request
		$http.get("/getServiceInformation")
		.success(function(response) {

		//Assign services from JSON rows
		$scope.services = response.rows;

		//Push each Service JSON Block into locations array (service name, description, latitude and longitude)
		for(i = 0; i < $scope.services.length; i++)
		{
			locations.push({service : $scope.services[i].value.S_name,
	        desc : $scope.services[i].value.D_health,
	        lat : $scope.services[i].value.A_lat,
	        long : $scope.services[i].value.A_long,
			tag: "Service"});
		}

		//Call get location of client device after this is complete
		$scope.getLocation();

		}, function(response) {
	    console.log("error")});

		 $scope.markers = [];
		 var infoWindow = new google.maps.InfoWindow();


		 // Set current lat and lng of client device and push client marker to locations array
		 $scope.setPosition = function (position) {
	            $scope.lat = position.coords.latitude;
	            $scope.lng = position.coords.longitude;

			locations.push({service : 'Your Location',
	        desc : 'You are here!',
	        lat : $scope.lat,
	        long : $scope.lng,
			tag: "Client"});

			$scope.makeMap();
	    };


		 $scope.setCustomPosition = function () {

			locations.pop(0);
			locations.push({service : 'Your Location',
	        desc : 'You are here!',
	        lat : $scope.lat,
	        long : $scope.lng,
			tag: "Client"});

			console.log($scope.lat);
			console.log($scope.lng);

			$scope.makeMap();
	    };


		//Get client device location using Javascript Geolcation API
		 $scope.getLocation = function () {
	            if (navigator.geolocation) {
	                navigator.geolocation.getCurrentPosition($scope.setPosition, $scope.showError);
	            }
	            else {
	                $scope.error = "Geolocation is not supported by this browser.";
	            }
	    }

		//Create a google maps marker
	    var createMarker = function (info){

	        var marker = new google.maps.Marker({
	            map: $scope.map,
	            position: new google.maps.LatLng(info.lat, info.long),
	            title: info.service
	        });

			//Can customize icons by tag field
			if(info.tag == "Client")
			{
			marker.setIcon('http://maps.google.com/mapfiles/ms/icons/blue-dot.png')
			}
			else
			{
			marker.setIcon('https://cdn4.iconfinder.com/data/icons/32x32-free-design-icons/32/Info.png')
			}
	        marker.content = '<div class="infoWindowContent">' + info.desc + '</div>';

			//Add click listener to marker to open a window
	        google.maps.event.addListener(marker, 'click', function(){
	            infoWindow.setContent('<h2>' + marker.title + '</h2>' + marker.content);
	            infoWindow.open($scope.map, marker);
	        });

			//Push marker to map
	        $scope.markers.push(marker);

	    }

		// Create a google map to display
		$scope.makeMap = function () {

		// Map options
		$scope.mapOptions = {
				zoom: 12,
				center: new google.maps.LatLng($scope.lat, $scope.lng),
				mapTypeId: google.maps.MapTypeId.TERRAIN
		};

		// Create a new google map
		$scope.map = new google.maps.Map(document.getElementById('map'), $scope.mapOptions);

		//Create markers for each Service
		for (i = 0; i < locations.length; i++){
			createMarker(locations[i]);
		}

		}


		$scope.openInfoWindow = function(e, selectedMarker){
	        e.preventDefault();
	        google.maps.event.trigger(selectedMarker, 'click');
	    }

	}]);
