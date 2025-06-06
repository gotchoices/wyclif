//Dispatch action and report interactions to the appropriate service function
//Copyright WyattERP.org; See license in root of this package
// -----------------------------------------------------------------------------
//TODO:
//- Make sure each instance is garbage collected upon user connection closing (test)
//- Make a better connCode that can't collide or be guessed
//- 
const StringHash		= require('string-hash')
const { Language }		= require('wyseman')
var connectionCount		= 0

module.exports = function ({db, expApp, actions, origin, log}) {
  if (!log) log = require('./log')('dispatch')
  this.reportList = {}
  this.connCode = 'R' + (new Date).getTime() + '.' + connectionCount++	//Make unique identifier for this connection handler
  this.path = '/report/' + this.connCode	//Path for resource requests
  this.actions = actions			//Views, actions and their control functions
  this.db = db

log.debug("Dispatch:", this.path, this.actions, origin)
  expApp.get(this.path + '/:idhash/:resource', (req, res, next)=>{	//Listen for http requests from this action
    let idHash = req.params.idhash
      , resource = req.params.resource
      , id = Object.keys(this.reportList).find(k=>(this.reportList[k].idHash == idHash))
      , reportCache = id ? this.reportList[id] : null			//Find cached info for this report
log.debug("Got http document request:", idHash, id, resource, req.query)
    if (reportCache) {
      try {
        reportCache.controlFunc(reportCache, (err, content, headers)=>{	//Call our report handler
          if (err) {
            next(err)
          } else {
            if (headers) res.set(headers)
            res.send(content)
          }
        }, resource) 
      } catch (err) {
        log.error('Executing control handler', id, err.message)
      }
    }
  })
  
  this.handle = function(msg, sender) {			//Process action request coming from UI client
    let {id, action, view, name, data, language} = msg
log.debug("Got user request:", id, language, view, name, action, data, 'opt:', data?.options)
    if (action != 'action' || !(view in actions) || !(name in actions[view])) return false
    let actList = actions[view]				//Look up the specs for this action
      , controlFunc = (actList ? actList[name] : null)
      , reportCache = this.reportList[id]

//log.debug("L:", Language.messages(language, view))
    if (!controlFunc) return false		//No report found, so abort
    Language.viewData(language, view, (langTags, message) => {
      if (reportCache) {
        reportCache.data = data			//Freshen options, keys from latest request
      } else {					//New object to hold context between calls
        let idHash = StringHash(id)
          , resPath = this.path + '/' + idHash
        reportCache = {
          db: this.db, 		controlFunc,
          view,			name,		data, 
          langTags,		message,	language,
          origin,		resPath,	path:	this.path,	idHash
        }
      }

      try {
        if (controlFunc(reportCache, (error, data)=>{	//Generate the report
log.trace('   report generated:', error, 'data:', data)
          sender({id, view, action, name, data, error})		//And return it
        })) {
          this.reportList[id] = reportCache			//Keep a cache of the report parameters
        }
      } catch (error) {
        log.error('Executing control action', id, error.message)
        sender({id, view, action, name, data, error})
      }
    })
    return true
  }
}
