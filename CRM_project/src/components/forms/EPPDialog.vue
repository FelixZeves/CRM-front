<script setup>
import { ref, computed } from 'vue'
import api from '@/main'
import { CLASS, validateMark } from '@/components/Utils'
import { successNotify, errorNotify } from '@/components/Notifies'
import { triggerDownload } from '@/components/Utils'

const props = defineProps(['visible', 'classId'])
const emit = defineEmits(['update:visible'])

const visible = computed({
    get: () => props.visible,
    set: val => emit('update:visible', val)
})

const formRef = ref(null)

const minMark = ref(null)
const maxMark = ref(null)
const loading = ref(false)

function clearDialog() {
    minMark.value = null
    maxMark.value = null
}

async function generate() {
    const isFormValid = await formRef.value.validate()
    if (!isFormValid) return

    loading.value = true

    try {
        const response = await api.get(
            `${CLASS}/${props.classId}/download-performance`,
            {
                params: {
                    low_bound: minMark.value,
                    hight_bound: maxMark.value
                },
                responseType: 'blob'
            }
        )
        triggerDownload(response, 'performance-report.xlsx')

        visible.value = false

    } catch (e) {
        errorNotify('Ошибка при формировании отчёта')
    } finally {
        loading.value = false
    }
}
</script>

<template>
    <q-dialog
        v-model="visible"
        backdrop-filter="blur(4px)"
        @hide="clearDialog"
    >
        <q-card class="text-black !rounded-[15pt] !flex !w-[40vw] !min-w-[400px]">
        
        <q-form
            ref="formRef"
            @submit.prevent="generate"
            class="bg-tile p-6 pt-4 !flex flex-col gap-y-6 w-full"
        >

            <q-card-section class="text-center brand-description">
            Формирование таблицы успеваемости
            </q-card-section>

            <q-input
                v-model="minMark"
                type="text"
                label="Нижняя граница"
                outlined
                class="brand-description"
                :rules="[
                val => val !== null || 'Введите значение',
                val => validateMark(val),
                ]"
            />

            <q-input
                v-model="maxMark"
                type="text"
                label="Верхняя граница"
                outlined
                class="brand-description"
                :rules="[
                val => val !== null || 'Введите значение',
                val => validateMark(val),
                val => minMark === null || val >= minMark || 'Верхняя граница не может быть меньше нижней'
                ]"
            />

            <q-btn
                label="Сформировать"
                type="submit"
                :loading="loading"
                color="brand-velvet"
                class="brand-description !h-[56px]"
            />

        </q-form>

        </q-card>
    </q-dialog>
</template>