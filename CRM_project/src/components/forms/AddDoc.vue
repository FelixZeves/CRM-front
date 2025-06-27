<script setup>
import { ref, computed } from 'vue'
import { getDepartments, getFormSchema} from '@/components/Utils'
import axios from 'axios'

const props = defineProps(['visible'])
const emit = defineEmits(['update:visible', 'update-list'])

const buffOptions = ref([])
const form = ref(getFormSchema('file'));

const visible = computed({
  get: () => props.visible,
  set: val => emit('update:visible', val)
})

async function send() {
    const fd = new FormData()

    fd.append('title', form.value.title)
    fd.append('body', form.value.body)
    fd.append('infinitely', form.value.infinitely)
    form.value.departments.forEach(dep => fd.append('departments', dep))
    form.value.tags.forEach(tag => fd.append('tags', tag))

    await axios.post('/api/user/file', fd, {headers: {'Content-Type': 'multipart/form-data'}})
    emit('update-list')
}

async function lazyLoad() {
    buffOptions.value = (await getDepartments()).data
}
</script>

<template>
    <q-dialog v-model="visible" backdrop-filter="blur(4px)">
        <q-card class="text-black !rounded-[15pt] !flex !w-[90vw] !min-w-[55%]">
            <q-form @submit="send" class="bg-tile p-5 !flex flex-row w-full h-full gap-2">

                <q-card-section class="flex flex-col w-[55%] gap-y-4">
                    <q-input
                        label="Название документа"
                        v-model="form.title"
                        outlined
                        type="text"
                        :rules="[val => val.length >= 4 || 'Минимальная длина 4 символа', val => val.length <= 80 || 'Максимальная длина 80 символов']"
                    />
                    <div class="flex flex-row gap-x-4">
                        <q-file
                            v-model="form.body"
                            label="Прикрепить файлы"
                            outlined
                            hide-bottom-space=""
                            bg-color="brand-wait"
                            clearable
                            class="!w-[60%]"
                            :rules="[val => val != null|| 'Обязательно прикрепите файл']">
                                <template v-slot:append><q-icon name="attach_file" /></template>
                        </q-file>
                        <q-checkbox
                            class="text-gray-700 text-base !w-[35%]"
                            label="Бессрочный"
                            indeterminate-value
                            keep-color
                            color="brand-velvet"
                            checked-icon="fa-solid fa-circle"
                            unchecked-icon="fa-solid fa-circle-notch"
                            v-model="form.infinitely"
                        />
                    </div>
                    
                    
                </q-card-section>

                <q-card-section class="flex flex-col gap-y-4 flex-grow">
                    <q-select
                        label="Отделы"
                        emit-value
                        map-options
                        outlined
                        use-chips
                        multiple
                        :options="buffOptions"
                        :option-label="'title'"
                        :option-value="'id'"
                        v-model="form.departments"
                        @focus="lazyLoad"
                        hint="Чтобы файл был доступен всем, оставьте поле пустым"
                    />
                    <q-select
                        v-model="form.tags"
                        outlined
                        use-chips
                        label="Направленность"

                        />
                    <q-btn label="Создать" type="submit" color="brand-velvet"/>
                </q-card-section>
            </q-form>
        </q-card>
    </q-dialog>
    <!--:rules="[val => val.length  > 0|| 'Обязательно выберите направленность']" -->
</template>

<style scoped>

</style>