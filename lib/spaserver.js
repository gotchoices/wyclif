//Launch http service to serve applications to the browser
//Copyright WyattERP.org; See license in root of this package
// -----------------------------------------------------------------------------
//TODO:
//- Re-enable wysegi (where to serve from?)
//-
const	Express		= require('express')
const	Http		= require('http')
const	Https		= require('https')
const	DefConfig	= {
  spaPort: 4000,
  expApp: Express(),
  pubDir: 'pub',
  infoPath: '/clientinfo',
  log: console.log
}

module.exports = function(config, log) {
  let d = Object.assign({}, DefConfig, config)
//d.log.trace("SPA Server:", d)
  if (Boolean(d.spaPort)) {
    let server = d.credentials ? Https.createServer(d.credentials, d.expApp) : Http.createServer(d.expApp)

    d.expApp.use(Express.static(d.pubDir))
//    if (d.wysegi)
//      expApp.use(Express.static('node_modules/wylib/dist'))	//Serve up wylib wysegi app too

    d.expApp.get(d.infoPath, (req, res)=>{	//Let clients know their IP number for validation purposes
d.log.trace("Client request:", req.headers)
      date = new Date
      res.send(JSON.stringify({
        ip: req.connection.remoteAddress,
        real: req.headers['x-real-ip'] || req.headers['x-forwarded-for'],
        cookie: req.headers.cookie,
        userAgent: req.headers['user-agent'],
        date,
      }))
    })
    server.listen(d.spaPort)
//d.log.debug("Serving client SPAs at port:", d.spaPort)
    return d.expApp
  }
}
