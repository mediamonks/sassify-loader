const path = require('path');

module.exports = {
  context: __dirname,
  entry: './test/fixtures/entry.scss',
  output: {
    path: path.resolve(__dirname),
    filename: 'bundle.js',
  },
  resolveLoader: {
    alias: {
      'sassify-loader': path.resolve(__dirname, './src/loader.js'),
    }
  },
  module: {
    rules: [{
      test: /\.scss$/,
      use: [
        'raw-loader',
        {
          loader: 'sassify-loader',
        }
      ]
    }]
  }
}
