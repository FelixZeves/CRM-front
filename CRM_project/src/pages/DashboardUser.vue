<script setup>
import CRMCalendar from '@/components/CRMCalendar.vue';
import EventsTile from '@/components/cards/EventsTile.vue';
import NavigationColumn from '@/components/menus/NavigationColumn.vue';
import TasksTile from '@/components/cards/TasksTile.vue';
import ChangePass_ from '@/components/forms/ChangePass_.vue';
</script>

<template>
    <div class="flex flex-row h-[100vh] w-[100vw] items-center px-8 gap-x-8 !flex-nowrap">
        <!-- <div class="flex flex-row h-[100vh] w-[100vw] items-center px-8 gap-x-8">
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
                            <CRMCalendar class="font-jetbrains-mono"/>
                        </Suspense>
                    </div>
                </div>
                <Suspense>
                    <EventsTile class=""/>
                </Suspense>
            </main>
        </div> -->

        <header class="min-w-[225px]">
            <NavigationColumn section='Office' />
        </header>
        
        <main class="flex flex-row flex-grow overflow-y-auto  justify-evenly">
            <div class="flex flex-col gap-y-8 min-w-[400px] max-w-[525px] flex-shrink-0">
                <EventsTile/>    
            </div>

            <div class="flex flex-col gap-y-8 min-w-[500px] flex-grow max-w-[700px] flex-shrink-0">
            <Suspense>
                <CRMCalendar class="font-jetbrains-mono"/>
            </Suspense>

            <TasksTile/>
            </div>
            
        </main>
    </div>
    <ChangePass_/>
</template>