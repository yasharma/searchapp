angular.module('app', ['ngRoute', 'app.controllers', 'app.directives','textAngular'])
	.config(['$routeProvider', function($routeProvider){
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
		.otherwise({
			redirectTo: '/'
		});
	}]);