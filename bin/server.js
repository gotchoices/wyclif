#!/usr/bin/env node
//WyattERP basic server
//Copyright WyattERP.org; See license in root of this package
// -----------------------------------------------------------------------------
//TODO:
//- Move schema location to a command line option?
//- Default to wyselib's stock schema
//- 

const MaxTimeDelta = 2000		//Allow max 2 second time difference between query and login
const { Wyseman } = require('wyseman')
const { Args, Dispatch, Log, Credentials, SpaServer} = require('../lib/index')

var log = Log('wyclif')
var { actions, Parser } = require('wyselib')
var argv = Args().argv

var credentials = argv.noSSL ? null : Credentials(argv.serverKey, argv.serverCert, log)

log.debug("SPA Port:  ", argv.spaPort, argv.wysegi, argv.serverKey, argv.serverCert)
log.debug("CLIF Port: ", argv.clifPort)
log.debug("Database:", argv.dbName, "At:", argv.dbHost, "Admin:", argv.dbAdmin)
log.trace("Actions:   ", actions)

var expApp = SpaServer({spaPort: argv.spaPort, credentials, log})
var wyseman = new Wyseman({
  host: argv.dbHost,
  database:argv.dbName,
  user: null,
}, {
  port: argv.clifPort, 
  dispatch: Dispatch,
  delta: MaxTimeDelta,
  log, credentials, expApp, actions,
}, {
  host: argv.dbHost,
  database:argv.dbName,
  user: argv.dbAdmin, 
  schema: __dirname + "/schema.sql"
})
