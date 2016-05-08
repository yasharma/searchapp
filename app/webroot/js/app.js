angular.module('app', ['ngRoute', 'app.controllers', 'app.directives','textAngular','ui.bootstrap','angular-loading-bar'])
	.config(['$routeProvider','cfpLoadingBarProvider','$locationProvider', function($routeProvider, cfpLoadingBarProvider, $locationProvider){
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
		// use the HTML5 History API
        $locationProvider.html5Mode(true);
	}]);