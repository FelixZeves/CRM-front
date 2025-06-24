<script setup>
import NavigationColumn from '@/components/menus/NavigationColumn.vue';
import { ref } from 'vue'
import TasksList from '@/components/layouts/TasksList.vue';
import TasksDropdown from '@/components/menus/TasksDropdown.vue';
import AddTask from '@/components/forms/AddTask.vue';

const visible = ref(false)
</script>


<template>
    <div class="h-full flex flex-row h-[100vh] w-[100vw] items-center px-8 gap-x-8">
        <header>
            <NavigationColumn
            section='Tasks'
            />
        </header>

        <main class="flex flex-grow">
            <div class="flex-grow">
                <TasksDropdown @show-dialog="visible = true"></TasksDropdown>
                <TasksList/>
                <AddTask v-model:visible="visible"></AddTask>
            </div>
        </main>
    </div>

</template>