<script setup>
import axios from 'axios';
import { onMounted} from 'vue'
import router from '@/router';
import { useQuasar } from 'quasar'

async function checkPass(){

    const response = (await axios.get('/api/user/me')).data;

    if (response.default_pass){
        confirmNotify()
    }

}

const q = useQuasar()
const confirmNotify = () => q.notify({
    type: 'negative',
    position: 'top',
    color: 'brand-velvet',
    message: 'Пожалуйста, смените стандартный пароль',
    actions: [
        {label: 'Сменить', color: 'white', handler: () => {router.push('/PasswordChanging')}},
]})

onMounted(async () => {await checkPass()})
</script>

<template>
    
</template>