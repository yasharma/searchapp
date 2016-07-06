!function() {
    "use strict";
    angular.module("app", [ "ngRoute", "app.controllers", "app.directives", "app.services", "ui.bootstrap", "angular-loading-bar", "truncate", "ngSanitize" ]).config([ "$routeProvider", "cfpLoadingBarProvider", function(a, b) {
        b.includeSpinner = !1, a.when("/", {
            templateUrl: "views/post.html",
            controller: "PostController"
        }).when("/search?:q", {
            templateUrl: "views/post.html",
            controller: "PostController"
        }).when("/:id", {
            templateUrl: "views/single.html",
            controller: "ViewPostController"
        }).when("/category/:category", {
            templateUrl: "views/post.html",
            controller: "PostByCategoriesCtrl"
        }).otherwise({
            redirectTo: "/"
        });
    } ]);
}(), function() {
    "use strict";
    angular.module("app.controllers", []).controller("AppController", [ "$scope", "$location", "$rootScope", function(a, b, c) {
        var d = b.protocol();
        c.appURL = "blog.dev" === b.host() ? d + "://blog.dev/" : d + "://peerblog.herokuapp.com/", 
        c.imagePath = c.appURL + "/img/posts_images/", c.admin = "admin.html#";
    } ]).controller("PostController", [ "$scope", "$location", "RestSvr", function(a, b, c) {
        var d = angular.isUndefined(b.search().q) ? void 0 : {
            params: {
                q: b.search().q
            }
        }, e = function() {
            c.paginate("posts", void 0, d).then(function(b) {
                a.posts = b.records, a.paging = b.paging;
            });
        };
        e(), a.pageChanged = function() {
            c.paginate("posts/index/page:" + a.paging.page).then(function(b) {
                a.posts = b.records, a.paging = b.paging;
            });
        }, a.viewPost = function(c) {
            b.path("/" + a.posts[c].Post.id);
        };
    } ]).controller("ViewPostController", [ "$scope", "RestSvr", "$routeParams", function(a, b, c) {
        b.getById({
            apiUrl: "posts/",
            id: c.id
        }).then(function(b) {
            a.Post = b.record.Post;
        });
    } ]).controller("AdminController", [ "$scope", "$location", "$rootScope", "localStorageService", "AuthenticationService", "RestSvr", function(a, b, c, d, e, f) {
        a.login = function(g) {
            if (g) {
                var h = {};
                h.User = a.user, f.login({
                    apiUrl: "users/login",
                    data: h
                }).then(function(f) {
                    "error" == f.message.type ? a.Message = f.message : (d.set("token", f.token), d.set("user", {
                        id: f.user.id,
                        firstname: f.user.firstname,
                        lastname: f.user.lastname,
                        email: f.user.email,
                        role: f.user.role,
                        created: f.user.created
                    }), e.isLogged = !0, c.isLogged = !0, c.user = d.get("user"), b.path("/dashboard"));
                });
            }
        };
    } ]).controller("DashboardController", [ "$scope", "RestSvr", function(a, b) {
        b.get("posts/count").then(function(c) {
            return a.totalPosts = c.records, b.get("categories/count");
        }).then(function(b) {
            a.totalCategories = b.records;
        });
    } ]).controller("LogoutController", [ "$scope", "$http", "$rootScope", "$location", "localStorageService", function(a, b, c, d, e) {
        b.get(c.appURL + "/users/logout.json").then(function(a) {
            e.remove("user"), e.remove("token"), c.isLogged = !1, delete c.user, d.path("/");
        });
    } ]).controller("ProfileController", [ "$scope", "$location", "$rootScope", "localStorageService", "RestSvr", function(a, b, c, d, e) {
        a.update_account_info = function(f) {
            if (f) {
                var g = {};
                g.User = a.user, e.put({
                    apiUrl: "users/",
                    id: a.user.id,
                    data: g
                }).then(function(f) {
                    "error" == f.type ? a.Message = f : e.getById({
                        apiUrl: "users/",
                        id: a.user.id
                    }).then(function(a) {
                        d.set("user", {
                            id: a.record.User.id,
                            firstname: a.record.User.firstname,
                            lastname: a.record.User.lastname,
                            email: a.record.User.email,
                            role: a.record.User.role,
                            created: a.record.User.created
                        }), c.user = d.get("user"), b.path("/dashboard");
                    });
                });
            }
        }, a.change_password = function(d) {
            if (d) {
                var f = {};
                f.user = a.user, c.Message = null, a.user.password === a.user.confirmpassword ? e.post({
                    apiUrl: "/users/change_password",
                    data: f
                }).then(function(d) {
                    c.Message = d, "success" == d.type && (a.user.currentpassword = null, a.user.password = null, 
                    a.user.confirmpassword = null, b.path("/dashboard"));
                }) : c.Message = {
                    type: "error",
                    text: "New Passowrd should match with confirm password"
                };
            }
        };
    } ]).controller("PostListController", [ "$scope", "$location", "RestSvr", function(a, b, c) {
        var d = function() {
            c.paginate("users/posts_list").then(function(b) {
                a.posts = b.records, a.paging = b.paging;
            });
        };
        d(), a.pageChanged = function() {
            c.paginate("users/posts_list/page:" + a.paging.page).then(function(b) {
                a.posts = b.records, a.paging = b.paging;
            });
        }, a.editPost = function(c) {
            b.path("/edit/" + a.posts[c].Post.id);
        }, a.deletePost = function(b) {
            var e = a.posts[b];
            c["delete"]({
                apiUrl: "posts/",
                id: e.Post.id
            }).then(function(a) {
                d();
            });
        }, a.toggleStatus = function(b) {
            var e = a.posts[b], f = {}, g = {
                1: 0,
                0: 1
            };
            f.Post = {
                status: g[e.Post.status]
            }, c.put({
                apiUrl: "posts/",
                id: e.Post.id,
                data: f
            }).then(function(a) {
                d();
            });
        };
    } ]).controller("NewPostController", [ "$scope", "$location", "Upload", "RestSvr", function(a, b, c, d) {
        a.getCategories = function(a) {
            return d.get("categories/getByName", {
                params: {
                    name: a
                }
            }).then(function(a) {
                return a.records.map(function(a, b, c) {
                    return a.Category;
                });
            });
        };
        var e = {};
        a.uploadFile = function(a) {
            e = a;
        }, a.save = function() {
            c.file({
                apiUrl: "posts",
                Post: a.post,
                file: e[0]
            }).then(function(a) {
                b.path("/posts");
            });
        }, a.cancel = function() {
            b.path("/posts");
        };
    } ]).controller("EditPostController", [ "$scope", "$routeParams", "$location", "RestSvr", "Upload", function(a, b, c, d, e) {
        a.getCategories = function(a) {
            return d.get("categories/getByName.json", {
                params: {
                    name: a
                }
            }).then(function(a) {
                return a.records.map(function(a, b, c) {
                    return a.Category;
                });
            });
        }, d.getById({
            apiUrl: "posts/",
            id: b.id
        }).then(function(b) {
            a.post = b.record.Post, a.post.category = b.record.Category;
        });
        var f = {};
        a.uploadFile = function(a) {
            f = a;
        }, a.updatePost = function() {
            e.file({
                apiUrl: "posts",
                Post: a.post,
                file: f[0]
            }).then(function(a) {
                c.path("/posts");
            });
        }, a.cancel = function() {
            c.path("/dashboard");
        };
    } ]).controller("CategoryController", [ "$scope", "$location", "RestSvr", "$rootScope", function(a, b, c, d) {
        var e = function() {
            c.paginate("categories").then(function(b) {
                a.categories = b.records, a.paging = b.paging;
            });
        };
        e(), a.pageChanged = function() {
            c.paginate("categories/index/page:" + a.paging.page).then(function(b) {
                a.categories = b.records, a.paging = b.paging;
            });
        }, a.editCategory = function(c) {
            b.path("/edit-category/" + a.categories[c].Category.id);
        }, a.deleteCategory = function(b) {
            var f = a.categories[b];
            c["delete"]({
                apiUrl: "categories/",
                id: f.Category.id
            }).then(function(a) {
                d.Message = a, e();
            });
        }, a.toggleStatus = function(b) {
            var d = a.categories[b], f = {}, g = {
                1: 0,
                0: 1
            };
            f.Category = {
                status: g[d.Category.status]
            }, c.put({
                apiUrl: "categories/",
                id: d.Category.id,
                data: f
            }).then(function(a) {
                e();
            });
        };
    } ]).controller("NewCategoryController", [ "$scope", "$location", "$rootScope", "RestSvr", function(a, b, c, d) {
        a.heading = "Create a New Category", a.buttonName = "Create", a.save = function(e) {
            if (e) {
                var f = {};
                f.Category = a.category, c.Message = null, d.post({
                    apiUrl: "categories",
                    data: f
                }).then(function(a) {
                    c.Message = a, "success" == a.type && b.path("/category");
                });
            }
        }, a.cancel = function() {
            b.path("/category");
        };
    } ]).controller("EditCategoryController", [ "$scope", "$location", "$rootScope", "RestSvr", "$routeParams", function(a, b, c, d, e) {
        a.heading = "Update Category", a.buttonName = "Update", d.getById({
            apiUrl: "categories/",
            id: e.id
        }).then(function(b) {
            a.category = b.record.Category;
        }), a.save = function(e) {
            if (e) {
                var f = {};
                f.Category = a.category, c.Message = null, d.put({
                    apiUrl: "categories/",
                    data: f,
                    id: a.category.id
                }).then(function(a) {
                    c.Message = a, "success" == a.type && b.path("/category");
                });
            }
        }, a.cancel = function() {
            b.path("/category");
        };
    } ]).controller("PostByCategoriesCtrl", [ "$scope", "$location", "$rootScope", "RestSvr", "$routeParams", function(a, b, c, d, e) {
        var f = function() {
            d.paginate("categories/name/", e.category).then(function(b) {
                a.posts = b.records.Post, a.category = b.records.Category, a.paging = b.paging;
            });
        };
        f(), a.pageChanged = function() {
            d.paginate("categories/name/" + e.category + "/page:" + a.paging.page).then(function(b) {
                a.posts = b.records.Post, a.category = b.records.Category, a.paging = b.paging;
            });
        }, a.viewPost = function(c) {
            b.path("/" + a.posts[c].Post.id);
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
            controller: [ "$scope", "RestSvr", "$location", function(a, b, c) {
                a.search = function(b) {
                    b && c.path("/search").search("q", a.post.search);
                }, b.get("categories/getByList").then(function(b) {
                    a.categories = b.records;
                }), a.viewByCategory = function(b) {
                    c.path("/category/" + angular.lowercase(a.categories[b].Category.name));
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
    angular.module("app.services", []).factory("AuthenticationService", function() {
        var a = {
            isLogged: !1
        };
        return a;
    }).factory("RestSvr", [ "$http", "mapUrlExt", function(a, b) {
        return {
            login: function(c) {
                return a.post(b.json(c.apiUrl), c.data).then(function(a) {
                    return {
                        message: {
                            type: a.data.message.type,
                            text: a.data.message.text
                        },
                        user: a.data.user,
                        token: a.headers("token")
                    };
                });
            },
            paginate: function(c, d, e) {
                var f = angular.isUndefined(d) ? "" : d, g = angular.isUndefined(e) ? "" : e;
                return a.get(b.json(c + f), g).then(function(a) {
                    return {
                        records: a.data.records,
                        paging: a.data.paging
                    };
                });
            },
            get: function(c, d) {
                angular.isUndefined(d) ? null : d;
                return a.get(b.json(c), d).then(function(a) {
                    return {
                        records: a.data.records
                    };
                });
            },
            getById: function(c) {
                return a.get(b.json(c.apiUrl + c.id)).then(function(a) {
                    return {
                        record: a.data.record
                    };
                });
            },
            post: function(c) {
                return a.post(b.json(c.apiUrl), c.data).then(function(a) {
                    return {
                        type: a.data.message.type,
                        text: a.data.message.text
                    };
                });
            },
            put: function(c) {
                return a.put(b.json(c.apiUrl + c.id), c.data).then(function(a) {
                    return {
                        type: a.data.message.type,
                        text: a.data.message.text
                    };
                });
            },
            "delete": function(c) {
                return a["delete"](b.json(c.apiUrl + c.id)).then(function(a) {
                    return {
                        type: a.data.message.type,
                        text: a.data.message.text
                    };
                });
            }
        };
    } ]).factory("Upload", [ "$rootScope", "$http", "mapUrlExt", function(a, b, c) {
        return {
            file: function(a) {
                Object.keys(a)[1];
                return b({
                    method: "POST",
                    url: c.json(a.apiUrl),
                    headers: {
                        "Content-Type": void 0
                    },
                    transformRequest: function(b) {
                        var c = new FormData();
                        return c.append("Post", angular.toJson(a.Post)), c.append("file", a.file), c;
                    },
                    data: {
                        modelKey: a.Post,
                        files: a.file
                    }
                });
            }
        };
    } ]).factory("mapUrlExt", [ "$rootScope", function(a) {
        return {
            json: function(b) {
                return a.appURL + b + ".json";
            }
        };
    } ]);
}();