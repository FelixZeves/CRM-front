<script setup>
import LogIn from '@/components/forms/LogIn.vue';
</script>

<template>
  <div class="w-full h-full justify-between flex flex-row !flex-nowrap">
    <div class="w-[45%] h-full content-center min-w-[800px]">
      <div class="ps-20 flex flex-col gap-y-5">
        <div class="flex flex-row w-full border-b border-black pb-4">
          <q-img src="@\assets\label.png" class="flex-none" height="180px" width="120px"/>
          <div class="ms-5 w-[65%] text-5xl font-semibold content-end break-words text-gray-700 align-end"> Образовательный центр № 5 </div>
        </div>
        <div class="flex-grow text-3xl text-end text-gray-600"> Умный инструментарий для управления вашим образовательным центром. </div>
        <div class="flex-grow text-lg text-end mt-5 text-gray-500"> Отслеживание прогресса учеников, организация уроков и упрощение администрирования — все в одном месте. </div>
      </div>
    </div>

    <div class="min-w-[530px] w-[40%] h-full flex justify-center content-center">
      <LogIn />
    </div>
  </div>
</template>

<style>

</style>