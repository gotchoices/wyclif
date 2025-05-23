//Launch http service to serve applications to the browser
//Copyright WyattERP.org; See license in root of this package
// -----------------------------------------------------------------------------
//TODO:
//- Re-enable wysegi (where to serve from?)
//-
const	Express		= require('express')
const	Http		= require('http')
const	Https		= require('https')
const	Path		= require('path')
const	FavIcon		= require('serve-favicon')
const	DefConfig	= {
  uiPort: 4000,
  expApp: Express(),
  pubDir: Path.join(__dirname, '..', 'pub'),
  infoPath: '/clientinfo',
  wyclif: false
}

module.exports = class {
  constructor(config, log = console.log) {
    let d = Object.assign({}, DefConfig, config)
log.trace("SPA Server:", d.uiPort, d.pubDir, d.wyclif)
    this.expApp = d.expApp

    if (Boolean(d.uiPort)) {
      this.server = d.credentials ? Https.createServer(d.credentials, d.expApp) : Http.createServer(d.expApp)
  
      if (d.favIconFile) d.expApp.use(FavIcon(Path.join(d.pubDir, d.favIconFile)))
      d.expApp.use(Express.static(d.pubDir))
      if (d.wyclif && d.pubDir != DefConfig.pubDir) {
        d.expApp.use(Express.static(DefConfig.pubDir))	//Serve up wyclif local apps wysegi too
      }

      d.expApp.get(d.infoPath, (req, res)=>{	//Let clients know their IP number for validation purposes
log.trace("Client request:", req.headers)
        let date = new Date
        res.send(JSON.stringify({
          ip: req.connection.remoteAddress,
          real: req.headers['x-real-ip'] || req.headers['x-forwarded-for'],
          cookie: req.headers.cookie,
          userAgent: req.headers['user-agent'],
          date,
        }))
      })
      this.server.listen(d.uiPort)
//log.debug("Serving client SPAs at port:", d.uiPort)
    }	//if
  }	//constructor
  
  close() {
    if (this.server) this.server.close()
  }
}	//class
