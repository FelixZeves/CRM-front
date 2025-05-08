<script setup>
import axios from 'axios'
import { ref } from 'vue'
import EventOnList from './EventOnList.vue';
import DocumentOnList from './DocumentOnList.vue';

const events = ref([ {name:"Приказ 3432.15 “О привлечении учеников к патриотическим мероприятиям от 01.01.2023", file: "23.11.2024 будет проводиться международная математическая олимиада “Кенгуру”."},
                    {name:"Приказ 1111.11 “О необходимости привлечения преподавателей школы для создания технического задания к CRM системе от 16.10.2024”", file: "testing test"},
                    {name:"Приказ 3432.15 “О привлечении учеников к патриотическим мероприятиям от 01.01.2023”", file: "testing test"},
                    {name:"Приказ 1111.11 “О необходимости привлечения преподавателей школы для создания технического задания к CRM системе от 16.10.2024”", file: "testing test"}
])
</script>

<template>
    <div class="max-h-[500px] lg:max-h-[650px] overflow-y-auto">
        <DocumentOnList 
        v-for="event in events"
        :name="event.name"
        :description="event.description">
        </DocumentOnList>
    </div>

</template>