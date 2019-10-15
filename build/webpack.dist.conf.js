// webpack.config.js
const path = require('path');
const Common = require('./common')
                
module.exports = {
  entry: Common.entry,
  output: Common.output,
  devtool: 'source-map',
  resolve: Common.resolve,
  plugins: Common.plugins,
  module: Common.module,
  performance: Common.performance
}
