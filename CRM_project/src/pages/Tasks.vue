<script setup>
import NavigationColumn from '@/components/menus/NavigationColumn.vue'
import { ref, onMounted } from 'vue'
import TasksList from '@/components/layouts/TasksList.vue'
import TasksDropdown from '@/components/menus/TasksDropdown.vue'
import AddTask from '@/components/forms/AddTask.vue'
import { getTasks } from '@/components/Utils'
import { SessionStorage } from 'quasar'
import TaskSkeleton from '@/components/skeletons/TaskSkeleton.vue'

const visible = ref(false)
const tasks = ref([])
const user = SessionStorage.getItem('user')

const filterParams = ref({})
const loading = ref(true)

async function updateList(params = {}) {
    loading.value = true
    filterParams.value = params
    tasks.value = await getTasks(null, false, filterParams.value)
    loading.value = false
}

onMounted(async () => {await updateList()})
</script>


<template>
    <div class="flex flex-row h-[100vh] w-[100vw] items-center px-8 gap-x-8 !flex-nowrap">
        <header class="min-w-[225px] w-[225px]">
            <NavigationColumn
            section='Tasks'
            />
        </header>

        <main class="flex flex-grow h-[80vh]">
            <div class="flex-grow">
                <TasksDropdown @show-dialog="visible = true" @apply-filters="updateList"></TasksDropdown>
                <q-list v-if="loading" class="overflow-y-auto !justify-self-center !w-full">
                    <q-item v-for="n in 4">
                        <TaskSkeleton/>
                    </q-item>
                </q-list>
                <TasksList v-else @update-list="updateList" :tasks="tasks" :user="user"/>
                <AddTask v-model:visible="visible" @update-list="updateList" :me="user"></AddTask>
            </div>
        </main>
    </div>

</template>