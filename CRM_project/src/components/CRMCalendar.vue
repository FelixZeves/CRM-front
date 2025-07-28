<script setup>
import { onMounted, ref, toRaw } from 'vue';
import { getEvents } from '@/components/Utils';

const events = ref()

function parseCustomDate(dateString) {
  const [day, month, year] = dateString.split('.').map(Number);
  return new Date(Date.UTC(year, month-1, day));
}

async function parseEvents(){
    let response = await getEvents()

    let rawEvents = response.data.data

    const result = Array.from(rawEvents).map(event => ({
    key: event.id,
    highlight: {
        color: 'velvet',
    },  
    dates: event.at != event.to  ? [[parseCustomDate(event.at), parseCustomDate(event.to)]] : [parseCustomDate(event.to)],
    popover: {
        label: `${event.title} - ${event.creator.init_name}`,
    }
    }));


    return result
}
const attrs = ref([])

onMounted(async () => {
    events.value = await parseEvents()
    attrs.value = [
    ...toRaw(events.value),
    {
        key: 'today',
        highlight: 'velvet-today',
        dates: new Date(),
        popover: {
        label: 'Сегодня',
        }
    }
    ]
})




</script>

<template>
    <div class="flex justify-end pe-6">
        <VCalendar
        borderless
        trim-weeks
        title-position="left"
        class="shadow-2xl min-w-[300px] w-full brand-description font-jetbrains-mono"
        color="velvet"
        :attributes="attrs"
    />
    </div>
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
    @apply !rounded-[15pt] !px-3 pt-3
}

.vc-title{
    @apply !text-xl !text-stone-700 !font-semibold
}

.vc-week{
    @apply py-2
}

.on-left{
    @apply !me-0
}

.on-right{
    @apply !ms-0
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