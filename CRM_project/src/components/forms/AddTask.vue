<script setup>
import api from '@/main'
import { computed, ref, watch } from 'vue'
import { DocEnum as D, PlaceEnum, RoleEnum_ as R} from '@/components/Enums.vue'
import { EVENT, TASK, DEPARTMENT, getFormSchema, getToday, COLLECTION, getDepartments } from '@/components/Utils.js'
import { errorNotify, successNotify } from '@/components/Notifies'

const props = defineProps(['visible', 'body', 'me', 'isMessage'])
const emit = defineEmits(['update:visible', 'update-list'])

const step = ref(1)
const activeEvent = ref(false)
const eventForMe =  ref(false)
const peopleOptions = ref([])
const departmentOptions = ref([])
const collectionOptions = ref([])
const evtUsers = ref(new Set())

const today = getToday()
const date = ref({ from: today, to: today })

const placeOptions = Object.values(PlaceEnum)

const taskForm = ref(null)
const receiversTab = ref('concrete')
const subsIntoCollection = ref([])


const visible = computed({
  get: () => props.visible,
  set: val => emit('update:visible', val)
})


watch(receiversTab, (newVal) => {
    if(newVal){
        subsIntoCollection.value = []
        task.value.executors = []
        task.value.reviewers = []
        task.value.checkers = []
    }
})

const task = ref({
    title: '',
    description: '',
    comment:  '',
    deadline: today,
    ref: null,
    gid: null,
    files: [],
    executors: [],
    reviewers: [],
    checkers: [],
    type: D.MEMO,
    place: null
})

watch(visible, async (val) => {
    if (val) {
        if (props.body){
            task.value.title = props.body.title
            task.value.description = props.body.description
            task.value.deadline = props.body.deadline
            task.value.type = D.ORDER
            task.value.ref = props.body.id
            if(props.body.gid && props.body.owner == props.me.profile.id){
                console.log(props)
                task.value.type = D.MEMO
                task.value.reviewers = [props.body.active[1].user]
                lazyLoad()
            }
            else if(props.isMessage == true){
                console.log(props)
                task.value.type = D.MEMO
                task.value.reviewers = props.body.reviewers
                task.value.ref = null
            }
        }
    }
})



watch(subsIntoCollection, (newVal) => {
    if (Array.isArray(newVal) && newVal.length > 0) {
        if (task.value.type === D.ORDER) {
            task.value.executors = newVal
            task.value.reviewers = []
            task.value.checkers = []
        } else {
            task.value.executors = []
            task.value.reviewers = newVal
            task.value.checkers = []
        }
    }
    else{
        task.value.executors = []
        task.value.reviewers = []
        task.value.checkers = []
    }
})

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

function throwData () {
    evtUsers.value.clear()

    if (eventForMe.value) {
        evtUsers.value.add(props.me.id)
    }

    const users = [
        ...task.value.executors,
        ...task.value.reviewers,
        ...task.value.checkers
    ]

    users.forEach(user => {
        if (user == null) return
        evtUsers.value.add(typeof user === 'object' ? user.id : user)
    })

    event.value.title = task.value.title
    event.value.description = task.value.description
    event.value.to = task.value.deadline
}

function clearDialog(){
    step.value = 2
    clearForm()
    step.value = 1
    clearForm()
    subsIntoCollection.value = []
    receiversTab.value = 'concrete'
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
    if (props.me.role == R.LEADER){
        department = (await getDepartments(props.me.profile.manager.id)).data[0]
        if(peopleOptions.value.length == 0){
            peopleOptions.value = [...department.staff.map(staff => ({id: staff.id, fio: `${staff.fio} (Сотрудник)`})),
                                    ...department.childrens.filter(child => child.manager !== null)
                                                                    .map(child => ({id: child.manager.id, fio: `${child.manager.fio} (${child.title})`}))]
        }
        if(departmentOptions.value.length == 0)
            departmentOptions.value = [...department.parents.map(p => ({id: p.id, title: `${p.title} (${p.manager?.fio})`}))]
    } else {
        department = (await getDepartments(props.me.profile.department.id)).data[0]
        if(peopleOptions.value.length == 0)
            peopleOptions.value = [{id: department.manager.id, fio: `${department.manager.fio} (${department.title})`}]
    }
    if(collectionOptions.value.length == 0){
        let collections = (await api.get(COLLECTION)).data.data
        collectionOptions.value = [...collections.map(collection => ({
                                    subs: collection.subs,
                                    title: collection.title}))]
        if (props.me.role == R.LEADER && props.me.profile.manager.id){
            collectionOptions.value = [...collectionOptions.value, {title: props.me.profile.manager.title, subs: peopleOptions.value}]
        }
    }
}

