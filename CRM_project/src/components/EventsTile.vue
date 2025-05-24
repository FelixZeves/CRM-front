<script setup>
import Event from './Event.vue'
import { ref } from 'vue';
import EventCreationDialog from './dialogs/EventCreationDialog.vue';
import { getEvents } from './Utils';

const events = ref([])

let response= await getEvents()

events.value = response.data.data.slice(0, 3)
</script>

<template>
    <div id="eventsTile" class="shadow-2xl">
        <div id="eventsHead" class="flex flex-row justify-between px-6 py-2">
            <h3 class="text-lg lg:text-2xl 2xl:text-3xl font-bold ps-2">Ближайшие мероприятия</h3>
            <div class="w-1/4 flex justify-center me-4"><EventCreationDialog/></div>
        </div>
        <div class="grid grid-rows-4 gap-y-2">
            <Event 
                v-for="event in events"
                :name="event.title"
                :description="event.description"
                :date="event.to"
                :place="event.place"
            />
        </div>
    </div>
</template>

<style>

#eventsTile{
    height: max-content;
    background-color: white;
    border-radius: 20pt;
    padding-bottom: 2%;
}

#eventsHead{
    align-items: center;
}

#eventsTile button{
    justify-self: right;
    width: max-content;
}

</style>