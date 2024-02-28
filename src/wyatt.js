//Default WyattERP user module
//Copyright WyattERP.org: See LICENSE in the root of this package
// -----------------------------------------------------------------------------
//- 

import { createApp } from 'vue'
import App from './wyatt.vue'
import Wylib from 'wylib'

const app = createApp(App)
app.component('wylib-app', Wylib.Application)
app.mount('#app')
