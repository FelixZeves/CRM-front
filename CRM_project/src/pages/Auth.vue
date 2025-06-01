<script setup>
import LogIn from '@/components/forms/LogIn.vue';
import AuthorizationHeader from '@/components/layouts/AuthorizationHeader.vue';
</script>

<template>
  <div class="w-full h-full justify-between flex flex-row">
    <div class="w-[45%] h-full content-center min-w-[800px]">
      <div class="ps-20 flex flex-col gap-y-5">
        <div class="flex flex-row w-full border-b border-black pb-4">
          <q-img src="https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEgrwyrWx3DxBA9Fi-JV_zu2-fy_RIyGSqNJa00M2IgDXg7Wq-1cPrASANc8sY5VVVaEQUx__A8jnn_-Z6WibaCnhusAOz-j5jcDSOyrK-D3MZcGEd9zlKVDPOWQmXNb1-0K1MWkVQdBqN5t/s1600/wCQQ11n0FA0.jpg" class="flex-none" height="120px" width="80px"/>
          <div class="ms-5 w-[65%] text-5xl font-semibold content-center break-words text-gray-700"> Образовательный центр № 5 </div>
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