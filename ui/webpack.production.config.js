var path = require('path')
var webpack = require('webpack')

module.exports = {
  entry: [
    './src/index'
  ],
  output: {
    path: path.join(__dirname, 'dist'),
    filename: 'bundle.js',
    publicPath: '/static/'
  },
  module: {
    loaders: [
      {
        test: /\.js$/,
        loaders: [ 'react-hot', 'babel' ],
        include: path.join(__dirname, 'src')
      }
    ]
  },
  resolve: {
    root: path.resolve(__dirname),
     alias: {
      components: 'src/components',
      config: path.join(__dirname, 'config', process.env.NODE_ENV)
     },
     extensions: ['', '.js']
  }
}
