<script setup>
import { ref } from 'vue'
import { StatusEnum, TypesEnum } from '@/components/Enums.vue'

const props = defineProps(['name', 'description', 'deadline', 'creator', 'documents', 'status', 'comments', 'type'])

const taskManipulation = ref(false)

const tmp = ref(false)
const step =  ref(1)

const taskReport = ref("")

const taskComment = ref("")

const form = ref({
    report: "",
    comment: "",
    files: []
})

</script>

<template>
    <q-btn v-if="type == 'execute'" @click="tmp = true" style="height:30; width: 175px; background-color: var(--crm-c-light-velvet); border-color: var(--crm-c-velvet); border-width: 1.5pt; border-radius: 5pt; color: white;">Отчитаться</q-btn>
    <q-btn v-if="type == 'agree'" @click="tmp = true" style="height:30; width: 175px; background-color: var(--crm-c-light-velvet); border-color: var(--crm-c-velvet); border-width: 1.5pt; border-radius: 5pt; color: white;">Согласовать</q-btn>
    <q-btn v-if="type == 'accept'" @click="tmp = true" style="height:30; width: 175px; background-color: var(--crm-c-light-velvet); border-color: var(--crm-c-velvet); border-width: 1.5pt; border-radius: 5pt; color: white; font-size: small;">Проверить задачу</q-btn>
    <q-btn v-if="type == 'created'" @click="tmp = true" style="height:30; width: 175px; background-color: var(--crm-c-light-velvet); border-color: var(--crm-c-velvet); border-width: 1.5pt; border-radius: 5pt; color: white;">Изучить ход задачи</q-btn>

    <q-dialog v-model="tmp" backdrop-filter="blur(4px)">
        <q-card style="max-width: 50%; min-width: 50%;" class="py-4 px-3 !rounded-[20px]">
            <q-card-section>
                <div class="text-xl font-bold text-center">
                    {{ name }}
                </div>
                <q-stepper
                v-model="step"
                done-color="brand-complete"
                active-color="brand-velvet"
                class="flex-grow"
                header-nav
                vertical
                flat
                animated>
                <q-step
                :name="1"
                :title="creator"
                :caption="deadline"
                icon="settings"
                :done="step > 1">
                    <div class="flex flex-col px-8">
                        <div class="flex-grow text-lg pb-10">Согласно приказа 123.4, необходимо провести опрос учащихся и заполнить таблицу в предоставленном шаблоне. Шаблон прикреплён</div>
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
                            <div class="flex-grow text-lg">Дополнительный комментарий Дополнительный комментарий Дополнительный комментарий Дополнительный комментарий Дополнительный комментарий Дополнительный комментарий </div>
                        </div>
                    </div>
                </q-step>

                <q-step
                    :name="2"
                    title="Вы"
                    :caption="deadline"
                    icon="assignment"
                    :done="step > 2">
                        <div class="flex flex-col px-8 gap-y-4">
                            <q-input
                            v-model="form.report"
                            outlined
                            type="textarea"
                            :rules="[val => val.length >= 4 || 'Минимальная длина 4 символа', val => val.length <= 255 || 'Максимальная длина 255 символов']"
                            label="Текст отчёта"></q-input>
                            <q-file
                            v-model="form.files"
                            label="Прикрепить файлы"
                            outlined
                            bg-color="brand-wait"
                            counter
                            :counter-label="({filesNumber, maxFiles, totalSize}) => `${filesNumber} из ${maxFiles} (общий размер ${totalSize})`"
                            max-files="5"
                            use-chips
                            multiple>
                                <template v-slot:append><q-icon name="attach_file" /></template>
                            </q-file>
                            <q-input
                            v-model="form.comment"
                            outlined
                            type="textarea"
                            :rules="[val => val.length <= 255 || 'Максимальная длина 255 символов']"
                            label="Комментарий"></q-input>
                            <div class="flex flex-row flex-grow justify-end">
                                <q-btn color="brand-velvet" label="Отправить" class="navigation-btn" />
                            </div>
                        </div>
                </q-step>

                <q-step
                    :name="3"
                    title="Вы"
                    :caption="deadline"
                    icon="how_to_reg"
                    :done="step > 3">
                        <div class="flex flex-col px-8 gap-y-4">
                            <q-input
                            v-model="form.comment"
                            outlined
                            type="textarea"
                            :rules="[val => val.length <= 255 || 'Максимальная длина 255 символов']"
                            label="Комментарий"></q-input>
                            <q-file
                            v-model="form.files"
                            label="Прикрепить файлы"
                            outlined
                            bg-color="brand-wait"
                            counter
                            :counter-label="({filesNumber, maxFiles, totalSize}) => `${filesNumber} из ${maxFiles} (общий размер ${totalSize})`"
                            max-files="5"
                            use-chips
                            multiple>
                                <template v-slot:append><q-icon name="attach_file" /></template>
                            </q-file>
                            <div class="flex flex-row flex-grow justify-between">
                                <q-btn color="brand-danger" label="Отклонить" class="navigation-btn opacity-[80%]" />
                                <q-btn color="brand-velvet" label="Согласовать" class="navigation-btn" />
                            </div>
                        </div>
                </q-step>

                <q-step
                    :name="4"
                    title="Вы"
                    :caption="deadline"
                    icon="fact_check"
                    :done="step > 3">
                        <div class="flex flex-col px-8 gap-y-4">
                            <q-input
                            v-model="form.comment"
                            outlined
                            type="textarea"
                            :rules="[val => val.length <= 255 || 'Максимальная длина 255 символов']"
                            label="Комментарий"></q-input>
                            <q-file
                            v-model="form.files"
                            label="Прикрепить файлы"
                            outlined
                            bg-color="brand-wait"
                            counter
                            :counter-label="({filesNumber, maxFiles, totalSize}) => `${filesNumber} из ${maxFiles} (общий размер ${totalSize})`"
                            max-files="5"
                            use-chips
                            multiple>
                                <template v-slot:append><q-icon name="attach_file" /></template>
                            </q-file>
                            <div class="flex flex-row flex-grow justify-between">
                                <q-btn color="brand-danger" label="Отклонить" class="navigation-btn opacity-[80%]" />
                                <q-btn color="brand-velvet" label="Подтвердить" class="navigation-btn" />
                            </div>
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