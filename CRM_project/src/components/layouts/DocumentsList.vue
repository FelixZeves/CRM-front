<script setup>
import DocumentOnList from '@/components/cards/DocumentOnList.vue';

const props = defineProps(['docs'])

</script>

<template>
    <q-list class="!min-w-[90%] min-h-[600px] lg:max-h-[750px] overflow-y-auto !justify-self-center pt-2">
        <DocumentOnList v-for="doc in docs" :body="doc"/>
    </q-list>

</template>