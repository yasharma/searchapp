!function() {
    "use strict";
    angular.module("adminApp", [ "ngRoute", "app.controllers", "app.directives", "textAngular", "ui.bootstrap", "angular-loading-bar", "LocalStorageModule" ]).config([ "$routeProvider", "cfpLoadingBarProvider", "$httpProvider", function(a, b, c) {
        b.includeSpinner = !1, a.when("/", {
            templateUrl: "views/admin/login.html",
            controller: "AdminController"
        }).when("/dashboard", {
            templateUrl: "views/admin/dashboard.html",
            controller: "DashboardController",
            access: {
                requiredLogin: !0
            }
        }).when("/logout", {
            template: "",
            controller: "LogoutController",
            access: {
                requiredLogin: !0
            }
        }).otherwise({
            redirectTo: "/"
        });
        var d = [ "$q", "$location", "$rootScope", "localStorageService", "AuthenticationService", function(a, b, c, d, e) {
            return {
                request: function(a) {
                    a.headers = a.headers || {};
                    var b = d.get("token");
                    return b && (a.headers.token = b, e.isLogged = 1, c.isLogged = 1), a;
                },
                requestError: function(b) {
                    return console.log(b), a.reject(b);
                },
                response: function(b) {
                    return b || a.when(b);
                },
                responseError: function(b) {
                    return console.log(b), a.reject(b);
                }
            };
        } ];
        c.interceptors.push(d);
    } ]).factory("AuthenticationService", function() {
        var a = {
            isLogged: !1
        };
        return a;
    }).run([ "$rootScope", "$location", "localStorageService", "AuthenticationService", function(a, b, c, d) {
        a.$on("$routeChangeStart", function(a, e, f) {
            (null !== e && null !== e.access || e.access.requiredLogin && !d.isLogged && !c.get("user")) && (d.isLogged = 0, 
            b.path("/"));
        }), a.user = c.get("user");
    } ]);
}(), function() {
    "use strict";
    angular.module("app.controllers", []).controller("AppController", [ "$scope", "$http", "$location", "$rootScope", function(a, b, c, d) {
        var e = c.protocol();
        d.appURL = "blog.dev" === c.host() ? e + "://blog.dev" : e + "://peerblog.herokuapp.com", 
        d.imagePath = d.appURL + "/img/posts_images/", d.admin = "admin.html#";
    } ]).controller("PostController", [ "$scope", "$http", "$location", "$rootScope", function(a, b, c, d) {
        var e = function() {
            b.get(d.appURL + "/posts.json").then(function(b) {
                a.posts = b.data.posts, a.paging = b.data.paging;
            });
        }, f = function(c) {
            var e = c.params.page;
            b.get(d.appURL + "/posts/index/page:" + e + ".json").then(function(b) {
                a.posts = b.data.posts, a.paging = b.data.paging;
            });
        };
        a.pageChanged = function() {
            f({
                params: {
                    page: a.paging.page
                }
            });
        }, e(), a.deletePost = function(c) {
            var f = a.posts[c];
            b["delete"](d.appURL + "/posts/" + f.Post.id + ".json").then(function(a) {
                e();
            });
        }, a.editPost = function(b) {
            c.path("/edit/" + a.posts[b].Post.id);
        }, a.viewPost = function(b) {
            c.path("/" + a.posts[b].Post.id);
        };
    } ]).controller("NewPostController", [ "$scope", "$http", "$location", "$rootScope", function(a, b, c, d) {
        var e = {};
        a.uploadFile = function(a) {
            e = a;
        }, a.save = function() {
            b({
                method: "POST",
                url: d.appURL + "/posts.json",
                headers: {
                    "Content-Type": void 0
                },
                transformRequest: function(b) {
                    var c = new FormData();
                    return c.append("Post", angular.toJson(a.post)), c.append("file", e[0]), c;
                },
                data: {
                    Post: a.post,
                    files: a.files
                }
            }).then(function(a) {
                c.path("/");
            });
        }, a.cancel = function() {
            c.path("/");
        };
    } ]).controller("EditPostController", [ "$scope", "$http", "$routeParams", "$location", "$rootScope", function(a, b, c, d, e) {
        b.get(e.appURL + "/posts/" + c.id + ".json").then(function(b) {
            a.post = b.post.Post;
        }), a.updatePost = function() {
            var c = {};
            c.Post = a.post, b.put(e.appURL + "/posts/" + a.post.id + ".json", c).then(function(a) {
                d.path("/");
            });
        }, a.cancel = function() {
            d.path("/");
        };
    } ]).controller("ViewPostController", [ "$scope", "$http", "$routeParams", "$location", "$rootScope", function(a, b, c, d, e) {
        b.get(e.appURL + "/posts/" + c.id + ".json").then(function(b) {
            a.Post = b.data.post.Post;
        });
    } ]).controller("AdminController", [ "$scope", "$http", "$location", "$rootScope", "localStorageService", "AuthenticationService", function(a, b, c, d, e, f) {
        a.login = function(g) {
            var h = {};
            h.User = a.user, b.post(d.appURL + "/users/login.json", h).then(function(b) {
                "error" == b.data.message.type ? a.Message = b.data.message : (e.set("token", b.headers("token")), 
                e.set("user", {
                    id: b.data.user.id,
                    firstname: b.data.user.firstname,
                    lastname: b.data.user.lastname,
                    email: b.data.user.email,
                    role: b.data.user.role,
                    created: b.data.user.created
                }), f.isLogged = !0, d.isLogged = !0, d.user = e.get("user"), c.path("/dashboard"));
            }, function(a) {
                c.path("/");
            });
        };
    } ]).controller("DashboardController", [ "$scope", "$http", "$rootScope", "$location", function(a, b, c, d) {
        b.get(c.appURL + "/users.json").then(function(b) {
            a.Post = b.data.posts;
        }, function(a) {
            500 === a.status && d.path("/");
        });
    } ]).controller("LogoutController", [ "$scope", "$http", "$rootScope", "$location", "localStorageService", function(a, b, c, d, e) {
        b.get(c.appURL + "/users/logout.json").then(function(a) {
            e.remove("token"), e.remove("user"), c.isLogged = !1, delete c.user, d.path("/");
        });
    } ]).controller("ProfileController", [ "$scope", "$http", "$location", "$rootScope", function(a, b, c, d) {
        console.log(d.appURL), console.log(d.User);
    } ]);
}(), function() {
    "use strict";
    angular.module("app.directives", []).directive("footer", function() {
        return {
            restrict: "A",
            templateUrl: "elements/footer.html",
            controller: [ "$scope", "$filter", function(a, b) {} ]
        };
    }).directive("header", function() {
        return {
            restrict: "A",
            templateUrl: "elements/header.html",
            controller: [ "$scope", "$filter", function(a, b) {} ]
        };
    }).directive("sidebar", function() {
        return {
            restrict: "A",
            templateUrl: "elements/sidebar.html",
            controller: [ "$scope", "$filter", function(a, b) {} ]
        };
    }).directive("adminHeader", function() {
        return {
            restrict: "A",
            templateUrl: "elements/admin/header.html",
            controller: [ "$scope", "$filter", function(a, b) {} ]
        };
    }).directive("adminSidebar", function() {
        return {
            restrict: "A",
            templateUrl: "elements/admin/sidebar.html",
            controller: [ "$scope", "$filter", function(a, b) {} ]
        };
    }).directive("navMenu", function(a) {
        return function(b, c, d) {
            for (var e = c.find("a"), f = {}, g = d.navMenu || "active", h = e.length - 1; h >= 0; h--) {
                var i = angular.element(e[h]), j = i.attr("href");
                "#" === j.substring(0, 1) ? f[j.substring(1)] = i : f[j] = i;
            }
            b.$on("$routeChangeStart", function() {
                var b = f[a.path()];
                e.parent("li").removeClass(g), b && b.parent("li").addClass(g);
            });
        };
    }).directive("fileModel", [ "$parse", function(a) {
        return {
            restrict: "A",
            link: function(b, c, d) {
                var e = a(d.fileModel), f = e.assign;
                c.bind("change", function() {
                    b.$apply(function() {
                        d.multiple ? f(b, c[0].files) : f(b, c[0].files[0]);
                    });
                });
            }
        };
    } ]);
}(), function() {
    "use strict";
    angular.module("truncate", []).filter("words", function() {
        return function(a, b) {
            if (isNaN(b)) return a;
            if (0 >= b) return "";
            if (a) {
                var c = a.split(/\s+/);
                c.length > b && (a = c.slice(0, b).join(" "));
            }
            return a;
        };
    });
}();