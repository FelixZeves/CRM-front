<script setup>
import { ref, computed } from 'vue'
import { StatusEnum_ as St, TaskTypeEnum as T } from '../Enums.vue'
import axios from 'axios'

const emit = defineEmits(['update:visible'])
const props = defineProps(['visible', 'body', 'user'])

const curStep = ref(props.body.steps.find(step => step.status !== St.APPROVED) ?? props.body.steps[0]);
const step =  ref(props.body.steps.findIndex(step => step.user.id == props.user.profile.id))

const successNotify = () => q.notify({type: 'positive', position: 'top', message: 'Успех!'})

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

</script>

<template>
    <q-dialog v-model="visible" backdrop-filter="blur(4px)">
        <q-card style="max-width: 50%; min-width: 50%;" class="py-4 px-3 min-w-[50%] max-w-[50%]">
            
            <q-card-section>
                <div class="text-xl font-bold text-center">{{ body.title }}</div>
                <q-stepper
                    v-model="step"
                    done-color="brand-complete"
                    active-color="brand-velvet"
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
                    :done="s.status == St.APPROVED"
                    :disable="s.status == St.PROGRESS && s.user.id != user.profile.id"
                >
                    <div class="flex flex-col px-8 gap-y-4">
                        <template v-if="s.status !== St.PROGRESS">
                            <div v-if="s.type === T.CREATOR" class="text-lg pb-10 max-h-[250px] overflow-y-auto mb-4">{{ body.description }}</div>
                            <div class="flex flex-row gap-x-4 pb-10">
                                <q-icon name="fa-solid fa-file-export" size="sm">
                                    <q-tooltip
                                    anchor="top middle"
                                    self="bottom middle"
                                    :offset="[10, 10]"
                                    max-width="200px"
                                    class="!text-sm text-center">
                                        {{ documents }}
                                    </q-tooltip>
                                </q-icon>
                            </div>
                            <div class="flex flex-col">
                                <div class="text-xl pb-2 text-semibold underline underline-offset-4">Комментарий</div>
                                <div class="flex-grow text-lg max-h-[250px] overflow-y-auto">{{ s.comment }}</div>
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
                                <q-btn color="brand-danger" @click="send(St.REJECTED)" label="Отклонить" class="navigation-btn opacity-[80%]" />
                                <q-btn color="brand-velvet" @click="send(St.APPROVED)" :label="s.type == T.REVIEWER ? 'Согласовать' : 'Утвердить'" class="navigation-btn" />
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