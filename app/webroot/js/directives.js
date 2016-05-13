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
    })
    .directive('navMenu', function($location) {
        return function(scope, element, attrs) {
            var links = element.find('a'),
                currentLink,
                urlMap = {},
                activeClass = attrs.navMenu || 'active';

            for (var i = links.length - 1; i >= 0; i--) {
                var link = angular.element(links[i]);
                var url = link.attr('href');
                if (url.substring(0,1) === '#') {
                    urlMap[url.substring(1)] = link;
                } else {
                    urlMap[url] = link;
                }
            }

            scope.$on('$routeChangeStart', function() {
                var path = urlMap[$location.path()];

                links.parent('li').removeClass(activeClass);
                
                if (path) {
                    path.parent('li').addClass(activeClass);
                }
            });
        };
    })
    .directive('fileModel', [
        '$parse',
        function ($parse) {
          return {
            restrict: 'A',
            link: function(scope, element, attrs) {
              var model = $parse(attrs.fileModel);
              var modelSetter = model.assign;

              element.bind('change', function(){
                scope.$apply(function(){
                  if (attrs.multiple) {
                    modelSetter(scope, element[0].files);
                  }
                  else {
                    modelSetter(scope, element[0].files[0]);
                  }
                });
              });
            }
          };
        }
      ]);
