<script setup>
import { ref } from 'vue'
import NavigationColumn from '@/components/menus/NavigationColumn.vue';
import DocumentsList from '@/components/layouts/DocumentsList.vue';
import DocumentsDropdownNSearch from '@/components/menus/DocumentsDropdownNSearch.vue';
import AddDoc from '@/components/forms/AddDoc.vue';

const events = ref([])
const visible = ref(false)

async function updateList() {
    
}

</script>


<template>
    <div class="h-full flex flex-row h-[100vh] w-[100vw] items-center">
        <header>
            <NavigationColumn
            section='Documents'
            />
        </header>

        <main class="flex flex-grow max-w-[80%]">
            <div class="">
                <DocumentsDropdownNSearch @show-dialog="visible = true"></DocumentsDropdownNSearch>
                <AddDoc v-model:visible='visible' @update-list="updateList"></AddDoc>
                <DocumentsList/>
            </div>
        </main>
    </div>

</template>