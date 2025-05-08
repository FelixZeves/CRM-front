<script setup>
import axios from 'axios'
import { ref } from 'vue'
import EventOnList from './EventOnList.vue';

const events = ref([ {name:"Олимпиада “Международный Математический Кенгуру”", description: "23.11.2024 будет проводиться международная математическая олимиада “Кенгуру”.", deadline: "23.11.2024", creator: "Иванова Оксана Ивановна", place: '204, 203, 208'},
                    {name:"test", description: "testing test", deadline: "18.09.2002", creator: "someone", place: '204, 203, 208'},
                    {name:"test", description: "testing test", deadline: "18.09.2002", creator: "someone", place: '204, 203, 208'},
                    {name:"test", description: "testing test", deadline: "18.09.2002", creator: "someone", place: '204, 203, 208'}
])
</script>

<template>
    <div class="max-h-[500px] lg:max-h-[650px] overflow-y-auto">
        <EventOnList 
        v-for="event in events"
        :name="event.name"
        :description="event.description"
        :deadline="event.deadline"
        :creator="event.creator"
        :place="event.place">
    </EventOnList>

        
    </div>

</template>