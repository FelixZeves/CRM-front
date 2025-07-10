<script setup>
import axios from 'axios'
import router from '@/router';
import { useQuasar } from 'quasar';
import { ref } from 'vue'

const passwordVerification = ref("")
const password = ref("")

const q = useQuasar()
const completeNotify = () => q.notify({
        type: 'positive',
        position: 'top',
        color: 'brand-complete',
        message: 'Пароль сменён успешно!',
        })

async function passwordCheck(){
    await axios.put('/api/user/change-pass', {password: password.value})

    completeNotify()
    router.push('/')
}
</script>

<template>
    <div class="shadow-2xl w-[70%] h-[50%] bg-tile p-10 rounded-[15pt] min-w-[300px] min-h-[450px]">
        <q-form @submit.prevent="passwordCheck" class="flex flex-col gap-y-10 mt-5">
            <div class="text-3xl font-normal"> Смена пароля </div>
            <q-input
                type="text"
                v-model="password"
                placeholder="Пароль"
                outlined 
                required
                :rules="[val => (val && val.length >= 6 && val.length <= 12) || 'Длина должна быть от 6 до 12 символов']"
                class="brand-description"
            />
            <q-input
                type="password"
                v-model="passwordVerification"
                placeholder="Повторите пароль"
                outlined 
                required
                :rules="[val => (val && val.length >= 6 && val.length <= 12) || 'Длина должна быть от 6 до 12 символов', val => (val && val == password) || 'Пароли должны совпадать']"
                class="brand-description"
            />
            <q-btn type="submit" color="brand-velvet" class="brand-description flex justify-center items-center mt-5"> Сменить </q-btn>
        </q-form>
    </div>
</template>