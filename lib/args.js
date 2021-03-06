//Parse standard server command line parameters
//Copyright WyattERP.org; See license in root of this package
// -----------------------------------------------------------------------------
const Path = require("path")
const DefConfig = {
  spaPort: 4000,
  clifPort: 4100,
  clifNP: 4200,
  dbAdmin: 'admin',
  wyclif: false,
  serverKey: process.env.WYCLIF_SERVER_KEY || Path.join(__dirname,'/../pki/local/spa-%.key'),
  serverCert: process.env.WYCLIF_SERVER_CERT || Path.join(__dirname,'/../pki/local/spa-%.crt'),
}

module.exports = function(config) {
  let d = Object.assign({}, DefConfig, config)
    , yargs = require('yargs')
    .alias('s','spaPort')    .default('spaPort',    d.spaPort)		//Serve client SPA's at this port
    .alias('i','clifPort')   .default('clifPort',   d.clifPort)		//Websocket port to control layer interface
    .alias('q','clifNP')     .default('clifNP',     d.clifNP)		//Noise-protocol port for control layer interface
    .alias('k','spaKey')     .default('spaKey',     d.spaKey)		//Private SSL key for this SPA server
    .alias('c','spaCert')    .default('spaCert',    d.spaCert)		//SSL Certificate for this SPA server
    .alias('D','dbName')     .default('dbName',     d.dbName)		//Database name
    .alias('P','dbPassword') .default('dbPassword', d.dbPassword)	//Database password
    .alias('A','dbAdmin')    .default('dbAdmin',    d.dbAdmin)		//Database administrator name
    .alias('H','dbHost')     .default('dbHost',     d.dbHost)		//Database host computer
    .alias('Q','dbPort')     .default('dbPort',     d.dbPort)		//Database connection port
    .alias('K','dbUserKey')  .default('dbUserKey',  d.dbUserKey)
    .alias('C','dbUserCert') .default('dbUserCert', d.dbUserCert)
    .alias('W','dbAdminKey') .default('dbAdminKey', d.dbAdminKey)
    .alias('X','dbAdminCert').default('dbAdminCert',d.dbAdminCert)
    .alias('Y','dbCA')	     .default('dbCA',       d.dbCA)
    .alias('w','wyclif')     .default('wyclif',     d.wyclif)	.boolean('wyclif')	//Serve wyclif SPAs too (such as wysegi)
    .alias('n','noHTTPS')    .default('noHTTPS',    false)	.boolean('noHTTPS')	//Run SPA server over regular HTTP (no ssl)

  Object.keys(d).forEach(key=>{		//Set defaults for anything else no explicitly done above
    if (!(key in yargs.argv)) {
//console.log("Missing key:", key, "Val:", d[key])
      yargs.default(key, d[key])
    }
  })
  return yargs
}
