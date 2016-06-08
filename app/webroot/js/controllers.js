(function(){
	"use strict";
	angular.module('app.controllers', [])
	.controller('AppController',['$scope', '$http', '$location', '$rootScope', function($scope, $http, $location, $rootScope){
		var protocol = $location.protocol();
		$rootScope.appURL = $location.host() === 'blog.dev' ? protocol+'://blog.dev' : protocol+'://peerblog.herokuapp.com';
		$rootScope.imagePath = $rootScope.appURL +'/img/posts_images/';
		$rootScope.admin = 'admin.html#';
	}])
	.controller('PostController', ['$scope', '$http', '$location', '$rootScope', function($scope, $http, $location, $rootScope){
		var load = function(){
			$http.get($rootScope.appURL + '/posts.json').then( function(response){
				$scope.posts = response.data.posts;
				$scope.paging = response.data.paging;
			});
		};

		var getData = function(option){
			var pageNum = option.params.page;
			$http.get($rootScope.appURL + '/posts/index/page:'+ pageNum +'.json').then( function(response){
				$scope.posts = response.data.posts;
				$scope.paging = response.data.paging;
			});
		};
		
		$scope.pageChanged = function () {
		   	getData({
		      	params: {
		        	page: $scope.paging.page
		      	}
		   	});
		};

		load();

		$scope.deletePost = function(index){
			var e = $scope.posts[index];
			$http.delete($rootScope.appURL + '/posts/' + e.Post.id + '.json')
				.then(function(response){
					load();
			});
		};

		$scope.editPost = function(index){
			$location.path('/edit/' + $scope.posts[index].Post.id);
		};

		$scope.viewPost = function(index){
			$location.path('/' + $scope.posts[index].Post.id);
		};
	}])
	.controller('NewPostController', ['$scope', '$http', '$location', '$rootScope', function($scope, $http, $location, $rootScope){
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
				$location.path('/');
			});
		};

		$scope.cancel = function () { $location.path('/'); };
	}])
	.controller('EditPostController', ['$scope', '$http', '$routeParams', '$location', '$rootScope', function($scope, $http, $routeParams, $location, $rootScope){
		$http.get($rootScope.appURL + '/posts/' + $routeParams.id + '.json')
        	.then(function(data) {
            	$scope.post = data.post.Post;
        });

        $scope.updatePost = function () {
			var _data = {};
			_data.Post = $scope.post;
			$http.put($rootScope.appURL + '/posts/' + $scope.post.id + '.json', _data)
				.then(function(response){
					$location.path('/');
			});
		};

		$scope.cancel = function () { $location.path('/'); };
	}])
	.controller('ViewPostController', ['$scope', '$http', '$routeParams', '$location', '$rootScope', function($scope, $http, $routeParams, $location, $rootScope){
		$http.get($rootScope.appURL + '/posts/' + $routeParams.id + '.json')
        	.then(function(response) {
            	$scope.Post = response.data.post.Post;
        });
	}])
	.controller('AdminController', ['$scope', '$http','$location', '$rootScope','localStorageService','AuthenticationService' ,function($scope, $http, $location, $rootScope, localStorageService,AuthenticationService){
		//$rootScope.user = null;
		$scope.login = function (isValid) {
			//if (!isValid) return;
			var _data = {};
			_data.User = $scope.user;
			$http.post($rootScope.appURL + '/users.json', _data)
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
	.controller('DashboardController', ['$scope', '$http', '$rootScope', '$location', function($scope, $http, $rootScope, $location){
		$http.get($rootScope.appURL + '/users.json').
			then(function(response){
				$scope.Post = response.data.posts;
			}, function(response){
				if(response.status === 500){
					$location.path('/');
				}
			});
	
		
	}])
	.controller('LogoutController', ['$scope', '$http', '$rootScope', '$location','localStorageService', function($scope, $http, $rootScope, $location,localStorageService){
		$http.get($rootScope.appURL + '/users/logout.json').
			then(function(response){
				localStorageService.remove('token');
				localStorageService.remove('user');
				$rootScope.isLogged = false;
				delete $rootScope.user;
				$location.path('/');
			});
	}])
	.controller('ProfileController', ['$scope', '$http','$location', '$rootScope', function($scope, $http, $location, $rootScope){
		console.log($rootScope.appURL);
		console.log($rootScope.User);
	}]);
})();