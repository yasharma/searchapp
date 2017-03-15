'use strict';
(function () {
	angular.module('app.controllers')
	.controller('searchCtrl', ['$scope', 'RestSvr', '$location', '$routeParams',function ($scope, RestSvr, $location, $routeParams) {
		$scope.forceEllipses = true;
		$scope.maxSize = 10;
		$scope.paging = {page: 1};
		$scope.max = 500;

		function get_search_results(search) {
			var _data = {
				q: search,
				page: $scope.paging.page
			};
			RestSvr.search('search/find', _data).then(function (response) {				
				$scope.results = response.records;
				$scope.paging = response.paging;
			});
		}
		if(!angular.isUndefined($routeParams.single)){
			$scope.single = $routeParams.single;
			get_search_results($routeParams.single);
		}

		// For single search
		$scope.singleSearch = function (isValid) {
			if(!isValid){
				return;
			}
			var search = $scope.single;
			$location.search('single', search);
		};

		$scope.pageChanged = function() {
    		get_search_results($routeParams.single);
  		};
	}]);
}());	