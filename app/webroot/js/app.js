(function() {
'use strict';

angular.module('app', ['ngRoute', 'app.controllers', 'app.directives','app.services','ui.bootstrap','angular-loading-bar','truncate','ngSanitize'])
	.config(['$routeProvider','cfpLoadingBarProvider', function($routeProvider, cfpLoadingBarProvider){
		cfpLoadingBarProvider.includeSpinner = false;
		$routeProvider
		.when('/', {
			templateUrl: 'views/post.html', 
			controller: 'PostController'
		})
		.when('/:id', {
			templateUrl: 'views/single.html', 
			controller: 'ViewPostController'
		})
		.otherwise({
			redirectTo: '/'
		});
	}]);
}());	