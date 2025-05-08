<script setup>
import TaskManipulationDialog from './dialogs/TaskManipulationDialog.vue'

import { StatusEnum } from './Enums.vue'

    const props = defineProps(['name', 'description', 'deadline', 'creator', 'documents', 'status', 'comments', 'type'])
</script>

<template>
    <div class="w-[90%] bg-white rounded-[20px] mx-3 px-6 my-5 py-3 shadow-xl">
        <div class="flex flex-row justify-between items-center gap-y-5">
            <div class="flex flex-col w-[90%] justify-self-start">
                <p class="lg:text-lg 2xl:text-xl font-bold text-sm lg:text-base 2xl:text-lg mb-2">{{ name }}</p>
                <p class="lg:text-md 2xl:text-lg font-semibold text-sm lg:text-base 2xl:text-lg mb-3">{{ description }}</p>
            </div>
            <div class="h-[25px] w-[25px] rounded-full cursor-help self-start" :class="StatusEnum[status].color">
                <q-tooltip
                anchor="top middle"
                self="bottom middle"
                :offset="[10, 10]"
                max-width="200px"
                class="!text-sm text-center"
                :class="StatusEnum[props.status].color, StatusEnum[props.status].textColor">
                    {{ StatusEnum[status].description }}
                </q-tooltip>
            </div>
        </div>
        
        <p class="lg:text-md 2xl:text-lg font-medium text-xs lg:text-sm 2xl:text-base m-0"><b>Срок выполнения: </b>{{ deadline }}</p>
        <p class="lg:text-md 2xl:text-lg font-medium text-xs lg:text-sm 2xl:text-base m-0"><b>Поставил(а) задачу: </b>{{ creator }}</p>
        <div class="flex flex-row justify-between items-center mt-2">
            <p class="lg:text-md 2xl:text-lg m-0">{{ documents || ""}}</p>
            <div>
                <TaskManipulationDialog 
                :name="name"
                :description="description"
                :deadline="deadline"
                :creator="creator"
                :status="status"
                :type="type"
                :documents="documents">
                
                </TaskManipulationDialog>
            </div>
            
        </div>
    </div>
</template>