(function() {
'use strict';

angular.module('app.services', [])
	.factory('paginateSvr', ['$rootScope','$http', function ($rootScope,$http) {
		return {
			getData: function (option) {
				var pageNum = option.params.page;
				var apiUrl = angular.isUndefined(option.params.apiUrl) ? '/posts/index/' : option.params.apiUrl;
				return $http.get($rootScope.appURL + apiUrl + 'page:' + pageNum +'.json').then( function(response){
					return {
						posts: response.data.posts,
						paging: response.data.paging
					};
				});
			}	
		};
	}])
	.factory('AuthenticationService', function () {
	    var auth = {
	        isLogged: false
	    };

	    return auth;
	})
	.factory('socketio', ['$rootScope', '$location',function ($rootScope, $location) {
		var socket = io.connect('http://'+ $location.host() +':8082');
		return {
			on: function (eventName, callback) {
				socket.on(eventName, function () {  
					var args = arguments;
					$rootScope.$apply(function () {
						callback.apply(socket, args);
					});
				});
			},
			emit: function (eventName, data, callback) {
				socket.emit(eventName, data, function () {
					var args = arguments;
					$rootScope.$apply(function () {
						if (callback) {
							callback.apply(socket, args);
						}
					});
				});
			}
		};
	}])
	.factory('postSvr', ['$rootScope', '$http', function ($rootScope, $http) {
		return{
			get: function(option){
				var apiUrl = angular.isUndefined(option) ? '/posts.json' : option.apiUrl;
				return $http.get($rootScope.appURL + apiUrl).then( function(response){
					return {
						posts: response.data.posts,
						paging: response.data.paging
					};
				});
			}
		};
	}]);	
}());	