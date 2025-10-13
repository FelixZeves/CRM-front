<template>
        <q-item
        class="items-center !max-h-[250px] !min-h-[100px] flex items-stretch gap-x-2 !px-0 !pb-2 !pt-0"
        >
        <q-item-section>
            <q-card class="overflow-hidden flex flex-row">
            <q-card-section class="flex flex-row flex-grow justify-between content-center w-[97%]">
                <div class="flex-grow w-[70%] flex flex-col gap-y-2">
                <q-skeleton type="text" width="80%" />
                <q-skeleton type="text" width="95%" />
                <q-skeleton type="text" width="60%" />
                </div>
                <div class="w-[25%] text-end pe-2 flex flex-col gap-y-2 items-end">
                <q-skeleton type="text" width="40%" />
                <q-skeleton type="text" width="60%" />
                </div>
            </q-card-section>
            <div class="flex-grow w-[3%] h-full !rounded-none justify-self-end">
                <q-skeleton type="rect" class="h-full w-full" />
            </div>
            </q-card>
        </q-item-section>
        </q-item>
</template>