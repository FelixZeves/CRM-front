<script setup>
import axios from 'axios';
import { ref } from 'vue'
import { DialogEnum } from '../Enums.vue';
const props = defineProps(['table', 'id'])

const recordAlternation = ref(false)
let gettedPassword = ref("")

const token = localStorage.getItem('jwtToken');

axios.defaults.headers['Authorization'] = `Bearer ${token}`;

const values = ref(DialogEnum[props.table].values)

const params = ref(structuredClone(DialogEnum[props.table].params))

async function getNeededRecord(){
    try {
        let details = await axios.get('/api/user', {
            params: {
                ids: props.id
            }
        });

        let user = details.data.data[0]

        params.value.email = String(user.email)
        params.value.fio =  String(user.profile.fio)
        params.value.role = user.role
        params.value.departments =  user.profile.departments
        params.value.classes =  user.profile.classes
        params.value.lessons =  user.profile.lessons
        
    } catch (error) {
        console.error('Ошибка авторизации:', error.response?.data || error.message);
    }
}
getNeededRecord()

async function editUser(){

    try {

        const response = await axios.post('../api/update_user', params.value);
        gettedPassword.value = response.data.password;
        
    } catch (error) {
        console.error('Ошибка авторизации:', error.response?.data || error.message);
    }

}
</script>

<template>
    <q-btn icon="fa-solid fa-pen-to-square" flat round color="primary" rounded class="!me-2" @click="recordAlternation = true"></q-btn>

    <q-dialog v-model="recordAlternation" backdrop-filter="blur(4px)">
        <q-card style="max-width: 75%; min-width: 75%;" class="py-4 !rounded-[20px] !overflow-y-hidden">
            <p align="center" class="text-bold !text-2xl">{{ DialogEnum[table].title }}</p>
            <q-form @submit="editUser">
                <div class="max-h-[600px] overflow-y-auto">
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
                    label="Изменить запись"
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