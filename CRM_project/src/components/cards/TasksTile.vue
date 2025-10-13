<script setup>
import { StatusEnum } from '@/components/Enums.vue'
import { SessionStorage } from 'quasar';

const props = defineProps(['body'])

const user = SessionStorage.getItem('user')

</script>

<template>
    <q-item
        class="items-center !max-h-[250px] !min-h-[100px] flex items-stretch gap-x-2 !px-0 !pb-2 !pt-0">
        <q-item-section>
            <q-card class="overflow-hidden flex flex-row">
                <q-card-section class="flex flex-row flex-grow justify-between content-center w-[97%]">
                    <div class="flex-grow w-[70%]">
                        <div class="brand-title text-ellipsis line-clamp-1">{{ body.title }}</div>
                        <div class="brand-description overflow-hidden text-ellipsis line-clamp-2"> {{ body.description }} </div>
                    </div>
                    <div class="w-[25%] text-end pe-2">
                        <div class="brand-text">{{ body.total == null ? body.active[0].user.init_name : user.profile.initials_name }}</div>
                        <div class="brand-text">{{ body.deadline }}</div>
                    </div>
                </q-card-section>
                <div class="flex-grow w-[3%] h-full !rounded-none justify-self-end" :class="StatusEnum[body.status].color"></div>
            </q-card>
        </q-item-section>
    </q-item>      
</template>

<style scoped>

</style>