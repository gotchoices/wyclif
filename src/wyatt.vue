//Default WyattERP user module
//Copyright WyattERP.org: See LICENSE in the root of this package
// -----------------------------------------------------------------------------
//TODO:
//- Implement basic ERP based on wyselib
//- Detect user's permission
//- Make tabs permission specific
//- admin: entity, tabedit
//- Allow to edit chart of accounts
//- Implement general ledger
//- 
<template>
  <wylib-app tag="wyatt" title="Wyatt ERP" :state="state" :tabs="tabs" :current="state.curTab" @tab="(t)=>{state.curTab = t}" help="Start ERP template">
    <keep-alive><component :is="currentComp" :state="state.tabs[state.curTab]"/></keep-alive>
  </wylib-app>
</template>

<script>
import TabEdit from './wysegi/tabedit.vue'
import EntEdit from './wysegi/entity.vue'

export default {
  components: {'tabEditor': TabEdit, 'entEditor': EntEdit},
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
}
</script>