async function send() {
    const taskValid = await taskForm.value.validate()
    if (!taskValid) {
        errorNotify('Задача. Не все поля заполнены')
        return
    }
    if([...task.value.executors, ...task.value.reviewers, ...task.value.checkers].length == 0){
        errorNotify('Поля получателей пусты')
        return
    }

    if (receiversTab.value == 'concrete' ||
        task.value.type == D.APPLICATION ||
        (receiversTab.value == 'massive' && [...task.value.executors, ...task.value.reviewers, ...task.value.checkers].length == 1)) {

            if (task.value.type == D.APPLICATION){
                task.value.title = `${task.value.title} (${task.value.place})`
            }

            task.value.executors = [...task.value.executors.map(staff => (staff.id))]
            task.value.reviewers = [...task.value.reviewers.map(staff => (staff.id))]
            task.value.checkers = [...task.value.checkers.map(staff => (staff.id))]

            const fd = new FormData()

            const { files, ...rest } = task.value
            fd.append('data', JSON.stringify(rest))

            files.forEach(file => fd.append('files', file))

            let response = await api.post(`${TASK}`, fd, {headers: {'Content-Type': 'multipart/form-data'}})

            if (activeEvent.value && response.status == 200) {
                event.value.user = [...evtUsers.value]
                response = await api.post(EVENT, event.value)
            }

            if (response.status == 200){
                successNotify('Задача поставлена')
                emit('update-list')
            }
    }

    else {
        task.value.executors = [...task.value.executors.map(staff => (staff.id))]
        task.value.reviewers = [...task.value.reviewers.map(staff => (staff.id))]
        task.value.checkers = [...task.value.checkers.map(staff => (staff.id))]
        const fd = new FormData()

        const { files, ...rest } = task.value
        fd.append('data', JSON.stringify(rest))

        files.forEach(file => fd.append('files', file))

        let response = await api.post(`${TASK}?group=true`, fd, {headers: {'Content-Type': 'multipart/form-data'}})

        if (activeEvent.value && response.status == 200) {
            event.value.user = [...evtUsers.value]
            response = await api.post(EVENT, event.value)
        }

        if (response.status == 200){
            successNotify('Групповая задача поставлена')
            emit('update-list')
        }
    }
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
                    :name="1"
                    :title="`СОЗДАНИЕ ${labelChanges()}`"
                    icon="fa-regular fa-file-lines"
                    class="row-grow"
                    :done="step > 1"
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
                <div class="!flex !flex-col min-h-[575px]">
                    <q-form ref="taskForm" class=" p-5 !flex flex-row h-full gap-x-12">
                        <div class="flex flex-col gap-y-8 w-1/2">
                            <div class="flex flex-row gap-x-2">
                                <q-btn unelevated icon="refresh " class="text-brand-danger opacity-[80%] !h-[56px]" @click="clearForm()">
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
                                    label="Название"
                                    :rules="[
                                        val => !!val || 'Обязательное поле',
                                        val => !val || val.length <= 1000 || 'Максимальная длина 1000 символов',
                                        val => !val || val.length>=4 || 'Минимальная длина 4 символа']"
                                    class="!flex-grow brand-description"
                                />
                            </div>
                                <q-input
                                    v-model="task.description"
                                    outlined
                                    type="textarea"
                                    label="Описание"
                                    :rules="[
                                        val => !!val || 'Обязательное поле',
                                        val => !val || val.length <= 1000 || 'Максимальная длина 1000 символов',
                                        val => !val || val.length>=4 || 'Минимальная длина 4 символа']"
                                    class="brand-description"
                                />
                                <q-input
                                    v-model="task.comment"
                                    outlined
                                    type="textarea"
                                    label="Дополнительный комментарий"
                                    :rules="[val => !val || val.length <= 1000 || 'Максимальная длина 1000 символов',
                                        val => !val || val.length>=4 || 'Минимальная длина 4 символа']"
                                    class="brand-description"
                                />
                        </div>
                        <div class="flex flex-col gap-y-8 w-1/2">
                            <q-file
                                v-model="task.files"
                                label="Прикрепить файлы"
                                outlined
                                hide-bottom-space
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
                                accept=".pdf, .jpg, .png, .docx, .pptx, .xlsx, .txt, .zip"
                                multiple
                                class="brand-description">
                                <template v-slot:append><q-icon name="attach_file" /></template>
                            </q-file>

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

                            <q-tabs
                                v-if="task.type != D.APPLICATION"
                                class="!h-[56px] !mb-5"
                                v-model="receiversTab"
                                active-color="brand-velvet"
                                indicator-color="brand-velvet"
                                align="justify"
                                narrow-indicator
                            >
                                <q-tab :name="'concrete'" label="Определённые люди"></q-tab>
                                <q-tab :name="'massive'" label="Групповая рассылка"></q-tab>
                            </q-tabs>

                            <div v-if="receiversTab == 'concrete' && task.type != D.APPLICATION" class="flex flex-col gap-y-8">
                                <q-select
                                    v-if="task.type == D.ORDER"
                                    label="Исполнитель (-и)"
                                    class="w-full"
                                    outlined
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
                                    map-options
                                    use-chips
                                    multiple
                                    :options="peopleOptions"
                                    :option-label="'fio'"
                                    :option-value="'id'"
                                    @focus="lazyLoad"
                                    v-model="task.checkers"
                                />
                            </div>

                            <div v-else-if="receiversTab == 'massive' && task.type != D.APPLICATION" class="flex flex-col gap-y-4">
                                <q-select
                                    v-if="task.type == D.ORDER"
                                    label="Получатели"
                                    class="w-full"
                                    outlined
                                    emit-value
                                    map-options
                                    :rules="[val => !!val || 'Обязательное поле']"
                                    clearable
                                    :options="collectionOptions"
                                    :option-label="'title'"
                                    :option-value="'subs'"
                                    @focus="lazyLoad"
                                    v-model="subsIntoCollection"
                                />
                                <q-select
                                    v-if="task.type == D.ORDER"
                                    label="Уточнение выбора"
                                    class="w-full"
                                    outlined
                                    map-options
                                    use-chips
                                    multiple
                                    :options="subsIntoCollection"
                                    :option-label="'fio'"
                                    :option-value="'id'"
                                    v-model="task.executors"
                                />

                                <q-select
                                    v-if="task.type == D.MEMO"
                                    label="Получатели"
                                    class="w-full"
                                    outlined
                                    emit-value
                                    map-options
                                    :rules="[val => !!val || 'Обязательное поле']"
                                    clearable
                                    :options="collectionOptions"
                                    :option-label="'title'"
                                    :option-value="'subs'"
                                    @focus="lazyLoad"
                                    v-model="subsIntoCollection"
                                />
                                <q-select
                                    v-if="task.type == D.MEMO"
                                    label="Уточнение выбора"
                                    class="w-full"
                                    outlined
                                    map-options
                                    use-chips
                                    multiple
                                    :options="subsIntoCollection"
                                    :option-label="'fio'"
                                    :option-value="'id'"
                                    v-model="task.reviewers"
                                />
                                
                                
                            </div>

                            <q-select
                                v-if="task.type == D.APPLICATION"
                                label="Образовательное пространство"
                                class="w-full pb-5"
                                hide-bottom-space
                                outlined
                                emit-value
                                map-options
                                :rules="[val => !!val || 'Обязательное поле']"
                                clearable
                                :options="placeOptions"
                                :option-label="'title'"
                                :option-value="'title'"
                                v-model="task.place"
                            />

                            <q-select
                                v-if="task.type == D.APPLICATION"
                                label="Получатель"
                                class="w-full"
                                outlined
                                emit-value
                                map-options
                                :rules="[val => !!val || 'Обязательное поле']"
                                clearable
                                :options="collectionOptions"
                                :option-label="'title'"
                                :option-value="'subs'"
                                @focus="lazyLoad"
                                v-model="task.reviewers"
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
                    <q-form ref="taskForm" class=" p-5 !flex flex-row h-full gap-x-12">
                        <div class="flex flex-col gap-y-8 w-1/2">
                            <q-toggle
                                v-model="activeEvent"
                                class="brand-description"
                                label="для получателей"
                            />
                            <q-toggle 
                                :disable="!activeEvent"
                                v-model="eventForMe"
                                class="brand-description"
                                label="для себя"
                                @update:model-value="eventForMe ? evtUsers.add(me.profile.id) : evtUsers.delete(me.profile.id)"
                            />
                            <div class="flex flex-row gap-x-2">
                                <q-btn :disable="!activeEvent" unelevated icon="refresh " class="text-brand-danger opacity-[80%] !h-[56px]" @click="clearForm()">
                                    <q-tooltip
                                    anchor="top middle"
                                    self="bottom middle"
                                    :offset="[10, 10]"
                                    max-width="200px"
                                    class="!text-sm text-center bg-brand-danger opacity-[80%]">
                                        Сбросить поля
                                    </q-tooltip>
                                </q-btn>
                                <q-input :disable="!activeEvent" label="Дата выполнения" v-model="formatDate" readonly outlined class="flex-grow">
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
                            :rules="[val => !!val || 'Обязательное поле' ,val => val.length >= 4 || 'Минимальная длина 4 символа', val => val.length <= 80 || 'Максимальная длина 80 символов']"
                            label="Название мероприятия"
                            class="brand-description"
                        />
                        <q-input
                            :disable="!activeEvent"
                            outlined
                            :rules="[val => !!val || 'Обязательное поле']"
                            v-model="event.place"
                            label="Место проведения"
                            class="brand-description"
                        />
                        <q-input
                        :disable="!activeEvent"
                        outlined
                        v-model="event.description"
                        :rules="[val => !!val || 'Обязательное поле', val => val.length >= 4 || 'Минимальная длина 4 символа', val => val.length <= 255 || 'Максимальная длина 255 символов']"
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
                <q-btn :disable="step == 1 ? true : false" @click="step = step - 1" color="brand-velvet" label="Назад" class="navigation-btn brand-description" />
                <q-btn v-if="(step == 1 && task.type == D.ORDER)" @click="step++; throwData()" color="brand-velvet" label="Далее" class="navigation-btn brand-description" />
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