<script setup>
import { ref, computed, watch } from 'vue'
import NavigationColumn from '@/components/menus/NavigationColumn.vue';
import { LocalStorage, SessionStorage } from 'quasar';
import { getTableSchema } from '@/components/Utils';
import TES from '@/components/layouts/TES.vue';

const body = ref(SessionStorage.getItem('selectedClass'))
const user = SessionStorage.getItem('user')

const cols = getTableSchema('students')
const pagination = ref({rowsPerPage: 0})
const selected = ref([])
const edit = ref(null)

const availableCols = ref([
    { value: 'fio', label: 'Ф.И.О.'},
    { value: 'parents', label: 'Родители'},
    { value: 'mainPhone', label: 'Основной телефон'},
    { value: 'subPhone', label: 'Доп. телефон'},
    { value: 'health', label: 'Группа здоровья'},
    { value: 'tutors', label: 'Репетиторы'},
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
    {id: 1, name: 'Сидоров Михаил Викторович', parents: ['Сидоров Виктор Анатольевич', 'Сидорова Нина Николаевна'], mainPhone: '89291234567', subPhone: '56488', health: 3, tutors: [{id: 1, title: 'Математика'}, {id: 2, title: 'Русский язык'}, {id: 3, title: 'Английский язык'}], achievementsRus: ['Олимпиада "Кенгуру"', 'Олимпиада "Олимпик"', 'Областная олимпиада Урфо', 'Третья Государственная олимпиада для учеников средних классов', 'Областная олимпиада Урфо'], achievementsInter: [''], schoolEvents: ['Конкурс поделок', 'Конкурс сценического искусства'], specAttention: 'Да'},
    {id: 2, name: 'Сидоров Сергей Викторович', parents: ['Сидоров Виктор Анатольевич'], mainPhone: '89291234567', subPhone: '56488', health: 3, tutors: [{id: 1, title: 'Математика'}, {id: 2, title: 'Русский язык'}], achievementsRus: [], achievementsInter: [], schoolEvents: [], specAttention: 'Нет'},
    {id: 3, name: 'Сидоров Михаил Викторович', parents: ['Сидоров Виктор Анатольевич'], mainPhone: '89291234567', subPhone: '56488', health: 3, tutors: [{id: 1, title: 'Математика'}, {id: 2, title: 'Русский язык'}], achievementsRus: [], achievementsInter: [], schoolEvents: [], specAttention: 'Нет'},
    {id: 4, name: 'Сидоров Михаил Викторович', parents: ['Сидоров Виктор Анатольевич'], mainPhone: '89291234567', subPhone: '56488', health: 3, tutors: [{id: 1, title: 'Математика'}, {id: 2, title: 'Русский язык'}], achievementsRus: [], achievementsInter: [], schoolEvents: [], specAttention: 'Нет'},
    {id: 5, name: 'Сидоров Михаил Викторович', parents: ['Сидоров Виктор Анатольевич'], mainPhone: '89291234567', subPhone: '56488', health: 3, tutors: [{id: 1, title: 'Математика'}, {id: 2, title: 'Русский язык'}], achievementsRus: [], achievementsInter: [], schoolEvents: [], specAttention: 'Нет'},
    {id: 6, name: 'Сидоров Михаил Викторович', parents: ['Сидоров Виктор Анатольевич'], mainPhone: '89291234567', subPhone: '56488', health: 3, tutors: [{id: 1, title: 'Математика'}, {id: 2, title: 'Русский язык'}], achievementsRus: [], achievementsInter: [], schoolEvents: [], specAttention: 'Нет'},
    {id: 7, name: 'Сидоров Михаил Викторович', parents: ['Сидоров Виктор Анатольевич'], mainPhone: '89291234567', subPhone: '56488', health: 3, tutors: [{id: 1, title: 'Математика'}, {id: 2, title: 'Русский язык'}], achievementsRus: [], achievementsInter: [], schoolEvents: [], specAttention: 'Нет'},
    {id: 8, name: 'Сидоров Михаил Викторович', parents: ['Сидоров Виктор Анатольевич'], mainPhone: '89291234567', subPhone: '56488', health: 3, tutors: [{id: 1, title: 'Математика'}, {id: 2, title: 'Русский язык'}], achievementsRus: [], achievementsInter: [], schoolEvents: [], specAttention: 'Нет'},
    {id: 9, name: 'Сидоров Михаил Викторович', parents: ['Сидоров Виктор Анатольевич'], mainPhone: '89291234567', subPhone: '56488', health: 3, tutors: [{id: 1, title: 'Математика'}, {id: 2, title: 'Русский язык'}], achievementsRus: [], achievementsInter: [], schoolEvents: [], specAttention: 'Нет'},
    {id: 10, name: 'Сидоров Михаил Викторович', parents: ['Сидоров Виктор Анатольевич'], mainPhone: '89291234567', subPhone: '56488', health: 3, tutors: [{id: 1, title: 'Математика'}, {id: 2, title: 'Русский язык'}], achievementsRus: [], achievementsInter: [], schoolEvents: [], specAttention: 'Нет'},
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
            row-key="id"
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
                        <q-btn dense class="brand-description" flat color="brand-velvet" icon="add">
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
                    {{ col.label }}
                    </q-th>
                    <q-th width="150px"> Действия </q-th>
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
                    <q-td v-if="col.name === 'mainPhone'">
                        {{ formatPhone(col.value) }}
                    </q-td>
                    <q-td v-else-if="col.name === 'subPhone'">
                        {{ formatPhone(col.value) }}
                    </q-td>
                    <span v-else-if="!['parents','tutors', 'achievementsRus', 'achievementsInter', 'schoolEvents'].includes(col.name)">{{ col.value }}</span>
                    <div class="flex flex-col" v-if="['parents','tutors', 'achievementsRus', 'achievementsInter', 'schoolEvents'].includes(col.name)">
                        <q-chip v-for="elem in col.value">
                            {{ elem }}
                        </q-chip>
                    </div>
                    <div v-if="col.name == 'edit'"  class="flex flex-row justify-center flex-grow">
                        <q-btn v-if="edit !== props.row.id" flat text-color="brand-velvet" icon="edit" dense @click="props.expand = true; edit = props.row.id"></q-btn>
                        <q-btn v-if="edit === props.row.id" flat text-color="brand-complete" icon="fa-solid fa-check" dense ></q-btn>
                        <q-btn v-if="edit === props.row.id" flat text-color="brand-danger" icon="refresh" dense @click="props.expand = false; edit = null"></q-btn>
                        <q-btn flat text-color="brand-danger" icon="delete" dense></q-btn>
                    </div>
                    </q-td>
                    <q-td>
                        <div  class="flex flex-row justify-center flex-grow">
                            <q-btn v-if="edit !== props.row.id" flat text-color="brand-velvet" icon="edit" dense @click="props.expand = true; edit = props.row.id"></q-btn>
                            <q-btn v-if="edit === props.row.id" flat text-color="brand-complete" icon="fa-solid fa-check" dense ></q-btn>
                            <q-btn v-if="edit === props.row.id" flat text-color="brand-danger" icon="refresh" dense @click="props.expand = false; edit = null"></q-btn>
                            <q-btn flat text-color="brand-danger" icon="delete" dense></q-btn>
                        </div>
                    </q-td>
                </q-tr>
                <q-tr v-show="props.expand" :props="props">
                    <q-td colspan="100%">
                        <TES :body="props.row" :edit="edit === props.row.id"/>
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