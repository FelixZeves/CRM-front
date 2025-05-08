<script setup>
import axios from 'axios';
import { ref } from 'vue'
const props = defineProps(['table', 'func'])

const recordCreation = ref(false)
let gettedPassword = ref("")

const token = localStorage.getItem('jwtToken');

axios.defaults.headers['Authorization'] = `Bearer ${token}`;

const values = ref([
    {name: "E-mail",
        model: "email",
        rules:
            [val => !!val || 'Обязательное поле',
            val => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val) || 'Введите корректный email']},

    {name: "Пароль",
        model: "password",
        hint: 'Может генерироваться автоматически',},

    {name: "ФИО",
        model: "fio",
        rules:
            [val => !!val || 'Обязательное поле']},

    {name: "Роль",
        model: "role",
        hint: 'По умолчанию - "Учитель"',
        options:
            [{value: 0,  label: 'Админ'},
            {value: 1,  label: 'Руководитель'},
            {value: 2,  label: 'Административный работник'},
            {value: 3,  label: 'Учитель'}]},

    {name: "Подразделение",
        hint: 'Необязательное поле',
        model: "department"},

    {name: "Классы",
        hint: 'Необязательное поле',
        model: "classes"},

    {name: "Уроки",
        hint: 'Необязательное поле',
        model: "lessons"},
])

const params = ref({
    email: '',
    fio: '',
    password: null,
    role: 3,
    department: '',
    classes: null,
    lessons: null
})

async function addUser(){

    try {

        console.log(params.value)
        const response = await axios.post('../api/create_user', params.value);
        gettedPassword.value = response.data.password;
        
    } catch (error) {
        console.error('Ошибка авторизации:', error.response?.data || error.message);
    }

}
</script>

<template>
    <q-btn icon="fa-solid fa-plus" outline round color="brand-complete" size="sm" @click="recordCreation = true"></q-btn>

    <q-dialog v-model="recordCreation" backdrop-filter="blur(4px)">
        <q-card style="max-width: 75%; min-width: 75%;" class="py-4 !rounded-[20px] !overflow-y-hidden">
            <p align="center" class="text-bold !text-2xl">{{ table }}</p>
            <q-form @submit="addUser">
                <div class="h-[600px] overflow-y-auto">
                    <q-card-section
                v-for="value in values"
                class="!w-[90%] justify-self-center !py-2">
                    <p>{{ value.name }}</p>
                    <q-select 
                    v-if="value.options"
                    v-model="params[value.model]"
                    :options="value.options"
                    :hint="value.hint"
                    emit-value
                    map-options
                    hide-bottom-space
                    dense
                    borderless
                    :menu-offset="[15, 30]"
                    popup-content-class="gray-menu">
                    </q-select>
                    <q-input
                    v-else
                    hide-bottom-space
                    dense
                    borderless
                    clearable
                    color="black"
                    label-color="black"
                    v-model="params[value.model]"
                    :hint="value.hint"
                    lazy-rules
                    :rules="value.rules">
                    </q-input>
                </q-card-section>
                </div>
                <q-card-section align="center">
                    <p>{{ gettedPassword }}</p>
                    <q-btn
                    type="submit"
                    label="Создать запись"
                    class="submit-btn"/>
                </q-card-section>
            </q-form>
        </q-card>
    </q-dialog>

</template>

<style scoped>

p{
    @apply text-xl text-black mb-2 ps-3 underline underline-offset-[6px]
}

.q-input, .q-select{
    @apply ps-4 bg-[--vt-c-white-mute] !rounded-[10pt] border-[0.5pt] border-[--crm-c-medium-gray] text-lg
}

</style>