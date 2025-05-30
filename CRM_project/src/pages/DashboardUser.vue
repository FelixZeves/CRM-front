<script setup>
import CRMCalendar from '@/components/CRMCalendar.vue';
import EventsTile from '@/components/cards/EventsTile.vue';
import NavigationColumn from '@/components/menus/NavigationColumn.vue';
import TasksTile from '@/components/cards/TasksTile.vue';
import { ref } from 'vue'
</script>

<template>
    <div class="h-full grid grid-cols-4 lg:grid-cols-5 2xl:grid-cols-6 gap-x-8 lg:gap-x-16 content-center">
        <header>
            <NavigationColumn
            section='Office'
            />
        </header>

        <main class="col-span-3  lg:col-span-4 2xl:col-span-5 grid grid-rows-4 grid-cols-5 gap-x-5 gap-y-2 lg:gap-y-5 lg:mt-1 2xl:mt-2">
            <div class="row-span-2 col-span-3 grid grid-row-subgrid">
                <TasksTile class="row-start-2"/>
            </div>
            <div class="row-span-2 col-span-2 flex justify-center self-center">
                <Suspense>
                    <CRMCalendar class="font-jetbrains-mono!"/>
                </Suspense>
            </div>
            <Suspense>
                <EventsTile class="row-span-2 col-span-5"/>
            </Suspense>
        </main>
    </div>
</template>