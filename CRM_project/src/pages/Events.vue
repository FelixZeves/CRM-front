<script setup>
import NavigationColumn from '@/components/menus/NavigationColumn.vue';
import EventsList from '@/components/layouts/EventsList.vue';
import AddEvent from '@/components/forms/AddEvent.vue';
import { ref } from 'vue'
import EventsDropdown from '@/components/menus/EventsDropdown.vue';
import { getEvents } from  '@/components/Utils.js';

const events = ref([])
const visible = ref(false)

const filterParams = ref({})

async function updateList(params = {}) {
    filterParams.value = params;
    console.log(filterParams.value)
    await getEvents(null, filterParams.value).then(response => {
        events.value = response.data.data
    })
}

updateList()
</script>


<template>
    <div class="h-full flex flex-row h-[100vh] w-[100vw] items-center px-8 gap-x-8 !flex-nowrap">
        <header class="min-w-[225px]">
            <NavigationColumn
            section='Events'
            />
        </header>

        <main class="flex flex-grow h-[80vh]">
            <div class="flex-grow">
                <EventsDropdown @show-dialog="visible = true" @apply-filters="updateList"></EventsDropdown>
                <EventsList :events="events" @update-list="updateList"/>
                <AddEvent v-model:visible='visible' @update-list="updateList"/>
            </div>
        </main>
    </div>
</template>