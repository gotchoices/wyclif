//Create a credentials object from specified files
//Copyright WyattERP.org; See license in root of this package
// -----------------------------------------------------------------------------
const Fs = require('fs')

module.exports = function(serverKeyFile, serverCertFile, log) {
  let key, cert

  if (Fs.existsSync(serverKeyFile))
    key = Fs.readFileSync(serverKeyFile)
  else
    log.error("Can't find server key file:", serverKeyFile)
    
  if (Fs.existsSync(serverCertFile))
    cert = Fs.readFileSync(serverCertFile)
  else
    log.error("Can't find server certificate file:", serverCertFile)
  
  return {key, cert}
}
