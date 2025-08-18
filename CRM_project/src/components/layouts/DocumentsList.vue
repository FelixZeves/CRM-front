<script setup>
import DocumentOnList from '@/components/cards/DocumentOnList.vue';

const props = defineProps(['docs', 'user'])
const emit = defineEmits(['update-list'])

</script>

<template>
    <q-list class="h-[72vh] w-full overflow-y-auto justify-self-center">
        <DocumentOnList v-for="doc in docs" :body="doc" :user="user" @update-list="emit('update-list')"/>
    </q-list>

</template>