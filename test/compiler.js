import path from 'path';
import webpack from 'webpack';
import memoryfs from 'memory-fs';

export default (fixture, options = {}) => {
  const compiler = webpack({
    context: __dirname,
    entry: fixture,
    output: {
      path: path.resolve(__dirname),
      filename: 'bundle.js',
    },
    module: {
      rules: [{
        test: /\.js$/,
        use: [
          'raw-loader',
          {
            loader: path.resolve(__dirname, '../src/loader.js'),
            options: {
              name: 'Alice'
            }
          },
          {
            loader: 'babel-loader',
            options: {
              presets: [
                ["env", {
                  "targets": {
                    "browsers": ['last 3 iOS versions', 'last 3 versions', 'ie >= 10'],
                    "uglify": true,
                  },
                  "modules": false,
                  "useBuiltIns": 'entry',
                }]
              ],
              // plugins: [
              //   'transform-class-display-name',
              //   'transform-class-properties',
              //   'transform-flow-strip-types',
              //   'transform-object-rest-spread',
              //   'transform-strict-mode',
              //   ["babel-plugin-transform-builtin-extend", {
              //     globals: ["Error", "Array"]
              //   }]
              // ],
              cacheDirectory: ''
            }
          },
        ]
      }]
    }
  });

  compiler.outputFileSystem = new memoryfs();

  return new Promise((resolve, reject) => {
    compiler.run((err, stats) => {
      if (err) reject(err);

      resolve(stats);
    });
  });
}
