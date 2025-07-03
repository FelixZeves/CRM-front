<script setup>
import { onMounted, ref } from 'vue'
import axios from 'axios';
import NavigationColumn from '@/components/menus/NavigationColumn.vue';
import DocumentsList from '@/components/layouts/DocumentsList.vue';
import DocumentsDropdownNSearch from '@/components/menus/DocumentsDropdownNSearch.vue';
import AddDoc from '@/components/forms/AddDoc.vue';

const docs = ref([])
const visible = ref(false)

async function updateList() {
    docs.value = (await axios.get('/api/user/file')).data.data
}

onMounted(async () => {updateList()})
</script>


<template>
    <div class="h-full flex flex-row h-[100vh] w-[100vw] items-center px-8 gap-x-2">
        <header>
            <NavigationColumn
            section='Documents'
            />
        </header>

        <main class="flex flex-grow max-w-[80%]">
            <div class="flex-grow">
                <DocumentsDropdownNSearch @show-dialog="visible = true"></DocumentsDropdownNSearch>
                <AddDoc v-model:visible='visible' @update-list="updateList"></AddDoc>
                <DocumentsList :docs="docs"/>
            </div>
        </main>
    </div>

</template>