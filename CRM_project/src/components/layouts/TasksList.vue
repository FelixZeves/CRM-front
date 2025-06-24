<script setup>
import axios from 'axios'
import { onMounted, ref } from 'vue'
import TaskOnList from '@/components/cards/TaskOnList.vue';
import { StatusEnum_ } from '../Enums.vue';

const tasks = ref([])
const user = ref()

onMounted(async () => {user.value = (await axios.get('/api/user/me')).data;})
async function get() {
    tasks.value = (await axios.get('/api/user/task')).data.data
    for (const task of tasks.value) {
        const currentStep = task.steps.find(step => step.status !== StatusEnum_.APPROVED)

        if (currentStep)
            task.status = currentStep.status
        else
            task.status = StatusEnum_.APPROVED
    }
}

get()
defineExpose({get})
</script>

<template>
    <q-list class="flex-grow !max-w-[90%] !min-w-[90%] min-h-[500px] lg:max-h-[650px] overflow-y-auto !justify-self-center">
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