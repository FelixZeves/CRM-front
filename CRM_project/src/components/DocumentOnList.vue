<script setup>
    const props = defineProps(['name', 'file'])

function downloadFile(){

    console.log('Типа Скачал')

}

</script>

<template>
    <div class="w-[90%] bg-white rounded-[20px] mx-3 px-6 my-5 py-3 shadow-xl">
        <div class="flex flex-row w-full justify-self-start justify-between items-center py-2">
            <p class="w-[75%] lg:text-lg 2xl:text-xl font-bold text-sm lg:text-base 2xl:text-lg m-0">{{ name }}</p>
            <button @click="downloadFile()">
                <q-icon name="download" size="md" class="px-5"></q-icon>
            </button>
        </div>
    </div>
</template>