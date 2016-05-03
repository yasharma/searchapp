angular.module('app.directives', [])
    .directive('footer', function() {
        return {
            restrict: 'A',            
            templateUrl: "elements/footer.html",
            controller: ['$scope', '$filter', function ($scope, $filter) {
                // Your behaviour goes here :)
            }]
        }
    })
    .directive('header', function () {
        return {
            restrict: 'A',            
            //scope: {user: '='}, // This is one of the cool things :). Will be explained in post.
            templateUrl: "elements/header.html",
            controller: ['$scope', '$filter', function ($scope, $filter) {
                // Your behaviour goes here :)
            }]
        }
    });
