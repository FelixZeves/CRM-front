<script setup>
import { onMounted, ref } from 'vue'
import api from '@/main';
import NavigationColumn from '@/components/menus/NavigationColumn.vue';
import DocumentsList from '@/components/layouts/DocumentsList.vue';
import DocumentsDropdownNSearch from '@/components/menus/DocumentsDropdownNSearch.vue';
import AddDoc from '@/components/forms/AddDoc.vue';
import { SessionStorage } from 'quasar';
import { FILE } from '@/components/Utils';

const docs = ref([])
const visible = ref(false)
const user = SessionStorage.getItem('user')

onMounted(async () => {await updateList()})

async function updateList(params = {}) {
    docs.value = (await api.get(FILE,  { params } )).data.data
}
</script>


<template>
    <div class="h-full flex flex-row h-[100vh] w-[100vw] items-center px-8 gap-x-2 !flex-nowrap">
        <header class="min-w-[225px]">
            <NavigationColumn
            section='Documents'
            />
        </header>

        <main class="flex flex-grow h-[80vh]">
            <div class="flex-grow">
                <DocumentsDropdownNSearch @show-dialog="visible = true" @apply-filters="updateList"></DocumentsDropdownNSearch>
                <AddDoc v-model:visible='visible' @update-list="updateList"></AddDoc>
                <DocumentsList :docs="docs" :user="user" @update-list="updateList"/>
            </div>
        </main>
    </div>

</template>