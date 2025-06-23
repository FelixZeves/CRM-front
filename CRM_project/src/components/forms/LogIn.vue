<script setup>
import router from '@/router';
import { ref } from 'vue'
import axios from 'axios';

const email = ref("")
const password = ref("")

const authorizationError = ref("")

async function loginUser(){
    try {
        const response = await axios.post('/api/login', {
          email: email.value,
          password: password.value,
        });

        const token = response.data.jwt;
        localStorage.setItem('jwtToken', token);

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
                :rules="[val => !!val || 'Обязательное поле', val => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val) || 'Введите корректный email']"/>
            <q-input
                type="text"
                v-model="password"
                placeholder="Пароль"
                outlined 
                required
                :rules="[val => (val && val.length >= 6 && val.length <= 12) || 'Длина должна быть от 6 до 12 символов']"/>
            <q-btn type="submit" color="brand-velvet" class="!text-base !w-full !flex !justify-center !items-center mt-5 !text-white"> Войти </q-btn>
            <div class="verificationError">{{authorizationError}}</div>
        </q-form>
    </div>
</template>

<style scoped>

</style>