<script setup>
import axios from 'axios'
import NavigationColumn from './components/NavigationColumn.vue';
import { ref } from 'vue'
import TasksList from './components/TasksList.vue';
import TasksDropdown from './components/dropdowns/TasksDropdown.vue';

const token = localStorage.getItem('jwtToken');

axios.defaults.headers['Authorization'] = `Bearer ${token}`;

const fio = ref("");
const role = ref("");

async function getUser(){

    try {
        const response = await axios.get('/api/me');

        let fullName = response.data.profile.fio;
        let parsedName = fullName.split(' ')
        if (parsedName.length == 3){
            fio.value = `${parsedName[0]} ${parsedName[1][0]}. ${parsedName[2][0]}.`
        }
        else{
            fio.value = `${parsedName[0]} ${parsedName[1][0]}`
        }
        role.value = response.data.role;
        
    } catch (error) {
        console.error('Ошибка авторизации:', error.response?.data || error.message);
    }

}

getUser()

</script>


<template>
    <div class="h-full grid grid-cols-4 lg:grid-cols-5 2xl:grid-cols-6 gap-x-8 lg:gap-x-16 content-center">
        <header>
            <NavigationColumn
            :name="fio"
            :role="role"
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