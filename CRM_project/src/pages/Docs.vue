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
    <div class="h-full grid grid-cols-4 lg:grid-cols-5 2xl:grid-cols-6 gap-x-8 lg:gap-x-16 content-center">
        <header>
            <NavigationColumn
            section='Documents'
            />
        </header>

        <main class="col-span-3 lg:col-span-4 2xl:col-span-5">
            <div>
                <DocumentsDropdownNSearch @show-dialog="visible = true"></DocumentsDropdownNSearch>
                <AddDoc v-model:visible='visible' @update-list="updateList"></AddDoc>
                <DocumentsList/>
            </div>
        </main>
    </div>


</template>