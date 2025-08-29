import { createApp } from 'vue'
import router from './router.js'
import { Quasar, Notify, LocalStorage, SessionStorage } from 'quasar'
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
import { errorNotify } from './components/Notifies.js'

import axios from 'axios'
import { scheduleTokenRefresh } from './components/Utils.js'

const api = axios.create({
    baseURL: import.meta.env.DEV ? '/dev' : '/api' // на dev через proxy, на prod — без
})

const token = localStorage.getItem('jwtToken');
if (token) {
  scheduleTokenRefresh();
}

export default api

// handler for jwt token
api.interceptors.request.use((config) => {
    const token = localStorage.getItem('jwtToken');

    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
})

api.interceptors.response.use((response) => response, (error) => {
    let message = ''
    if (!error.response) {
        message = 'Сервер недоступен. Попробуйте позже.'
        errorNotify(message)
        return
    }

    switch (error.response.status) {
        case 401:
            localStorage.removeItem('jwtToken');
            window.location.href = '/';
            message = 'У вас истек срок действия сессии, пожалуйста, войдите снова';
            errorNotify(message)
            break;

        case 403:
            message = 'У вас нет прав для выполнения этого действия';
            errorNotify(message)
            break;

        default:
            errorNotify(error.response.data?.msg || '')
            break;
    }
});

createApp(App).use(Quasar, {plugins: {Notify, LocalStorage, SessionStorage}, lang: langRu,}).use(router).use(VCalendar, {}).mount('#app')
