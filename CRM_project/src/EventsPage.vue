<script setup>
import axios from 'axios'
import NavigationColumn from './components/NavigationColumn.vue';
import EventsList from './components/EventsList.vue';
import { ref } from 'vue'
import EventsDropdown from './components/dropdowns/EventsDropdown.vue';

const token = localStorage.getItem('jwtToken');

axios.defaults.headers['Authorization'] = `Bearer ${token}`;

</script>


<template>
    <div class="h-full grid grid-cols-4 lg:grid-cols-5 2xl:grid-cols-6 gap-x-8 lg:gap-x-16 content-center">
        <header>
            <NavigationColumn
            section='Events'
            />
        </header>

        <main class="col-span-3 lg:col-span-4 2xl:col-span-5">
            <div>
                <EventsDropdown></EventsDropdown>
                <EventsList/>
            </div>
        </main>
    </div>


</template>