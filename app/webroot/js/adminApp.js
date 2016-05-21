angular.module('adminApp', ['ngRoute', 'app.controllers', 'app.directives','textAngular','ui.bootstrap','angular-loading-bar'])
	.config(['$routeProvider','cfpLoadingBarProvider','$locationProvider', function($routeProvider, cfpLoadingBarProvider){
		cfpLoadingBarProvider.includeSpinner = false;
		$routeProvider
		.when('/', {
			templateUrl: 'views/admin/login.html', 
			controller: 'AdminController'
		})
		.otherwise({
			redirectTo: '/'
		});
	}]);