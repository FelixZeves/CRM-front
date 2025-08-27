<script setup>
import { ref, computed, watch, onMounted } from 'vue'
import { StatusEnum_ as St, TaskTypeEnum as T, fileIconsEnum as FI} from '@/components/Enums.vue'
import axios from 'axios'
import { downloadFile } from '@/components/Utils'
import { confirmNotify, successNotify } from '@/components/Notifies'

const emit = defineEmits(['update:visible', 'update-list'])
const props = defineProps(['visible', 'body', 'user'])
const tab = ref('comment')
const url = '/api/user/task'

const visible = computed({
  get: () => props.visible,
  set: val => emit('update:visible', val)
})

const body = computed({
    get:  () => props.body
})

const step = ref(body.value.active.findIndex(step => step.user.id == props.user.profile.id))
const isCreator = (type) => { return type === T.CREATOR }

const form = ref({
    id: null,
    status: St.PROGRESS,
    comment: null,
    files: []
})

async function send(status) {
    form.value.status = status
    form.value.id = body.value.active[step.value].id

    const fd = new FormData()

    for (const key of ['id', 'status', 'comment']){
        fd.append(key, form.value[key])
    }
        
    for (const key of ['files'])
        form.value[key].forEach(elem => fd.append(key, elem))

    let response = await axios.put(`${url}/approve`, fd, {headers: {'Content-Type': 'multipart/form-data'}})

    if (response.status == 200){
        successNotify()
        emit('update-list')
    }
}

const isReset = ref(false)
const deadline = ref(body.value.deadline)

async function reset(){
    let response = await axios.patch(`${url}/rollback/${body.value.id}`, { deadline: deadline.value})

    if (response.status == 200){
        successNotify('Задача перезапущена')
        emit('update-list')
    }
}

async function toArchive(){
    let response = await axios.put(`${url}/archive/${props.body.id}`)

    if (response.status == 200){
        successNotify('Задача отправлена в архив')
        visible.value = false
        emit('update-list')
    }
}

async function deleteTask(){
    let response = await axios.delete(`${url}/${props.body.id}`)

    if (response.status == 200){
        successNotify('Задача удалена')
        visible.value = false
        emit('update-list')
    }
}

async function lazyLoad(step){
    if(!step.files[0].title)
        step.files = (await axios.get(`/api/user/file?id=${step.files}`)).data.data
}

watch(step, (newVal, oldVal) => {
    if(body.value.active[newVal].files.length > 0)
        lazyLoad(body.value.active[newVal])
})

watch(() => props.body, (newBody) => {
    body.value = newBody
    step.value =  newBody.active.findIndex(step => step.user.id == props.user.profile.id)
    if(body.value.active[step.value].files.length > 0)
        lazyLoad(body.value.active[step.value])
})

onMounted(() => {
    if(body.value.active[step.value].files.length > 0)
        lazyLoad(body.value.active[step.value])
})

</script>

