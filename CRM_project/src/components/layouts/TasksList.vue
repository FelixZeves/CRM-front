<script setup>
import TaskOnList from '@/components/cards/TaskOnList.vue';
const props = defineProps(['tasks', 'user'])

</script>

<template>
    <q-list class="h-[72vh] overflow-y-auto !justify-self-center !w-full">
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