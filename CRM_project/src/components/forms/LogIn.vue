<script setup>
import router from '@/router';
import { ref } from 'vue'
import axios from 'axios';
import { getMe, scheduleTokenRefresh } from '../Utils';
import { SessionStorage } from 'quasar'

const email = ref("")
const password = ref("")

async function loginUser(){
    try {
        const response = await axios.post('/api/login', {
          email: email.value,
          password: password.value,
        });

        const token = response.data.jwt;
        localStorage.setItem('jwtToken', token);

        const me = (await getMe()).data

        SessionStorage.set('user', me)

        scheduleTokenRefresh()
        
        router.push('/Office')
        
    } catch (error) {
        console.error('Ошибка авторизации:', error.message);
    }
};
</script>

<template> 
    <div class="shadow-2xl w-[70%] h-[50%] bg-tile p-10 rounded-[15pt] min-w-[300px] min-h-[450px]">
        <q-form @submit.prevent="loginUser" class="flex flex-col gap-y-10 mt-5">
            <div class="text-3xl font-normal"> Вход </div>
            <q-input 
                type="email" 
                v-model="email" 
                placeholder="email" 
                outlined 
                required 
                class="brand-description"
                :rules="[val => !!val || 'Обязательное поле', val => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val) || 'Введите корректный email']"/>
            <q-input
                type="password"
                v-model="password"
                placeholder="Пароль"
                outlined 
                required
                class="brand-description"
                :rules="[val => (val && val.length >= 6 && val.length <= 12) || 'Длина должна быть от 6 до 12 символов']"/>
            <q-btn type="submit" color="brand-velvet" class="brand-description w-full flex justify-center items-center mt-5"> Войти </q-btn>
        </q-form>
    </div>
</template>

<style scoped>

</style>