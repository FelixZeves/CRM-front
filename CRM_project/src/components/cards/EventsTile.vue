<script setup>
import { onMounted, ref } from 'vue';
import { getEvents } from '@/components/Utils';

const events = ref([])

async function updateList() {
    let response = await getEvents(5)

    events.value = response.data.data
}

onMounted(() => {updateList()})
</script>

<template>
    <q-timeline color="brand-velvet"
    class="h-[40vh] overflow-y-auto !pe-2"
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
                <div class="!text-base !normal-case">
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