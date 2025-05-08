<script setup>
import { ref } from 'vue'

const props = defineProps(['table', 'id', 'name', 'position'])
</script>

<template>
    <div v-if="id"
    class="record select-none px-4 grid grid-cols-9 gap-x-3 items-center justify-items-center my-1 lg:py-1 2xl:py-3 hover:bg-[#F2F2F2]">
        <p class="col-span-4 xl:text-md 2xl:text-lg 3xl:text-xl">{{ name }}</p>
        <p class="col-span-3 xl:text-md 2xl:text-lg 3xl:text-xl">{{ position }}</p>
        <div class="flex w-full justify-end">
            <button class="pl-4">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="red" class="size-6">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M6 18 18 6M6 6l12 12" />
                </svg>
            </button>
        </div>
    </div>
    <div v-else
    class="record px-4 grid grid-cols-8 gap-x-3 items-center justify-items-center">
        <p class="py-4 empty col-span-8 text-lg">
            <slot></slot>
        </p>
    </div>
</template>

<style>
.empty{
    justify-self: center;
    align-self: center;
}

.record{
    width: 97%;
    justify-self: center;
    border-radius: 10pt;
}

</style>