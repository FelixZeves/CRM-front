<script setup>
import CRMCalendar from './components/CRMCalendar.vue';
import EventsTile from './components/EventsTile.vue';
import NavigationColumn from './components/NavigationColumn.vue';
import TasksTile from './components/TasksTile.vue';
import axios from 'axios'
import { ref } from 'vue'

const token = localStorage.getItem('jwtToken');

axios.defaults.headers['Authorization'] = `Bearer ${token}`;


</script>

<template>
    <div class="h-full grid grid-cols-4 lg:grid-cols-5 2xl:grid-cols-6 gap-x-8 lg:gap-x-16 content-center">
        <header>
            <NavigationColumn
            section='Office'
            />
        </header>

        <main class="col-span-3  lg:col-span-4 2xl:col-span-5 grid grid-rows-4 grid-cols-5 gap-x-5 gap-y-2 lg:gap-y-5 lg:mt-1 2xl:mt-2">
            <div class="row-span-2 col-span-3 grid grid-row-subgrid">
                <TasksTile class="row-start-2"/>
            </div>
            <div class="row-span-2 col-span-2 flex justify-center self-center">
                <CRMCalendar class="font-jetbrains-mono!"/>
            </div>
            <EventsTile class="row-span-2 col-span-5"/>
        </main>
    </div>
</template>