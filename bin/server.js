#!/usr/bin/env node
//Wyatt-ERP example server
//Copyright WyattERP.org; See license in root of this package
// -----------------------------------------------------------------------------
//TODO:
//- 
var	log		= require('../lib/logger')('wyclif')
const	Fs		= require('fs')
const	Express		= require('express')
const	Http		= require('http')
const	Https		= require('https')
var	expSPApp	= Express()

var argv = require('../args').argv
var credentials = argv.noSSL ? null : require('../credentials')(argv.serverKey, argv.serverCert)
var dbConf = {database:argv.dbName, user: argv.dbAdmin, host: argv.dbHost}

log.trace("SPA Port:   ", argv.spaPort, argv.wysegi, argv.serverKey, argv.serverCert)
log.trace("WyCLIf Port: ", argv.clifPort)
log.trace("dbConf:", dbConf)

var expApp = require('../spaserver')({spaPort:argv.spaPort})
var clif = require('../clifserver')({port: argv.clifPort, credentials, expApp})
