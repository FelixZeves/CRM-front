<script setup>
import { ref } from 'vue'
import DBTableManage from './components/DBTableManage.vue'
</script>

<template>
    <header id="adminHeader" class="px-4 pb-2 w-full absolute top-0 left-0 flex items-center justify-between border-b-2 border-black">
        <div class="text-3xl font-bold select-none">Административная панель</div>
        <RouterLink to="/DBManage" class="leavePage">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-7">
                <path stroke-linecap="round" stroke-linejoin="round" d="M15.75 19.5 8.25 12l7.5-7.5" />
            </svg>
        </RouterLink>
    </header>
    <DBTableManage :table="$route.params.table"/>
</template>

<style>

.leavePage{
    height: 100%;
    width: 30px;
    border-radius: 5pt;
}

.leavePage:hover{
    background-color: var(--crm-c-light-velvet);
    color: white;
}

</style>