<script setup>
import { ref } from 'vue'
import UserTable from './UsersTable.vue';
import DBLastUpdates from './DBLastUpdates.vue';

const tables = ref([
    {name: 'Пользователи'}
])

</script>

<template>
    <div class="mt-24 grid grid-cols-7 lg:grid-cols-9 2xl:grid-cols-11 gap-x-4 lg:gap-x-16 2xl:gap-x-32 3xl:gap-x-48 overflow-y-none">
        <div class="col-span-7 lg:col-span-5 xl:col-span-6 2xl:col-span-7">
            <UserTable/>
        </div>
        <div class="sr-only lg:not-sr-only lg:col-span-2 xl:col-span-3 2xl:col-span-4">
            <div class="DBUpdates">
                <p class="py-2 px-5 lg:px-6 2xl:px-7 text-lg font-bold border-b border-gray-500">Последние изменения</p>
                <DBLastUpdates
                v-if="updates"
                v-for="update in updates"
                :table="update.table"
                :info="update.info"
                />
                <DBLastUpdates>Записей нет</DBLastUpdates>
            </div>
        </div>
    </div>
</template>

<style>
.DBUpdates{
    width: 90%;
    background-color: white;
    border-radius: 20pt;
}

</style>