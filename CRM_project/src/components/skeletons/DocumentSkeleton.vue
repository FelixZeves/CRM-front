<script setup>
</script>

<template>
  <q-item class="my-4 mx-3 max-h-[200px]">
    <q-card class="flex-grow !min-w-[90%]">
      <q-card-section class="flex flex-row items-center">

        <q-skeleton type="rect" animation="fade" class="!max-w-[5%] w-[48px] h-[48px]" />

        <div class="flex flex-row gap-x-3 px-4 !max-w-[90%] !min-w-[90%] !flex-nowrap">

          <div class="flex flex-col content-start flex-grow w-[40%]">
            <div class="flex flex-row w-full !flex-nowrap items-center">
              <q-skeleton type="text" animation="fade" class="w-[80%] h-[30px] mb-1" />
            </div>
            <div class="flex flex-row gap-x-2">
                <q-skeleton type="text" animation="fade" class="w-[35%] h-[16px]" />
                <q-separator vertical size="2px" class="!h-[16px]"/>
                <q-skeleton type="text" animation="fade" class="w-[30%] h-[16px]" />
            </div>
          </div>

          <div class="content-center !w-[50%]">
            <div class="flex flex-row justify-end gap-x-2">
              <q-skeleton type="rect" animation="fade" class="w-[80px] h-[24px] rounded" />
              <q-skeleton type="rect" animation="fade" class="w-[80px] h-[24px] rounded" />
              <q-skeleton type="rect" animation="fade" class="w-[110px] h-[24px] rounded" />
            </div>
          </div>

          <q-skeleton type="text" animation="fade" class="!w-[6%] h-[16px] self-center" />
        </div>

        <q-skeleton type="rect" animation="fade" class="!w-[32px] !h-[32px] ms-2 rounded-md" />
      </q-card-section>
    </q-card>
  </q-item>
</template>