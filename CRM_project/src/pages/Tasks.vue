<script setup>
import NavigationColumn from '@/components/menus/NavigationColumn.vue';
import axios from 'axios';
import { ref, onMounted } from 'vue'
import TasksList from '@/components/layouts/TasksList.vue';
import TasksDropdown from '@/components/menus/TasksDropdown.vue';
import AddTask from '@/components/forms/AddTask.vue';
import { StatusEnum_ } from '@/components/Enums.vue';

const visible = ref(false)
const tasks = ref([])
const user = ref()

onMounted(async () => {user.value = (await axios.get('/api/user/me')).data; await updateList()})

async function updateList() {
    tasks.value = (await axios.get('/api/user/task')).data.data
    for (const task of tasks.value) {
        const currentStep = task.steps.find(step => step.status !== StatusEnum_.APPROVED)

        if (currentStep)
            task.status = currentStep.status
        else
            task.status = StatusEnum_.APPROVED
    }
}
</script>


<template>
    <div class="flex flex-row h-[100vh] w-[100vw] items-center px-8 gap-x-8">
        <header>
            <NavigationColumn
            section='Tasks'
            />
        </header>

        <main class="flex flex-grow max-w-[80%]">
            <div>
                <TasksDropdown @show-dialog="visible = true"></TasksDropdown>
                <TasksList :tasks="tasks" :user="user"/>
                <AddTask v-model:visible="visible" @update-list="updateList"></AddTask>
            </div>
        </main>
    </div>

</template>