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

import axios from 'axios'

// handler for jwt token
axios.interceptors.request.use((config) => {
    const token = localStorage.getItem('jwtToken');

    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
})

axios.interceptors.response.use((response) => response, (error) => {
    let r = {type: 'negative', position: 'top', message: 'Ошибка'};

    if (!error.response) {
        r.message = 'Сервер недоступен. Попробуйте позже.'
        Notify.create(r)
        return
    }

    switch (error.response.status) {
        case 401:
            localStorage.removeItem('jwtToken');
            r.message = 'У вас истек срок действия сессии, пожалуйста, войдите снова';
            window.location.href = '/';
            Notify.create(r);
            break;

        case 403:
            r.message = 'У вас нет прав для выполнения этого действия';
            Notify.create(r);
            break;

        default:
            Notify.create({
                type: 'negative',
                position: 'top',
                message: `Ошибка: ${error.response.data?.msg || ''}`,
            });
            break;
    }
});

createApp(App).use(Quasar, {plugins: {Notify}, lang: langRu,}).use(router).use(VCalendar, {}).mount('#app')
