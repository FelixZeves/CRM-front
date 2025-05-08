<script setup>
import { ref } from 'vue';

const attrs = ref([
    {
        key: 'today',
        highlight: 'velvet-today',
        dates: new Date(),
        popover: {
        label: 'Сегодня',
        }
    },
]);

</script>

<template>
    <VCalendar
        borderless
        trim-weeks
        title-position="left"
        class="shadow-2xl"
        color="velvet"
        :attributes="attrs"
    />
</template>

<style>

.vc-velvet-today{
    --vc-accent-50: #efecfb;
    --vc-accent-100: #e2dcf9;
    --vc-accent-200: #c7bafb;
    --vc-accent-300: #825AFF;
    --vc-accent-400: #643CFF;
    --vc-accent-500: #643CFF;
    --vc-accent-600: #2A2B47;
    --vc-accent-700: #2705b1;
    --vc-accent-800: #1e067e;
    --vc-accent-900: #2A2B47;
}

.vc-velvet{
    --vc-accent-50: #efecfb;
    --vc-accent-100: #e2dcf9;
    --vc-accent-200: #c7bafb;
    --vc-accent-300: #825AFF;
    --vc-accent-400: #643CFF;
    --vc-accent-500: #643CFF;
    --vc-accent-600: #643CFF;
    --vc-accent-700: #2705b1;
    --vc-accent-800: #22088b;
    --vc-accent-900: #1e0b68;
}

.vc-CRM-yellow{
    --vc-accent-50: #f7f1e0;
    --vc-accent-100: #f5e9c6;
    --vc-accent-200: #f8edcc;
    --vc-accent-300: #fcd769;
    --vc-accent-400: #FCCE42;
    --vc-accent-500: #f8c428;
    --vc-accent-600: #e8b213;
    --vc-accent-700: #cb9d15;
    --vc-accent-800: #a78215;
    --vc-accent-900: #7b6112;
}

.vc-container{

    @apply !w-[100%] !h-[100%] !rounded-[20pt] py-2 px-2
}

.vc-weekdays{
    @apply py-2
}

.vc-week{
    @apply py-2
}

.vc-highlight{
    border-radius: 5pt !important;
}

.vc-focus{
    border-radius: 5pt !important;
}

.vc-focus:hover{
    background-color: var(--crm-c-light-velvet) !important;
    color:white !important;
}

.vc-nav-item.is-active:hover{
    background-color: var(--crm-c-light-velvet) !important;
}

.vc-nav-item.is-current{
    color: var(--crm-c-velvet) !important
}

.vc-nav-item.is-current:hover{
    color: white !important
}

</style>