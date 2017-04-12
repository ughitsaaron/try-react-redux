const { join } = require('path');

var config = {
  entry: join(__dirname, 'app.js'),
  devtool: 'eval',
  output: {
    filename: 'bundle.js',
    path: join(__dirname, 'dist')
  },
  module: {
    loaders: [{
      test: /\.js$/,
      exclude: /(node_modules)/,
      loader: 'babel-loader'
    }]
  },
};

module.exports = config;
