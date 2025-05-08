<script setup>
import Event from './Event.vue'
import { ref } from 'vue';
import EventCreationDialog from './dialogs/EventCreationDialog.vue';

const events = ref([
  { name: "Название мероприятия", description: 'Краткое описание мероприятия', date: "21.11.2024", place: "Место проведения"},
  { name: "Название мероприятия", description: 'Краткое описание мероприятия', date: "22.11.2024-26.11.2024", place: "Место проведения"},
  { name: "Название мероприятия", description: 'Краткое описание мероприятия', date: "25.11.2024", place: "Место проведения"},
  { name: "Название мероприятия", description: 'Краткое описание мероприятия', date: "25.11.2024", place: "Место проведения"}
])

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
                :name="event.name"
                :description="event.description"
                :date="event.date"
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