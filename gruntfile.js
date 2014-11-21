'use strict';

module.exports = function(grunt) {
    // Project Configuration
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        watch: {
            options: {
                livereload: 35730
            },
            js: {
                files: ['gruntfile.js', 'server.js', 'public/js/**', 'public/modules/**/*.js', 'test/**/*.js'],
                tasks: ['jshint']
            },
            html: {
                files: ['public/**/*.html']
            },
            css: {
                files: ['public/**/*.css']
            }
        },
        jshint: {
            all: {
                src: ['gruntfile.js', 'package.json', 'bower.json', 'server.js', 'public/js/*.js', 'config/**/*.js', 'test/**/*.js', '!test/coverage/**/*.js'],
                options: {
                    jshintrc: true
                }
            }
        },
        nodemon: {
            dev: {
                script: 'server.js',
                options: {
                    ext: 'js,json',
                    ignore: ['public/**', 'lib/**', 'test/**'],
                    nodeArgs: ['--debug=8888']
                }
            },
            prod: {
                script: 'server.js',
                options: {
                    ignore: ['.'],
                    env: {
                        NODE_ENV: 'production'
                    }
                }
            }
        },
        concurrent: {
            tasks: ['nodemon:dev', 'watch'],
            options: {
                logConcurrentOutput: true
            }
        },
        mochaTest: {
            options: {
                reporter: 'spec',
                require: 'server.js'
            },
            src: ['test/mocha/**/*.js']
        },
        env: {
            test: {
                NODE_ENV: 'test'
            }
        },
        karma: {
            unit: {
                configFile: 'test/karma/karma.conf.js'
            }
        },
        jsbeautifier: {
            'default': {
                src: ['<%= jshint.all.src %>', 'bower.json', '<%= watch.html.files %>', '!public/views/**/*.html'],
                options: {
                    js: {
                        preserveNewlines: true,
                        maxPreserveNewlines: 2
                    }
                }
            },
            'build': {
                src: '<%= jsbeautifier.default.src %>',
                options: {
                    mode: 'VERIFY_ONLY',
                    js: '<%= jsbeautifier.default.options.js%>'
                }
            }
        },
        bower: {
            install: {
                options: {
                    verbose: true
                }
            }
        },
        clean: ['./test/*.js', './lib/']
    });

    //Load NPM tasks
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-contrib-clean');
    grunt.loadNpmTasks('grunt-contrib-jshint');
    grunt.loadNpmTasks('grunt-mocha-test');
    grunt.loadNpmTasks('grunt-karma');
    grunt.loadNpmTasks('grunt-nodemon');
    grunt.loadNpmTasks('grunt-concurrent');
    grunt.loadNpmTasks('grunt-env');
    grunt.loadNpmTasks('grunt-jsbeautifier');
    grunt.loadNpmTasks('grunt-bower-task');

    //Making grunt default to force in order not to break the project.
    grunt.option('force', true);

    //Default task(s).
    grunt.registerTask('default', ['bower', 'test', 'jsbeautifier:default']);

    // Test task.
    grunt.registerTask('test', function() {
        grunt.option('force', false);
        grunt.task.run('env:test', 'jshint' /*, 'mochaTest', 'karma:unit'*/ );
    });

    grunt.registerTask('build', ['clear', 'test', 'jsbeautifier:build']);

    // Clean the project
    grunt.registerTask('clear', ['clean']);

    // Server task
    grunt.registerTask('server', ['bower', 'jshint', 'concurrent']);
    grunt.registerTask('server:prod', ['nodemon:prod']);
};
