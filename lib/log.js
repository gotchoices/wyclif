//Manage logging for wyclif and friends
//Copyright WyattERP.org; See license in root of this package
// -----------------------------------------------------------------------------
const { format, createLogger, transports } = require('winston')

const Path = require('path')
const Fs = require('fs')
var logPath = process.env.WYATT_LOGPATH || Path.join('/var', 'tmp', 'wyatt')
var defaultLevel = process.env.NODE_DEBUG || 'warn'
if (defaultLevel == 'trace') defaultLevel = 'silly'	//some standards use 'trace'
  
module.exports = function(tag, level = defaultLevel, path = logPath) {
  var logFile = Path.join(path, tag)
//console.log("Create:", path)
  if (!Fs.existsSync(path)) Fs.mkdirSync(path)
  var logger = createLogger({
    level: level,
    format: format.combine(
      format.label({label: tag}),
      format.colorize(),
//      format.timestamp(),
//      format.printf(info => `${info.timestamp} ${info.label}(${info.level}): ${info.message}`)
      format.printf(info => `${info.label}(${info.level}): ${info.message}`)
    ),
    transports: [new transports.File({ filename: Path.join(path,'combined.log') })],
  })
//console.log("Adding logger:", Path.join(path, tag))
  if (tag) {
    logger.add(new transports.File({ filename: Path.join(path, tag) }))
  }

  function logit(level, ...args) {		//Capable of rendering objects as text
    let message = args.map(val => {
      return((typeof val) == 'object' ? JSON.stringify(val, (k,v)=>{
        if (k && v && typeof v == 'object') return '[obj]'		//Only show objects one level deep
        else return v
      }) : val)
    }).join(' ')
//console.log("Message:", message)
    logger.log({level, message})
  }
    
  //Wrappers to allow for multiple arguments:
  logger.error   = (...args) => {logit('error',   ...args)}
  logger.warn    = (...args) => {logit('warn',    ...args)}
  logger.info    = (...args) => {logit('info',    ...args)}
  logger.verbose = (...args) => {logit('verbose', ...args)}
  logger.debug   = (...args) => {logit('debug',   ...args)}
  logger.silly   = (...args) => {logit('silly',   ...args)}
  logger.trace   = (...args) => {logit('silly',   ...args)}
    
//    logger.warn("Starting Logger:------------------------------------------")
  return logger
}

module.exports.setPath = function(path) {	//Set default logging directory
//console.log("Set:", path)
  logPath = path
}
