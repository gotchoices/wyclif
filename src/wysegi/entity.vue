//Browse/modify wyseman registered users
//Copyright WyattERP.org: See LICENSE in the root of this package
// -----------------------------------------------------------------------------
//TODO:
//- 
import Vue from 'vue'
<template>
  <div style="width: 100%; height: 100%; resize: both; overflow: auto; padding: 0 4px 4px 0;">
    <div class="subwindows">
      <wylib-win v-for="win,idx in state.windows" topLevel=true :key="idx" :env="env" :state="win" @close="close(idx)">
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
}
</script>
