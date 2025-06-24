<script setup>
import NavigationColumn from '@/components/menus/NavigationColumn.vue';
import EventsList from '@/components/layouts/EventsList.vue';
import EventCreationDialog from '@/components/forms/AddEvent.vue';
import { ref } from 'vue'
import EventsDropdown from '@/components/menus/EventsDropdown.vue';
import { getEvents } from  '@/components/Utils.js';

const events = ref([])
const visible = ref(false)

async function updateList() {
    await getEvents().then(response => {
        events.value = response.data.data
    })
}

updateList()
</script>


<template>
    <div class="h-full flex flex-row h-[100vh] w-[100vw] items-center px-8 gap-x-8">
        <header>
            <NavigationColumn
            section='Events'
            />
        </header>

        <main class="flex flex-grow">
            <div class="flex-grow">
                <EventsDropdown @show-dialog="visible = true"></EventsDropdown>
                <EventCreationDialog v-model:visible='visible' @update-list="updateList"/>
                <Suspense>
                    <EventsList :events="events" @update-list="updateList"/>
                    <template #fallbkack>
                        <div>
                            Загрузка информации
                        </div>
                    </template>
                </Suspense>
                
            </div>
        </main>
    </div>


</template>