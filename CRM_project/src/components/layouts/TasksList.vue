<script setup>
import TaskOnList from '@/components/cards/TaskOnList.vue';

const props = defineProps(['tasks', 'user'])
const emit = defineEmits(['update-list'])

</script>

<template>
    <q-list class="h-[72vh] overflow-y-auto !justify-self-center !w-full">
        <q-item v-for="task in tasks">
            <TaskOnList
                @update-list="emit('update-list')"
                :key="task.id" 
                :body="task"
                :user="user"
            >
            </TaskOnList>
        </q-item>
    </q-list>


</template>