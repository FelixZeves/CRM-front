<script setup>
import DocumentOnList from '@/components/cards/DocumentOnList.vue';

const props = defineProps(['docs'])

</script>

<template>
    <q-list class="h-[70vh] w-full overflow-y-auto justify-self-center">
        <DocumentOnList v-for="doc in docs" :body="doc"/>
    </q-list>

</template>