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

        const details = await axios.get('/api/user/me');

        const role = details.data.role

        router.push(role == 0 ? '/DBManage' : '/Office')
        
    } catch (error) {
        console.error('Ошибка авторизации:', error.message);
    }
};
</script>

<template>
    <form @submit.prevent="loginUser" id="authorizationBody" class="shadow-2xl">
        <h2 class="underline decoration-2 underline-offset-8 font-medium">Вход</h2>

        <input type="email" v-model="email" class="inputDiv" placeholder="email" required/>

        <input type="text" v-model="password" class="inputDiv" placeholder="Пароль" required/>

        <button type="submit" class="velvetButton text-2xl">Войти</button>

        <div class="verificationError">{{authorizationError}}</div>
    </form>
</template>

<style>
#authorizationBody{
    display: block;
    width: 665px;
    height: 560px;
    border-radius: 20pt;
    background: white;
}

#authorizationBody h2{
    text-align: center;
    padding-top: 7%;
    padding-bottom: 5%;
    color: black;
    font-size: 32px;
}

.inputDiv{
    display: flex;
    justify-self: center;
    width: 465px;
    height: 55px;
    border-radius: 30pt;
    border-color: var(--crm-c-medium-gray);
    border-width: 0.5pt;
    background-color: var(--vt-c-white-mute);
    margin: 7%;
    padding-left: 3%;
    font-size: 16px;
}

.inputDiv:focus::placeholder{
    transition: 0.3s;
    opacity: 0;
}

.inputDiv:hover{
    border-color: var(--crm-c-medium-gray);
}

.velvetButton{
    display: flex;
    justify-self: center;
    justify-content: center;
    align-items: center;
    width: 250px;
    height: 55px;
    background-color: var(--crm-c-light-velvet);
    border-radius: 30pt;
    border-color: var(--crm-c-velvet);
    margin-top: 14%;
    border-width: 2pt;
    color: white;
}

.velvetButton:hover{
    background-color: var(--crm-c-velvet);
}

</style>