<template>
    <q-dialog v-model="visible" backdrop-filter="blur(4px)">
        <q-card class="py-4 px-3 min-w-[50%] max-w-[50%] !flex-nowrap">
            
            <q-card-section>
                <div class="brand-title text-center">{{ body.title }}</div>
                <q-stepper
                    v-model="step"
                    class="flex-grow"
                    header-nav
                    vertical
                    flat
                    animated
                >
                <q-step
                    v-for="(s, index) in body.active"
                    :name="index"
                    :title="s.user.fio"
                    :caption="s.status !== St.PROGRESS ? s.update_at : body.deadline"
                    icon="settings"
                    :active-icon="s.status == St.PROGRESS ? 'fa-regular fa-edit' : 'fa-solid fa-info'"
                    :done-icon="s.status == St.APPROVED ? 'fa-solid fa-check' : 'fa-solid fa-xmark'"
                    :done-color="s.status == St.APPROVED ? 'brand-complete' : 'brand-danger'"
                    :active-color="s.status === St.PROGRESS ? 'brand-velvet' : s.status === St.APPROVED ? 'brand-complete' : 'brand-danger'"
                    :done="s.status == St.APPROVED || s.status == St.REJECTED"
                    :disable="s.status == St.PROGRESS && s.user.id != user.profile.id"
                >
                    <div class="flex flex-col">
                        <template v-if="s.status !== St.PROGRESS">
                            <q-tabs
                                v-model="tab"
                                dense
                                class="!w-2/3 brand-description"
                                active-color="brand-velvet"
                                indicator-color="brand-velvet"
                                align="left"
                                narrow-indicator
                                >
                                <q-tab name="details" class="brand-description" label="Описание" v-if="isCreator(s.type)"/>
                                <q-tab name="comment" class="brand-description" label="Комментарий" />
                                <q-tab name="files" class="brand-description" label="Файлы" v-if="s.files.length > 0"/>
                                <q-tab name="history" class="brand-description" label="История" v-if="isCreator(s.type)  && body.archive.length > 0"/>
                            </q-tabs>

                            <q-tab-panels
                                class="!max-h-[65%] !min-h-[350px]"
                                v-model="tab"
                                transition-next="slide-left"
                                transition-prev="slide-right"
                                animated
                            >
                            <q-tab-panel name="details" class="brand-description overflow-y-auto" v-if="isCreator(s.type)">{{ body.description }}</q-tab-panel>
                            <q-tab-panel name="comment" class="brand-description overflow-y-auto">{{ s.comment }}</q-tab-panel>
                            <q-tab-panel name="files" v-if="s.files.length > 0">
                                <q-list class="!flex !flex-col !gap-y-2 w-full">
                                    <q-item v-for="file in s.files" class="gap-x-2 !px-0 !items-center !flex-nowrap">
                                        <q-icon :name="file.title ? FI[file.title.split('.').pop()] : 'fa-regular fa-file'" size="md"/>
                                        <span class="brand-text flex-grow text-ellipsis line-clamp-1">{{ file.title }}</span>
                                        <span class="brand-text w-[15%]">{{ `${(file.size / (1024 * 1024)).toFixed(2)}MB` }}</span>
                                        <q-btn color="brand-wait" class="!w-[185px] brand-text" text-color="black" label="Скачать" icon-right="bi-download ps-5" @click="downloadFile('/api/user/task/download',file.id)"/>
                                    </q-item>
                                </q-list>
                            </q-tab-panel>
                            <q-tab-panel name="history" v-if="isCreator(s.type) && body.archive.length > 0">
                                <q-list>
                                    <q-expansion-item
                                        v-for="hs in body.archive"
                                        group="history steps"
                                        :icon="hs.status == St.APPROVED ? 'fa-solid fa-circle-check' : 'fa-solid fa-circle-xmark'"
                                        :label="hs.user.init_name"
                                        :caption="hs.update_at"
                                        :header-class="hs.status == St.APPROVED ? 'text-positive text-lg' : 'text-negative text-lg'"
                                        @click="() => {if(hs.files.length > 0) lazyLoad(hs)}"
                                    >
                                        <q-card>
                                        <q-card-section class="brand-description min-h-[150px]">{{ hs.comment }}</q-card-section>
                                        <q-card-section>
                                            <q-list>
                                                <q-item v-for="hf in hs.files" class="gap-x-2 !px-0 !items-center !flex-nowrap">
                                                            <q-icon :name="hf.title ? FI[hf.title.split('.').pop()] : 'fa-regular fa-file'" size="md"/>
                                                            <span class="brand-text flex-grow text-ellipsis line-clamp-1">{{ hf.title }}</span>
                                                            <span class="brand-text w-[15%]">{{ `${(hf.size / (1024 * 1024)).toFixed(2)}MB` }}</span>
                                                            <q-btn color="brand-wait" class="!w-[185px] brand-text" text-color="black" label="Скачать" icon-right="bi-download ps-5" @click="downloadFile('/api/user/task/download', hf.id)"/>
                                                </q-item>
                                            </q-list>
                                        </q-card-section>
                                    </q-card>
                                </q-expansion-item>
                                </q-list>                                
                            </q-tab-panel>
                            </q-tab-panels>
                            
                            <div v-if="s.status == St.REJECTED && body.active[0].user.id  == user.profile.id && body.is_archive != true && body.gid === null" class="flex flex-row flex-grow justify-between pt-2">
                                <q-btn v-if="isReset != true" color="brand-danger" @click="confirmNotify(deleteTask)" label="Удалить" class="navigation-btn opacity-[80%] brand-description" />
                                <q-btn v-if="isReset != true" color="brand-danger" @click="confirmNotify(toArchive)" label="В архив" class="navigation-btn opacity-[80%] brand-description" />
                                <q-btn v-if="isReset != true" color="brand-velvet" @click="isReset = true" label="Сбросить задачу" class="navigation-btn brand-description" />
                                <q-form @submit.prevent="reset" v-if="isReset == true" class="flex flex-row w-full gap-x-2">
                                    <q-btn unelevated icon="fa-solid fa-arrow-left" class="text-brand-danger opacity-[80%] !h-[56px]" @click="isReset=false">
                                        <q-tooltip
                                            anchor="top middle"
                                            self="bottom middle"
                                            :offset="[10, 10]"
                                            max-width="200px"
                                            class="!text-sm text-center bg-brand-danger opacity-[80%]"
                                        >
                                            Вернуться назад
                                        </q-tooltip>
                                    </q-btn>
                                    <q-input
                                        label="Новый срок выполнения"
                                        class="flex-grow"
                                        v-model="deadline"
                                        required
                                        
                                        outlined
                                        :rules="[val => !val || val.length > 0 || 'Обязательное поле']"
                                    >
                                        <template v-slot:append>
                                            <q-icon name="event" color="brand-velvet">
                                                <q-popup-proxy cover transition-show="scale" transition-hide="scale">
                                                    <q-date
                                                        v-model="deadline"
                                                        minimal
                                                        mask="DD.MM.YYYY"
                                                        class="brand-description"
                                                        >
                                                        <q-btn class="flex flex-row brand-description" v-close-popup label="Закрыть" flat/>
                                                    </q-date>
                                                </q-popup-proxy>
                                            </q-icon>
                                        </template>
                                    </q-input>
                                    <q-btn type="submit" class="brand-description !h-[56px]" color="brand-velvet" label="Принять"/>
                                </q-form>
                            </div>

                            <div v-if="body.status == St.APPROVED && body.active[0].user.id  == user.profile.id && index == (body.active.length - 1) && body.is_archive != true && body.gid === null" class="flex flex-row flex-grow justify-between pt-2">
                                <q-btn color="brand-danger" @click="confirmNotify(deleteTask)" label="Удалить" class="navigation-btn opacity-[80%] brand-description" />
                                <q-btn color="brand-velvet" @click="confirmNotify(toArchive)" label="В архив" class="navigation-btn brand-description" />
                            </div>
                        </template>
                        <template v-else-if="s.type === T.EXECUTOR && s.status !== St.APPROVED">
                            <q-input
                                v-model="form.comment"
                                outlined
                                type="textarea"
                                :rules="[val => !val || val.length <= 1000 || 'Максимальная длина 1000 символов',
                                        val => !val || val.length>=4 || 'Минимальная длина 4 символа']"
                                class="brand-description"
                                label="Отчёт"
                            />
                            <q-file
                                v-model="form.files"
                                label="Прикрепить файлы"
                                outlined
                                bg-color="brand-wait"
                                :rules="[
                                            val => !val || val.length <= 5 || 'Достигнут лимит в 5 файлов. Объедините их в zip архив',
                                            val => {
                                                        if (!val) return true
                                                        const totalSize = val.reduce((sum, file) => sum + file.size, 0)
                                                        const sizeInMB = totalSize / (1024 * 1024)
                                                        return totalSize <= 30 * 1024 * 1024 || `Общий размер файлов не должен превышать 30MB. Размер ${sizeInMB.toFixed(2)}MB`
                                                    }
                                        ]"
                                use-chips
                                multiple
                            >
                                <template v-slot:append><q-icon name="attach_file" /></template>
                            </q-file>
                            <div class="flex flex-row flex-grow justify-end">
                                <q-btn color="brand-velvet" @click="send(St.APPROVED)" label="Отправить" class="navigation-btn" />
                            </div>
                        </template>
                        <template v-else-if="(s.type == T.REVIEWER || s.type == T.CHECKER) && s.status != St.APPROVED">
                            <q-input
                                v-model="form.comment"
                                outlined
                                type="textarea"
                                :rules="[val => !val || val.length <= 1000 || 'Максимальная длина 1000 символов',
                                        val => !val || val.length>=4 || 'Минимальная длина 4 символа']"
                                class="brand-description"
                                label="Комментарий"/>
                            <q-file
                                v-model="form.files"
                                label="Прикрепить файлы"
                                outlined
                                bg-color="brand-wait"
                                :rules="[
                                            val => !val || val.length <= 5 || 'Достигнут лимит в 5 файлов. Объедините их в zip архив',
                                            val => {
                                                        if (!val) return true
                                                        const totalSize = val.reduce((sum, file) => sum + file.size, 0)
                                                        const sizeInMB = totalSize / (1024 * 1024)
                                                        return totalSize <= 30 * 1024 * 1024 || `Общий размер файлов не должен превышать 30MB. Размер ${sizeInMB.toFixed(2)}MB`
                                                    }
                                        ]"
                                use-chips
                                multiple
                            >
                            <template v-slot:append><q-icon name="attach_file" /></template>
                            </q-file>
                            <div class="flex flex-row flex-grow justify-between pt-2">
                                <q-btn color="brand-danger" @click="send(St.REJECTED)" label="Отклонить" class="navigation-btn opacity-[80%] brand-description" />
                                <q-btn color="brand-velvet" @click="send(St.APPROVED)" :label="s.type == T.REVIEWER ? 'Согласовать' : 'Утвердить'" class="navigation-btn brand-description" />
                            </div>
                        </template>
                    </div>
                </q-step>
                </q-stepper>
            </q-card-section>
        </q-card>
    </q-dialog>
</template>

<style scoped>

.navigation-btn{
    @apply !min-w-[150px]
}

</style>