//Create a credentials object from specified files
//Copyright WyattERP.org; See license in root of this package
// -----------------------------------------------------------------------------
const Fs = require('fs')
const Os = require('os')
const Hostname = Os.hostname()
const Host = Hostname ? Hostname.split('.')[0] : null

module.exports = function(keyFile, certFile, caFile, log) {
  let key, cert, ca, file
    , hostFile = template => {			//If filename contains %, substitute the hostname there
        if (template.includes('%')) {
          if (Host)
            return template.replace(/%/, Host)
        }
        return template
      }

  if (Fs.existsSync(file = hostFile(keyFile)))
    key = Fs.readFileSync(file)
  else if (log)
    log.error("Can't find key file:", file)
    
  if (Fs.existsSync(file = hostFile(certFile)))
    cert = Fs.readFileSync(file)
  else if (log)
    log.error("Can't find certificate file:", file)

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
