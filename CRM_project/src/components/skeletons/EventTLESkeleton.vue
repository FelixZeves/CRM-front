<template>
    <q-timeline-entry>
        <template #title>
            <div class="ml-6">
            <q-skeleton type="text" width="60%" />
            </div>
        </template>

        <template #subtitle>
            <div class="ml-6">
            <q-skeleton type="text" width="40%" />
            </div>
        </template>

        <div class="flex flex-col gap-2 mt-2 ml-6">
            <q-skeleton type="text" width="90%" />
            <q-skeleton type="text" width="80%" />
        </div>

        <div class="mt-1 ml-6">
            <q-skeleton type="text" width="30%" />
        </div>
    </q-timeline-entry>
</template>