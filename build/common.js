const { VueLoaderPlugin } = require('vue-loader')
const webpack = require('webpack')
const path = require('path')

module.exports = {
  entry: {
    wyatt: './src/wyatt.js',
    report: './src/report.js',
    wysegi: './src/wysegi/wysegi.js',
  },
  output: {
    path: path.join(__dirname, '..', 'pub'),
    filename: '[name]-bundle.js'
  },
  resolve: {
    alias: {
      vue: path.resolve('./node_modules/vue/dist/vue.runtime.esm-bundler.js')
    }
  },
  plugins: [
    new VueLoaderPlugin(),
    new webpack.DefinePlugin({          // Define Vue feature flags here
      __VUE_OPTIONS_API__: JSON.stringify(true),
      __VUE_PROD_DEVTOOLS__: JSON.stringify(true),
      __VUE_PROD_HYDRATION_MISMATCH_DETAILS__: JSON.stringify(true),
    })
  ],
  performance: {
    maxAssetSize: 2000000,
    maxEntrypointSize: 1500000
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /(node_modules|bower_components)/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: [
                ["@babel/preset-env", {"useBuiltIns": "entry", "corejs":"3"}]
//              ["@babel/env", {"targets": "last 1 versions, > 2%, not dead"}]
//              ["@babel/env", {"targets": {browsers: "chrome 68"}}]		//ES6
            ]
          }
        }
      },
      {
        test: /\.vue$/,
        exclude: /(node_modules|bower_components)/,
        use: { loader: 'vue-loader' }
      },
      {
        test: /\.(less|css)$/,
        use: [ 'style-loader', 'css-loader', 'less-loader' ],
      },
      {
        test: /\.scss$/,
        use: [ 'vue-style-loader', 'css-loader', 'sass-loader' ],
      },
      {
        test: /.*\.(gif|png|jpe?g)$/i,
        use: [ 'file-loader' ],
      },
      {
        test: /.*\.svg$/i,
        use: [ 'file-loader?name=[path][name].[ext]&context=./lib' ],
      }
    ]
  }
}
