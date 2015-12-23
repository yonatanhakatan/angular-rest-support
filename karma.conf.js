module.exports = function(config) {
  config.set({
    basePath: './',

    files: [
      'bower_components/angular/angular.js',
      'bower_components/angular-mocks/angular-mocks.js',
      'src/**/*.js'
    ],

    preprocessors: {
      'src/!(tests)/**/*.js': ['coverage']
    },

    autoWatch: true,

    frameworks: ['jasmine'],

    browsers: ['Firefox'],

    singleRun: true,

    reporters: ['progress', 'coverage']
  });
};
