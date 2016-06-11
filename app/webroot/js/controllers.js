(function() {
	'use strict';

	angular.module('app.controllers', [])
	.controller('AppController', ['$scope', '$http', '$location', '$rootScope', 'socketio',function($scope, $http, $location, $rootScope, socketio){
		var protocol = $location.protocol();
		$rootScope.appURL = $location.host() === 'blog.dev' ? protocol+'://blog.dev' : protocol+'://peerblog.herokuapp.com';
		$rootScope.imagePath = $rootScope.appURL +'/img/posts_images/';
		$rootScope.admin = 'admin.html#';
	}])
	.controller('PostController', ['$scope', '$location', 'paginateSvr', 'socketio', 'postSvr' ,function($scope, $location, paginateSvr, socketio, postSvr){
		var load = function(){
			postSvr.get().then(function(response){
				$scope.posts = response.posts;
				$scope.paging = response.paging;
			});
		};
		
		socketio.on('new.post.created', function(){
			load();
		});

		/* Fetching all posts when first comes to page */
		load();

		$scope.pageChanged = function () {
		   	paginateSvr.getData({
		      	params: {
		        	page: $scope.paging.page
		      	}
		   	}).then(function(response){
		   		$scope.posts = response.posts;
				$scope.paging = response.paging;
		   	});
		};

		$scope.viewPost = function(index){
			$location.path('/' + $scope.posts[index].Post.id);
		};
	}])
	.controller('ViewPostController', ['$scope', '$http', '$routeParams','$location', '$rootScope',function($scope, $http, $routeParams, $location, $rootScope){
		
		$http.get($rootScope.appURL + '/posts/' + $routeParams.id + '.json')
        	.then(function(response) {
            	$scope.Post = response.data.post.Post;
        });
	}])
	.controller('AdminController', ['$scope', '$http','$location', '$rootScope','localStorageService','AuthenticationService' ,function($scope, $http, $location, $rootScope, localStorageService,AuthenticationService){
		//$rootScope.user = null;
		$scope.login = function (isValid) {
			if (!isValid) return;
			var _data = {};
			_data.User = $scope.user;
			$http.post($rootScope.appURL + '/users/login.json', _data)
				.then(function(response){
					if( response.data.message.type == 'error' ){
						$scope.Message = response.data.message;
					} else {
						localStorageService.set('token', response.headers('token'));
						localStorageService.set('user', {
						    "id": response.data.user.id,
						    "firstname": response.data.user.firstname,
						    "lastname": response.data.user.lastname,
						    "email": response.data.user.email,
						    "role": response.data.user.role,
						    "created": response.data.user.created,
						});
						AuthenticationService.isLogged = true;
                    	$rootScope.isLogged = true;
						$rootScope.user = localStorageService.get('user');
						$location.path('/dashboard');
					}

				},	function (response){
					$location.path('/');
				}
			);
		};	
	}])
	.controller('DashboardController', ['$scope', '$http', '$rootScope', '$location', '$timeout', 'socketio',function($scope, $http, $rootScope, $location,$timeout,socketio){
		$http.get($rootScope.appURL + '/users.json').
			then(function(response){
				$scope.Post = response.data.posts;
			}
		);
	
		$timeout(function () { 
			$rootScope.Message = null; 
		}, 3000); 
	}])
	.controller('LogoutController', ['$scope', '$http', '$rootScope', '$location','localStorageService', function($scope, $http, $rootScope, $location,localStorageService){
		$http.get($rootScope.appURL + '/users/logout.json').
			then(function(response){
				localStorageService.remove('user');
				localStorageService.remove('token');
				$rootScope.isLogged = false;
				delete $rootScope.user;
				$location.path('/');
			});
	}])
	.controller('ProfileController', ['$scope', '$http','$location', '$rootScope', 'localStorageService', function($scope, $http, $location, $rootScope, localStorageService){
		$scope.update_account_info = function(isValid){
			if (!isValid) return;
			var _data = {};
			_data.User = $scope.user;
			$http.put($rootScope.appURL + '/users/' + $scope.user.id + '.json', _data)
				.then(function(response){
					if( response.data.message.type == 'error' ){
						$scope.Message = response.data.message;
					} else {
						localStorageService.set('user', {
						    "id": response.data.user.id,
						    "firstname": response.data.user.firstname,
						    "lastname": response.data.user.lastname,
						    "email": response.data.user.email,
						    "role": response.data.user.role,
						    "created": response.data.user.created,
						});
						$rootScope.user = localStorageService.get('user');
						$location.path('/dashboard');
					}

				},	function (response){
					$location.path('/');
				}
			);
		};

		$scope.change_password = function(isValid){
			if(!isValid) return;
			var _data = {};
			_data.user = $scope.user;
			$rootScope.Message = null;
			if($scope.user.password === $scope.user.confirmpassword){
				$http.post($rootScope.appURL + '/users/change_password.json', _data).then(function(response){
					$rootScope.Message = response.data.message;
					if( response.data.message.type == 'success' ){
						$scope.user.currentpassword = null;
						$scope.user.password = null;
						$scope.user.confirmpassword = null;
					    $location.path('/dashboard');
					}
				});
			} else { 
				$rootScope.Message = {
					'type': 'error',
					'text': 'New Passowrd should match with confirm password'
				};
			}
		};
	}])
	.controller('PostListController', ['$scope', '$http','$location', '$rootScope', 'localStorageService', 'paginateSvr','socketio','postSvr', function($scope, $http, $location, $rootScope, localStorageService, paginateSvr, socketio, postSvr){
		var load = function(){
			postSvr.get({apiUrl: '/users/posts_list.json'}).then(function(response){
				$scope.posts = response.posts;
				$scope.paging = response.paging;
			});
		};	
		load();
		$scope.pageChanged = function () {
		   	paginateSvr.getData({
		      	params: {
		        	page: $scope.paging.page,
		        	apiUrl: '/users/posts_list/'
		      	}
		   	}).then(function(response){
		   		$scope.posts = response.posts;
				$scope.paging = response.paging;
		   	});
		};

		$scope.editPost = function(index){
			$location.path('/edit/' + $scope.posts[index].Post.id);
		};

		
		$scope.deletePost = function(index){
			var e = $scope.posts[index];
			$http.delete($rootScope.appURL + '/posts/' + e.Post.id + '.json')
				.then(function(response){
					load();
					socketio.emit('new_post');
			});
		};

		$scope.toggleStatus = function (index) {
			var e = $scope.posts[index];
			var _data = {};
			var status = {1 : 0, 0: 1};
			_data.Post = {status : status[e.Post.status]};
			
			$http.put($rootScope.appURL + '/posts/' + e.Post.id + '.json', _data)
			.then(function(response){
				socketio.emit('new.post.created');
				load();
			});
		};
	}])
	.controller('NewPostController', ['$scope', '$http', '$location', '$rootScope', 'socketio',function($scope, $http, $location, $rootScope,socketio){
		/*Image Upload*/
		var file = {};
		$scope.uploadFile = function(files) {
			file = files;
		};

		$scope.save = function () {
			$http({
				method: 'POST',
				url: $rootScope.appURL + '/posts.json',
				headers: { 'Content-Type': undefined },
				transformRequest: function (data) {
					var formData = new FormData();
					formData.append("Post", angular.toJson($scope.post));
					formData.append("file" , file[0]);
					return formData;
				},
				data: { Post: $scope.post, files: $scope.files }
			}).then(function(response){
				socketio.emit('new.post.created');
				$location.path('/posts');
			});
		};

		$scope.cancel = function () { $location.path('/posts'); };
	}])
	.controller('EditPostController', ['$scope', '$http', '$routeParams','$location', '$rootScope', 'socketio',function($scope, $http, $routeParams, $location, $rootScope, socketio){
		$http.get($rootScope.appURL + '/posts/' + $routeParams.id + '.json')
        	.then(function(response) {
            	$scope.post = response.data.post.Post;
        });

        /*Image Upload*/
		var file = {};
		$scope.uploadFile = function(files) {
			file = files;
		};

        $scope.updatePost = function () {
			$http({
				method: 'POST',
				url: $rootScope.appURL + '/posts.json',
				headers: { 'Content-Type': undefined },
				transformRequest: function (data) {
					var formData = new FormData();
					formData.append("Post", angular.toJson($scope.post));
					formData.append("file" , file[0]);
					return formData;
				},
				data: { Post: $scope.post, files: $scope.files }
			}).then(function(response){
				socketio.emit('new.post.created');
				$location.path('/posts');
			});
		};

		$scope.cancel = function () { $location.path('/dashboard'); };
	}]);
}());