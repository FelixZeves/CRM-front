<script setup>
import EventOnList from '@/components/cards/EventOnList.vue'

const props = defineProps(['events'])
const emit = defineEmits(['update-list']);

</script>

<template>
    <div class="flex-grow !max-w-[90%] !min-w-[90%] min-h-[500px] lg:max-h-[650px] overflow-y-auto">
        <EventOnList
            @delete-event="$emit('update-list')"
            v-if="events.length > 0" 
            v-for="event in events"
            :name="event.title"
            :description="event.description"
            :deadline="event.at != event.to ? `${event.at} - ${event.to}` : event.to"
            :creator="event.id"
            :place="event.place"
            :id="event.id">
        </EventOnList>
        <div v-else class="justify-self-center text-2xl mt-12">
            Мероприятий нет
        </div>
   
    </div>

</template>