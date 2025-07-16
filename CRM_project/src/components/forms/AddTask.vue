<script setup>
import axios from 'axios'
import { computed, ref, onMounted } from 'vue'
import { DocEnum as D, RoleEnum_ as R} from '@/components/Enums.vue'
import { getFormSchema, getToday, getMe } from '@/components/Utils.js'
import { successNotify } from '@/components/Notifies'

const props = defineProps(['visible', 'body'])
const emit = defineEmits(['update:visible', 'update-list'])

onMounted(async () => {me.value = (await getMe()).data})

const step = ref(1)
const activeEvent = ref(false)
const eventForMe =  ref(false)
const peopleOptions = ref([])
const departmentOptions = ref([])
const me = ref()
const evtUsers = ref(new Set())

const today = getToday();
const date = ref({ from: today, to: today });

const task = ref({
    title: '',
    description: '',
    comment:  '',
    deadline: today,
    files: [],
    executors: [],
    reviewers: [],
    checkers: [],
    type: D.MEMO,    
})

if (props.body){
    task.value.title = props.body.title
    task.value.description = props.body.description
    task.value.deadline = props.body.deadline
    task.value.type = D.ORDER
}

const event = ref(getFormSchema('event'));

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
    if (step.value === D.APPLICATION) {
        for (const key in task.value) {
        const value = task.value[key]
        if (typeof value === 'string') {
            task.value[key] = ''
        } else if (Array.isArray(value)) {
            task.value[key] = []
        }
        }
        task.value.deadline = today
        task.value.type = D.MEMO
    } 
    else if (step.value === D.MEMO) {
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
    evtUsers.value.clear()
    if (eventForMe.value) evtUsers.value.add(me.value.profile.id)
    let tmp = [...task.value.executors, ...task.value.reviewers, ...task.value.checkers].forEach(id => evtUsers.value.add(id))

    event.value.title = task.value.title
    event.value.description = task.value.description
    event.value.to = task.value.deadline
}

function clearDialog(){
    step.value = 2
    clearForm()
    step.value = 1
    clearForm()
}

const visible = computed({
  get: () => props.visible,
  set: val => emit('update:visible', val)
})

function checkDock(){
    console.log(taskFiles)
}

function labelChanges(){
    if (task.value.type == D.ORDER){
        return 'ЗАДАЧИ'
    }
    else if (task.value.type == D.MEMO){
        return 'СЗ'
    }
    else{
        return 'ЗАЯВКИ'
    }
}

async function lazyLoad() {
    let department = null
    if (me.value.role == R.LEADER){
        department = (await axios.get(`/api/user/department?id=${me.value.profile.manager.id}`)).data.data[0]
        peopleOptions.value = [...department.staff.map(staff => ({id: staff.id, fio: `${staff.fio} (Сотрудник)`})),
                               ...department.childrens.filter(child => child.manager !== null)
                                                      .map(child => ({id: child.manager.id, fio: `${child.manager.fio} (${child.title})`}))]
        departmentOptions.value = [...department.parents.map(p => ({id: p.id, title: `${p.title} (${p.manager?.fio})`}))]
    } else {
        department = (await axios.get(`/api/user/department?id=${me.value.profile.department.id}`)).data.data[0]
        peopleOptions.value = [{id: department.manager.id, fio: `${department.manager.fio} (${department.title})`}]
    }
}

async function send() {
    let response = await axios.post('/api/user/task', task.value)

    if (activeEvent.value) {
        event.value.user = [...evtUsers.value]
        await axios.post('/api/user/event', event.value)
    }

    if (response.status == 200) successNotify()
    emit('update-list')
}
</script>

