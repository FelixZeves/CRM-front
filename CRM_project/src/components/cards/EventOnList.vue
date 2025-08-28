<script setup>
import api from '@/main';
import { EVENT } from '../Utils';
const props = defineProps(['id','name', 'description', 'deadline', 'creator', 'place'])
const emit = defineEmits(['delete-event']);

async function deleteEvent(){
    try{
        const response = await api.delete(`${EVENT}?id=${props.id}`)
        emit('delete-event')
        return response
    } catch (error) {
        console.error('Ошибка создания евента:', error);
        return []; // Возвращаем пустой массив в случае ошибки
    }
}
</script>

<template>
    <q-card class="my-6 mx-3 max-h-[200px]">
        <q-card-section class="flex flex-row flex-grow gap-x-4 items-center  !flex-nowrap">
            <div class="flex flex-col gap-y-2 w-[20%] overflow-hidden">
                <div class="brand-text max-w-[90%]">{{ deadline }}</div>
                <div class="brand-text max-w-[90%]">{{ place }}</div>
            </div>
            <div class="flex flex-col gap-y-2 flex-grow w-[60%]">
                <div class="brand-title">{{ name }}</div>
                <div class="brand-text">{{ creator}}</div>
                <div class="brand-description text-ellipsis line-clamp-2">{{ description }}</div>
            </div>
            <q-btn class="!w-[10%] !min-w-[125px]" label="Завершить" color="brand-velvet" text-color="white" @click="deleteEvent"/>
        </q-card-section>
    </q-card>
</template>