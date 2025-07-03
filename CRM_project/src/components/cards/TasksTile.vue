<script setup>
import axios from 'axios'
import { StatusEnum, StatusEnum_ } from '@/components/Enums.vue'
import { ref } from 'vue';

const tasks = ref([])

async function get() {
    tasks.value = (await axios.get('/api/user/task')).data.data
    for (const task of tasks.value) {
        const currentStep = task.steps.find(step => step.status !== StatusEnum_.APPROVED)

        if (currentStep)
            task.status = currentStep.status
        else
            task.status = StatusEnum_.APPROVED
    }
}

get()
</script>

<template>
    <!-- <div id="tasksTile" class="shadow-2xl">
        <h3 class="text-lg lg:text-2xl 2xl:text-3xl font-bold">Задачи</h3>
        <div class="grid grid-rows-5 gap-y-0.5">
            <div v-for="task in tasks" class="task grid grid-cols-4 gap-x-1">
                <div class="mainInfo col-span-2">
                    <p class="text-base lg:text-lg font-medium mb-0">{{ task.title }}</p>
                    <p class="text-sm lg:text-base mb-0">{{ task.description }}</p>
                </div>
                <p class="date text-sm lg:text-base mb-0">{{ task.deadline || "---------" }}</p>
                <div class="status cursor-help" :class="StatusEnum[task.status].color">
                    <q-tooltip
                        anchor="top middle"
                        self="bottom middle"
                        max-width="200px"
                        :offset="[10, 10]"
                        class="!text-sm text-center"
                        :class="StatusEnum[task.status].color, StatusEnum[task.status].textColor">
                        {{ StatusEnum[task.status].description }}
                    </q-tooltip>
                </div>
            </div>
        </div>
    </div> -->

    <q-list class="!max-h-[40vh] overflow-y-auto flex-grow px-2">
        <q-item
            v-for="task in tasks"
            class="items-center !max-h-[250px] !min-h-[100px] flex items-stretch gap-x-2 !px-0">
            <q-item-section>
                <q-card class="overflow-hidden flex flex-row">
                    <q-card-section class="flex flex-row flex-grow justify-between content-center max-w-[97%]">
                        <div class="flex-grow">
                            <div class="text-xl text-stone-700 shrink-0 truncate">{{ task.title }}</div>
                            <div class="text-lg text-stone-600 w-full shrink-0 truncate">{{ task.description }}</div>
                        </div>
                        <div class="w-[25%] text-end pe-2">
                            <div class="text-base text-stone-600">{{ task.steps[0].user.init_name }}</div>
                            <div class="text-base text-stone-600">{{ task.deadline }}</div>
                        </div>
                    </q-card-section>
                    <div class="max-w-[3%] flex-grow h-full !rounded-none justify-self-end" :class="StatusEnum[task.status].color"></div>
                </q-card>
            </q-item-section>

            <!-- <div class="w-[10%] !min-h-[100px] rounded-[5pt] rounded-e-[15pt] shadow-2 cursor-help" :class="StatusEnum[task.status].color">
                <q-tooltip
                    anchor="top middle"
                    self="bottom middle"
                    max-width="200px"
                    :offset="[10, 10]"
                    class="!text-sm text-center"
                    :class="StatusEnum[task.status].color, StatusEnum[task.status].textColor">
                    {{ StatusEnum[task.status].description }}
                </q-tooltip>
            </div>
             -->
        </q-item>
    </q-list>
            
</template>

<style scoped>

</style>