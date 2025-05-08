<script setup>
    const props = defineProps(['name', 'description', 'deadline', 'creator', 'place'])
</script>

<template>
    <div class="w-[90%] bg-white rounded-[20px] mx-3 px-6 my-5 py-3 shadow-xl">
        <div class="flex flex-row justify-between items-center gap-y-5">
            <div class="flex flex-col w-[90%] justify-self-start">
                <p class="lg:text-lg 2xl:text-xl font-bold text-sm lg:text-base 2xl:text-lg mb-2">{{ name }}</p>
                <p class="lg:text-md 2xl:text-lg font-semibold text-sm lg:text-base 2xl:text-lg mb-3">{{ description }}</p>
            </div>
        </div>
        
        <p class="lg:text-md 2xl:text-lg font-medium text-xs lg:text-sm 2xl:text-base m-0">Срок выполнения: {{ deadline }}</p>
        <p class="lg:text-md 2xl:text-lg font-medium text-xs lg:text-sm 2xl:text-base m-0">Поставил(а) задачу: {{ creator }}</p>
        <div class="flex flex-row justify-between items-center mt-2">
            <p class="lg:text-md 2xl:text-lg font-medium text-xs lg:text-sm xl:text-base m-0">Место проведения: {{ place }}</p>
            <q-btn label="Закрыть мероприятие" type="submit" style="background: var(--crm-c-light-velvet); width: 20%; border-radius: 5pt; font-size: small;" text-color="white"/>
        </div>
    </div>
</template>