<script setup>
import CRMCalendar from '@/components/CRMCalendar.vue';
import EventsTile from '@/components/cards/EventsTile.vue';
import NavigationColumn from '@/components/menus/NavigationColumn.vue';
import TasksTile from '@/components/cards/TasksTile.vue';
import { checkPass } from '@/components/Notifies';
import { onMounted, ref } from 'vue';
import TaskTileSkeleton from '@/components/skeletons/TaskTileSkeleton.vue';
import { getEvents, getTasks } from '@/components/Utils';
import EventTLESkeleton from '@/components/skeletons/EventTLESkeleton.vue';

const tasks = ref([])
const tasksLoading = ref(true)

const events =  ref([])
const eventsLoading = ref(true)

async function getTaskTiles(){
    tasksLoading.value = true
    tasks.value = (await getTasks()).slice(0,6)
    tasksLoading.value = false
}

async function getEventsTiles(){
    eventsLoading.value = true
    events.value = (await getEvents(5)).data.data
    eventsLoading.value = false
}

onMounted(async () => {
    checkPass()
    await getTaskTiles()
    await getEventsTiles()
})
</script>

<template>
    <div class="flex flex-row h-[100vh] w-[100vw] items-center px-8 gap-x-4 !flex-nowrap">
        <header class="min-w-[225px]">
            <NavigationColumn section='Office' />
        </header>
        
        <main class="flex flex-row flex-grow overflow-y-hidden gap-x-4 justify-evenly h-[80vh]">
            <div class="flex flex-col gap-y-8 w-[60%] flex-shrink-0">
                <q-list v-if="tasksLoading" class="!max-h-[80vh] overflow-y-auto flex-grow px-2">
                    <TaskTileSkeleton v-for="n in 6"></TaskTileSkeleton>
                </q-list>
                <q-list v-else class="!max-h-[80vh] overflow-y-auto flex-grow px-2">
                    <TasksTile v-for="task in tasks" :body="task"/>
                </q-list>
            </div>

            <div class="flex flex-col gap-y-8 flex-grow w-[35%] flex-shrink-0">
                <CRMCalendar/>
                <q-timeline color="brand-velvet"
                class="h-[40vh] overflow-y-auto !pe-2"
                side="left"
                >
                    <EventTLESkeleton v-if="eventsLoading" v-for="n in 5"/>
                    <EventsTile v-else v-for="event in events" :body="event"/>
                </q-timeline>
            </div>
        </main>
    </div>
</template>