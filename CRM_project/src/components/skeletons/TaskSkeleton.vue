<script setup>
</script>

<template>
  <q-card class="!flex !flex-col !flex-grow bg-white mx-2 my-2 pt-3 pb-5 px-5 !min-h-[250px] !max-h-[600px] !flex-nowrap">
    <div class="flex flex-row w-[70%] justify-between">
      <div class="flex flex-row gap-x-8">
        <q-skeleton type="text" animation="fade" class="w-[300px] h-[35px]" />
      </div>
      <q-skeleton type="rect" animation="fade" class="absolute top-0 end-0 h-[40px] w-[30%] !rounded-tr-[15pt] !rounded-bl-[25pt]" />
    </div>

    <div class="flex flex-row gap-x-4 mt-4">
      <q-skeleton type="text" animation="fade" class="w-[80px] h-[20px]" />
      <q-skeleton type="text" animation="fade" class="w-[120px] h-[20px]" />
      <q-skeleton type="text" animation="fade" class="w-[60px] h-[20px]" />
    </div>

    <div class="mt-6 space-y-2">
      <q-skeleton type="text" animation="fade" class="w-[25%] h-[16px] justify-self-end text-end" />
      <q-skeleton type="text" animation="fade" class="w-[20%] h-[16px] justify-self-end text-end" />
      <q-skeleton type="text" animation="fade" class="w-full h-[16px]" />
      <q-skeleton type="text" animation="fade" class="w-[40%] h-[16px]" />
    </div>

    <div class="flex flex-row justify-end items-center mt-7">
      <q-skeleton type="rect" animation="fade" class="w-[150px] h-[36px] rounded-md" />
    </div>
  </q-card>
</template>