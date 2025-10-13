<script setup>
import NavigationColumn from '@/components/menus/NavigationColumn.vue'
import { ref, onMounted } from 'vue'
import TasksList from '@/components/layouts/TasksList.vue'
import { getTasks } from '@/components/Utils'
import ArchiveDropdown from '@/components/menus/ArchiveDropdown.vue'
import { SessionStorage } from 'quasar'
import TaskSkeleton from '@/components/skeletons/TaskSkeleton.vue'

const visible = ref(false)
const tasks = ref([])
const user = SessionStorage.getItem('user')

const loading = ref(true)

onMounted(async () => {await updateList()})

const filterParams = ref({})

async function updateList(params = {}) {
    loading.value = true
    filterParams.value = params;
    tasks.value = await getTasks(null, true, filterParams.value)
    loading.value = false
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
                <q-list v-if="loading" class="overflow-y-auto !justify-self-center !w-full">
                    <q-item v-for="n in 4">
                        <TaskSkeleton/>
                    </q-item>
                </q-list>
                <TasksList v-else @update-list="updateList" :tasks="tasks" :user="user"/>
            </div>
        </main>
    </div>

</template>