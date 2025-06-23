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
    <div id="tasksTile" class="shadow-2xl">
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
    </div>
</template>

<style scoped>

#tasksTile{
    @apply bg-white rounded-[15pt] pb-4
}

#tasksTile h3{
    padding-left: 5%;
    padding-top: 2%;
    padding-bottom: 0%;
}

.task{
    justify-self: center;
    border-radius: 10pt;
    width: 95%;
    height: 55px;
}

.task:hover{
    background-color: var(--vt-c-white-mute);
    transition: 0.5s;
}

.task .mainInfo{
    padding-left: 5%;
    align-self: center;
}

.task .date{
    text-align: center;
    align-self: center;
}

.task .status{
    justify-self: center;
    align-self: center;
    height: 20px;
    width: 20px;
    border-radius: 20pt;
}

.task .status-danger{
    background-color: var(--crm-c-danger);
}

.task .status-wait{
    background-color: var(--crm-c-light-yellow);
}

.task .status-complete{
    background-color: var(--crm-c-complete);
}

</style>