//Browse/modify a wyseman database
//Copyright WyattERP.org: See LICENSE in the root of this package
// -----------------------------------------------------------------------------
//TODO:
//- Table preview context help should come from the DB help for that table
//- Implement Users edit
//- Implement Address edit
//- Implement Communications edit
//- Implement Privileges edit
//- 
//- Later:
//- Implement ERD display
//- 

import Vue from 'vue'
Vue.config.productionTip = false
import Wylib from 'wylib'
import TabEdit from './tabedit.vue'
import EntEdit from './entity.vue'
import ErdView from './erd.vue'

const AppTemplate = `
  <wylib-app tag="wylib_wysegi" title="Wyseman GUI" :state="state" v-slot="ws" :tabs="tabs" :current="state.curTab" @tab="(t)=>{state.curTab = t}" help="Viewer for tables and views in a Wyseman managed database">
    <keep-alive><component :is="currentComp" :state="state.tabs[state.curTab]" :env="ws.env"/></keep-alive>
  </wylib-app>
`
new Vue(Object.assign({el: '#app', template: AppTemplate}, {
  components: {'wylib-app': Wylib.Application, 'erdViewer': ErdView, 'tabEditor': TabEdit, 'entEditor': EntEdit},
  data() { return {
    state:	{
      curTab: 'db', 
      tabs: {
        db:	{windows: [{posted: true, client: {dbView: 'wm.table_data', loaded: true}}]},
        ent:	{windows: [{posted: true, client: {dbView: 'base.ent_v', loaded: true}}]},
        erd:	{}
      }
    },
    tabs:	[
      {tag: 'db',  component: 'tabEditor', title: 'Database', help: 'Direct access to database tables'},
      {tag: 'ent', component: 'entEditor', title: 'Users', help: 'View and edit database user entities'},
      {tag: 'erd', component: 'erdViewer', title: 'ERD', help: 'Graphical view of database tables and their relations'},
    ],
  }},
  computed: {
    currentComp: function() {
      return this.tabs.find(e=>(e.tag == this.state.curTab)).component
    },
  },
//  beforeMount: function() {
//    this.db = {windows: [{posted: true, client: {dbView: 'wm.table_pub', loaded: true}}]}
//  },
}))
