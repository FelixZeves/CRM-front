<script setup>
import TaskOnList from '@/components/cards/TaskOnList.vue';
const props = defineProps(['tasks', 'user'])

</script>

<template>
    <q-list class="min-h-[500px] lg:max-h-[650px] overflow-y-auto !justify-self-center">
        <q-item v-for="task in tasks">
            <TaskOnList
                :key="task.id" 
                :body="task"
                :user="user"
            >
            </TaskOnList>
        </q-item>
    </q-list>


</template>