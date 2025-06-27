<script setup>
import axios from 'axios';
const props = defineProps(['id','name', 'description', 'deadline', 'creator', 'place'])
const emit = defineEmits(['delete-event']);

async function deleteEvent(){
    try{
        const response = await axios.delete(`/api/user/event?id=${props.id}`)
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
        <q-card-section class="flex flex-row gap-x-4 items-center">
            <div class="flex flex-col gap-y-2 w-[20%]">
                <div class="text-lg text-gray-700">{{ deadline }}</div>
                <div class="text-base text-gray-600">{{ place }}</div>
            </div>
            <div class="flex flex-col gap-y-2 flex-grow">
                <div class="text-xl font-bold text-gray-700">{{ name }}</div>
                <div class="text-base text-gray-600">{{ creator}}</div>
                <div class="text-lg text-gray-600 w-[80%]">{{ description }}</div>
            </div>
            <q-btn class="!w-[15%]" label="Закрыть мероприятие" color="brand-velvet" text-color="white" @click="deleteEvent"/>
        </q-card-section>
    </q-card>
</template>