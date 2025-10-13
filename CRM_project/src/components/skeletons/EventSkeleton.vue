<script setup>
</script>

<template>
  <q-card class="my-6 mx-3 max-h-[200px]">
    <q-card-section class="flex flex-row flex-grow gap-x-4 items-center !flex-nowrap">
      <div class="flex flex-col gap-y-2 w-[20%] overflow-hidden">
        <q-skeleton type="text" animation="fade" class="w-[80%] h-[16px]" />
        <q-skeleton type="text" animation="fade" class="w-[60%] h-[16px]" />
      </div>

      <div class="flex flex-col gap-y-2 flex-grow w-[60%]">
        <q-skeleton type="text" animation="fade" class="w-[70%] h-[20px]" />
        <q-skeleton type="text" animation="fade" class="w-[40%] h-[16px]" />
        <q-skeleton type="text" animation="fade" class="w-[90%] h-[16px]" />
      </div>

      <div class="!w-[10%] !min-w-[125px] flex justify-end">
        <q-skeleton type="rect" animation="fade" class="w-[125px] h-[36px] rounded-md" />
      </div>
    </q-card-section>
  </q-card>
</template>