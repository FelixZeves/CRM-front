<script setup>
import CRMCalendar from '@/components/CRMCalendar.vue';
import EventsTile from '@/components/cards/EventsTile.vue';
import NavigationColumn from '@/components/menus/NavigationColumn.vue';
import TasksTile from '@/components/cards/TasksTile.vue';
</script>

<template>
    <div class="flex flex-row h-[100vh] w-[100vw] items-center px-8 gap-x-8">
        <header>
            <NavigationColumn
            section='Office'
            />
        </header>

        <main class="flex flex-col gap-y-8 flex-grow">
            <div class="flex flex-row gap-x-4">
                <div class="flex-grow">
                    <TasksTile/>
                </div>
                <div class="w-1/4">
                    <Suspense>
                        <CRMCalendar class="font-jetbrains-mono!"/>
                    </Suspense>
                </div>
            </div>
            <Suspense>
                <EventsTile class=""/>
            </Suspense>
        </main>
    </div>
</template>