<script setup>
import { getEvents } from './Utils.js'
import { ref } from 'vue'
import EventOnList from './EventOnList.vue'

const events = ref([])

let response= await getEvents()

events.value = response.data.data
</script>

<template>
    <div class="max-h-[500px] lg:max-h-[650px] overflow-y-auto">
        <EventOnList
            v-if="events.length > 0" 
            v-for="event in events"
            :name="event.title"
            :description="event.description"
            :deadline="event.to"
            :creator="event.creator"
            :place="event.place"
            :id="event.id">
        </EventOnList>
        <div v-else class="justify-self-center text-2xl mt-12">
            Мероприятий нет
        </div>
   
    </div>

</template>