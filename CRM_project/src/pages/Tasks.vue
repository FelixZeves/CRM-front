<script setup>
import NavigationColumn from '@/components/menus/NavigationColumn.vue'
import { ref, onMounted } from 'vue'
import TasksList from '@/components/layouts/TasksList.vue'
import TasksDropdown from '@/components/menus/TasksDropdown.vue'
import AddTask from '@/components/forms/AddTask.vue'
import { getTasks } from '@/components/Utils'
import { SessionStorage } from 'quasar'

const visible = ref(false)
const tasks = ref([])
const user = SessionStorage.getItem('user')

onMounted(async () => {await updateList()})

const filterParams = ref({})

async function updateList(params = {}) {
    filterParams.value = params;
    tasks.value = await getTasks(null, false, filterParams.value)

    tasks.value.push({title: 'Задача multiple (Групповая задача)',
                    status: 0,
                    type: 0,
                    multiple:  true,
                    approved: [
                        {fio: "Иванов И.И.", status: 2, update_at: "20.08.2025", files: [1, 2]},
                        {fio: "Петров П.П.", status: 2, update_at: "20.08.2025", files: [1, 2, 3]},
                        {fio: "Исполнительный П.В.", status: 2, update_at: "20.08.2025", files: [1]},
                        {fio: "Согласный В.М.", status: 2, update_at: "20.08.2025", files: [1, 2, 3, 4, 5]},
                        {fio: "Проверенный Н.И.", status: 2, update_at: "20.08.2025", files: []},
                    ],
                    rejected: [],
                    progress: [
                        {fio: "Некоторая Н.Л.", status: 0, update_at: "16.08.2025", files: []},
                        {fio: "Некоторая П.Л.", status: 0, update_at: "16.08.2025", files: []},

                    ],
                    all: 7,
                    description: 'Lorem ipsum dolor, sit amet consectetur adipisicing elit. Iste cumque ducimus soluta porro, non mollitia?',
                    deadline: "21.08.2025",
                    is_archive: false,
                    history: [],
                    active: [
                        {id: "712bae32-d2f2-402a-80a1-c9550c084a24",
                        status: 2,
                        type: 3,
                        update_at: "16.08.2025",
                        comment: "Комментарий",
                        user: {fio: "Зубенко Михаил Петрович", id: "5336a813-00a5-4f34-8cc2-980cab5b36ec", init_name: "Зубенко М.П."}
                        }
                    ]})
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