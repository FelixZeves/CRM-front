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

const availableCols = ref([
    { value: 'name', label: 'Ф.И.О.'},
    { value: 'parents', label: 'Родители'},
    { value: 'mainPhone', label: 'Основной телефон'},
    { value: 'subPhone', label: 'Доп. телефон'},
    { value: 'health', label: 'Группа здоровья'},
    { value: 'tutors', label: 'Репетиторы'},
    { value: 'achievementsRus', label: 'Информация об участии во Всероссийских конкурсах детского творчества'},
    { value: 'achievementsInter', label: 'Информация об участии детей в Международных конкурсах детского творчества'},
    { value: 'schoolEvents', label: 'Участие в мероприятиях школы'},
    { value: 'specAttention', label: 'Требует особого внимания'},
])

const savedCols = LocalStorage.getItem('visibleCols')

const visibleCols = ref(
  savedCols ? JSON.parse(savedCols) : availableCols.value.map(item => item.value)
)

const students = ref([
    {id: 1, name: 'Сидоров Михаил Викторович', parents: ['Сидоров Анатолий Анатольевич', 'Сидорова Нина Николаевна'], mainPhone: '89291234567', subPhone: '56488', health: '3', tutors: [{id: 1, title: 'Математика'}, {id: 2, title: 'Русский язык'}, {id: 3, title: 'Английский язык'}], achievementsRus: ['Олимпиада "Кенгуру"', 'Олимпиада "Олимпик"', 'Областная олимпиада Урфо', 'Областная олимпиада Урфо', 'Областная олимпиада Урфо'], achievementsInter: [''], schoolEvents: ['Конкурс поделок', 'Конкурс сценического искусства'], specAttention: ['Да']},
    {id: 2, name: 'Сидоров Сергей Викторович', parents: ['Сидоров Виктор Анатольевич'], mainPhone: '89291234567', subPhone: '56488', health: '3', tutors: [{id: 1, title: 'Математика'}, {id: 2, title: 'Русский язык'}], achievementsRus: [], achievementsInter: [], schoolEvents: [], specAttention: 'Нет'},
    {id: 3, name: 'Сидоров Михаил Викторович', parents: ['Сидоров Виктор Анатольевич'], mainPhone: '89291234567', subPhone: '56488', health: '3', tutors: [{id: 1, title: 'Математика'}, {id: 2, title: 'Русский язык'}], achievementsRus: [], achievementsInter: [], schoolEvents: [], specAttention: 'Нет'},
    {id: 4, name: 'Сидоров Михаил Викторович', parents: ['Сидоров Виктор Анатольевич'], mainPhone: '89291234567', subPhone: '56488', health: '3', tutors: [{id: 1, title: 'Математика'}, {id: 2, title: 'Русский язык'}], achievementsRus: [], achievementsInter: [], schoolEvents: [], specAttention: 'Нет'},
    {id: 5, name: 'Сидоров Михаил Викторович', parents: ['Сидоров Виктор Анатольевич'], mainPhone: '89291234567', subPhone: '56488', health: '3', tutors: [{id: 1, title: 'Математика'}, {id: 2, title: 'Русский язык'}], achievementsRus: [], achievementsInter: [], schoolEvents: [], specAttention: 'Нет'},
    {id: 6, name: 'Сидоров Михаил Викторович', parents: ['Сидоров Виктор Анатольевич'], mainPhone: '89291234567', subPhone: '56488', health: '3', tutors: [{id: 1, title: 'Математика'}, {id: 2, title: 'Русский язык'}], achievementsRus: [], achievementsInter: [], schoolEvents: [], specAttention: 'Нет'},
    {id: 7, name: 'Сидоров Михаил Викторович', parents: ['Сидоров Виктор Анатольевич'], mainPhone: '89291234567', subPhone: '56488', health: '3', tutors: [{id: 1, title: 'Математика'}, {id: 2, title: 'Русский язык'}], achievementsRus: [], achievementsInter: [], schoolEvents: [], specAttention: 'Нет'},
    {id: 8, name: 'Сидоров Михаил Викторович', parents: ['Сидоров Виктор Анатольевич'], mainPhone: '89291234567', subPhone: '56488', health: '3', tutors: [{id: 1, title: 'Математика'}, {id: 2, title: 'Русский язык'}], achievementsRus: [], achievementsInter: [], schoolEvents: [], specAttention: 'Нет'},
    {id: 9, name: 'Сидоров Михаил Викторович', parents: ['Сидоров Виктор Анатольевич'], mainPhone: '89291234567', subPhone: '56488', health: '3', tutors: [{id: 1, title: 'Математика'}, {id: 2, title: 'Русский язык'}], achievementsRus: [], achievementsInter: [], schoolEvents: [], specAttention: 'Нет'},
    {id: 10, name: 'Сидоров Михаил Викторович', parents: ['Сидоров Виктор Анатольевич'], mainPhone: '89291234567', subPhone: '56488', health: '3', tutors: [{id: 1, title: 'Математика'}, {id: 2, title: 'Русский язык'}], achievementsRus: [], achievementsInter: [], schoolEvents: [], specAttention: 'Нет'},
    {id: 11, name: 'Сидоров Михаил Викторович', parents: ['Сидоров Виктор Анатольевич'], mainPhone: '89291234567', subPhone: '56488', health: '3', tutors: [{id: 1, title: 'Математика'}, {id: 2, title: 'Русский язык'}], achievementsRus: [], achievementsInter: [], schoolEvents: [], specAttention: 'Да'},
    {id: 12, name: 'Сидоров Михаил Викторович', parents: ['Сидоров Виктор Анатольевич'], mainPhone: '89291234567', subPhone: '56488', health: '3', tutors: [{id: 1, title: 'Математика'}, {id: 2, title: 'Русский язык'}], achievementsRus: [], achievementsInter: [], schoolEvents: [], specAttention: 'Да'},
    {id: 13, name: 'Сидоров Михаил Викторович', parents: ['Сидоров Виктор Анатольевич'], mainPhone: '89291234567', subPhone: '56488', health: '3', tutors: [{id: 1, title: 'Математика'}, {id: 2, title: 'Русский язык'}], achievementsRus: [], achievementsInter: [], schoolEvents: [], specAttention: 'Нет'},
    {id: 14, name: 'Сидоров Михаил Викторович', parents: ['Сидоров Виктор Анатольевич'], mainPhone: '89291234567', subPhone: '56488', health: '3', tutors: [{id: 1, title: 'Математика'}, {id: 2, title: 'Русский язык'}], achievementsRus: [], achievementsInter: [], schoolEvents: [], specAttention: 'Нет'},
    {id: 15, name: 'Сидоров Михаил Викторович', parents: ['Сидоров Анатолий Анатольевич'], mainPhone: '89291234567', subPhone: '56488', health: '3', tutors: [{id: 1, title: 'Математика'}, {id: 2, title: 'Русский язык'}], achievementsRus: [], achievementsInter: [], schoolEvents: [], specAttention: null},
])

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
        <header class="min-w-[225px]">
            <NavigationColumn section='Education'/>
        </header>
        
        <main class="!flex !flex-col gap-y-8 !h-[80vh] w-[80%]">
            <div class="border-1 border-2 no-wrap flex flex-col gap-y-2 py-2">
                <!-- <q-breadcrumbs active-color="brand-velvet" class="brand-text ps-4">
                    <q-breadcrumbs-el :label="user.profile.initials_name" :to="{name: 'Office'}" />
                    <q-breadcrumbs-el label="Учебная деятельность" :to="{name : 'Education'}"/>
                    <q-breadcrumbs-el :label="'Класс: ' + body.title" />
                </q-breadcrumbs> -->
                <div class="flex flex-row px-2">
                    <q-btn-dropdown
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
                </div>
            </div>
            <q-table
            flat bordered
            hide-bottom
            class="h-[70vh]"
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

            <template v-slot:header="props">
                <q-tr :props="props">
                    <q-th auto-width />
                    <q-th
                        v-for="col in props.cols"
                        :key="col.name"
                        :props="props"
                    >
                        {{ col.label }}
                    </q-th>
                </q-tr>
            </template>

            <template v-slot:body="props">
                <q-tr :props="props">
                    <q-td auto-width>
                        <q-btn size="sm" color="brand-velvet" round flat @click="props.expand = !props.expand" :icon="props.expand ? 'fa-solid fa-circle' : 'fa-solid fa-circle-notch'" />
                    </q-td>
                    <q-td
                        v-for="col in props.cols"
                        :key="col.name"
                        :props="props"
                    >
                    <span v-if="!['parents','tutors', 'achievementsRus', 'achievementsInter', 'schoolEvents'].includes(col.name)">{{ col.value }}</span>
                    <div class="flex flex-col" v-else>
                        <q-chip v-for="elem in col.value">
                            {{ elem }}
                        </q-chip>
                    </div>
                    </q-td>
                </q-tr>
                <q-tr v-show="props.expand" :props="props">
                    <q-td colspan="100%">
                        <TES :body="props.row"/>
                    </q-td>
                </q-tr>
            </template>

            </q-table>
        </main>
    </div>
</template>