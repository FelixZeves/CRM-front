<script setup>
import TaskOnTile from './TaskOnTile.vue';
import { ref } from 'vue';

const tasks = ref([
  { name: "Название задачи", description: 'Краткое описание задачи', date: "18.11.2024", status: "danger"},
  { name: "Название задачи", description: 'Краткое описание задачи', date: "20.11.2024", status: "danger"},
  { name: "Название задачи", description: 'Краткое описание задачи', date: "24.11.2024", status: "wait"},
  { name: "Название задачи", description: 'Краткое описание задачи', status: "complete"},
  { name: "Название задачи", description: 'Краткое описание задачи', status: "complete"}
])

</script>

<template>
    <div id="tasksTile" class="shadow-2xl">
        <h3 class="text-lg lg:text-2xl 2xl:text-3xl font-bold">Задачи</h3>
        <div class="grid grid-rows-5 gap-y-0.5">
            <TaskOnTile 
                v-for="task in tasks"
                :name="task.name"
                :description="task.description"
                :date="task.date"
                :status="task.status"
            />
        </div>
    </div>
</template>

<style>

#tasksTile{
    height: max-content;
    background-color: white;
    border-radius: 20pt;
    padding-bottom: 4%;
}

#tasksTile h3{
    padding-left: 5%;
    padding-top: 2%;
    padding-bottom: 0%;
}

</style>