npm install --save-dev \
  webpack@5 webpack-cli@5 webpack-dev-server@4 \
  karma-webpack@5 ts-loader@9 \
  karma karma-chrome-launcher \
  karma-jasmine karma-jasmine-html-reporter \
  @angular-devkit/build-angular


  const webpack = require('webpack');

module.exports = function (config) {
  config.set({
    basePath: '',
    frameworks: ['jasmine', '@angular-devkit/build-angular'],
    files: [
      { pattern: 'src/test.ts', watched: false }
    ],
    preprocessors: {
      'src/test.ts': ['webpack']
    },
    webpack: {
      mode: 'development',
      resolve: {
        fallback: {
          "crypto": false,
          "path": false,
          "fs": false
        }
      },
      plugins: [
        new webpack.ProvidePlugin({
          process: 'process/browser',
        }),
      ],
    },
    webpackMiddleware: {
      stats: 'errors-only'
    },
    plugins: [
      require('karma-webpack'),
      require('karma-jasmine'),
      require('karma-chrome-launcher'),
      require('karma-jasmine-html-reporter'),
      require('@angular-devkit/build-angular/plugins/karma')
    ],
    browsers: ['Chrome'],
    singleRun: false,
  });
};
