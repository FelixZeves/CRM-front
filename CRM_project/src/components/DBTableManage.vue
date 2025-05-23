<script setup>
import { onMounted, ref } from 'vue'
import axios from 'axios';
import { RoleEnum, TableEnum } from './Enums.vue'
import RecordAlternationDialog from './dialogs/RecordAlternationDialog.vue';
import RecordCreationDialog from './dialogs/RecordCreationDialog.vue';

const props = defineProps(['table'])

const token = localStorage.getItem('jwtToken');

axios.defaults.headers['Authorization'] = `Bearer ${token}`;

let records = ref([])

async function fetchTableData(params){
  const {
    getUrl,
    dataMapper,
    limit = 25
  } = params;

  try {
    const response = await axios.get(getUrl);
    
    const details = response.data.data.slice(0, limit)
    
    return Array.isArray(details) ? details.map(dataMapper) : [];
  } catch (error) {
    console.error('Ошибка при загрузке данных таблицы:', error.response?.data || error.message);
    return [];
  }
}

const table = TableEnum[props.table]

const cols = table.cols

onMounted(async () => {
    records.value = await fetchTableData({
      getUrl: table.getUrl,
      dataMapper: table.dataMapper,
    });
})

</script>

<template>
    <q-table
        title-class="text-bold"
        :columns="cols"
        :rows="records || []"
        row-key="name"
        hide-pagination
        virtual-scroll
        :rows-per-page-options="[0]"
        :pagination="{rowsPerPage : 0}"
        no-data-label="Записей нет"
        class="px-2 pb-2 mb-8 mt-24 h-[80vh] !max-w-screen">

        <template v-slot:top="props">
            <div class="q-table__title">
                <q-btn flat class="!rounded-[10px]">
                    <q-icon :name="table.icon" class="pe-3" size="sm"></q-icon>
                    <div class="font-bold normal-case text-xl">{{ table.title }}</div>
                </q-btn>
            </div>
            <q-space/>
            <RecordCreationDialog :table="table.name"/>
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
                :props="props"
                class="max-w-[20vw] truncate">
                <div v-if="col.field==='role'">
                    {{ RoleEnum[col.value].translation }}
                </div>
                <div v-else>
                    {{ col.value }}
                </div>
                </q-td>
                <q-td auto-width>
                    <RecordAlternationDialog :table="table.name" :id="props.row.id"/>
                    <q-btn icon="fa-solid fa-trash" flat round color="brand-danger"></q-btn>
                </q-td>
            </q-tr>
        </template>

        </q-table>

</template>

<style>

</style>