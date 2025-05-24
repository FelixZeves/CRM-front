import { createApp } from 'vue'
import router from './router.js'
import { Quasar, Notify } from 'quasar'
import langRu from 'quasar/lang/ru'
import App from './App.vue'
import VCalendar from 'v-calendar'

import 'v-calendar/style.css'
import '@quasar/extras/material-icons/material-icons.css'
import '@quasar/extras/material-icons-round/material-icons-round.css'
import '@quasar/extras/material-icons-outlined/material-icons-outlined.css'
import '@quasar/extras/material-symbols-outlined/material-symbols-outlined.css'
import '@quasar/extras/bootstrap-icons/bootstrap-icons.css'
import '@quasar/extras/fontawesome-v6/fontawesome-v6.css'

import './assets/main.css'

import 'quasar/src/css/index.sass'

createApp(App).use(Quasar, {plugins: {Notify}, lang: langRu,}).use(router).use(VCalendar, {}).mount('#app')
