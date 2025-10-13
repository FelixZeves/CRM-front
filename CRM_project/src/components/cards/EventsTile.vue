<script setup>
const props = defineProps(['body'])

</script>

<template>
    <q-timeline-entry>
        <template #title>
            <div class="brand-title">
                {{ body.title }}
            </div>
        </template>

        <template #subtitle>
            <div class="!text-base !normal-case">
                {{ body.at !== body.to ? `${body.at} - ${body.to}` : body.to }} : {{ body.creator.init_name }}
            </div>
        </template>

        <div class="brand-description text-ellipsis line-clamp-2">
            {{ body.description }}
        </div>
        <div class="brand-text">
            {{ body.place }}
        </div>
    </q-timeline-entry>
</template>