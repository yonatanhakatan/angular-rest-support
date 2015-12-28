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

    reporters: ['progress', 'coverage'],

    coverageReporter: {
      // specify a common output directory
      dir: './coverage',
      reporters: [
        {type: 'html', subdir: 'report-html'},
        {type: 'lcov', subdir: 'report-lcov'}
      ]
    }
  });
};
