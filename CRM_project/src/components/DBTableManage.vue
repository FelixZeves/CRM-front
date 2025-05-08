<script setup>
import { ref } from 'vue'
import axios from 'axios';
import { RoleEnum } from './Enums.vue'

const props = defineProps(['table'])

const token = localStorage.getItem('jwtToken');

axios.defaults.headers['Authorization'] = `Bearer ${token}`;

let records = ref([])

async function getRecords(){
    try {

        records.value = []

        const response = await axios.get('../api/get_users');

        let neededIds = response.data.ids;

        let details = await axios.post('../api/get_detail', { 
            ids: neededIds,
        })

        records.value = details.data.users
        
        
    } catch (error) {
        console.error('Ошибка авторизации:', error.response?.data || error.message);
    }
}

getRecords()

async function deleteUser(id){

    try {
        await axios.delete(`../delete_user?id=${id}`)
        getRecords()

    } catch (error) {
        console.error('Ошибка авторизации:', error.response?.data || error.message);
    }
}

</script>

<template>
    <div class="tableBody shadow-2xl">
        <div class="w-full flex flex-row justify-between py-2 px-8 border-b-2 border-black">
            <h3 class="text-lg font-bold">{{ $route.params.table }}</h3>
            <!-- <ModalAddRecord :table="$route.params.table" :func="getRecords"/> -->
        </div>
        <div class="recordsBody self-center gap-y-6 overflow-y-auto snap-y w-full items-center flex flex-col pt-3">
            <div class="record px-6 py-3 grid grid-cols-10 gap-x-4 justify-items-center">
                <p class="font-bold">Email</p>
                <p class="font-bold col-span-5">ФИО</p>
                <p class="font-bold col-span-3">Роль</p>
            </div>
            <div class="record px-6 py-3 grid grid-cols-10 gap-x-4 justify-items-center hover:bg-[#F2F2F2] "
                v-for="record in records">
                <p class="flex w-full justify-self-start">{{ record.email }}</p>
                <p class="col-span-5 text-center">{{ record.profile.fio }}</p>
                <p class="col-span-3 text-center">{{ RoleEnum[record.role].translation }}</p>

                <div>
                    <!-- <ModalEditRecord 
                    :table="$route.params.table"
                    :name="record.profile.fio"
                    :status="record.profile.department"
                    /> -->
                    <button @click="deleteUser(record.id)" class="pl-4">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="red" class="size-6">
                            <path stroke-linecap="round" stroke-linejoin="round" d="M6 18 18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>
            </div>
        </div>

    </div>

</template>

<style>

.record{
    width: 97%;
    justify-self: center;
    border-radius: 10pt;
}

.tableBody{
    position: fixed;
    top: 10%;
    left: 10%;
    background-color: white;
    height: 80%;
    width: 80%;
    justify-self: center;
    border-radius: 20pt;
}

.recordsBody{
    margin-left: 2%;
    width: 95%;
    height: 90%;
}

.leavePage{
    height: 100%;
    width: 30px;
    border-radius: 5pt;
}

.leavePage:hover{
    background-color: var(--crm-c-light-velvet);
    color: white;
}

</style>