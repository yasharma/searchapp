!function() {
    "use strict";
    angular.module("app", [ "ngRoute", "app.controllers", "app.directives", "app.services", "angular-loading-bar", "ui.bootstrap", "LocalStorageModule", "textAngular" ]).config([ "$routeProvider", "cfpLoadingBarProvider", "$httpProvider", function(a, b, c) {
        b.includeSpinner = !1, a.when("/", {
            templateUrl: "views/admin/login.html",
            controller: "AdminController",
            access: {
                requiredLogin: !1
            }
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
        }).when("/profile", {
            templateUrl: "views/admin/profile.html",
            controller: "ProfileController",
            access: {
                requiredLogin: !0
            }
        }).when("/posts", {
            templateUrl: "views/admin/post.html",
            controller: "PostListController",
            access: {
                requiredLogin: !0
            }
        }).when("/create", {
            templateUrl: "views/admin/create.html",
            controller: "NewPostController",
            access: {
                requiredLogin: !0
            }
        }).when("/edit/:id", {
            templateUrl: "views/admin/edit.html",
            controller: "EditPostController",
            access: {
                requiredLogin: !0
            }
        }).otherwise({
            redirectTo: "/"
        }), c.defaults.useXDomain = !0, delete c.defaults.headers.common["X-Requested-With"];
        var d = [ "$q", "$window", "$rootScope", "localStorageService", "AuthenticationService", function(a, b, c, d, e) {
            return {
                request: function(a) {
                    a.headers = a.headers || {};
                    var b = d.get("token");
                    return b && (a.headers.token = b, e.isLogged = 1, c.isLogged = 1), a;
                },
                requestError: function(b) {
                    return a.reject(b);
                },
                response: function(b) {
                    return b || a.when(b);
                },
                responseError: function(f) {
                    return null !== f && 400 === f.status && (console.log(f), d.remove("token"), d.remove("user"), 
                    e.isLogged = !1, c.isLogged = !1, b.location.href = "admin.html"), a.reject(f);
                }
            };
        } ];
        c.interceptors.push(d);
    } ]).run([ "$rootScope", "$location", "localStorageService", "AuthenticationService", function(a, b, c, d) {
        a.$on("$routeChangeStart", function(a, e, f) {
            if (null === e || null === e.access || e.access.requiredLogin || d.isLogged || c.get("user")) {
                var g = c.get("token");
                "/" == b.path() && g && b.path("/dashboard");
            } else d.isLogged = 0, b.path("/");
        }), a.user = c.get("user");
    } ]);
}(), function() {
    "use strict";
    angular.module("app.controllers", []).controller("AppController", [ "$scope", "$http", "$location", "$rootScope", "socketio", function(a, b, c, d, e) {
        var f = c.protocol();
        d.appURL = "blog.dev" === c.host() ? f + "://blog.dev" : f + "://peerblog.herokuapp.com", 
        d.imagePath = d.appURL + "/img/posts_images/", d.admin = "admin.html#";
    } ]).controller("PostController", [ "$scope", "$location", "paginateSvr", "socketio", "postSvr", function(a, b, c, d, e) {
        var f = function() {
            e.get().then(function(b) {
                a.posts = b.posts, a.paging = b.paging;
            });
        };
        d.on("new.post.created", function() {
            f();
        }), f(), a.pageChanged = function() {
            c.getData({
                params: {
                    page: a.paging.page
                }
            }).then(function(b) {
                a.posts = b.posts, a.paging = b.paging;
            });
        }, a.viewPost = function(c) {
            b.path("/" + a.posts[c].Post.id);
        };
    } ]).controller("ViewPostController", [ "$scope", "$http", "$routeParams", "$location", "$rootScope", function(a, b, c, d, e) {
        b.get(e.appURL + "/posts/" + c.id + ".json").then(function(b) {
            a.Post = b.data.post.Post;
        });
    } ]).controller("AdminController", [ "$scope", "$http", "$location", "$rootScope", "localStorageService", "AuthenticationService", function(a, b, c, d, e, f) {
        a.login = function(g) {
            if (g) {
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
            }
        };
    } ]).controller("DashboardController", [ "$scope", "$http", "$rootScope", "$location", "$timeout", "socketio", function(a, b, c, d, e, f) {
        b.get(c.appURL + "/users.json").then(function(b) {
            a.Post = b.data.posts;
        }), e(function() {
            c.Message = null;
        }, 3e3);
    } ]).controller("LogoutController", [ "$scope", "$http", "$rootScope", "$location", "localStorageService", function(a, b, c, d, e) {
        b.get(c.appURL + "/users/logout.json").then(function(a) {
            e.remove("user"), e.remove("token"), c.isLogged = !1, delete c.user, d.path("/");
        });
    } ]).controller("ProfileController", [ "$scope", "$http", "$location", "$rootScope", "localStorageService", function(a, b, c, d, e) {
        a.update_account_info = function(f) {
            if (f) {
                var g = {};
                g.User = a.user, b.put(d.appURL + "/users/" + a.user.id + ".json", g).then(function(b) {
                    "error" == b.data.message.type ? a.Message = b.data.message : (e.set("user", {
                        id: b.data.user.id,
                        firstname: b.data.user.firstname,
                        lastname: b.data.user.lastname,
                        email: b.data.user.email,
                        role: b.data.user.role,
                        created: b.data.user.created
                    }), d.user = e.get("user"), c.path("/dashboard"));
                }, function(a) {
                    c.path("/");
                });
            }
        }, a.change_password = function(e) {
            if (e) {
                var f = {};
                f.user = a.user, d.Message = null, a.user.password === a.user.confirmpassword ? b.post(d.appURL + "/users/change_password.json", f).then(function(b) {
                    d.Message = b.data.message, "success" == b.data.message.type && (a.user.currentpassword = null, 
                    a.user.password = null, a.user.confirmpassword = null, c.path("/dashboard"));
                }) : d.Message = {
                    type: "error",
                    text: "New Passowrd should match with confirm password"
                };
            }
        };
    } ]).controller("PostListController", [ "$scope", "$http", "$location", "$rootScope", "localStorageService", "paginateSvr", "socketio", "postSvr", function(a, b, c, d, e, f, g, h) {
        var i = function() {
            h.get({
                apiUrl: "/users/posts_list.json"
            }).then(function(b) {
                a.posts = b.posts, a.paging = b.paging;
            });
        };
        i(), a.pageChanged = function() {
            f.getData({
                params: {
                    page: a.paging.page,
                    apiUrl: "/users/posts_list/"
                }
            }).then(function(b) {
                a.posts = b.posts, a.paging = b.paging;
            });
        }, a.editPost = function(b) {
            c.path("/edit/" + a.posts[b].Post.id);
        }, a.deletePost = function(c) {
            var e = a.posts[c];
            b["delete"](d.appURL + "/posts/" + e.Post.id + ".json").then(function(a) {
                i(), g.emit("new_post");
            });
        }, a.toggleStatus = function(c) {
            var e = a.posts[c], f = {}, h = {
                1: 0,
                0: 1
            };
            f.Post = {
                status: h[e.Post.status]
            }, b.put(d.appURL + "/posts/" + e.Post.id + ".json", f).then(function(a) {
                g.emit("new.post.created"), i();
            });
        };
    } ]).controller("NewPostController", [ "$scope", "$http", "$location", "$rootScope", "socketio", function(a, b, c, d, e) {
        var f = {};
        a.uploadFile = function(a) {
            f = a;
        }, a.save = function() {
            b({
                method: "POST",
                url: d.appURL + "/posts.json",
                headers: {
                    "Content-Type": void 0
                },
                transformRequest: function(b) {
                    var c = new FormData();
                    return c.append("Post", angular.toJson(a.post)), c.append("file", f[0]), c;
                },
                data: {
                    Post: a.post,
                    files: a.files
                }
            }).then(function(a) {
                e.emit("new.post.created"), c.path("/posts");
            });
        }, a.cancel = function() {
            c.path("/posts");
        };
    } ]).controller("EditPostController", [ "$scope", "$http", "$routeParams", "$location", "$rootScope", "socketio", function(a, b, c, d, e, f) {
        b.get(e.appURL + "/posts/" + c.id + ".json").then(function(b) {
            a.post = b.data.post.Post;
        });
        var g = {};
        a.uploadFile = function(a) {
            g = a;
        }, a.updatePost = function() {
            b({
                method: "POST",
                url: e.appURL + "/posts.json",
                headers: {
                    "Content-Type": void 0
                },
                transformRequest: function(b) {
                    var c = new FormData();
                    return c.append("Post", angular.toJson(a.post)), c.append("file", g[0]), c;
                },
                data: {
                    Post: a.post,
                    files: a.files
                }
            }).then(function(a) {
                f.emit("new.post.created"), d.path("/posts");
            });
        }, a.cancel = function() {
            d.path("/dashboard");
        };
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
            controller: [ "$scope", "$http", "$rootScope", function(a, b, c) {
                a.search = function(b) {
                    b && console.log(a.post.search);
                };
            } ]
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
    }).directive("navMenu", [ "$location", function(a) {
        return function(b, c, d) {
            for (var e = c.find("a"), f = {}, g = d.navMenu || "active", h = e.length - 1; h >= 0; h--) {
                var i = angular.element(e[h]), j = angular.isUndefined(i.attr("href")) ? i.attr("ng-href") : i.attr("href");
                "#" === j.substring(0, 1) ? f[j.substring(1)] = i : "{{admin}}" === j.substring(0, j.indexOf("/")) ? f[j.substring(j.indexOf("/"))] = i : f[j] = i;
            }
            b.$on("$routeChangeStart", function() {
                var b = f[a.path()];
                e.parent("li").removeClass(g), b && b.parent("li").addClass(g);
            });
        };
    } ]).directive("setHeight", [ "$window", function(a) {
        return {
            restrict: "A",
            link: function(b, c, d) {
                c.css("min-height", a.innerHeight - 50 + "px");
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
}(), function() {
    "use strict";
    angular.module("app.services", []).factory("paginateSvr", [ "$rootScope", "$http", function(a, b) {
        return {
            getData: function(c) {
                var d = c.params.page, e = angular.isUndefined(c.params.apiUrl) ? "/posts/index/" : c.params.apiUrl;
                return b.get(a.appURL + e + "page:" + d + ".json").then(function(a) {
                    return {
                        posts: a.data.posts,
                        paging: a.data.paging
                    };
                });
            }
        };
    } ]).factory("AuthenticationService", function() {
        var a = {
            isLogged: !1
        };
        return a;
    }).factory("socketio", [ "$rootScope", function(a) {
        var b = io.connect("http://peerblog.herokuapp.com:8082");
        return {
            on: function(c, d) {
                b.on(c, function() {
                    var c = arguments;
                    a.$apply(function() {
                        d.apply(b, c);
                    });
                });
            },
            emit: function(c, d, e) {
                b.emit(c, d, function() {
                    var c = arguments;
                    a.$apply(function() {
                        e && e.apply(b, c);
                    });
                });
            }
        };
    } ]).factory("postSvr", [ "$rootScope", "$http", function(a, b) {
        return {
            get: function(c) {
                var d = angular.isUndefined(c) ? "/posts.json" : c.apiUrl;
                return b.get(a.appURL + d).then(function(a) {
                    return {
                        posts: a.data.posts,
                        paging: a.data.paging
                    };
                });
            }
        };
    } ]);
}();