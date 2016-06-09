angular.module('app.services', [])
	.factory('paginateSvr', ['$rootScope','$http', function ($rootScope,$http) {
		return {
			getData: function (option) {
				var pageNum = option.params.page;
				return $http.get($rootScope.appURL + '/posts/index/page:'+ pageNum +'.json');
			}	
		};
	}]);	