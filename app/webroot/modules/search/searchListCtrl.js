'use strict';
angular.module('app.controllers')
.controller('searchListCtrl', ['$scope', 'RestSvr', '$location', '$routeParams',function ($scope, RestSvr, $location, $routeParams) {
	$scope.forceEllipses = true;
	$scope.maxSize = 10;
	$scope.paging = {page: 1};
	function load() {
		RestSvr.paginate('search', $scope.paging.page).then(function (response) {
			$scope.results = response.records;
			$scope.paging = response.paging;
		});
	}
	load();
}]);	