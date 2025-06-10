<script setup>
import axios from 'axios'
import { computed, onMounted, ref } from 'vue'
import { getDepartments, getSupervisors } from '@/components/Utils'

const props = defineProps(['visible'])
const emit = defineEmits(['update:visible', 'update-list'])

const role = ref()

async function getUser(){

try {
    const response = await axios.get('/api/user/me');

    role.value = response.data.role;
    
} catch (error) {
    console.error('Ошибка авторизации:', error.response?.data || error.message);
}

}
getUser()

const today = new Date().toLocaleDateString('ru-RU', { day: '2-digit', month: '2-digit', year: 'numeric' });

const step = ref(1)

const task = ref({
    title: '',
    description: '',
    comment:  '',
    deadline: today,
    files: [],
    executors: [],
    reviewers: [],
    checkers: [],
    type: "2",    
})

const activeEvent = ref(false)
const eventForMe =  ref(false)

const event = ref({
    title: '',
    description: '',
    place: '',
    recivers: [],
    at: today,
    to: today
});

const date = ref({ from: today, to: today });

const formatDate = computed(() => {
    const { from, to } = date.value;
    return from === to ? from : `${from} - ${to}`;
});

function selectDate(val) {
    let newDate;
    if (typeof val === 'object')
        newDate = {...val};

    if (typeof val === 'string')
        newDate = { from: val, to: val };

    date.value = newDate;
    event.value.at = newDate.from;
    event.value.to = newDate.to;
}

function clearForm() {
    if (step.value === 1) {
        for (const key in task.value) {
        const value = task.value[key]
        if (typeof value === 'string') {
            task.value[key] = ''
        } else if (Array.isArray(value)) {
            task.value[key] = []
        }
        }
        task.value.deadline = today
        task.value.type = "2"
    } 
    else if (step.value === 2) {
        for (const key in event.value) {
        const value = event.value[key]
        if (typeof value === 'string')
            event.value[key] = ''
        }
        event.value.at = today
        event.value.to = today
        eventForMe.value = false
    }
}

function throwData(){
    event.value.title = task.value.title
    event.value.description = task.value.description
    event.value.to = task.value.deadline
}

function clearDialog(){
    step.value = 2
    clearForm()
    step.value=1
    clearForm()
}

const visible = computed({
  get: () => props.visible,
  set: val => emit('update:visible', val)
})

function checkDock(){
    console.log(taskFiles)
}

</script>

<template>

