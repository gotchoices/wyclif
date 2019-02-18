//Parse standard server command line parameters
//Copyright WyattERP.org; See license in root of this package
// -----------------------------------------------------------------------------
const DefConfig = {
  spaPort: 4000,
  clifPort: 4100,
  dbAdmin: 'admin',
  serverKey: process.env.WYCLIF_SERVER_KEY || __dirname + '/../pki/server_private_key.pem',
  serverCert: process.env.WYCLIF_SERVER_CERT || __dirname + '/../pki/server_certificate.pem',
}

module.exports = function(config) {
  let d = Object.assign({}, DefConfig, config)
  return require('yargs')
    .alias('s','spaPort')    .default('spaPort',    d.spaPort)		//Serve client SPA's at this port
    .alias('i','clifPort')   .default('clifPort',   d.clifPort)		//Access to control layer interface
    .alias('k','serverKey')  .default('serverKey',  d.serverKey)	//Private SSL key for this server
    .alias('c','serverCert') .default('serverCert', d.serverCert)	//SSL Certificate for this server
    .alias('D','dbName')     .default('dbName',     d.dbName)		//Database name
    .alias('A','dbAdmin')    .default('dbAdmin',    d.dbAdmin)		//Database administrator name
    .alias('H','dbHost')     .default('dbHost',     d.dbHost)		//Database administrator name
    .alias('w','wysegi')     .default('wysegi',     d.wysegi)		//Serve wysegi SPA
    .alias('n','noSSL')      .default('noSSL',      false)		//Do not run server with SSL
}