<template>
    <q-dialog v-model="visible" backdrop-filter="blur(4px)" @hide="clearDialog">
        <q-card class="text-black !rounded-[15pt] !flex !flex-col !w-[90vw] !min-w-[50%] !max-w-[75%] !bg-tile">
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
                    :name="D.APPLICATION"
                    :title="`СОЗДАНИЕ ${labelChanges()}`"
                    icon="fa-regular fa-file-lines"
                    class="row-grow"
                    :done="step > D.APPLICATION"
                >
                <q-tabs
                    v-model="task.type"
                    active-color="brand-velvet"
                    indicator-color="brand-velvet"
                    align="justify"
                    narrow-indicator
                >
                    <q-tab v-if="me.role != R.TEACHER" :name="D.ORDER" label="Задача"></q-tab>
                    <q-tab :name="D.MEMO" label="Служебная записка" />
                    <q-tab :name="D.APPLICATION" label="Заявка" />
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
                                        class="!text-sm text-center bg-brand-danger opacity-[80%]"
                                    >
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
                                    class="!flex-grow brand-description"
                                />
                            </div>
                                <q-input
                                    v-model="task.description"
                                    outlined
                                    type="textarea"
                                    label="Описание задачи"
                                    :rules="[val => val.length >= 4 || 'Минимальная длина 4 символа', val => val.length <= 1000 || 'Максимальная длина 1000 символов']"
                                    class="brand-description"
                                />
                                <q-input
                                    v-model="task.comment"
                                    outlined
                                    type="textarea"
                                    label="Дополнительный комментарий"
                                    :rules="[val => val.length <= 255 || 'Максимальная длина 255 символов']"
                                    class="brand-description"
                                />
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
                                                class="brand-description"
                                                >
                                                <q-btn class="flex flex-row brand-description" v-close-popup label="Закрыть" flat/>
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
                                multiple
                                class="brand-description">
                                <template v-slot:append><q-icon name="attach_file" /></template>
                            </q-file>
                            
                            <q-select
                                v-if="task.type == D.ORDER"
                                label="Исполнитель (-и)"
                                class="w-full"
                                outlined
                                emit-value
                                map-options
                                use-chips
                                multiple
                                :options="peopleOptions"
                                :option-label="'fio'"
                                :option-value="'id'"
                                @focus="lazyLoad"
                                v-model="task.executors"
                            />
                            <q-select
                                v-if="task.type != D.APPLICATION"
                                label="Согласующий (-ие)"
                                class="w-full"
                                outlined
                                emit-value
                                map-options
                                use-chips
                                multiple
                                :options="peopleOptions"
                                :option-label="'fio'"
                                :option-value="'id'"
                                @focus="lazyLoad"
                                v-model="task.reviewers"
                            />
                            <q-select
                                v-if="task.type == D.ORDER"
                                label="Проверяющий (-ие)"
                                class="w-full"
                                outlined
                                emit-value
                                map-options
                                use-chips
                                multiple
                                :options="peopleOptions"
                                :option-label="'fio'"
                                :option-value="'id'"
                                @focus="lazyLoad"
                                v-model="task.checkers"
                            />
                            <q-select
                                v-if="task.type == D.APPLICATION"
                                label="Отделы"
                                class="w-full"
                                outlined
                                emit-value
                                map-options
                                clearable
                                multiple
                                :options="departmentOptions"
                                :option-label="'title'"
                                :option-value="'id'"
                                @focus="lazyLoad"
                                v-model="task.executors"
                            />
                        </div>
                    </q-form>
                </div>
                </q-step>

                <q-step
                    v-if="task.type == D.ORDER"
                    :name="2"
                    title="СОЗДАНИЕ МЕРОПРИЯТИЯ"
                    class="row-grow"
                    icon="add"
                    :done="step > 2"
                >
                    <q-form @submit="checkDock" class=" p-5 !flex flex-row h-full gap-x-12">
                        <div class="flex flex-col gap-y-8 w-1/2">
                            <q-toggle
                                v-model="activeEvent"
                                class="brand-description"
                                label="для исполнителей"
                            />
                            <q-toggle 
                                :disable="!activeEvent"
                                v-model="eventForMe"
                                class="brand-description"
                                label="для себя"
                                @update:model-value="eventForMe ? evtUsers.add(me.profile.id) : evtUsers.delete(me.profile.id)"
                            />
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
                        </div>
                        <div class="flex flex-col gap-y-8 w-1/2">
                        <q-input
                            :disable="!activeEvent"
                            outlined
                            v-model="event.title"
                            :rules="[val => val.length >= 4 || 'Минимальная длина 4 символа', val => val.length <= 80 || 'Максимальная длина 80 символов']"
                            label="Название мероприятия"
                            class="brand-description"
                        />
                        <q-input
                            :disable="!activeEvent"
                            outlined
                            v-model="event.place"
                            label="Место проведения"
                            class="brand-description"
                        />
                        <q-input
                        :disable="!activeEvent"
                        outlined
                        v-model="event.description"
                        :rules="[val => val.length >= 4 || 'Минимальная длина 4 символа', val => val.length <= 255 || 'Максимальная длина 255 символов']"
                        label="Описание мероприятия"
                        type="textarea" input-style="min-height: 150px; resize: vertical;"
                        class="brand-description"
                        />
                        </div>
                    </q-form>
                
                </q-step>
                </q-stepper>
                
            </q-card-section>
            <q-card-section class="flex flex-row justify-between mx-12">
                <q-btn :disable="step == 1 ? true : false" @click="step = 1" color="brand-velvet" label="Назад" class="navigation-btn brand-description" />
                <q-btn v-if="step == 1 & task.type == D.ORDER" @click="step++; throwData()" color="brand-velvet" label="Далее" class="navigation-btn brand-description" />
                <q-btn v-if="step == 2 || task.type != D.ORDER" @click="send" color="brand-velvet" label="Создать" class="navigation-btn brand-description" />
            </q-card-section>
        </q-card>
    </q-dialog>
</template>

<style scoped>

.navigation-btn{
    @apply !w-[150px]
}
</style>