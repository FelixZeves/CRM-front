<script setup>
import { ref, watch, nextTick, onMounted } from 'vue'
import api from '@/main'
import NavigationColumn from '@/components/menus/NavigationColumn.vue';
import { LocalStorage, SessionStorage, uid } from 'quasar';
import { CLASS, downloadFile, getFormSchema, getTableSchema, formatPhone, STUDENT, triggerDownload } from '@/components/Utils';
import TES from '@/components/layouts/TES.vue';
import { confirmNotify, errorNotify, successNotify } from '@/components/Notifies';
import EPPDialog from '@/components/forms/EPPDialog.vue';

const body = ref(SessionStorage.getItem('selectedClass'))
const user = ref(SessionStorage.getItem('user'))

const schema = getTableSchema('students')
const pagination = ref({rowsPerPage: 0})
const selected = ref([])
const editIndex = ref(null)
const fileRef = ref(null)
const currentUploadType = ref(null)

const uploadMap = {
  students: {
    url: `${CLASS}/${body.value.cid}/upload`,
    method: 'post',
    success: 'Ученики успешно импортированы'
  },
  performance: {
    url: `${CLASS}/${body.value.cid}/upload-performance`,
    method: 'put',
    success: 'Успеваемость успешно загружена'
  },
  achievements: {
    url: `${CLASS}/${body.value.cid}/upload-achievements`,
    method: 'put',
    success: 'Достижения успешно загружены'
  }
}

const showPerformanceDialog = ref(false)

const availableCols = ref(
    schema.columns.map(({ name, label }) => ({
        value: name,
        label
    }))
)

function pickFile(type){
    currentUploadType.value = type
    fileRef.value.pickFiles()
}

async function handleUpload(file) {
    if (!file || !currentUploadType.value) return

    const config = uploadMap[currentUploadType.value]
    if (!config) return

    const formData = new FormData()
    formData.append('body', file)

    try {
        const response = await api[config.method](config.url, formData)

        if (response.status === 200) {
            successNotify(config.success)
            await updateList()
        }

    } catch (e) {
        errorNotify('Ошибка при загрузке файла')
    } finally {
        currentUploadType.value = null
    }
}

const savedCols = LocalStorage.getItem('visibleCols')

const visibleCols = ref(
    savedCols ? JSON.parse(savedCols) : ['fio', 'phone', 'health',  'specAttention', 'citizenship', 'avgMark']
)

const students = ref([])

const rowKey = (row) => row.sid ?? row._tempId

function addStudent(){
    const hasUnsaved = students.value.some(s => s.sid === null)

    if(hasUnsaved){
        errorNotify('Сначала завершите заполнение текущего нового ученика')
        return
    }

    const newStudent = getFormSchema('student')
    newStudent.parents.push(getFormSchema('parent'))
    newStudent._tempId = uid()

    students.value.unshift(newStudent)

    editIndex.value = 0

    nextTick(() => {
        const expandBtn = document.querySelector(
        '.q-table tbody tr:first-child td:nth-child(2) button'
        )
        if (expandBtn) expandBtn.click()
    })
}

function removeStudent(index) {
    confirmNotify(()=>{
        editIndex.value = null

        const expandBtn = document.querySelector(
        '.q-table tbody tr:first-child td:nth-child(2) button'
        )
        if (expandBtn) expandBtn.click()

        students.value.splice(index, 1)
    })
}

async function deleteStudent(props){
    confirmNotify(async () => {
        editIndex.value = null

        if (props.expand) props.expand = false

        let response = await api.delete(`${CLASS}/${body.value.cid}/${STUDENT}/${props.row.sid}`)
        if(response.status == 200){
            successNotify('Ученик успешно удалён')
            updateList()
        }
    })
}

watch(
  visibleCols,
  (newVal) => {
    LocalStorage.setItem('visibleCols', JSON.stringify(newVal))
  },
  { deep: true }
)

async function updateList() {
    students.value = (await api.get(`${CLASS}/${body.value.cid}`)).data.data.students
}

