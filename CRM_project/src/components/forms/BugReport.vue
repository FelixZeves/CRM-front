<script setup>
import api from '@/main'
import { computed, ref, onMounted, onBeforeUnmount } from 'vue'
import { successNotify } from '../Notifies'

const props = defineProps(['visible'])
const emit = defineEmits(['update:visible'])
const attachFiles = ref([])
const comment = ref('')
const visible = computed({
    get: () => props.visible,
    set: val => emit('update:visible', val)
})

async function sendBugReport() {
    let form = new FormData()
    
    if (attachFiles.value.length > 0)
        attachFiles.value.forEach(file => { form.append('files', file) })

    if (comment.value.length > 0)
        form.append('comment', comment.value)

    let response = await api.post('/report', form)

    if (response.status == 200){
        successNotify()
    }
}

function handlePaste(e) {
  if (!e.clipboardData || !e.clipboardData.items) return
  for (const item of e.clipboardData.items) {
    if (item.type.startsWith('image/')) {
      const file = item.getAsFile()
      if (file) {
        attachFiles.value = [...attachFiles.value, file]
      }
    }
  }
}

onMounted(() => {
  window.addEventListener('paste', handlePaste)
})
onBeforeUnmount(() => {
  window.removeEventListener('paste', handlePaste)
})

</script>

<template>
    <q-dialog v-model="visible" backdrop-filter="blur(4px)">
        <q-card class="text-black !rounded-[15pt]">
            <q-form @submit="sendBugReport" class="bg-tile p-5 flex flex-col gap-y-2 w-full">
                <q-card-section class="brand-title text-left pb-5"> Отчёт об ошибке </q-card-section>
                <q-separator inset />
                <q-card-section class="brand-description text-gray-700 text-start">
                    Пожалуйста, добавьте любые детали, которые могут помочь в решении проблемы 
                    (например, версия браузера или скриншоты) и прикрепите его к отчету.
                    Опишите проблему в текстовом блоке ниже, например, указав следующую информацию:
                    <ul class="brand-description mt-5 flex gap-y-2">
                        <li>
                            <span class="font-semibold text-gray-700">Шаги:</span>
                            Опишите последовательность действий, которая привела к возникновению ошибки.
                        </li>
                        <li>
                            <span class="font-semibold text-gray-700">Ожидаемый результат:</span>
                            Укажите, что вы ожидали увидеть или получить.
                        </li>
                        <li>
                            <span class="font-semibold text-gray-700">Фактический результат:</span>
                            Опишите, что произошло на самом деле.
                        </li>
                    </ul>
                </q-card-section>
                <q-separator inset />
                <q-card-section class="flex flex-col gap-y-2">
                    <q-input class="brand-description" v-model="comment" outlined clearable type="textarea" label="Введите описание ошибки"/>
                    <q-file
                        v-model="attachFiles"
                        label="Прикрепить файлы"
                        outlined counter
                        use-chips
                        :counter-label="({filesNumber, maxFiles, totalSize}) => `${filesNumber} из ${maxFiles} (общий размер ${totalSize})`"
                        max-files="5"
                        multiple>
                        <template v-slot:prepend><q-icon name="attach_file" /></template>
                    </q-file>
                </q-card-section>
                <q-card-actions align="center">
                    <q-btn label="Отправить" type="submit" class="brand-description" color="brand-velvet"/>
                </q-card-actions>
            </q-form>
        </q-card>
    </q-dialog>
</template>
