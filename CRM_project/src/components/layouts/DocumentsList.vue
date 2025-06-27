<script setup>
import axios from 'axios'
import { ref, onMounted } from 'vue'
import DocumentOnList from '@/components/cards/DocumentOnList.vue';

const docs = ref([])
onMounted(async () => {get()})

async function get() {
    docs.value = (await axios.get('/api/user/file')).data.data
}

</script>

<template>
    <q-list class="!max-w-[90%] min-h-[500px] lg:max-h-[650px] overflow-y-auto !justify-self-center">
        <DocumentOnList v-for="doc in docs" :body="doc">
        </DocumentOnList>
    </q-list>

</template>