<q-dialog v-model="visible" backdrop-filter="blur(4px)" @hide="clearDialog">
    <q-card class="text-black !rounded-[15pt] !flex !flex-col !w-[90vw] !min-w-[50%] !max-w-[65%] !bg-tile">
        <q-card-section class="!flex flex-row !ps-0 items-center">
            <q-stepper
            v-model="step"
            vertical
            done-color="brand-complete"
            active-color="brand-velvet"
            class="flex-grow"
            contracted
            flat
            animated
            >
            <q-step
                :name="1"
                title="Создание задачи"
                icon="fa-regular fa-file-lines"
                class="row-grow"
                :done="step > 1"
            >
            <q-tabs
            v-model="task.type"
            class="!text-lg !font-bold"
            active-color="primary"
            indicator-color="primary"
            align="justify"
            narrow-indicator
            >
                <q-tab v-if="role !=3" name="0" label="Задача" />
                <q-tab name="2" label="Служебная записка" />
                <q-tab name="1" label="Заявка" />
            </q-tabs>
            <div class="!flex !flex-col">
                <q-form class=" p-5 !flex flex-row h-full gap-x-12">
                    <div class="flex flex-col gap-y-8 w-1/2">
                        <div class="flex flex-row gap-x-2">
                            <q-btn icon="refresh" color="brand-danger opacity-[80%]" @click="clearForm()">
                                <q-tooltip
                                anchor="top middle"
                                self="bottom middle"
                                :offset="[10, 10]"
                                max-width="200px"
                                class="!text-sm text-center bg-brand-danger opacity-[80%]">
                                    Сбросить поля
                                </q-tooltip>
                            </q-btn>
                            <q-input
                            v-model="task.title"
                            outlined
                            hide-bottom-space
                            type="text"
                            label="Название задачи"
                            :rules="[val => val.length >= 4 || 'Минимальная длина 4 символа', val => val.length <= 80 || 'Максимальная длина 80 символов']"
                            class="!flex-grow"></q-input>
                        </div>
                        <q-input
                        v-model="task.description"
                        outlined
                        type="textarea"
                        label="Описание задачи"
                        :rules="[val => val.length >= 4 || 'Минимальная длина 4 символа', val => val.length <= 1000 || 'Максимальная длина 1000 символов']"/>
                        <q-input
                        v-model="task.comment"
                        outlined
                        type="textarea"
                        label="Дополнительный комментарий"
                        :rules="[val => val.length <= 255 || 'Максимальная длина 255 символов']"/>
                    </div>
                    <div class="flex flex-col gap-y-8 w-1/2">
                        <q-input label="Дата выполнения" v-model="task.deadline" readonly outlined>
                            <template v-slot:append>
                                <q-icon name="event" color="brand-velvet">
                                    <q-popup-proxy cover transition-show="scale" transition-hide="scale">
                                        <q-date
                                            v-model="task.deadline"
                                            minimal
                                            mask="DD.MM.YYYY"
                                            >
                                            <q-btn class="flex flex-row" v-close-popup label="Закрыть" flat/>
                                        </q-date>
                                    </q-popup-proxy>
                                </q-icon>
                            </template>
                        </q-input>
                        <q-file
                            v-model="task.files"
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
                        <q-select v-if="task.type == 0" v-model="task.executors" outlined use-chips label="Исполнитель (-и)"/> 
                        <q-select v-if="task.type != 1" v-model="task.reviewers" outlined use-chips label="Согласующий (-ие)"/>
                        <q-select v-if="task.type == 0" v-model="task.checkers" outlined use-chips label="Проверяющий (-ие)"/>
                        <q-select v-if="task.type == 1" v-model="task.executors" outlined use-chips label="Отделы"/>
                    </div>
                </q-form>
            </div>
            </q-step>

            <q-step
                v-if="task.type == 0"
                :name="2"
                title="Создание мероприятия"
                class="row-grow"
                icon="add"
                :done="step > 2"
            >
                <q-form @submit="checkDock" class=" p-5 !flex flex-row h-full gap-x-12">
                    <div class="flex flex-col gap-y-8 w-1/2">
                        <q-toggle v-model="activeEvent" label="Создать мероприятие исполнителям"></q-toggle>
                        <q-toggle :disable="!activeEvent" v-model="eventForMe" label="Создать для себя"></q-toggle>
                        <div class="flex flex-row gap-x-2">
                            <q-btn icon="refresh" color="brand-danger opacity-[80%]" @click="clearForm()">
                                <q-tooltip
                                anchor="top middle"
                                self="bottom middle"
                                :offset="[10, 10]"
                                max-width="200px"
                                class="!text-sm text-center bg-brand-danger opacity-[80%]">
                                    Сбросить поля
                                </q-tooltip>
                            </q-btn>
                            <q-input :disable="!activeEvent" label="Дата выполнения" v-model="formatDate" readonly outlined  class="flex-grow">
                                <template v-slot:append>
                                    <q-icon name="event" color="brand-velvet">
                                        <q-popup-proxy cover transition-show="scale" transition-hide="scale">
                                            <q-date
                                                v-model="date"
                                                minimal
                                                range
                                                mask="DD.MM.YYYY"
                                                @update:model-value="selectDate"
                                                >
                                                <q-btn class="flex flex-row" v-close-popup label="Закрыть" flat/>
                                            </q-date>
                                        </q-popup-proxy>
                                    </q-icon>
                                </template>
                            </q-input>
                        </div>
                        <div class="text-gray-500">Чтобы создать мероприятие с одной датой проведения, дважды нажмите на необходимую дату.</div>
                        <q-select :disable="!activeEvent" v-model="event.recivers" label="Получатели" use-chips></q-select>
                    </div>
                    <div class="flex flex-col gap-y-8 w-1/2">
                       <q-input
                       :disable="!activeEvent"
                       v-model="event.title"
                       :rules="[val => val.length >= 4 || 'Минимальная длина 4 символа', val => val.length <= 80 || 'Максимальная длина 80 символов']"
                       label="Название мероприятия"></q-input>
                       <q-input
                       :disable="!activeEvent"
                       v-model="event.place"
                       label="Место проведения"></q-input>
                       <q-input
                       :disable="!activeEvent"
                       v-model="event.description"
                       :rules="[val => val.length >= 4 || 'Минимальная длина 4 символа', val => val.length <= 255 || 'Максимальная длина 255 символов']"
                       label="Описание мероприятия"
                       type="textarea" input-style="min-height: 165px; resize: vertical;" ></q-input>
                    </div>
                </q-form>
            
            </q-step>
            </q-stepper>
            
        </q-card-section>
        <q-card-section class="flex flex-row justify-between mx-12">
            <q-btn :disable="step == 1 ? true : false" @click="step = 1" color="brand-velvet" label="Назад" class="navigation-btn" />
            <q-btn v-if="step == 1 & task.type == 0" @click="step =step + 1; throwData()" color="brand-velvet" label="Далее" class="navigation-btn" />
            <q-btn v-if="step == 2 || task.type != 0" color="brand-velvet" label="Создать" class="navigation-btn" />
        </q-card-section>
    </q-card>
</q-dialog>
</template>

<style scoped>

.navigation-btn{
    @apply !w-[150px]
}
</style>