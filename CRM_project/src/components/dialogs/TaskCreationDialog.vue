<script setup>
import axios from 'axios'
import { onMounted, ref } from 'vue'
import { getDepartments, getSupervisors } from '../Utils'

const props = defineProps(['taskType'])

const departments = ref([])

const executors = ref([])

const reviewers =  ref([])

const сheckers = ref([])

var title = ""

var hint = ""

switch(props.taskType){
    case 'application':
        title = "Заявка"
        hint = "заявки"
        break
    case 'task':
        title = "Задача"
        hint = "задачи"
        break
    case 'memo':
        title = "Служебная записка"
        hint = "служебной записки"
}

const taskCreation = ref(false)

const taskName = ref("")

const taskDescription = ref("")

const taskComment = ref("")

const taskDeps = ref(Array())

const taskExecs = ref(Array())

const taskRevs = ref(Array())

const taskChecks = ref(Array())

function getTodayDate() {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, '0');
    const day = String(today.getDate()).padStart(2, '0');
    return `${day}/${month}/${year}`;
}

const tasktDate = ref(getTodayDate())

const taskFiles = ref(Array())

function checkDock(){
    console.log(taskFiles)
}

onMounted(async () => {
    if (props.taskType == 'application'){
        let depResponse =  await getDepartments()

        departments.value = depResponse
    }
    else if(props.taskType == 'memo'){

    }
    else if(props.taskType == 'task'){

    }
})

</script>

<template>

    <q-item-section @click="taskCreation = true">{{ title }}</q-item-section>
    
    <q-dialog v-model="taskCreation" backdrop-filter="blur(4px)">
        <q-card style="max-width: 75%; min-width: 75%;" class="py-4 !rounded-[20px]">
            <q-card-section>
                <p class="text-lg text-black mb-2 ps-3 underline underline-offset-[6px]">Название {{ hint }}</p>
                <q-input
                    v-model="taskName"
                    :rules="[val => val && val.length > 0 || 'Введите название']"
                    hide-bottom-space
                    dense
                    borderless
                    color="black"
                    label-color="black"
                    placeholder="Введите название задачи..."
                    class="ps-4 bg-[--vt-c-white-mute] !rounded-[10pt] border-[0.5pt] border-[--crm-c-medium-gray]">

                </q-input>
            </q-card-section>

            <q-card-section>
                <p class="text-lg text-black mb-2 ps-3 underline underline-offset-[6px]">Основная информация</p>
                <q-input
                    v-model="taskDescription"
                    :rules="[val => val && val.length > 0 || 'Введите основную информацию']"
                    hide-bottom-space
                    dense
                    borderless
                    color="black"
                    label-color="black"
                    placeholder="Введите описание задачи..."
                    class="ps-4 bg-[--vt-c-white-mute] !rounded-[10pt] border-[0.5pt] border-[--crm-c-medium-gray]">
                </q-input>
            </q-card-section>
    
            <q-card-section>
                <p class="text-lg text-black mb-2 ps-3 underline underline-offset-[6px]">Дополнительный комментарий</p>
                <q-input
                    v-model="taskComment"
                    hide-bottom-space
                    dense
                    borderless
                    color="black" 
                    label-color="black"
                    placeholder="Дополнительный комментарий..."
                    hint="Необязательное поле"
                    class="ps-4 bg-[--vt-c-white-mute] !rounded-[10pt] border-[0.5pt] border-[--crm-c-medium-gray]">
                </q-input>
            </q-card-section>

            <q-card-section style="padding-left: 0; padding-right: 0;">
                <div class="flex flex-row justify-between ">
                    <div class="w-1/2 flex flex-col justify-between items-center">
                        <p class="text-lg text-black mb-2 underline underline-offset-[6px]">Время выполнения</p>
                        <q-input
                        style="background: var(--crm-c-light-yellow); border-radius: 5pt; padding-left: 5pt; padding-right: 5pt; width: 75%"
                        input-style="background-color: white; height:75%; align-self: center; border-radius: 5pt; padding-left: 5px; padding-right: 5px; justify-items: center"
                        mask="## | ## | ####"
                        dense
                        borderless
                        v-model="tasktDate">
                        <template v-slot:append>
                            <q-icon name="event" class="cursor-pointer">
                            <q-popup-proxy cover transition-show="scale" transition-hide="scale">
                                <q-date minimal mask="DD/MM/YYYY" v-model="eventDateSolo">
                                    <div class="row items-center justify-end">
                                        <q-btn v-close-popup color="primary" flat>
                                            <q-icon name="close"></q-icon>
                                        </q-btn>
                                    </div>
                                </q-date>
                            </q-popup-proxy>
                            </q-icon>
                        </template>
                        </q-input>
                    </div>
                    <div class="w-1/2 flex flex-col justify-between items-center">
                        <p class="text-lg text-black mb-2 underline underline-offset-[6px]">Файлы {{ hint }}</p>
                        <q-file
                        v-model="taskFiles"
                        label="Добавить файл"
                        borderless
                        dense
                        multiple
                        max-files="5"
                        
                        accept=".pdf, .zip, .7z, .dockx, .png"
                        counter
                        use-chips
                        style="background: var(--crm-c-light-yellow); border-radius: 5pt; padding-left: 5pt; padding-right: 5pt; width: 75%; height: 40px;">
                            <template v-slot:after>
                            <q-icon name="attach_file" />
                            </template>
                        </q-file>
                    </div>
                </div>
            </q-card-section>

            <q-card-section>
                <div v-if="taskType == 'application'" class="flex flex-col justify-between">
                    <p class="text-lg text-black mb-2 underline underline-offset-[6px]">Отделы</p>
                    <q-select multiple use-chips v-model="taskDeps" :options="departments" label="Выбрать отдел"/>
                </div>
                <div v-if="taskType == 'memo'" class="flex flex-col justify-between">
                    <p class="text-lg text-black mb-2 underline underline-offset-[6px]">Согласующие</p>
                    <q-select multiple use-chips v-model="taskRevs" :options="reviewers" label="Выбрать согласующих"/>
                </div>
                <div v-if="taskType == 'task'" class="flex flex-col justify-between pb-2">
                    <p class="text-lg text-black mb-2 underline underline-offset-[6px]">Исполнители</p>
                    <q-select multiple use-chips v-model="taskExecs" :options="executors" label="Выбрать исполнителей"/>
                </div>
                <div v-if="taskType == 'task'" class="flex flex-col justify-between pb-2">
                    <p class="text-lg text-black mb-2 underline underline-offset-[6px]">Согласующие</p>
                    <q-select multiple use-chips v-model="taskRevs" :options="reviewers" label="Выбрать согласующих"/>
                </div>
                <div v-if="taskType == 'task'" class="flex flex-col justify-between pb-2">
                    <p class="text-lg text-black mb-2 underline underline-offset-[6px]">Проверяющие</p>
                    <q-select multiple use-chips v-model="taskChecks" :options="сheckers" label="Выбрать проверающих"/>
                </div>
            </q-card-section>
    
            <q-card-actions align="center">
                <q-btn label="Отправить" type="submit" @click="checkDock" rounded class="submit-btn" v-close-popup />
            </q-card-actions>
        </q-card>
    </q-dialog>
</template>