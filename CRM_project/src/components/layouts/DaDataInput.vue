<script setup>
import { ref, watch, defineProps, defineEmits, computed } from 'vue'
import { suggestAddress } from '@/components/Utils'

const props = defineProps({
    modelValue: String,
    label: String
})

const emit = defineEmits(['select'])

const input = ref(props.modelValue || '')
const options = ref([])
const loading = ref(false)
const showMenu = ref(false)
const canToggleMenu = computed(() => options.value.length > 0)
const skipNextWatch = ref(false)

let timer = null

watch(() => props.modelValue, (val) => {
    if (val !== input.value) {
        skipNextWatch.value = true
        input.value = val
    }
})

const onFocus = () => {
  if (options.value.length > 0) {
    showMenu.value = true
  }
}

watch(input, (val) => {
    if (skipNextWatch.value) {
        skipNextWatch.value = false
        return
    }

    if (timer) clearTimeout(timer)
    options.value = []
    showMenu.value = false

    if (!val || val.length < 3) return

    timer = setTimeout(async () => {
        loading.value = true
        try {
            const results = await suggestAddress(val)
            options.value = results
            showMenu.value = results.length > 0
        } catch (e) {
            console.error(e)
            options.value = []
            showMenu.value = false
        } finally {
            loading.value = false
        }
    }, 1000)
})

const selectAddress = (item) => {
    skipNextWatch.value = true
    input.value = item.value
    emit('select', item.value)

    showMenu.value = false
}
</script>
    
<template>
    <div class="relative">
        <q-input
            v-model="input"
            dense
            outlined
            :label="label"
            :loading="loading"
            hide-bottom-space
        >
        <template #append>
            <q-icon
                v-if="canToggleMenu"
                name="fa-solid fa-info"
                size="xs"
                class="!cursor-help"
                @mouseenter="onFocus"
            />
        </template>
        </q-input>
        <div>
            <q-menu
                v-model="showMenu"
                anchor="top right"
                self="bottom left"
                fit
            >
                <q-list>
                <q-item
                    v-for="item in options"
                    :key="item.value"
                    clickable
                    @click="selectAddress(item)"
                >
                    <q-item-section>
                    {{ item.value }}
                    </q-item-section>
                </q-item>
                </q-list>
            </q-menu>
        </div>
    </div>
</template>
    