async function downloadSocialPassport() {
    try {
        const response = await api.get(
            `${CLASS}/${body.value.cid}/download`,
            {
                responseType: 'blob'
            }
        )
        triggerDownload(response, 'Соц. паспорт.docx')
    } catch (e) {
        errorNotify('Ошибка при формировании социального паспорта')
    }
}

const studentForms = ref({})

async function onSubmit(props) {
    await nextTick()

    const form = studentForms.value[rowKey(props.row)]

    if (!form) return errorNotify('Форма ещё не готова')

    const response = await form.sendForm()

    if (response?.status == 200) {
        successNotify('Ученик успешно добавлен')

        editIndex.value = null
        if (props.expand) props.expand = false

        updateList()
    }
}

onMounted(async () => {await updateList()})

</script>

<template>
    <div class="flex flex-row h-[100vh] w-[100vw] items-center px-8 gap-x-4 justify-evenly !flex-nowrap">
        <header class="min-w-[225px] w-[225px]">
            <NavigationColumn section='Education'/>
        </header>
        
        <main class="!flex !flex-col gap-y-8 !h-[80vh] w-[80%]">
            <div class="border-1 border-2 no-wrap flex flex-col gap-y-2 py-2">
                <q-breadcrumbs active-color="brand-velvet" class="brand-text ps-4">
                    <q-breadcrumbs-el :label="user.profile.initials_name" :to="{name: 'Office'}" />
                    <q-breadcrumbs-el label="Учебная деятельность" :to="{name : 'Education'}"/>
                    <q-breadcrumbs-el :label="'Класс: ' + `${body.number}.${body.parallel}`" />
                </q-breadcrumbs>
            </div>
            <q-table
            flat bordered
            class="h-[72vh]"
            :rows="students"
            :columns="schema.columns"
            virtual-scroll
            v-model:pagination="pagination"
            :rows-per-page-options="[0]"
            :row-key="rowKey"
            :visible-columns="visibleCols"
            selection="multiple"
            v-model:selected="selected"
            separator="cell"
            >
            <template v-slot:top>
                <div class="flex flex-row flex-grow justify-between">
                    <q-btn-dropdown
                    dense
                    flat
                    :menu-offset="[0, 5]"
                    menu-anchor="bottom left"
                    menu-self="top left"
                    color="white" text-color="black" label="Столбцы" class="brand-description">
                        <div class="flex flex-col gap-y-2">
                            <q-toggle
                            v-for="col in availableCols"
                            v-model="visibleCols"
                            :val="col.value"
                            :label="col.label">
                            </q-toggle>
                        </div>
                    </q-btn-dropdown>
                    <div class="flex flex-row items-center gap-x-2">

                        <q-btn size="sm" flat color="brand-velvet" icon="fa-solid fa-file-download !text-base pe-1" label="Генерация файлов">
                            <q-menu
                                auto-close
                                :offset="[0, 5]"
                                class="text-brand-velvet"
                            >
                                <q-list>
                                    <q-item clickable @click="downloadSocialPassport">
                                        <q-item-section>Скачать социальный паспорт</q-item-section>
                                    </q-item>

                                    <q-item clickable @click="showPerformanceDialog = true">
                                        <q-item-section>Скачать таблицу успеваемости</q-item-section>
                                    </q-item>
                                </q-list>
                            </q-menu>
                        </q-btn>

                        <q-separator vertical size="2px" class="!mx-2" color="grey-4"/>

                        <q-btn
                            flat
                            color="brand-velvet"
                            icon="fa-solid fa-chart-line !text-base pe-1"
                            label="Успеваемость и достижения"
                        >
                            <q-menu auto-close :offset="[0, 5]" class="text-brand-velvet">
                                <q-list>
                                    <q-item clickable @click="pickFile('performance')">
                                        <q-item-section>Добавить успеваемость класса</q-item-section>
                                    </q-item>

                                    <q-item clickable @click="pickFile('achievements')">
                                        <q-item-section>Добавить достижения класса</q-item-section>
                                    </q-item>
                                </q-list>
                            </q-menu>
                        </q-btn>
                                                
                        <q-separator vertical size="2px" class="!mx-2" color="grey-4"/>

                        <q-btn
                            dense
                            flat
                            color="brand-velvet"
                            icon="fa-regular fa-file-excel"
                            @click="pickFile('students')"
                        >
                            <q-tooltip
                                anchor="top left"
                                outline self="bottom right"
                                :offset="[-5, 5]"
                                class="!text-sm text-center bg-brand-velvet !text-white shadow-xl !max-w-[250px]"
                            >
                                Добавить учеников из файла (.xlsx)
                            </q-tooltip>
                        </q-btn>

                        <q-file
                            ref="fileRef"
                            accept=".xlsx"
                            class="hidden"
                            @update:model-value="handleUpload"
                        />

                        <q-btn
                            dense
                            flat
                            color="brand-velvet"
                            icon="add"
                            @click="addStudent"
                        >
                            <q-tooltip anchor="top left" outline self="bottom right" :offset="[-5, 5]"
                                class="!text-sm text-center bg-brand-velvet !text-white shadow-xl !max-w-[250px]">
                                Добавить ученика
                            </q-tooltip>
                        </q-btn>
                    </div>
                </div>
            </template>

            <template v-slot:header="props">
                <q-tr :props="props">
                    <q-th auto-width>
                        <q-checkbox
                            keep-color
                            color="brand-velvet"
                            checked-icon="fa-solid fa-circle"
                            unchecked-icon="fa-solid fa-circle-notch"
                            v-model="props.selected"
                        />
                    </q-th>
                    <q-th auto-width></q-th>
                    <q-th
                        v-for="col in props.cols"
                        :key="col.name"
                        :props="props"
                    >
                        <template v-if="col.name === 'birthday'">
                            <q-icon name="fa-solid fa-calendar-days" size="sm">
                                <q-tooltip
                                anchor="top middle"
                                self="bottom middle"
                                class="!text-sm text-center bg-brand-velvet !text-white shadow-xl !max-w-[250px]"
                                >
                                {{ col.label }}
                                </q-tooltip>
                            </q-icon>
                        </template>

                        <template v-else-if="col.name === 'age'">
                            <q-icon name="fa-solid fa-cake-candles" size="sm">
                                <q-tooltip
                                anchor="top middle"
                                self="bottom middle"
                                class="!text-sm text-center bg-brand-velvet !text-white shadow-xl !max-w-[250px]"
                                >
                                {{ col.label }}
                                </q-tooltip>
                            </q-icon>
                        </template>
                        
                        <template v-else-if="col.name === 'health'">
                            <q-icon name="fa-solid fa-heart-pulse" size="sm">
                                <q-tooltip
                                anchor="top middle"
                                self="bottom middle"
                                class="!text-sm text-center bg-brand-velvet !text-white shadow-xl !max-w-[250px]"
                                >
                                {{ col.label }}
                                </q-tooltip>
                            </q-icon>
                        </template>
                    
                        <template v-else-if="col.name === 'specAttention'">
                            <q-icon name="fa-solid fa-triangle-exclamation" size="sm">
                                <q-tooltip
                                anchor="top middle"
                                self="bottom middle"
                                class="!text-sm text-center bg-brand-velvet !text-white shadow-xl !max-w-[250px]"
                                >
                                {{ col.label }}
                                </q-tooltip>
                            </q-icon>
                        </template>

                        <template v-else-if="col.name === 'homeEducation'">
                            <q-icon name="fa-solid fa-house-user" size="sm">
                                <q-tooltip
                                anchor="top middle"
                                self="bottom middle"
                                class="!text-sm text-center bg-brand-velvet !text-white shadow-xl !max-w-[250px]"
                                >
                                {{ col.label }}
                                </q-tooltip>
                            </q-icon>
                        </template>

                        <template v-else-if="col.name === 'citizenship'">
                            <q-icon name="fa-solid fa-passport" size="sm">
                                <q-tooltip
                                anchor="top middle"
                                self="bottom middle"
                                class="!text-sm text-center bg-brand-velvet !text-white shadow-xl !max-w-[250px]"
                                >
                                {{ col.label }}
                                </q-tooltip>
                            </q-icon>
                        </template>

                        <template v-else-if="col.name === 'veterans'">
                            <q-icon name="fa-solid fa-medal" size="sm">
                                <q-tooltip
                                anchor="top middle"
                                self="bottom middle"
                                class="!text-sm text-center bg-brand-velvet !text-white shadow-xl !max-w-[250px]"
                                >
                                {{ col.label }}
                                </q-tooltip>
                            </q-icon>
                        </template>

                        <template v-else-if="col.name === 'avgMark'">
                            <q-icon name="fa-solid fa-star-half-alt" size="sm">
                                <q-tooltip
                                anchor="top middle"
                                self="bottom middle"
                                class="!text-sm text-center bg-brand-velvet !text-white shadow-xl !max-w-[250px]"
                                >
                                {{ col.label }}
                                </q-tooltip>
                            </q-icon>
                        </template>

                        <template v-else-if="col.name === 'olimpics'">
                            <q-icon name="fa-solid fa-trophy" size="sm">
                                <q-tooltip
                                anchor="top middle"
                                self="bottom middle"
                                class="!text-sm text-center bg-brand-velvet !text-white shadow-xl !max-w-[250px]"
                                >
                                {{ col.label }}
                                </q-tooltip>
                            </q-icon>
                        </template>

                        <template v-else>
                            {{ col.label }}
                        </template>
                    </q-th>
                    <q-th> Действия </q-th>
                </q-tr>
            </template>
            <template v-slot:body-selection="props">
                
            </template>

            <template v-slot:body="props">
                <q-tr :props="props">
                    <q-td auto-width>
                        <q-checkbox
                            keep-color
                            color="brand-velvet"
                            checked-icon="fa-solid fa-circle"
                            unchecked-icon="fa-solid fa-circle-notch"
                            v-model="props.selected"
                        />
                    </q-td>
                    <q-td auto-width>
                        <q-btn
                            fab-mini
                            round
                            flat
                            color="brand-velvet"
                            @click="props.expand = !props.expand"
                            :icon="props.expand ? 'fa-solid fa-angle-up' : 'fa-solid fa-angle-down'"
                        />
                    </q-td>
                    <q-td
                        v-for="col in props.cols"
                        :key="col.name"
                        :props="props"
                    >
                    <q-td v-if="col.name === 'fio'">
                        {{ col.value?.length > 0 ? col.value : 'Новый ученик' }}
                    </q-td>
                    <q-td v-else-if="col.name === 'mainPhone'">
                        {{ formatPhone(col.value) }}
                    </q-td>
                    <span v-else-if="!['parents', 'family_type', 'olimpics'].includes(col.name)" class=" break-words whitespace-normal">{{ col.value }}</span>
                    <div class="flex flex-col" v-if="['parents', 'family_type', 'olimpics'].includes(col.name)">
                        <q-chip v-if="col.name == 'parents'" v-for="elem in col.value">
                            {{ elem.fio }}
                        </q-chip>
                        <q-chip v-else v-for="elem in col.value">
                            {{ elem }}
                        </q-chip>
                    </div>
                    </q-td>
                    <q-td>
                        <div  class="flex flex-row justify-center">
                            <q-btn v-if="editIndex !== props.rowIndex" flat text-color="brand-velvet" icon="edit" dense @click="props.expand = true; editIndex = props.rowIndex">
                                <q-tooltip
                                    anchor="top left"
                                    outline
                                    self="bottom right"
                                    :offset="[-5, 5]"
                                    class="!text-sm text-center bg-brand-velvet !text-white shadow-xl !max-w-[250px]"
                                    >
                                    Редактировать ученика
                                </q-tooltip>
                            </q-btn>
                            <q-btn v-if="editIndex === props.rowIndex" @click="onSubmit(props)" flat text-color="brand-complete" icon="fa-solid fa-check" dense >
                                <q-tooltip
                                    anchor="top left"
                                    outline
                                    self="bottom right"
                                    :offset="[-5, 5]"
                                    class="!text-sm text-center bg-brand-velvet !text-white shadow-xl !max-w-[250px]"
                                    >
                                    Подтвердить изменения
                                </q-tooltip>
                            </q-btn>
                            <q-btn v-if="editIndex === props.rowIndex  && props.row.fio.length > 0" flat text-color="brand-danger" icon="refresh" dense @click="props.expand = false; editIndex = null">
                                <q-tooltip
                                    anchor="top left"
                                    outline
                                    self="bottom right"
                                    :offset="[-5, 5]"
                                    class="!text-sm text-center bg-brand-velvet !text-white shadow-xl !max-w-[250px]"
                                    >
                                    Сбросить изменения
                                </q-tooltip>
                            </q-btn>
                            <q-btn v-if="props.row.sid != null" flat text-color="brand-danger" @click="deleteStudent(props)" icon="delete" dense>
                                <q-tooltip
                                    anchor="top left"
                                    outline
                                    self="bottom right"
                                    :offset="[-5, 5]"
                                    class="!text-sm text-center bg-brand-danger !text-white shadow-xl !max-w-[250px]"
                                    >
                                    Удалить ученика
                                </q-tooltip>
                            </q-btn>
                            <q-btn v-if="props.row.sid === null" flat text-color="brand-danger" @click="removeStudent(props.rowIndex)" icon="delete" dense>
                                <q-tooltip
                                    anchor="top left"
                                    outline
                                    self="bottom right"
                                    :offset="[-5, 5]"
                                    class="!text-sm text-center bg-brand-danger !text-white shadow-xl !max-w-[250px]"
                                    >
                                    Удалить нового ученика
                                </q-tooltip>
                            </q-btn>
                        </div>
                    </q-td>
                </q-tr>
                <q-tr v-show="props.expand" :props="props">
                    <q-td colspan="100%" class="p-0">
                        <transition
                        name="expand"
                        enter-active-class="transition ease-out duration-500"
                        enter-from-class="opacity-0 -translate-y-4"
                        enter-to-class="opacity-100 translate-y-0"
                        leave-active-class="transition ease-in duration-500"
                        leave-from-class="opacity-100 translate-y-0"
                        leave-to-class="opacity-0 -translate-y-4"
                        >
                            <div v-show="props.expand" class="overflow-hidden">
                                <TES :ref="el => studentForms[rowKey(props.row)] = el" :key="rowKey(props.row)" :body="props.row" :edit="editIndex === props.rowIndex" />
                            </div>
                        </transition>
                    </q-td>
                </q-tr>
            </template>
            <template v-slot:bottom>
                <div>
                    <span v-if="selected.length > 0">
                        Выбрано записей: {{ selected.length }}
                    </span>
                    <!-- <div class="flex flex-row justify-evenly">
                        <q-btn v-if="selected.length > 0" flat dense icon="fa-solid fa-file-export" color="brand-velvet">
                            <q-tooltip
                            anchor="top left"
                            outline
                            self="bottom left"
                            :offset="[0, 5]"
                            class="!text-sm text-center bg-brand-velvet !text-white shadow-xl !max-w-[250px]"
                            >
                                Экспортировать записи в файл
                            </q-tooltip>
                        </q-btn>
                        <q-btn v-if="selected.length > 0" flat dense icon="delete" color="brand-danger" class="opacity-[80%]">
                            <q-tooltip
                            anchor="top left"
                            outline
                            self="bottom left"
                            :offset="[0, 5]"
                            class="!text-sm text-center bg-brand-danger !text-white shadow-xl !max-w-[250px]"
                            >
                                Удалить выбранные записи
                            </q-tooltip>
                        </q-btn>
                    </div> -->
                </div>
            </template>
            </q-table>
        </main>
    </div>
    <EPPDialog
        v-model="showPerformanceDialog"
        :class-id="body.cid"
    />
</template>