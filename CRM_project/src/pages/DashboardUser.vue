<script setup>
import CRMCalendar from '@/components/CRMCalendar.vue';
import EventsTile from '@/components/cards/EventsTile.vue';
import NavigationColumn from '@/components/menus/NavigationColumn.vue';
import TasksTile from '@/components/cards/TasksTile.vue';
import { checkPass } from '@/components/Notifies';
import { onMounted } from 'vue';

onMounted(() => {checkPass()})
</script>

<template>
    <div class="flex flex-row h-[100vh] w-[100vw] items-center px-8 gap-x-4 !flex-nowrap">
        <header class="min-w-[225px]">
            <NavigationColumn section='Office' />
        </header>
        
        <main class="flex flex-row flex-grow overflow-y-hidden gap-x-4 justify-evenly h-[80vh]">
            <div class="flex flex-col gap-y-8 w-[60%] flex-shrink-0">
                <TasksTile/>
            </div>

            <div class="flex flex-col gap-y-8 flex-grow w-[35%] flex-shrink-0">
                <Suspense>
                    <CRMCalendar/>
                </Suspense>
                <EventsTile/>
            </div>
        </main>
    </div>
</template>