module.exports = function (grunt) {
    grunt.initConfig({
        mochaTest: {
            test: {
                options: {
                  reporter: 'spec',
                  // Require blanket wrapper here to instrument other required
                  // files on the fly. 
                  //
                  // NB. We cannot require blanket directly as it
                  // detects that we are not running mocha cli and loads differently.
                  //
                  // NNB. As mocha is 'clever' enough to only run the tests once for
                  // each file the following coverage task does not actually run any
                  // tests which is why the coverage instrumentation has to be done here
                  require: 'coverage/blanket'
                },
                src: ['test/*Spec.js']
            }
        },
        jshint: {   
            all: [ 'gruntfile.js', 'lib/*.js', 'test/*.js'],
            options: {
                globals: {
                    it: true,
                    describe: true,
                    beforeEach: true
                },
                curly: true,
                eqeqeq: true,
                immed: true,
                latedef: true,
                newcap: true,
                noarg: true,
                sub: true,
                undef: true,
                boss: true,
                eqnull: true,
                node: true,
                strict: false,
                es5: true,
                expr: true
            }
        }
    });
    grunt.registerTask('default', ['jshint:all', 'mochaTest']);
    grunt.loadNpmTasks('grunt-contrib-jshint');
    grunt.loadNpmTasks('grunt-mocha-test');    
};