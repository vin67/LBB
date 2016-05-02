'use strict';

//Angular App Module and Controller
angular.module('lbbApp.map')
	.controller('MapController', ['$document', 'mapApi', function ($document, mapApi) {
		//variables

		var vm = this;
		var locations = [];
		var infoWindow = new google.maps.InfoWindow();
		var mapElem = $document[0].getElementById('map');
		var lat = '0';
		var lng = '0';
		var newAddress = [];
		var markers = [];
		var services = [];
		var map = null;
		var mapOptions = null;

		//variables
		vm.error = '';
		vm.address = {
			addressInput: ''
		};

		//functions
		vm.update = update;



		_init();
		 


		//*** PUBLIC FUNCTIONS ***//
		function update() {
			mapApi.getGeocode(vm.address.addressInput)
				.then(function successCallback(result) {
					newAddress = result.data.results;
					lat = newAddress[0].geometry.location.lat;
					lng = newAddress[0].geometry.location.lng;

					_setCustomPosition();
				});
		}


		//*** PRIVATE FUNCTIONS ***//

		function _init(){
			//Get Service Information with HTTP Request
			mapApi.getServiceInfo()
				.then(function successCallback(result) {
					var i;
					//Assign services from JSON rows
					services = result.data.rows;

					//Push each Service JSON Block into locations array (service name, description, latitude and longitude)
					for(i = 0; i < services.length; i++)
					{
						locations.push({service : services[i].value.S_name,
							desc : services[i].value.D_health,
							lat : services[i].value.A_lat,
							long : services[i].value.A_long,
						tag: 'Service'});
					}

					//Call get location of client device after this is complete
					_getLocation();

				}, function errorCallback(result) {
					console.log('error')
				});
		}



		// Set current lat and lng of client device and push client marker to locations array
		function _setPosition(position) {
			lat = position.coords.latitude;
			lng = position.coords.longitude;

			locations.push({service : 'Your Location',
					desc : 'You are here!',
					lat : lat,
					long : lng,
			tag: 'Client'});

			_makeMap();
		}





	 	function _setCustomPosition() {

			locations.pop();
			locations.push({service : 'Your Location',
				desc : 'You are here!',
				lat : lat,
				long : lng,
				tag: 'Client'
			});

			console.log(lat);
			console.log(lng);

			_makeMap();
		}


		//Get client device location using Javascript Geolcation API
		function _getLocation() {
			if (navigator.geolocation) {
				navigator.geolocation.getCurrentPosition(_setPosition, function(err){
					vm.error = 'Error getting current Geolocation.';
				});
			}
			else {
					vm.error = 'Geolocation is not supported by this browser.';
			}
		}


		//Create a google maps marker
		function _createMarker(info){
			var marker = new google.maps.Marker({
					map: map,
					position: new google.maps.LatLng(info.lat, info.long),
					title: info.service
			});

			//Can customize icons by tag field
			if(info.tag === 'Client'){
				marker.setIcon('https://maps.google.com/mapfiles/ms/icons/blue-dot.png')
			}
			else{
				marker.setIcon('https://cdn4.iconfinder.com/data/icons/32x32-free-design-icons/32/Info.png')
			}
			marker.content = '<div class="infoWindowContent">' + info.desc + '</div>';

			//Add click listener to marker to open a window
			google.maps.event.addListener(marker, 'mousedown', function(){
					infoWindow.setContent('<h2>' + marker.title + '</h2>' + marker.content);
					infoWindow.open(map, marker);
			});

			//Push marker to map
			markers.push(marker);

		}


		// Create a google map to display
		function _makeMap() {
			var i;
			// Map options
			mapOptions = {
				zoom: 12,
				center: new google.maps.LatLng(lat, lng),
				mapTypeId: google.maps.MapTypeId.TERRAIN
			};

			// Create a new google map
			map = new google.maps.Map(mapElem, mapOptions);

			//Create markers for each Service
			for (i = 0; i < locations.length; i++){
				_createMarker(locations[i]);
			}

		}

	}]);
