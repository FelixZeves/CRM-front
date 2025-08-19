<script setup>
import NavigationColumn from '@/components/menus/NavigationColumn.vue'
import { ref, onMounted } from 'vue'
import TasksList from '@/components/layouts/TasksList.vue'
import { getTasks } from '@/components/Utils'
import ArchiveDropdown from '@/components/menus/ArchiveDropdown.vue'
import { SessionStorage } from 'quasar'

const visible = ref(false)
const tasks = ref([])
const user = SessionStorage.getItem('user')

onMounted(async () => {await updateList()})

const filterParams = ref({})

async function updateList(params = {}) {
    filterParams.value = params;
    tasks.value = await getTasks(null, true, filterParams.value)
}
</script>


<template>
    <div class="flex flex-row h-[100vh] w-[100vw] items-center px-8 gap-x-8 !flex-nowrap">
        <header class="min-w-[225px]">
            <NavigationColumn
            section='Archive'
            />
        </header>

        <main class="flex flex-grow h-[80vh]">
            <div class="flex-grow">
                <ArchiveDropdown @show-dialog="visible = true" @apply-filters="updateList"></ArchiveDropdown>
                <TasksList @update-list="updateList" :tasks="tasks" :user="user"/>
            </div>
        </main>
    </div>

</template>