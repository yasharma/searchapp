module.exports = function(grunt) {

  // Project configuration.
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    cssmin:{
        sitecss:{
            files:{
                'app/webroot/css/site.min.css': [
                    'bower_components/angular-loading-bar/build/loading-bar.min.css',
                    'bower_components/bootstrap/dist/css/bootstrap.min.css',
                    'bower_components/textAngular/dist/textAngular.css',
                    'bower_components/Ionicons/css/ionicons.min.css',
                    'bower_components/AdminLTE/dist/css/AdminLTE.min.css',
                    'bower_components/AdminLTE/dist/css/skins/skin-purple.min.css'
                ]  
            }
        },
        frontcss: {
            files: {
                'app/webroot/css/front.min.css':[
                    'bower_components/angular-loading-bar/build/loading-bar.min.css',
                    'bower_components/bootstrap/dist/css/bootstrap.min.css',
                ]
            }
        }
    },  
    jshint: {
        all: [
            'Gruntfile.js',
            'app/webroot/js/app.js',
            'app/webroot/js/adminApp.js',
            'app/webroot/js/controllers.js',
            'app/webroot/js/directives.js',
            'app/webroot/js/filters.js',
            'app/webroot/js/services.js'
        ]
    },
    watch: {
        scripts: {
            files: ['app/webroot/js/*.js','Gruntfile.js'],
            tasks: ['jshint','uglify:admin_app', 'uglify:front_app'],
            options: {
                spawn: false,
            },
        },
    },
    uglify: {
        bower_components: {
            options: {
                banner: '/*! <%= pkg.name %> <%= grunt.template.today("yyyy-mm-dd") %> */\n',
                compress: true
            },
            files:{
                'app/webroot/js/lib.min.js': [
                    'bower_components/jquery/dist/jquery.min.js',
                    'bower_components/bootstrap/dist/js/bootstrap.min.js',
                    'bower_components/AdminLTE/dist/js/app.min.js',
                    'bower_components/angular/angular.min.js',
                    'bower_components/angular-route/angular-route.min.js',
                    'bower_components/angular-animate/angular-animate.min.js',
                    'bower_components/angular-touch/angular-touch.min.js',
                    'bower_components/angular-bootstrap/ui-bootstrap-tpls.min.js',
                    'bower_components/textAngular/dist/textAngular-rangy.min.js',
                    'bower_components/textAngular/dist/textAngular-sanitize.min.js',
                    'bower_components/textAngular/dist/textAngular.min.js',
                    'bower_components/angular-loading-bar/build/loading-bar.min.js',
                    'bower_components/angular-local-storage/dist/angular-local-storage.min.js'
                ],
                'app/webroot/js/front-lib.min.js': [
                    'bower_components/jquery/dist/jquery.min.js',
                    'bower_components/bootstrap/dist/js/bootstrap.min.js',
                    'bower_components/angular/angular.min.js',
                    'bower_components/angular-route/angular-route.min.js',
                    'bower_components/angular-animate/angular-animate.min.js',
                    'bower_components/angular-touch/angular-touch.min.js',
                    'bower_components/angular-bootstrap/ui-bootstrap-tpls.min.js',
                    'bower_components/angular-sanitize/angular-sanitize.min.js',
                    'bower_components/angular-loading-bar/build/loading-bar.min.js'
                ]
            }
        },
        admin_app:{
            options:{
                beautify: true
            },
            files:{
                'app/webroot/js/admin-app.js': [
                    'app/webroot/js/adminApp.js',
                    'app/webroot/js/controllers.js',
                    'app/webroot/js/directives.js',
                    'app/webroot/js/filters.js',
                    'app/webroot/js/services.js'
                ]
            }
        },
        front_app:{
            options:{
                beautify: true
            },
            files:{
                'app/webroot/js/front-app.js': [
                    'app/webroot/js/app.js',
                    'app/webroot/js/controllers.js',
                    'app/webroot/js/directives.js',
                    'app/webroot/js/filters.js',
                    'app/webroot/js/services.js'
                ]
            }
        }
    }
    });

  // Compress JS Files
  grunt.loadNpmTasks('grunt-contrib-uglify');
  // Compress CSS Files
  grunt.loadNpmTasks('grunt-contrib-cssmin');
  // Validate JS code
  grunt.loadNpmTasks('grunt-contrib-jshint');
  // Watch File Changes
  grunt.loadNpmTasks('grunt-contrib-watch');

  // The default task (running "grunt" in console) is "watch"
  grunt.registerTask('default', ['uglify','cssmin','watch']);

};