// webpack.config.js
// Build bundles for the pages in the test folder
var path = require('path')
const Common = require('./common')
                
module.exports = {
  mode: 'development',
  entry: Common.entry,
  output: Common.output,
  resolve: Common.resolve,
  plugins: Common.plugins,
  module: Common.module,
  performance: Common.performance,
  devServer: {
       port: 3300,
       host: '0.0.0.0',	disableHostCheck: true,	//To browse from different host on lan
       hot: true, hotOnly: true,
       contentBase: 'test',			//Serve files out of test dir
   }
}
