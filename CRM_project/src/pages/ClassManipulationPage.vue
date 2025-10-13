<script setup>
import { ref, watch, nextTick } from 'vue'
import NavigationColumn from '@/components/menus/NavigationColumn.vue';
import { LocalStorage, SessionStorage } from 'quasar';
import { getFormSchema, getTableSchema } from '@/components/Utils';
import TES from '@/components/layouts/TES.vue';
import { confirmNotify, errorNotify } from '@/components/Notifies';

const body = ref(SessionStorage.getItem('selectedClass'))
const user = SessionStorage.getItem('user')

const cols = getTableSchema('students')
const pagination = ref({rowsPerPage: 0})
const selected = ref([])
const editIndex = ref(null)

const availableCols = ref([
    { value: 'fio', label: 'Ф.И.О.'},
    { value: 'parents', label: 'Родители'},
    { value: 'mainPhone', label: 'Основной телефон'},
    { value: 'health', label: 'Группа здоровья'},
    { value: 'schoolEvents', label: 'Школьные конкурсы'},
    { value: 'achievementsRus', label: 'Всероссийские конкурсы'},
    { value: 'achievementsInter', label: 'Международные конкрусы'},
    { value: 'specAttention', label: 'Требует особого внимания'}
])

const savedCols = LocalStorage.getItem('visibleCols')

const visibleCols = ref(
  savedCols ? JSON.parse(savedCols) : availableCols.value.map(item => item.value)
)

const students = ref([
    {id: 1,
        name: 'Сидоров Михаил Викторович',
        birthday: '25.04.2013',
        regAddress: 'г. Челябинск, ул Молодогвардейцев д.74. кв.101',
        resAddress: 'г. Челябинск, ул Молодогвардейцев д.74. кв.101',
        parents: [
            {name: 'Сидоров Виктор Анатольевич', phone: '89231056889', workPlace: 'Российский Федеральный Ядерный Центр Всероссийский Научно-исследовательский Институт Технической Физики', workPost: 'Главный конструктор отдела новых разработок', education: 'Кандидат физических наук'},
            {name:  'Сидорова Нина Николаевна', phone: '89231256548', workPlace: 'Некоторое предприятие', workPost: 'Некоторая должность',  education: 'Магистрская степень математических наук'}],
        familyStatus: ['Многодетная'],
        veterans:  true,
        mainPhone: '89291234567',
        health: 3,
        achievementsRus: [
            'Олимпиада "Кенгуру"',
            'Олимпиада "Олимпик"',
            'Областная олимпиада Урфо',
            'Третья Государственная олимпиада для учеников средних классов',
            'Областная олимпиада Урфо'],
        achievementsInter: [],
        schoolEvents: ['Конкурс поделок', 'Конкурс сценического искусства'],
        specAttention: true},
    {id: 2, name: 'Сидоров Сергей Викторович', parents: [{name: 'Сидоров Виктор Анатольевич', phone: '89231056889', workPlace: 'Некоторое предприятие', workPost: 'Некоторая должность'}], mainPhone: '89291234567', subPhone: '56488', health: 3, achievementsRus: [], achievementsInter: [], schoolEvents: [], specAttention: true},
    {id: 3, name: 'Сидоров Михаил Викторович', parents: [{name: 'Сидоров Виктор Анатольевич', phone: '89231056889', workPlace: 'Некоторое предприятие', workPost: 'Некоторая должность'}], mainPhone: '89291234567', subPhone: '56488', health: 3, achievementsRus: [], achievementsInter: [], schoolEvents: [], specAttention: false},
    {id: 4, name: 'Сидоров Михаил Викторович', parents: [{name: 'Сидоров Виктор Анатольевич', phone: '89231056889', workPlace: 'Некоторое предприятие', workPost: 'Некоторая должность'}], mainPhone: '89291234567', subPhone: '56488', health: 3, achievementsRus: [], achievementsInter: [], schoolEvents: [], specAttention: false},
    {id: 5, name: 'Сидоров Михаил Викторович', parents: [{name: 'Сидоров Виктор Анатольевич', phone: '89231056889', workPlace: 'Некоторое предприятие', workPost: 'Некоторая должность'}], mainPhone: '89291234567', subPhone: '56488', health: 3, achievementsRus: [], achievementsInter: [], schoolEvents: [], specAttention: false},
    {id: 6, name: 'Сидоров Михаил Викторович', parents: [{name: 'Сидоров Виктор Анатольевич', phone: '89231056889', workPlace: 'Некоторое предприятие', workPost: 'Некоторая должность'}], mainPhone: '89291234567', subPhone: '56488', health: 3, achievementsRus: [], achievementsInter: [], schoolEvents: [], specAttention: true},
    {id: 7, name: 'Сидоров Михаил Викторович', parents: [{name: 'Сидоров Виктор Анатольевич', phone: '89231056889', workPlace: 'Некоторое предприятие', workPost: 'Некоторая должность'}], mainPhone: '89291234567', subPhone: '56488', health: 3, achievementsRus: [], achievementsInter: [], schoolEvents: [], specAttention: false},
    {id: 8, name: 'Сидоров Михаил Викторович', parents: [{name: 'Сидоров Виктор Анатольевич', phone: '89231056889', workPlace: 'Некоторое предприятие', workPost: 'Некоторая должность'}], mainPhone: '89291234567', subPhone: '56488', health: 3, achievementsRus: [], achievementsInter: [], schoolEvents: [], specAttention: true},
    {id: 9, name: 'Сидоров Михаил Викторович', parents: [{name: 'Сидоров Виктор Анатольевич', phone: '89231056889', workPlace: 'Некоторое предприятие', workPost: 'Некоторая должность'}], mainPhone: '89291234567', subPhone: '56488', health: 3, achievementsRus: [], achievementsInter: [], schoolEvents: [], specAttention: true},
    {id: 10, name: 'Сидоров Михаил Викторович', parents: [{name: 'Сидоров Виктор Анатольевич', phone: '89231056889', workPlace: 'Некоторое предприятие', workPost: 'Некоторая должность'}], mainPhone: '89291234567', subPhone: '56488', health: 3, achievementsRus: [], achievementsInter: [], schoolEvents: [], specAttention: true},
])

