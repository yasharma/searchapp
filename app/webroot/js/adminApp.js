(function(){
	"use strict";
	angular.module('adminApp', ['ngRoute', 'app.controllers', 'app.directives','textAngular','ui.bootstrap','angular-loading-bar','LocalStorageModule'])
		.config(['$routeProvider','cfpLoadingBarProvider','$httpProvider', function($routeProvider, cfpLoadingBarProvider,$httpProvider){
			cfpLoadingBarProvider.includeSpinner = false;
			$routeProvider
			.when('/', {
				templateUrl: 'views/admin/login.html', 
				controller: 'AdminController'
			})
			.when('/dashboard', {
				templateUrl: 'views/admin/dashboard.html', 
				controller: 'DashboardController',
				access: {requiredLogin: true}
			})
			.when('/logout', {
				template: '', 
				controller: 'LogoutController',
				access: {requiredLogin: true}
			})
			.otherwise({
				redirectTo: '/'
			});

			var interceptor = ['$q', '$location', '$rootScope', 'localStorageService', 'AuthenticationService', function ($q, $location, $rootScope, localStorageService, AuthenticationService) {
				return {
		        	request: function (config) {
			           config.headers = config.headers || {};
			           var token = localStorageService.get('token');
			           if (token) {
			               	config.headers.token = token;
			               	AuthenticationService.isLogged = 1;
		                    $rootScope.isLogged = 1;
			           }
			           return config;
			       	},

		            requestError: function (rejection) {
		            	console.log(rejection);
		                return $q.reject(rejection);
		            },

		            response: function (response) {
		            	//console.log(response);
		                return response || $q.when(response);
		            },

		            // Revoke client authentication if 401 is received

		            responseError: function (rejection) {
		                // Dynamically get the service since they can't be injected into config
		                console.log(rejection);
		                return $q.reject(rejection);
		            }
		        };
			}];
			$httpProvider.interceptors.push(interceptor);
		}])
		.factory('AuthenticationService', function () {
		    var auth = {
		        isLogged: false
		    };
		    return auth;
		})
		.run(['$rootScope', '$location', 'localStorageService', 'AuthenticationService', function ($rootScope, $location, localStorageService, AuthenticationService) {
			$rootScope.$on("$routeChangeStart", function (event, nextRoute, currentRoute) {
				if ( nextRoute !== null && nextRoute.access !== null || nextRoute.access.requiredLogin && !AuthenticationService.isLogged && !localStorageService.get('user')) {
				    AuthenticationService.isLogged = 0;
				    $location.path("/");
				}  
			});

			$rootScope.user = localStorageService.get('user');
		}]);
})();	