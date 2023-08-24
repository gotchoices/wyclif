//Browse/modify tables in a wyseman database
//Copyright WyattERP.org: See LICENSE in the root of this package
// -----------------------------------------------------------------------------
//TODO:
//- 

<template>
  <div style="width: 100%; height: 100%; resize: both; overflow: auto; padding: 0 4px 4px 0;">
    <wylib-win topLevel=true :key="0" :state="state.windows[0]" :env="env" @close="">
      <wylib-dbp :state="state.windows[0].client" :autoEdit="false" :env="env" @execute="addWin"/>
    </wylib-win>
    <div class="subwindows">
      <wylib-win v-for="win,idx in state.windows" v-if="idx > 0 && win" topLevel=true :env="env" :key="idx" :state="win" @close="r=>close(idx,r)">
        <wylib-dbp :state="win.client" :env="env"/>
      </wylib-win>
    </div>
  </div>
</template>

<script>
import Wylib from 'wylib'

export default {
  components: {'wylib-win': Wylib.Window, 'wylib-dbp': Wylib.DataView},
  props: {
    state:	{type: Object, default: ()=>({})},
    env:       	{type: Object, default: Wylib.Common.envTpt},
  },
//  data() { return {
//  }},
  methods: {
    addWin(row, pkey, keyVals) {	//console.log("addWin", row, pkey, keyVals)
      let i = this.state.windows.length
        , dbView = (i > 0) ? keyVals.slice(0,2).join('.') : 'wm.table_pub'
        , newWin = {posted: true, client: {dbView, loaded: true}}
//console.log(" windows:", i, this.state.windows)
      Wylib.Common.addWindow(this.state.windows, newWin, this)
    },
    close(idx, reopen) {
      Wylib.Common.closeWindow(this.state.windows, idx, this, reopen)
    },
  },
//  beforeMount: function() {		//console.log("tabedit before mount:", this.state)
//  },
  mounted: function() {			console.log("tabedit mounted:", this.state)
    this.$nextTick(() => {
      this.state.windows[0].layer = 1	//Set this window at the back
    })
  },
}
</script>
