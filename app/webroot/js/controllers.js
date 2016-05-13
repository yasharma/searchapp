angular.module('app.controllers', [])
	.controller('AppController',function($scope, $http, $location, $rootScope){
		var protocol = $location.protocol();
		$rootScope.appURL = $location.host() === 'blog.dev' ? protocol+'://blog.dev' : protocol+'://peerblog.herokuapp.com';
		$rootScope.imagePath = $rootScope.appURL +'/img/posts_images/';
	})
	.controller('PostController', function($scope, $http, $location, $rootScope){
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
	})
	.controller('NewPostController', function($scope, $http, $location, $rootScope){
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
	})
	.controller('EditPostController', function($scope, $http, $routeParams, $location, $rootScope){
		$http.get($rootScope.appURL + '/posts/' + $routeParams['id'] + '.json')
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
	})
	.controller('ViewPostController', function($scope, $http, $routeParams, $location, $rootScope){
		$http.get($rootScope.appURL + '/posts/' + $routeParams['id'] + '.json')
        	.then(function(response) {
            	$scope.Post = response.data.post.Post;
        });
	})
	.controller('AdminController', function($scope, $http, $location, $rootScope){
		console.log('Admin Area!');
	});
