<script setup>
import axios from 'axios'
import NavigationColumn from './components/NavigationColumn.vue';
import { ref } from 'vue'
import TasksList from './components/TasksList.vue';
import TasksDropdown from './components/dropdowns/TasksDropdown.vue';

const token = localStorage.getItem('jwtToken');

axios.defaults.headers['Authorization'] = `Bearer ${token}`;

</script>


<template>
    <div class="h-full grid grid-cols-4 lg:grid-cols-5 2xl:grid-cols-6 gap-x-8 lg:gap-x-16 content-center">
        <header>
            <NavigationColumn
            section='Tasks'
            />
        </header>

        <main class="col-span-3 lg:col-span-4 2xl:col-span-5">
            <div>
                <TasksDropdown></TasksDropdown>
                <TasksList/>
            </div>
        </main>
    </div>

</template>