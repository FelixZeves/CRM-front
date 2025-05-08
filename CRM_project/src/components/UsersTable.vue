<script setup>
import { onMounted, ref } from 'vue'
import { RoleEnum, TableEnum } from './Enums.vue'
import axios from 'axios';
import RecordCreationDialog from './dialogs/RecordCreationDialog.vue';
import RecordAlternationDialog from './dialogs/RecordAlternationDialog.vue';

const token = localStorage.getItem('jwtToken');

axios.defaults.headers['Authorization'] = `Bearer ${token}`;

let records = ref([])

// async function getLastRecords(){
//     try {

//         const response = await axios.get('../api/get_users');

//         let neededIds = response.data.slice(0,4);

//         let details = await axios.post('../api/get_detail', { 
//             ids: neededIds,
//         })

//         return  details.data.users.map(val => ({email: val.email, 'full name': val.profile.fio, role: val.role, id: val.id}))
        
//     } catch (error) {
//         console.error('Ошибка авторизации:', error.response?.data || error.message);
//         return  []
//     }
// }

async function fetchTableData(params){
  const {
    getUrl,
    dataMapper,
    limit = 3
  } = params;

  console.log(params)

  try {
    const response = await axios.get(getUrl);
    
    const details = response.data.slice(0, limit);

    return Array.isArray(details.data.users) 
      ? details.data.users.map(dataMapper)
      : [];
  } catch (error) {
    console.error('Ошибка при загрузке данных таблицы:', error.response?.data || error.message);
    return [];
  }
}

</script>

<template>
    <div class="shadow-2xl">
        <q-table
        v-for="table in TableEnum"
        title-class="text-bold"
        :columns="table.cols"
        :rows="fetchTableData(getUrl = table.getUrl, dataMapper = table.dataMapper)"
        row-key="name"
        hide-bottom
        class="px-2 pb-2">

        <template v-slot:top="props">
            <div class="q-table__title">
                <q-btn flat class="!rounded-[10px]">
                    <q-icon name="fa-solid fa-user" class="pe-2" size="sm"></q-icon>
                    <div class="font-bold normal-case text-xl">{{ table.title }}</div>
                </q-btn>
            </div>
            <q-space/>
            <RecordCreationDialog table="Пользователи"/>
        </template>

        <template v-slot:header="props">
            <q-tr :props="props">
            <q-th
                v-for="col in props.cols"
                :key="col.name"
                :props="props"
            >
                {{ col.label }}
            </q-th>
            <q-th auto-width />
            </q-tr>
        </template>

        <template v-slot:body="props">
            <q-tr :props="props" class="!py-2">
                <q-td
                v-for="col in props.cols"
                :key="col.name"
                :props="props">
                <div v-if="col.field==='role'">
                    {{ RoleEnum[col.value].translation }}
                </div>
                <div v-else>
                    {{ col.value }}
                </div>
                </q-td>
                <q-td auto-width>
                    <RecordAlternationDialog table="Пользователи" :id="props.row.id"/>
                    <q-btn icon="fa-solid fa-trash" flat round color="brand-danger"></q-btn>
                </q-td>
            </q-tr>
        </template>

        </q-table>
    </div>
</template>

<style scoped>



</style>