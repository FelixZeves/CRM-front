<script setup>
import NavigationColumn from '@/components/menus/NavigationColumn.vue';
import axios from 'axios';
import { ref, onMounted } from 'vue'
import TasksList from '@/components/layouts/TasksList.vue';
import TasksDropdown from '@/components/menus/TasksDropdown.vue';
import AddTask from '@/components/forms/AddTask.vue';
import { getTasks } from '@/components/Utils';

const visible = ref(false)
const tasks = ref([])
const user = ref()

onMounted(async () => {user.value = (await axios.get('/api/user/me')).data; await updateList()})

const filterParams = ref({})

async function updateList(params = {}) {
    filterParams.value = params;
    tasks.value = await getTasks(null, filterParams.value)
}
</script>


<template>
    <div class="flex flex-row h-[100vh] w-[100vw] items-center px-8 gap-x-8 !flex-nowrap">
        <header class="min-w-[225px]">
            <NavigationColumn
            section='Tasks'
            />
        </header>

        <main class="flex flex-grow h-[80vh]">
            <div class="flex-grow">
                <TasksDropdown @show-dialog="visible = true" @apply-filters="updateList"></TasksDropdown>
                <TasksList @update-list="updateList" :tasks="tasks" :user="user"/>
                <AddTask v-model:visible="visible" @update-list="updateList" :me="user"></AddTask>
            </div>
        </main>
    </div>

</template>