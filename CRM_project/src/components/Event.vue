<script setup>
const props = defineProps(['name', 'description', 'date', 'place'])

</script>

<template>
    <div class="w-[97%] justify-self-center px-2 event grid grid-cols-7 gap-x-2 pb-1">
        <div class="items-start col-span-3 ps-2">
            <p class="text-base lg:text-lg  font-medium mb-0">{{ name }}</p>
            <p class="text-sm lg:text-base mb-0">{{ description }}</p>
        </div>
        <p class="date text-sm lg:text-base col-span-2 mb-0">{{ date }}</p>
        <p class="place text-sm lg:text-base col-span-2 mb-0">{{ place }}</p>
    </div>
</template>

<style>

.event{
    border-radius: 10pt;
}

.event:hover{
    background-color: var(--vt-c-white-mute);
    transition: 0.5s;
}

.event .mainInfo{
    align-self: center;
}

.event .date{
    text-align: center;
    align-self: center;
}

.event .place{
    text-align: center;
    align-self: center;
}

</style>