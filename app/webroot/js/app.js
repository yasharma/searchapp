(function(){
	'use strict';
	angular.module('app', ['ngRoute', 'app.controllers', 'app.directives','textAngular','ui.bootstrap','angular-loading-bar','truncate'])
	.config(['$routeProvider','cfpLoadingBarProvider','$locationProvider', function($routeProvider, cfpLoadingBarProvider){
		cfpLoadingBarProvider.includeSpinner = false;
		$routeProvider
		.when('/', {
			templateUrl: 'views/post.html', 
			controller: 'PostController'
		})
		.when('/new', {
			templateUrl: 'views/create.html', 
			controller: 'NewPostController'
		})
		.when('/edit/:id', {
			templateUrl: 'views/edit.html', 
			controller: 'EditPostController'
		})
		.when('/:id', {
			templateUrl: 'views/single.html', 
			controller: 'ViewPostController'
		})
		.otherwise({
			redirectTo: '/'
		});
	}]);
})();	