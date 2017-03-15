'use strict';

angular.module('myApp', [
	'ngAnimate',
	'ngSanitize',
	'ngRoute',
	'angular-loading-bar',
	'ui.bootstrap',
	'app.controllers',
	'app.factories'
])
.config(['$routeProvider', 'cfpLoadingBarProvider', '$locationProvider',
	function($routeProvider, cfpLoadingBarProvider, $locationProvider){
		cfpLoadingBarProvider.includeSpinner = false;
		$routeProvider
		.when('/', {
			controller: 'searchListCtrl',
			templateUrl: 'modules/search/views/search_list.html',
		})
		.when('/new', {
			controller: 'searchCtrl',
			templateUrl: 'modules/search/views/search.html',
		})
		.otherwise({
			redirectTo: '/'
		});
		// $locationProvider.html5Mode(true);
	}
]);		

/* Setting up new module with its corresponding dependencies */
angular.module('app.controllers', []);
angular.module('app.factories', []);
/*

angular.module('app.directives', []);
angular.module('app.filters', []);*/