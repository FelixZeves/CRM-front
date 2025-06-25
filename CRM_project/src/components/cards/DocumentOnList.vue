<script setup>
    const props = defineProps(['name', 'type', 'spec', 'date', 'file'])

function downloadFile(){

    console.log('Типа Скачал')

}

</script>

<template>
    <q-item class="!flex-grow !w-[90%] !ms-3 justify-self-center">
        <q-card class="flex-grow !min-w-[90%]">
            <q-card-section class="flex flex-row items-center">
                <q-icon name="fa-regular fa-file-word" size="xl" class="!max-w-[5%]"/>
                <div class="flex flex-col px-4 !max-w-[90%] !min-w-[90%]">
                    <div class="font-bold text-sm lg:text-base 2xl:text-lg !max-w-full truncate pb-4">{{ name }}</div>
                    <div class="flex flex-row justify-end">
                        <q-chip clickable outline square color="grey-8" :label="type"></q-chip>
                        <q-chip clickable outline square color="grey-8" :label="spec"></q-chip>
                        <q-chip outline square color="grey-8" :label="date"></q-chip>
                    </div>
                </div>
                <q-btn flat class="!max-w-[5%]">
                    <q-icon name="download" size="lg"></q-icon>
                </q-btn>
            </q-card-section>
        </q-card>
    </q-item>
</template>