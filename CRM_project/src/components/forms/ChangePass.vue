<script setup>
import axios from 'axios'
import router from '@/router';
import { ref } from 'vue'

const passwordVerification = ref("")
const password = ref("")

const authorizationError = ref("")

async function passwordCheck(){
    await axios.put('/api/user/change-pass', {password: password.value})

    router.push('/')
}
</script>

<template>
    <div class="shadow-2xl w-[70%] h-[50%] bg-tile p-10 rounded-[15pt] min-w-[300px] min-h-[450px]">
        <q-form @submit.prevent="passwordCheck" class="flex flex-col gap-y-10 mt-5">
            <div class="text-3xl font-normal"> Смена пароля </div>
            <q-input
                type="password"
                v-model="password"
                placeholder="Пароль"
                outlined 
                required
                :rules="[val => (val && val.length >= 6 && val.length <= 12) || 'Длина должна быть от 6 до 12 символов']"/>
            <q-input
                type="password"
                v-model="passwordVerification"
                placeholder="Повторите пароль"
                outlined 
                required
                :rules="[val => (val && val.length >= 6 && val.length <= 12) || 'Длина должна быть от 6 до 12 символов', val => (val && val == password) || 'Пароли должны совпадать']"/>
            <q-btn type="submit" color="brand-velvet" class="!text-base !w-full !flex !justify-center !items-center mt-5 !text-white"> Сменить </q-btn>
            <div class="verificationError">{{authorizationError}}</div>
        </q-form>
    </div>
</template>