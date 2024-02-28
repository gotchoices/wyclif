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
const Path = require('path')

var log = Log('wyclif')
var { actions, Parser } = require('wyselib')
var argv = Args().argv

var credentials = argv.noSSL ? null : Credentials(argv.serverKey, argv.serverCert, log)

log.debug("UI Ports:  ", argv.uiPort, argv.clifPort)
log.debug("Certs:     ", argv.serverKey, argv.serverCert, argv.wysegi)
log.debug("Database:  ", argv.dbName, "At:", argv.dbHost, "Admin:", argv.dbAdmin)
log.trace("Actions:   ", actions)

var expApp = new SpaServer({spaPort: argv.spaPort, credentials}, log)
var wyseman = new Wyseman({
  host: argv.dbHost,
  database:argv.dbName,
  user: null,
}, {
  websock: {port: argv.clifPort, credentials, delta: MaxTimeDelta, uiPort: argv.uiPort},
  dispatch: Dispatch,
  expApp, log, actions,
}, {
  host: argv.dbHost,
  database:argv.dbName,
  user: argv.dbAdmin, 
  schema: Path.join(__dirname, '../schema/schema.json')
})
