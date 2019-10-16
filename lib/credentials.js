//Create a credentials object from specified files
//Copyright WyattERP.org; See license in root of this package
// -----------------------------------------------------------------------------
const Fs = require('fs')

module.exports = function(keyFile, certFile, caFile, log) {
  let key, cert, ca

  if (Fs.existsSync(keyFile)) {
    key = Fs.readFileSync(keyFile)
  } else if (log) {
    log.error("Can't find key file:", keyFile)
  }
    
  if (Fs.existsSync(certFile))
    cert = Fs.readFileSync(certFile)
  else if (log)
    log.error("Can't find certificate file:", certFile)

  if (caFile) {
    if (Fs.existsSync(caFile))
      ca = Fs.readFileSync(caFile)
    else if (log)
      log.error("Can't find CA file:", caFile)
  }

  if (key && cert && ca) {
    return {key, cert, ca}
  } else if (key && cert) {
    return {key, cert}
  }
  return null
}
