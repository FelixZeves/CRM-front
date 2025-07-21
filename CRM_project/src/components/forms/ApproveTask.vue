<script setup>
import { ref, computed, watch, onMounted } from 'vue'
import { StatusEnum_ as St, TaskTypeEnum as T, fileIconsEnum as FI} from '@/components/Enums.vue'
import axios from 'axios'
import { downloadFile } from '@/components/Utils'
import { successNotify } from '@/components/Notifies'

const emit = defineEmits(['update:visible', 'update-list'])
const props = defineProps(['visible', 'body', 'user'])

const visible = computed({
  get: () => props.visible,
  set: val => emit('update:visible', val)
})

const body = computed({
    get:  () => props.body
})

const curStep = ref(body.value.steps.find(step => step.status !== St.APPROVED) ?? body.value.steps[0]);
const step =  ref(body.value.steps.findIndex(step => step.user.id == props.user.profile.id))

async function send(status) {
    form.value.status = status
    form.value.step = body.value.steps[step.value].id

    const fd = new FormData()

    for (const key of ['step', 'status', 'comment']){
        fd.append(key, form.value[key])
    }
        

    for (const key of ['files'])
        form.value[key].forEach(elem => fd.append(key, elem))

    let response = await axios.put('/api/user/task/approve', fd, {headers: {'Content-Type': 'multipart/form-data'}})

    if (response.status == 200){
        successNotify()
        emit('update-list')
    }
}

const isReset = ref(false)
const deadline = ref(body.value.deadline)

async function reset(){
    console.log(body.value)
    let response = await axios.patch('/api/user/task/reset', {tid: body.value.id, deadline: deadline.value})

    if (response.status == 200){
        successNotify()
        emit('update-list')
    }
}

const form = ref({
    step: null,
    status: St.PROGRESS,
    comment: null,
    files: []
})

async function lazyLoad(step){
    if(!step.files[0].title)
        step.files = (await axios.get(`/api/user/file?id=${step.files}`)).data.data
}

watch(step, (newVal, oldVal) => {
    if(body.value.steps[newVal].files.length > 0)
        lazyLoad(body.value.steps[newVal])
})

watch(() => props.body, (newBody) => {
    body.value = newBody
    curStep.value = newBody.steps.find(step => step.status !== St.APPROVED) ?? newBody.steps[0];
    step.value =  newBody.steps.findIndex(step => step.user.id == props.user.profile.id)
    if(body.value.steps[step.value].files.length > 0)
        lazyLoad(body.value.steps[step.value])
})

onMounted(() => {
    if(body.value.steps[step.value].files.length > 0)
        lazyLoad(body.value.steps[step.value])
})

</script>

<template>
    <q-dialog v-model="visible" backdrop-filter="blur(4px)">
        <q-card style="max-width: 50%; min-width: 50%;" class="py-4 px-3 min-w-[50%] max-w-[50%] !flex-nowrap">
            
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
                    v-for="(s, index) in body.steps"
                    :name="index"
                    :title="s.user.fio"
                    :caption="s.status !== St.PROGRESS ? s.update_at : body.deadline"
                    icon="settings"
                    :active-icon="s.status == St.PROGRESS ? 'fa-regular fa-edit' : 'fa-regular fa-eye'"
                    :done-icon="s.status == St.APPROVED ? 'fa-solid fa-check' : 'fa-solid fa-xmark'"
                    :done-color="s.status == St.APPROVED ? 'brand-complete' : 'brand-danger'"
                    :active-color="s.status === St.PROGRESS ? 'brand-velvet' : s.status === St.APPROVED ? 'brand-complete' : 'brand-danger'"
                    :done="s.status == St.APPROVED || s.status == St.REJECTED"
                    :disable="s.status == St.PROGRESS && s.user.id != user.profile.id"
                >
                    <div class="flex flex-col px-8 gap-y-4">
                        <template v-if="s.status !== St.PROGRESS">
                            <div v-if="s.type === T.CREATOR" class="brand-description pb-2 max-h-[250px] overflow-y-auto mb-4">{{ body.description }}</div>
                            <q-list class="pb-4" v-if="s.files.length > 0">
                                <q-expansion-item
                                        switch-toggle-side
                                        header-class="brand-description"
                                        label="Файлы"
                                        >
                                    <q-list class="!flex !flex-col !gap-y-2 w-full">
                                        <q-item v-for="file in s.files" class="gap-x-2 !px-0 !items-center !flex-nowrap">
                                            <q-icon :name="FI[file.title.split('.').pop()] || 'fa-regular fa-file'" size="md"/>
                                            <span class="brand-text flex-grow text-ellipsis line-clamp-1">{{ file.title }}</span>
                                            <span class="brand-text w-[15%]">{{ `${(file.size / (1024 * 1024)).toFixed(2)}MB` }}</span>
                                            <q-btn color="brand-wait" class="!w-[185px] brand-text" text-color="black" label="Скачать" icon-right="bi-download ps-5" @click="downloadFile(file.id)"/>
                                        </q-item>
                                    </q-list>
                                </q-expansion-item>
                            </q-list>
                            
                            <div class="flex flex-col">
                                <div class="pb-2 brand-title underline underline-offset-4">Комментарий</div>
                                <div class="flex-grow brand-description max-h-[250px] overflow-y-auto">{{ s.comment }}</div>
                            </div>
                            <q-list v-if="s.type === T.CREATOR">
                                <q-expansion-item
                                    switch-toggle-side
                                    header-class="brand-description"
                                    label="История выполнения"
                                    >
                                    <div class="brand-description" v-for="his_step in body.history">
                                        <div v-if="his_step.status !== St.PROGRESS">
                                            <div>{{his_step.user.init_name}}</div>
                                            <div><span>Комментарий: </span><br/>{{ his_step.comment }}</div>
                                            <q-list class="pb-4" v-if="his_step.files.length > 0">
                                                <q-expansion-item
                                                        @click="() => {if(his_step.files.length > 0) lazyLoad(his_step)}"
                                                        switch-toggle-side
                                                        header-class="brand-description"
                                                        label="Файлы"
                                                        >
                                                    <q-list class="!flex !flex-col !gap-y-2 w-full">
                                                        <q-item v-for="hf in his_step.files" class="gap-x-2 !px-0 !items-center !flex-nowrap">
                                                            <!-- <q-icon :name="FI[hf.title.split('.').pop()] || 'fa-regular fa-file'" size="md"/> -->
                                                            <span class="brand-text flex-grow text-ellipsis line-clamp-1">{{ hf.title }}</span>
                                                            <span class="brand-text w-[15%]">{{ `${(hf.size / (1024 * 1024)).toFixed(2)}MB` }}</span>
                                                            <q-btn color="brand-wait" class="!w-[185px] brand-text" text-color="black" label="Скачать" icon-right="bi-download ps-5" @click="downloadFile(hf.id)"/>
                                                        </q-item>
                                                    </q-list>
                                                </q-expansion-item>
                                            </q-list>
                                        </div>
                                        <q-separator/>
                                    </div>
                                </q-expansion-item>
                            </q-list>
                            
                            <div v-if="s.status == St.REJECTED && body.steps[0].user.id  == user.profile.id" class="flex flex-row flex-grow justify-between pt-2">
                                <q-btn v-if="isReset != true" color="brand-danger" @click="" label="В архив" class="navigation-btn opacity-[80%] brand-description" />
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
                            <div class="flex flex-row flex-grow justify-between">
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