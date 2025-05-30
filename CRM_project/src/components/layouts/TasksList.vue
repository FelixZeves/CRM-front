<script setup>
import axios from 'axios'
import { ref } from 'vue'
import TaskOnList from '@/components/cards/TaskOnList.vue';

const tasks = ref([ {name:"Заполнить отчёт о факультативах учеников класса 2.2", description: "Согласно приказа 123.4, необходимо провести опрос учащихся и заполнить таблицу в предоставленном шаблоне. Шаблон прикреплён", deadline: "18.11.2024", creator: "Иванова Оксана Ивановна", status: "danger", type: "execute", documents: "fileName.pdf"},
                    {name:"test", description: "testing test", deadline: "18.09.2002", creator: "someone", status: "complete", type: "accept", documents: "fileName.pdf"},
                    {name:"test", description: "testing test", deadline: "18.09.2002", creator: "someone", status: "wait", type: "agree"},
                    {name:"test", description: "testing test", deadline: "18.09.2002", creator: "someone", status: "wait", type: "agree"}
])
</script>

<template>
    <div class="max-h-[500px] lg:max-h-[650px] overflow-y-auto">
        <TaskOnList 
        v-for="task in tasks"
        :name="task.name"
        :description="task.description"
        :deadline="task.deadline"
        :creator="task.creator"
        :status="task.status"
        :type="task.type"
        :documents="task.documents">
        
        </TaskOnList>
        
    </div>

</template>