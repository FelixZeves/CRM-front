<script setup>
import { onMounted, ref } from 'vue';
import { getEvents } from '@/components/Utils';
import EventCreationDialog from '@/components/forms/AddEvent.vue';
import axios from 'axios';

const events = ref([])
const visible = ref(false)

async function updateList() {
    events.value = (await axios.get('/api/user/event?limit=7')).data.data
}

onMounted(() => {updateList()})
</script>

<template>
    <q-timeline color="brand-velvet"
    class=" h-[40vh] overflow-y-auto !pe-2"
    side="left"
    >
        <q-timeline-entry
            v-for="event in events"
        >
            <template #title>
                <div class="brand-title">
                    {{ event.title }}
                </div>
            </template>

            <template #subtitle>
                <div>
                    {{ event.at !== event.to ? `${event.at} - ${event.to}` : event.to }} : {{ event.creator.init_name }}
                </div>
            </template>

            <div class="brand-description text-ellipsis line-clamp-2">
                {{ event.description }}
            </div>
            <div class="brand-text">
                {{ event.place }}
            </div>
        </q-timeline-entry>
    </q-timeline>
</template>

<style scoped>

#eventsTile{
    @apply bg-white rounded-[15pt] pb-4
}

#eventsHead{
    align-items: center;
}

#eventsTile button{
    justify-self: right;
    width: max-content;
}

.event{
    border-radius: 10pt;
}

.event:hover{
    background-color: var(--vt-c-white-mute);
    transition: 0.5s;
}

.event .mainInfo{
    align-self: center;
}

.event .date{
    text-align: center;
    align-self: center;
}

.event .place{
    text-align: center;
    align-self: center;
}
</style>