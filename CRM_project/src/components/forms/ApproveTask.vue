<script setup>
import { ref, computed, watch, onMounted } from 'vue'
import { StatusEnum_ as St, TaskTypeEnum as T, fileIconsEnum as FI} from '@/components/Enums.vue'
import axios from 'axios'
import { downloadFile } from '@/components/Utils'
import { successNotify } from '@/components/Notifies'

const emit = defineEmits(['update:visible'])
const props = defineProps(['visible', 'body', 'user'])

const curStep = ref(props.body.steps.find(step => step.status !== St.APPROVED) ?? props.body.steps[0]);
const step =  ref(props.body.steps.findIndex(step => step.user.id == props.user.profile.id))

const visible = computed({
  get: () => props.visible,
  set: val => emit('update:visible', val)
})

async function send(status) {
    form.value.status = status
    form.value.step = props.body.steps[step.value].id
    let response = await axios.put('/api/user/task/approve', form.value)

    if (response.status == 200) successNotify()
}

const form = ref({
    step: null,
    status: St.PROGRESS,
    report: "",
    comment: null,
    files: []
})

const files = ref(null)

async function lazyLoad(index){
    console.log(props.body.steps[index])
    if(props.body.steps[index].status != St.PROGRESS)
        files.value = (await axios.get(`/api/user/file?id=${props.body.steps[index].files}`)).data.data
}

watch(step, (newVal, oldVal) => {
    lazyLoad(newVal);
});

onMounted(() => lazyLoad(step.value))

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
                    :caption="s.id !== curStep.id ? s.update_at : body.deadline"
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
                            <div class="flex flex-row gap-x-4 pb-4">
                                <q-list class="!flex !flex-col !gap-y-2 w-full">
                                    <q-item v-for="file in files" class="gap-x-2 !px-0 !items-center !flex-nowrap">
                                        <q-icon :name="FI[file.title.split('.').pop()] || 'fa-regular fa-file'" size="md"/>
                                        <span class="brand-text flex-grow text-ellipsis line-clamp-1">{{ file.title }}</span>
                                        <span class="brand-text w-[15%]">{{ `${(file.size / (1024 * 1024)).toFixed(2)}MB` }}</span>
                                        <q-btn color="brand-wait" class="!w-[185px] brand-text" text-color="black" label="Скачать" icon-right="bi-download ps-5" @click="downloadFile(file.id)"/>
                                    </q-item>
                                </q-list>
                            </div>
                            <div class="flex flex-col">
                                <div class="pb-2 brand-title underline underline-offset-4">Комментарий</div>
                                <div class="flex-grow brand-description max-h-[250px] overflow-y-auto">{{ s.comment }}</div>
                            </div>
                        </template>
                        <template v-else-if="s.type === T.EXECUTOR && s.status !== St.APPROVED">
                            <!-- <q-input
                                v-model="form.report"
                                outlined
                                type="textarea"
                                :rules="[val => val.length >= 4 || 'Минимальная длина 4 символа', val => val.length <= 255 || 'Максимальная длина 255 символов']"
                                label="Текст отчёта"
                            /> -->
                            <q-file
                                v-model="form.files"
                                label="Прикрепить файлы"
                                outlined
                                bg-color="brand-wait"
                                counter
                                :counter-label="({filesNumber, maxFiles, totalSize}) => `${filesNumber} из ${maxFiles} (общий размер ${totalSize})`"
                                max-files="5"
                                use-chips
                                multiple
                            >
                                <template v-slot:append><q-icon name="attach_file" /></template>
                            </q-file>
                            <q-input
                                v-model="form.comment"
                                outlined
                                type="textarea"
                                :rules="[val => val.length <= 255 || 'Максимальная длина 255 символов']"
                                class="brand-description"
                                label="Комментарий"
                            />
                            <div class="flex flex-row flex-grow justify-end">
                                <q-btn color="brand-velvet" @click="send(St.APPROVED)" label="Отправить" class="navigation-btn" />
                            </div>
                        </template>
                        <template v-else-if="(s.type == T.REVIEWER || s.type == T.CHECKER) && s.status != St.APPROVED">
                            <q-input
                                v-model="form.comment"
                                outlined
                                type="textarea"
                                :rules="[val => val.length <= 255 || 'Максимальная длина 255 символов']"
                                class="brand-description"
                                label="Комментарий"/>
                            <q-file
                                v-model="form.files"
                                label="Прикрепить файлы"
                                outlined
                                bg-color="brand-wait"
                                counter
                                :counter-label="({filesNumber, maxFiles, totalSize}) => `${filesNumber} из ${maxFiles} (общий размер ${totalSize})`"
                                max-files="5"
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
    @apply !w-[150px]
}

</style>