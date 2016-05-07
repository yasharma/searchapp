angular.module('app.controllers', [])
	.controller('AppController',function($scope, $http, $location, $rootScope){
		$rootScope.appURL = 'http://blog.dev';
	})
	.controller('PostController',function($scope, $http, $location, $rootScope){
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
	})
	.controller('NewPostController' ,function($scope,$http,$location,$rootScope){		
		$scope.save = function () {
			var _data = {};
			_data.Post = $scope.post;
			$http.post($rootScope.appURL + '/posts.json', _data)
				.then(function(response){
					$location.path('/');
			});
		};

		$scope.cancel = function () { $location.path('/'); };
	})
	.controller('EditPostController' ,function($scope,$http,$routeParams,$location,$rootScope){
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
	});
