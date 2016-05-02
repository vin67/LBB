'use strict';

angular.module('lbbApp', ['ionic', 'lbbApp.dialog', 'lbbApp.map', 'lbbApp.menu', 'lbbApp.qa', 'lbbApp.detail'])
  .run(['$ionicPlatform', function($ionicPlatform) {
    $ionicPlatform.ready(function() {
      // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
      // for form inputs)
      if (window.cordova && window.cordova.plugins.Keyboard) {
        cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
      }
      if (window.StatusBar) {
        // org.apache.cordova.statusbar required
        StatusBar.styleDefault();
      }
    });
  }])
  .config(['$stateProvider', '$urlRouterProvider', function($stateProvider, $urlRouterProvider) {
    $stateProvider
    .state('app', {
      url: '/app',
      abstract: true,
      templateUrl: 'templates/menu.html',
      controller: 'MenuController',
      controllerAs: 'menu'
    })
    .state('app.search', {
      url: '/search',
      views: {
        'menuContent': {
          templateUrl: 'templates/search.html',
          controller: 'QaController',
          controllerAs: 'qa'
        }
      }
    })
    .state('app.dialog', {
      url: '/dialog',
      params: {question:null},
      views: {
        'menuContent': {
          templateUrl: 'templates/dialog.html',
          controller: 'DialogController',
          controllerAs: 'dialog'
        }
      }
    })
    .state('app.browse', {
      url: '/browse',
      views: {
        'menuContent': {
          templateUrl: 'templates/browse.html',
          controller: 'QaController',
          controllerAs: 'qa'
        }
      }
    })
    .state('app.searchresults', {
      url: '/searchresults',
      views: {
        'menuContent': {
          templateUrl: 'templates/search-results.html',
          controller: 'QaController',
          controllerAs: 'qa'
        }
      }
    })
    .state('app.map', {
      url: '/map',
      views: {
        'menuContent': {
          templateUrl: 'templates/map.html',
          controller: 'MapController',
          controllerAs: 'map'
        }
      }
    })
    .state('app.reachout', {
      url: '/reachout',
      views: {
        'menuContent': {
          templateUrl: 'templates/reachout.html'
        }
      }
    })
  .state('app.detail', {
      url: '/detail/:id',
      views: {
        'menuContent': {
          templateUrl: 'templates/detail.html',
          controller: 'DetailController',
          controllerAs: 'detail'
        }
      }
    });
    // if none of the above states are matched, use this as the fallback
    $urlRouterProvider.otherwise('/app/search');
  }]);


require('./menu/');
require('./map/');
require('./qa/');
require('./reachout/');
require('./dialog/');
require('./detail/');
