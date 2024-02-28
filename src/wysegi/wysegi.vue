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

<template>
  <wylib-app tag="wylib_wysegi" title="Wyseman GUI" :state="state" v-slot="ws" :tabs="tabs" :current="state.curTab" @tab="(t)=>{state.curTab = t}" help="Viewer for tables and views in a Wyseman managed database">
    <component v-for="t in runTabs" :key="t.tag" v-show="curTab==t.tag" :is="components[t.tag]" :tag="t.tag" :view="views[t.tag]" :state="state.tabs[t.tag]" :env="ws.env"/>
  </wylib-app>
</template>

<script>
import Wylib from 'wylib'
import TabEdit from './tabedit.vue'
import EntEdit from './entity.vue'
import ErdView from './erd.vue'

export default {
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
    runTabs() {         //Defer loading component until a tab has been selected
      return this.tabs.filter(t => this.hasRun[t.tag])
    },
    views() {
      return this.tabs.reduce((ac, el) => {
        let aggObj = {[el.tag]: el.view}
        Object.assign(aggObj, ac)
        return aggObj
      }, {})
    },
    components() {
      return this.tabs.reduce((ac, el)=>{
        let aggObj = {[el.tag]: el.component ?? 'wylib-launch'}
        Object.assign(aggObj, ac)
        return aggObj
      }, {})
    },
  },
  mounted: function () {				//console.log("Admin init:", this.curTab)
    if (this.curTab)
      this.$nextTick(()=>{this.hasRun[this.curTab] = true})
  },
  watch: {
    'state.curTab': function(newVal, oldVal) {		//console.log("Watched curTab:", newVal)
      this.hasRun[this.curTab] = true
    }
  },
}
</script>
