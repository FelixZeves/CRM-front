<script setup>
import { StatusEnum } from '@/components/Enums.vue'
import { ref } from 'vue';
import { getTasks } from '../Utils';
import { SessionStorage } from 'quasar';

const tasks = ref([])

const user = SessionStorage.getItem('user')

async function get() {
    tasks.value = (await getTasks()).slice(0,6)
}

get()
</script>

<template>
    <q-list class="!max-h-[80vh] overflow-y-auto flex-grow px-2">
        <q-item
            v-for="task in tasks"
            class="items-center !max-h-[250px] !min-h-[100px] flex items-stretch gap-x-2 !px-0 !pb-2 !pt-0">
            <q-item-section>
                <q-card class="overflow-hidden flex flex-row">
                    <q-card-section class="flex flex-row flex-grow justify-between content-center w-[97%]">
                        <div class="flex-grow w-[70%]">
                            <div class="brand-title text-ellipsis line-clamp-1">{{ task.title }}</div>
                            <div class="brand-description overflow-hidden text-ellipsis line-clamp-2"> {{ task.description }} </div>
                        </div>
                        <div class="w-[25%] text-end pe-2">
                            <div class="brand-text">{{ task.total == null ? task.active[0].user.init_name : user.profile.initials_name }}</div>
                            <div class="brand-text">{{ task.deadline }}</div>
                        </div>
                    </q-card-section>
                    <div class="flex-grow w-[3%] h-full !rounded-none justify-self-end" :class="StatusEnum[task.status].color"></div>
                </q-card>
            </q-item-section>
        </q-item>
    </q-list>
            
</template>

<style scoped>

</style>