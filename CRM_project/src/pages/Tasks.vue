<script setup>
import NavigationColumn from '@/components/menus/NavigationColumn.vue';
import { ref } from 'vue'
import TasksList from '@/components/layouts/TasksList.vue';
import TasksDropdown from '@/components/menus/TasksDropdown.vue';
import AddTask from '@/components/forms/AddTask.vue';

const visible = ref(false)
</script>


<template>
    <div class="h-full grid grid-cols-4 lg:grid-cols-5 2xl:grid-cols-6 gap-x-8 lg:gap-x-16 items-center">
        <header>
            <NavigationColumn
            section='Tasks'
            />
        </header>

        <main class="col-span-5 w-[81vw]">
            <div>
                <TasksDropdown @show-dialog="visible = true"></TasksDropdown>
                <TasksList/>
                <AddTask v-model:visible="visible"></AddTask>
            </div>
        </main>
    </div>

</template>