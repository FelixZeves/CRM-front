<script setup>
import NavigationColumn from './components/NavigationColumn.vue';
import { ref } from 'vue'
import EventsDropdown from './components/dropdowns/EventsDropdown.vue';
import DocumentsList from './components/DocumentsList.vue';
import DocumentsDropdownNSearch from './components/dropdowns/DocumentsDropdownNSearch.vue';

</script>


<template>
    <div class="h-full grid grid-cols-4 lg:grid-cols-5 2xl:grid-cols-6 gap-x-8 lg:gap-x-16 content-center">
        <header>
            <NavigationColumn
            section='Documents'
            />
        </header>

        <main class="col-span-3 lg:col-span-4 2xl:col-span-5">
            <div>
                <DocumentsDropdownNSearch></DocumentsDropdownNSearch>
                <DocumentsList/>
            </div>
        </main>
    </div>


</template>