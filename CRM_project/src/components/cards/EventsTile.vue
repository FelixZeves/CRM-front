<script setup>
import { onMounted, ref } from 'vue';
import { getEvents } from '@/components/Utils';
import EventCreationDialog from '@/components/forms/AddEvent.vue';
import axios from 'axios';

const events = ref([])
const visible = ref(false)

async function updateList() {
    events.value = (await axios.get('/api/user/event?limit=3')).data.data
}

onMounted(() => {updateList()})
</script>

<template>
    <!-- <div id="eventsTile" class="shadow-2xl">
        <div id="eventsHead" class="flex flex-row justify-between px-6 py-2">
            <h3 class="text-lg lg:text-2xl 2xl:text-3xl font-bold ps-2">Ближайшие мероприятия</h3>
            <div class="w-1/4 flex justify-center me-4">
                <q-btn style="background: var(--crm-c-light-yellow); text-transform:none;  border-radius: 5pt;" size="md" unelevated rounded text-color="black" label="Добавить мероприятие" @click="visible = true"/>
                <EventCreationDialog v-model:visible='visible' @update-list="updateList"/>
            </div>
        </div>
        <div class="grid grid-rows-4 gap-y-2">
            <div v-for="event in events" class="w-[97%] justify-self-center px-2 event grid grid-cols-7 gap-x-2 pb-1">
                <div class="items-start col-span-3 ps-2">
                    <p class="text-base lg:text-lg  font-medium mb-0">{{ event.title }}</p>
                    <p class="text-sm lg:text-base mb-0">{{ event.description }}</p>
                </div>
                <p class="date text-sm lg:text-base col-span-2 mb-0">{{ event.at != event.to ? `${event.at} - ${event.to}` : event.to }}</p>
                <p class="place text-sm lg:text-base col-span-2 mb-0">{{ event.place }}</p>
            </div>
        </div>
    </div> -->
    <q-timeline color="brand-velvet">
        <q-timeline-entry heading>
            Мероприятия
        </q-timeline-entry>

        <q-timeline-entry
            v-for="event in events"
            :title="event.title"
            :subtitle="`${event.at != event.to ? `${event.at} - ${event.to}` : event.to} : ${event.creator.init_name}`"
        >
            <div class="text-xl text-stone-700]">
                {{ event.description }}
            </div>
            <div class="text-lg text-stone-600">
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