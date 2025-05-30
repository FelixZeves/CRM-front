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
    <div class="h-full grid grid-cols-4 lg:grid-cols-5 2xl:grid-cols-6 gap-x-8 lg:gap-x-16 content-center">
        <header>
            <NavigationColumn
            section='Events'
            />
        </header>

        <main class="col-span-3 lg:col-span-4 2xl:col-span-5">
            <div>
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