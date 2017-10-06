var webpack = require('webpack');
var path = require('path');
require("babel-polyfill");


module.exports = {
    entry: [
        'babel-polyfill',
        'webpack/hot/only-dev-server',
        './src/index.js',
    ],
  output: {
    path: path.join(__dirname, '/public/'),
    filename: 'bundle.js'
  },
  module: {

    loaders: [
      {
        test: /\.json$/,
        loader: 'json-loader'
      },
      {
        test: /\.js$/,
        exclude: /(node_modules)/,
        loader: 'babel-loader',
          query: {compact: false}
      },
      {
        test: /\.css$/,
        loader: 'style-loader!css-loader!autoprefixer-loader'
      },
      {
        test: /\.scss$/,
        loader: 'style-loader!css-loader!autoprefixer-loader!sass-loader'
      }
    ]
  },
    devServer: {
        compress: true,
        publicPath: "http://loscalhost:8080/",
        filename: "bundle.js",
        hot: true,
        inline: true
    },
    plugins: [
        new webpack.HotModuleReplacementPlugin(),
        new webpack.NoEmitOnErrorsPlugin()
    ]
};