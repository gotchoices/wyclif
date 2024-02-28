//Browse/modify a wyseman database
//Copyright WyattERP.org: See LICENSE in the root of this package
// -----------------------------------------------------------------------------
import { createApp } from 'vue'
import App from './wysegi.vue'
import Wylib from 'wylib'

const app = createApp(App)
app.component('wylib-app', Wylib.Application)
app.mount('#app')