function formatPhone(phone) {
  if (!phone) return ''

  // если мобильный (11 цифр, начинается с 7 или 8)
  if (/^(7|8)\d{10}$/.test(phone)) {
    return phone.replace(/(\d)(\d{3})(\d{3})(\d{2})(\d{2})/, '$1 ($2) $3-$4-$5')
  }

  // если домашний (например, 6 цифр)
  if (/^\d{5}$/.test(phone)) {
    return phone.replace(/(\d{1})(\d{2})(\d{2})/, '$1-$2-$3')
  }

  return phone // fallback
}

function getRowKey(row, index){
    return row.id ?? `${index}`
}

function addStudent(){
    const hasUnsaved = students.value.some(s => s.id === null)

    if(hasUnsaved){
        errorNotify('Сначала завершите заполнение текущего нового ученика')
        return
    }

    const newStudent = getFormSchema('student')

    newStudent.parents.push(getFormSchema('parent'))

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

watch(
  visibleCols,
  (newVal) => {
    LocalStorage.setItem('visibleCols', JSON.stringify(newVal))
  },
  { deep: true }
)
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
                    <q-breadcrumbs-el :label="'Класс: ' + body.title" />
                </q-breadcrumbs>
            </div>
            <q-table
            flat bordered
            class="h-[72vh]"
            :rows="students"
            :columns="cols.columns"
            virtual-scroll
            v-model:pagination="pagination"
            :rows-per-page-options="[0]"
            :row-key="getRowKey"
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
                    <div class="">
                        <q-btn dense class="brand-description" flat color="brand-velvet" icon="fa-regular fa-file-excel">
                            <q-tooltip
                                anchor="top left"
                                outline
                                self="bottom right"
                                :offset="[-5, 5]"
                                class="!text-sm text-center bg-brand-velvet !text-white shadow-xl !max-w-[200px]"
                                >
                                Выгрузить учеников из файла
                            </q-tooltip>
                        </q-btn>
                        <q-btn
                            dense
                            class="brand-description"
                            flat color="brand-velvet"
                            icon="add"
                            @click="addStudent"
                        >
                            <q-tooltip
                                anchor="top left"
                                outline
                                self="bottom right"
                                :offset="[-5, 5]"
                                class="!text-sm text-center bg-brand-velvet !text-white shadow-xl !max-w-[250px]"
                                >
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
                        <template v-if="col.name === 'specAttention'">
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
                        {{ col.value.length > 0 ? col.value : 'Новый ученик' }}
                    </q-td>
                    <q-td v-else-if="col.name === 'mainPhone'">
                        {{ formatPhone(col.value) }}
                    </q-td>
                    <span v-else-if="!['parents', 'achievementsRus', 'achievementsInter', 'schoolEvents'].includes(col.name)">{{ col.value }}</span>
                    <div class="flex flex-col" v-if="['parents', 'achievementsRus', 'achievementsInter', 'schoolEvents'].includes(col.name)">
                        <q-chip v-if="col.name != 'parents' " v-for="elem in col.value">
                            {{ elem }}
                        </q-chip>
                        <q-chip v-else v-for="elem in col.value">
                            {{ elem.name }}
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
                            <q-btn v-if="editIndex === props.rowIndex" flat text-color="brand-complete" icon="fa-solid fa-check" dense >
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
                            <q-btn v-if="editIndex === props.rowIndex  && props.row.name.length > 0" flat text-color="brand-danger" icon="refresh" dense @click="props.expand = false; editIndex = null">
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
                            <q-btn v-if="props.row.id != null" flat text-color="brand-danger" icon="delete" dense>
                                <q-tooltip
                                    anchor="top left"
                                    outline
                                    self="bottom right"
                                    :offset="[-5, 5]"
                                    class="!text-sm text-center bg-brand-velvet !text-white shadow-xl !max-w-[250px]"
                                    >
                                    Удалить ученика
                                </q-tooltip>
                            </q-btn>
                            <q-btn v-if="props.row.id === null" flat text-color="brand-danger" @click="removeStudent(props.rowIndex)" icon="delete" dense>
                                <q-tooltip
                                    anchor="top left"
                                    outline
                                    self="bottom right"
                                    :offset="[-5, 5]"
                                    class="!text-sm text-center bg-brand-velvet !text-white shadow-xl !max-w-[250px]"
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
                                <TES :body="props.row" :edit="editIndex === props.rowIndex" />
                            </div>
                        </transition>
                    </q-td>
                </q-tr>
            </template>
            <template v-slot:bottom>
                <div v-if="selected.length > 0">
                    <span>
                        Выбрано записей: {{ selected.length }}
                    </span>
                    <div class="flex flex-row justify-evenly">
                        <q-btn flat dense icon="fa-solid fa-file-export" color="brand-velvet">
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
                        <q-btn flat dense icon="delete" color="brand-danger" class="opacity-[80%]">
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
                    </div>
                </div>
            </template>
            </q-table>
        </main>
    </div>
</template>