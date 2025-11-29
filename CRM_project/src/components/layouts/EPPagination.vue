<script setup>
const props = defineProps(['slideNumber', 'slideLength'])

const emit = defineEmits(['update:slideNumber'])

const onChange = (val) => {
  emit('update:slideNumber', val)
}
</script>

<template>
    <div class="absolute bottom-6 left-0 right-0 flex justify-center">
        <q-pagination
            :model-value="slideNumber"
            @update:model-value="onChange"
            :max="slideLength"
            :max-pages="7"
            boundary-numbers
            color="brand-velvet"
            gutter="6px"
        >
        </q-pagination>
    </div>
</template>

<style scoped>

::v-deep(.q-pagination .q-btn){
    @apply !rounded-full 
}

</style>