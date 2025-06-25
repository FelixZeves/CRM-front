<script setup>
import axios from 'axios'
import { ref } from 'vue'
import DocumentOnList from '@/components/cards/DocumentOnList.vue';

const docs = ref([ {name:"Приказ 3432.15 “О привлечении учеников к патриотическим мероприятиям от 01.01.2023", type: 'Приказ', spec:'Образование', date: '12.05.2025', file: "23.11.2024 будет проводиться международная математическая олимиада “Кенгуру”."},
                    {name:"Приказ 1111.11 “О необходимости привлечения преподавателей школы для создания технического задания к CRM системе от 16.10.2024”", type: 'Нормативный документ', spec:'Образование', date: '12.05.2025', file: "testing test"},
                    {name:"Приказ 3432.15 “О привлечении учеников к патриотическим мероприятиям от 01.01.2023”", type: 'Приказ', spec:'Образование', date: '12.05.2025', file: "testing test"},
                    {name:"Приказ 1111.11 “О необходимости привлечения преподавателей школы для создания технического задания к CRM системе от 16.10.2024”", type: 'Приказ', spec:'Образование', date: '12.05.2025', file: "testing test"}
])
</script>

<template>
    <q-list class="!max-w-[90%] min-h-[500px] lg:max-h-[650px] overflow-y-auto !justify-self-center">
        <DocumentOnList 
        v-for="doc in docs"
        :name="doc.name"
        :type="doc.type"
        :spec="doc.spec"
        :date="doc.date"
        :file="doc.file">
        </DocumentOnList>
    </q-list>

</template>