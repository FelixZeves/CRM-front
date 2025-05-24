<script setup>
import { onMounted, ref } from 'vue'
import { RoleEnum, TableEnum } from './Enums.vue'
import axios from 'axios';
import RecordCreationDialog from './dialogs/RecordCreationDialog.vue';
import RecordAlternationDialog from './dialogs/RecordAlternationDialog.vue';

let records = ref([])

async function fetchTableData(params){
  const {
    getUrl,
    dataMapper,
    limit = 3
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

onMounted(async () => {
  for (const [key, table] of Object.entries(TableEnum)) {
    records.value[table.title] = await fetchTableData({
      getUrl: table.getUrl,
      dataMapper: table.dataMapper,
    });
  }
})

</script>

<template>
    <div class="overflow-y-auto h-[80vh] pe-4">
        <q-table
        v-for="table in TableEnum"
        title-class="text-bold"
        :columns="table.cols"
        :rows="records[table.title] || []"
        row-key="name"
        hide-pagination
        no-data-label="Записей нет"
        class="px-2 pb-2 mb-8 min-w-[45vw] max-w-[60vw]">

        <template v-slot:top="props">
            <div class="q-table__title">
                <q-btn flat class="!rounded-[10px]" :to="{name: 'Table', params: { table : table.name}}">
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
                v-for="col in props.cols.slice(0, 3)"
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
                v-for="col in props.cols.slice(0, 3)"
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
                    <RecordAlternationDialog :table="table.name" :id="props.row.id"/>
                    <q-btn icon="fa-solid fa-trash" flat round color="brand-danger" @click="table.deletingFunction(props.row.id)"></q-btn>
                </q-td>
            </q-tr>
        </template>

        </q-table>
    </div>
</template>

<style scoped>



</style>