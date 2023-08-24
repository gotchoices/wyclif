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

const Template = `
  <wylib-app tag="wylib_wysegi" title="Wyseman GUI" :state="state" v-slot="ws" :tabs="tabs" :current="state.curTab" @tab="(t)=>{state.curTab = t}" help="Viewer for tables and views in a Wyseman managed database">
    <component v-for="t in tabs" :key="t.tag" v-show="curTab==t.tag" v-if="hasRun[t.tag]" :is="components[t.tag]" :tag="t.tag" :view="views[t.tag]" :state="state.tabs[t.tag]" :env="ws.env"/>
  </wylib-app>
`
new Vue({
  el: '#app',
  template: Template,
  components: {'wylib-app': Wylib.Application, 'erdViewer': ErdView, 'tabEditor': TabEdit, 'entEditor': EntEdit},
  data() { return {
    state:	{
      curTab: 'db', 
      tabs: {
        db:	{windows: [{posted: true, client: {dbView: 'wm.table_pub', loaded: true}}]},
        ent:	{windows: [{posted: true, client: {dbView: 'base.ent_v', loaded: true}}]},
        erd:	{}
      }
    },
    hasRun:	{},
    tabs:	[
      {tag: 'db',  component: 'tabEditor', title: 'Database', help: 'Direct access to database tables'},
      {tag: 'ent', component: 'entEditor', title: 'Users', help: 'View and edit database user entities'},
      {tag: 'erd', component: 'erdViewer', title: 'ERD', help: 'Graphical view of database tables and their relations'},
    ],
  }},
  computed: {
    curTab() {
      return this.state.curTab || 'users'
    },
    views() {
      return this.tabs.reduce((ac,el)=>{
        ac[el.tag] = el.view
        return ac
      }, {})
    },
    components() {
      return this.tabs.reduce((ac,el)=>{
        ac[el.tag] = el.component || 'wylib-launch'
        return ac
      }, {})
    },
  },
  mounted: function () {				//console.log("Admin init:", this.curTab)
    if (this.curTab)
      this.$nextTick(()=>{this.$set(this.hasRun, this.curTab, true)})
  },
  watch: {
    'state.curTab': function(newVal, oldVal) {		//console.log("Watched curTab:", newVal)
      this.$set(this.hasRun, this.curTab, true)
    }
  },
})
