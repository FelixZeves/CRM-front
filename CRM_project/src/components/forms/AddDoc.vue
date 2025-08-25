<script setup>
import { ref, computed } from 'vue'
import { getDepartments, getFormSchema} from '@/components/Utils'
import axios from 'axios'
import { successNotify } from '@/components/Notifies'
import { FileFocusEnum, FileTypeEnum } from '../Enums.vue'

const props = defineProps(['visible', 'body'])
const emit = defineEmits(['update:visible', 'update-list'])

const buffOptions = ref([])
const typesOptions = Object.values(FileTypeEnum)
const focusOptions = Object.values(FileFocusEnum)

const form = ref(getFormSchema('file'));

if (props.body){
    form.value.id = props.body.id
    form.value.title = props.body.title
    form.value.permanent = props.body.permanent
    form.value.focus = props.body.tags[0].title
    form.value.type = props.body.tags[1].title
    form.value.departments = [...props.body.accesses, props.body.owner]
}

const visible = computed({
  get: () => props.visible,
  set: val => emit('update:visible', val)
})

async function send() {
    const fd = new FormData()

    fd.append('title', form.value.title)
    fd.append('body', form.value.body)
    fd.append('permanent', form.value.permanent)
    fd.append('tags', form.value.type)
    fd.append('tags', form.value.focus)
    form.value.departments.forEach(dep => fd.append('departments', dep))
    

    let response = await axios.post('/api/user/document/upload', fd, {headers: {'Content-Type': 'multipart/form-data'}})
    if (response.status == 200) {
        successNotify()
        emit('update-list')
    }
}

async function edit() {
    const fd = new FormData()

    fd.append('id', form.value.id)
    fd.append('title', form.value.title)
    fd.append('permanent', form.value.permanent)
    fd.append('tags', form.value.type)
    fd.append('tags', form.value.focus)
    form.value.departments.forEach(dep => fd.append('departments', dep.id))
    

    let response = await axios.patch('/api/user/document', fd)
    if (response.status == 200) {
        successNotify()
        emit('update-list')
    }
}

async function lazyLoad() {
    buffOptions.value = (await getDepartments()).data
}
</script>

<template>
    <q-dialog v-model="visible" backdrop-filter="blur(4px)">
        <q-card class="text-black !rounded-[15pt] !flex !w-[90vw] !min-w-[55%]">
            <q-form @submit="body != null ? edit() : send()" class="bg-tile p-5 !flex flex-row w-full h-full gap-2">

                <q-card-section class="flex flex-col w-[55%] gap-y-6">
                    <q-input
                        label="Название документа"
                        required
                        v-model="form.title"
                        outlined
                        hide-bottom-space
                        type="text"
                        class="brand-description"
                        :rules="[val => val.length >= 4 || 'Минимальная длина 4 символа', val => val.length <= 80 || 'Максимальная длина 80 символов']"
                    />
                    <div class="flex flex-row gap-x-4">
                        <q-file
                            v-model="form.body"
                            label="Прикрепите файл"
                            required
                            :disable="body != null"
                            outlined
                            hide-bottom-space
                            bg-color="brand-wait"
                            clearable
                            accept=".pdf, .jpg, .png, .docx, .pptx, .xlsx, .txt, .zip"
                            class="!w-[60%]"
                            :rules="[val => (body == null && val != null)|| 'Обязательно прикрепите файл']">
                                <template v-slot:append><q-icon name="attach_file" /></template>
                        </q-file>
                        <q-checkbox
                            class="brand-description !w-[35%]"
                            label="Бессрочный"
                            indeterminate-value
                            keep-color
                            color="brand-velvet"
                            checked-icon="fa-solid fa-circle"
                            unchecked-icon="fa-solid fa-circle-notch"
                            v-model="form.permanent"
                        />
                    </div>
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
                    />
                    
                </q-card-section>

                <q-card-section class="flex flex-col gap-y-6 flex-grow">
                    
                    <q-select
                        popup-content-class="brand-description"
                        input-class="brand-description"
                        required
                        v-model="form.type"
                        outlined
                        clearable
                        label="Тип"
                        :options="typesOptions"
                    />
                    <q-select
                        popup-content-class="brand-description"
                        input-class="brand-description"
                        required
                        v-model="form.focus"
                        outlined
                        clearable
                        label="Направленность"
                        :options="focusOptions"
                    />
                    <q-btn :label="body != null ? 'Редактировать' : 'Создать'" class="brand-description !h-[56px]" type="submit" color="brand-velvet"/>
                </q-card-section>
            </q-form>
        </q-card>
    </q-dialog>
</template>