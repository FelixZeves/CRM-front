<script setup>
import CRMCalendar from '@/components/CRMCalendar.vue';
import EventsTile from '@/components/cards/EventsTile.vue';
import NavigationColumn from '@/components/menus/NavigationColumn.vue';
import TasksTile from '@/components/cards/TasksTile.vue';
import ChangePass_ from '@/components/forms/ChangePass_.vue';
</script>

<template>
    <div class="flex flex-row h-[100vh] w-[100vw] items-center px-8 gap-x-4 !flex-nowrap">
        <header class="min-w-[225px]">
            <NavigationColumn section='Office' />
        </header>
        
        <main class="flex flex-row flex-grow overflow-y-auto gap-x-2 justify-evenly h-[80vh]">
            <div class="flex flex-col gap-y-8 max-w-[55%] flex-shrink-0">
                <TasksTile/>
            </div>

            <div class="flex flex-col gap-y-8 flex-grow max-w-[40%] flex-shrink-0">
                <Suspense>
                    <CRMCalendar class="font-jetbrains-mono"/>
                </Suspense>
                <EventsTile/>
            </div>
        </main>
    </div>
    <ChangePass_/>
</template>