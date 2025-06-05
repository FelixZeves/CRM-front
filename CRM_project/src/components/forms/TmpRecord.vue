<script setup>
import { computed } from 'vue'

const props = defineProps({
    dict: {type: Object, required: true, default: {}},
    status: {type: Boolean, default: false}
})

const visibleFields = computed(() =>
    Object.entries(props.dict).filter(([_, val]) => !val?.hidden)
)

</script>

<template>
    <q-list>
        <q-item
            v-for="[key, val] in visibleFields"
            :key="key"
        >
            <q-select
                class="w-full"
                v-if="Array.isArray(val['value'])"
                outlined
                :label="val['label']"
                :readonly="val?.readonly ? val.readonly : status"
                v-model="val['value']"
            />
            <q-expansion-item
                class="w-full text-gray-700 text-xl"
                v-else-if="typeof val['value'] === 'object'"
                :label="key"
            >
                <TmpRecord :dict="val['value']" :status="status"/>
            </q-expansion-item>
            <q-checkbox
                class="w-full text-gray-700 text-base"
                v-else-if="typeof val['value'] === 'boolean'"
                :label="val['label']"
                :disable="val?.readonly ? val.readonly : status"
                keep-color
                color="brand-velvet"
                checked-icon="fa-solid fa-circle"
                unchecked-icon="fa-solid fa-circle-notch"
                v-model="val['value']"
            />
            <q-input
                class="w-full"
                v-else
                outlined
                :label="val['label']"
                :readonly="val?.readonly ? val.readonly : status"
                v-model="val['value']"
            />
        </q-item>
    </q-list>
</template>