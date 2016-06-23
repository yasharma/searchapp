(function() {
	'use strict';

	angular.module('app.controllers', [])
	.controller('AppController', ['$scope', '$location', '$rootScope', function($scope, $location, $rootScope){
		var protocol = $location.protocol();
		$rootScope.appURL = $location.host() === 'blog.dev' ? protocol+'://blog.dev/' : protocol+'://peerblog.herokuapp.com/';
		$rootScope.imagePath = $rootScope.appURL +'/img/posts_images/';
		$rootScope.admin = 'admin.html#';
	}])
	.controller('PostController', ['$scope', '$location', 'RestSvr', 'socketio', function($scope, $location, RestSvr, socketio){
		
		var load = function(){
			RestSvr.paginate('posts').then(function(response){
				$scope.posts = response.records;
				$scope.paging = response.paging;
			});
		};
		
		socketio.on('new.post.created', function(){
			load();
		});

		/* Fetching all posts when first comes to page */
		load();

		$scope.pageChanged = function () {
		   	RestSvr.paginate('posts/index/page:' + $scope.paging.page).then(function(response){
		   		$scope.posts = response.records;
				$scope.paging = response.paging;
		   	});
		};

		$scope.viewPost = function(index){
			$location.path('/' + $scope.posts[index].Post.id);
		};
	}])
	.controller('ViewPostController', ['$scope', 'RestSvr', '$routeParams', function($scope, RestSvr, $routeParams){
		
		RestSvr.getById({apiUrl: 'posts/', id: $routeParams.id}).then(function(response) {
            $scope.Post = response.record.Post;
        });
	}])
	.controller('AdminController', ['$scope', '$location', '$rootScope','localStorageService','AuthenticationService', 'RestSvr', function($scope, $location, $rootScope, localStorageService, AuthenticationService, RestSvr){
		$scope.login = function (isValid) {
			if (!isValid) return;
			var _data = {};
			_data.User = $scope.user;
			RestSvr.login({apiUrl: 'users/login', data: _data}).then(function(response){
				if( response.message.type == 'error' ){
					$scope.Message = response.message;
				} else {
					localStorageService.set('token', response.token);
					localStorageService.set('user', {
					    "id": response.user.id,
					    "firstname": response.user.firstname,
					    "lastname": response.user.lastname,
					    "email": response.user.email,
					    "role": response.user.role,
					    "created": response.user.created,
					});
					AuthenticationService.isLogged = true;
                	$rootScope.isLogged = true;
					$rootScope.user = localStorageService.get('user');
					$location.path('/dashboard');
				}

			});
		};	
	}])
	.controller('DashboardController', ['$scope', 'RestSvr', function($scope, RestSvr){
		RestSvr.get('posts/count').then(function(response){
				$scope.totalPosts = response.records;
			}
		);
		RestSvr.get('categories/count').then(function(response){
				$scope.totalCategories = response.records;
			}
		);	
	}])
	.controller('LogoutController', ['$scope', '$http', '$rootScope', '$location','localStorageService', function($scope, $http, $rootScope, $location,localStorageService){
		$http.get($rootScope.appURL + '/users/logout.json').then(function(response){
			localStorageService.remove('user');
			localStorageService.remove('token');
			$rootScope.isLogged = false;
			delete $rootScope.user;
			$location.path('/');
		});
	}])
	.controller('ProfileController', ['$scope','$location', '$rootScope', 'localStorageService', 'RestSvr',function($scope, $location, $rootScope, localStorageService, RestSvr){
		$scope.update_account_info = function(isValid){
			if (!isValid) return;
			var _data = {};
			_data.User = $scope.user;
			RestSvr.put({apiUrl: 'users/', id: $scope.user.id, data: _data}).then(function(response){
				if( response.type == 'error' ){
					$scope.Message = response;
				} else {
					RestSvr.getById({apiUrl: 'users/', id: $scope.user.id}).then(function(response){
						localStorageService.set('user', {
						    "id": response.record.User.id,
						    "firstname": response.record.User.firstname,
						    "lastname": response.record.User.lastname,
						    "email": response.record.User.email,
						    "role": response.record.User.role,
						    "created": response.record.User.created,
						});
						$rootScope.user = localStorageService.get('user');
						$location.path('/dashboard');
					});
				}
			});
		};

		$scope.change_password = function(isValid){
			if(!isValid) return;
			var _data = {};
			_data.user = $scope.user;
			$rootScope.Message = null;
			if($scope.user.password === $scope.user.confirmpassword){
				RestSvr.post({apiUrl: '/users/change_password', data: _data}).then(function(response){
					$rootScope.Message = response;
					if( response.type == 'success' ){
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
	.controller('PostListController', ['$scope', '$location', 'RestSvr', 'socketio',function($scope, $location, RestSvr, socketio){
		var load = function(){
			RestSvr.paginate('users/posts_list').then(function(response){
				$scope.posts = response.records;
				$scope.paging = response.paging;
			});
		};	
		load();

		$scope.pageChanged = function () {
		   	RestSvr.paginate('users/posts_list/page:' + $scope.paging.page).then(function(response){
		   		$scope.posts = response.records;
				$scope.paging = response.paging;
		   	});
		};

		$scope.editPost = function(index){
			$location.path('/edit/' + $scope.posts[index].Post.id);
		};

		
		$scope.deletePost = function(index){
			var e = $scope.posts[index];
			RestSvr.delete({ apiUrl: 'posts/', id: e.Post.id}).then(function(response){
				load();
				socketio.emit('new.post.created');
			});
		};

		$scope.toggleStatus = function (index) {
			var e = $scope.posts[index];
			var _data = {};
			var status = {1 : 0, 0: 1};
			_data.Post = {status : status[e.Post.status]};
			
			RestSvr.put({apiUrl: 'posts/', id: e.Post.id , data: _data}).then(function(response){
				socketio.emit('new.post.created');
				load();
			});
		};
	}])
	.controller('NewPostController', ['$scope', '$location', 'socketio', 'Upload', '$http', function($scope, $location, socketio, Upload, $http){

		$scope.getCategories = function(value){
			return $http.get('categories/getByName.json', {
				params: { name: value }
			}).then(function(response){
				return response.data.records.map(function(item, index, arr){
					return item.Category;
				});
			});
		};

		/*Image Upload*/
		var file = {};
		$scope.uploadFile = function(files) {
			file = files;
		};

		$scope.save = function () {
			Upload.file({
				apiUrl: 'posts', 
				Post: $scope.post, 
				file: file[0]
			}).then(function (response) {
				socketio.emit('new.post.created');
				$location.path('/posts');
			});
		};

		$scope.cancel = function () { $location.path('/posts'); };
	}])
	.controller('EditPostController', ['$scope', '$routeParams','$location', 'socketio', 'RestSvr', 'Upload',function($scope, $routeParams, $location, socketio, RestSvr, Upload){

        RestSvr.getById({apiUrl: 'posts/', id: $routeParams.id}).then(function(response) {
            $scope.post = response.record.Post;
        });

        /*Image Upload*/
		var file = {};
		$scope.uploadFile = function(files) {
			file = files;
		};

        $scope.updatePost = function () {
			Upload.file({
				apiUrl: 'posts', 
				Post: $scope.post, 
				file: file[0]
			}).then(function (response) {
				socketio.emit('new.post.created');
				$location.path('/posts');
			});
		};

		$scope.cancel = function () { $location.path('/dashboard'); };
	}])
	.controller('CategoryController', ['$scope','$location', 'RestSvr', '$rootScope', function($scope, $location, RestSvr, $rootScope){
		var load = function(){
			RestSvr.paginate('categories').then(function(response){
				$scope.categories = response.records;
				$scope.paging = response.paging;
			});	
		};
		load();

		$scope.pageChanged = function () {
		   	RestSvr.paginate('categories/index/page:' + $scope.paging.page).then(function(response){
		   		$scope.categories = response.records;
				$scope.paging = response.paging;
		   	});
		};

		$scope.editCategory = function(index){
			$location.path('/edit-category/' + $scope.categories[index].Category.id);
		};

		$scope.deleteCategory = function(index){
			var e = $scope.categories[index];
			RestSvr.delete({apiUrl: 'categories/', id: e.Category.id }).then(function(response){
				$rootScope.Message = response;
				load();
			});
		};

		$scope.toggleStatus = function (index) {
			var e = $scope.categories[index];
			var _data = {};
			var status = {1 : 0, 0: 1};
			_data.Category = {status : status[e.Category.status]};
			RestSvr.put({apiUrl: 'categories/' , id: e.Category.id ,data: _data}).then(function(response){
				load();
			});
		};
	}])
	.controller('NewCategoryController', ['$scope','$location', '$rootScope', 'RestSvr',function($scope, $location, $rootScope, RestSvr){
		$scope.heading = 'Create a New Category';
		$scope.buttonName = 'Create';
		$scope.save = function(isValid){
			if (!isValid) return;
			var _data = {};
			_data.Category = $scope.category;
			$rootScope.Message = null;
			RestSvr.post({apiUrl: 'categories', data: _data}).then(function(response){
				$rootScope.Message = response;
				if(response.type == 'success'){
					$location.path('/category');
				}
			});
		};

		$scope.cancel = function () { $location.path('/category'); };
	}])
	.controller('EditCategoryController', ['$scope','$location', '$rootScope', 'RestSvr', '$routeParams', function($scope, $location, $rootScope, RestSvr, $routeParams){
		$scope.heading = 'Update Category';
		$scope.buttonName = 'Update';
		RestSvr.getById({apiUrl: 'categories/', id: $routeParams.id}).then(function(response) {
            $scope.category = response.record.Category;
        });
		$scope.save = function(isValid){
			if (!isValid) return;
			var _data = {};
			_data.Category = $scope.category;
			$rootScope.Message = null;
			RestSvr.put({apiUrl: 'categories/', data: _data, id: $scope.category.id}).then(function(response){
				$rootScope.Message = response;
				if(response.type == 'success'){
					$location.path('/category');
				}
			});
		};

		$scope.cancel = function () { $location.path('/category'); };
	}]);
}());