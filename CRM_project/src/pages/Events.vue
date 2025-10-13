<script setup>
import NavigationColumn from '@/components/menus/NavigationColumn.vue';
import EventsList from '@/components/layouts/EventsList.vue';
import AddEvent from '@/components/forms/AddEvent.vue';
import { ref } from 'vue'
import EventsDropdown from '@/components/menus/EventsDropdown.vue';
import { getEvents } from  '@/components/Utils.js';
import EventSkeleton from '@/components/skeletons/EventSkeleton.vue';

const events = ref([])
const visible = ref(false)

const filterParams = ref({})
const loading = ref(true)

async function updateList(params = {}) {
    loading.value = true
    filterParams.value = params;
    await getEvents(null, filterParams.value).then(response => {
        events.value = response.data.data
    })
    loading.value = false
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
                <div v-if="loading" class="h-[72vh] w-full overflow-y-auto justify-self-center">
                    <EventSkeleton v-for="n in 6"/>
                </div>
                <EventsList v-else :events="events" @update-list="updateList"/>
                <AddEvent v-model:visible='visible' @update-list="updateList"/>
            </div>
        </main>
    </div>
</template>