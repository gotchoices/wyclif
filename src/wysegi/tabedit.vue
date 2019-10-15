//Browse/modify tables in a wyseman database
//Copyright WyattERP.org: See LICENSE in the root of this package
// -----------------------------------------------------------------------------
//TODO:
//- 

<template>
  <div style="width: 100%; height: 100%; resize: both; overflow: auto; padding: 0 4px 4px 0;">
    <wylib-win topLevel=true :key="0" :state="state.windows[0]" @close="">
      <wylib-dbp :state="state.windows[0].client" :autoEdit="false" @execute="addWin"/>
    </wylib-win>
    <div class="subwindows">
      <wylib-win v-for="win,idx in state.windows" v-if="idx > 0 && win" topLevel=true :key="idx" :state="win" @close="close(idx)">
        <wylib-dbp :state="win.client"/>
      </wylib-win>
    </div>
  </div>
</template>

<script>
import Wylib from 'wylib'

export default {
  components: {'wylib-win': Wylib.Window, 'wylib-dbp': Wylib.DataView},
  props: {
    state:	{type: Object, default: ()=>({})}
  },
//  data() { return {
//  }},
  methods: {
    addWin(row, pkey, keyVals) {
//console.log("Add Window", row, pkey, keyVals)
      let i, view = keyVals.slice(0,2).join('.')
      for (i = 0; this.state.windows[i]; i++) {}
      if (i <= 0) view = 'wm.table_pub'
      let newWin = {posted: true, client: {dbView: view, loaded: true}}
      this.state.windows.splice(i, 0, newWin)
//console.log(" windows:", this.state.windows)
    },
    close(idx) {
      this.state.windows.splice(idx,1)
    },
  },
}
</script>
