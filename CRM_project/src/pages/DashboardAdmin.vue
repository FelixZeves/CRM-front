<script setup>
import { getTableSchema, getFormSchema} from '@/components/Utils.js'
import User from '@/components/forms/admin/User.vue'
import Department from '@/components/forms/admin/Deparment.vue'
import Class from '@/components/forms/admin/Class.vue'
import Lesson from '@/components/forms/admin/Lesson.vue'
import Collection from '@/components/forms/admin/Collection.vue'
import axios from 'axios'
import { computed, ref } from 'vue'

const status = ref('read')
const isRead = computed(() => status.value != 'read'? false: true)
const url = ref(null)
const typeForm = ref(null)
const formSubmit = ref(null)
const details = ref(null)
const pagination = ref({rowsPerPage: 0})

const forms = {
    user: User,
    department: Department,
    class: Class,
    lesson: Lesson,
    collection: Collection
}

const tables = ref([
  {...getTableSchema('user'), name: 'user', data: [],
    async get() {this.data = (await axios.get('/api/user')).data.data},
    choose(row) {typeForm.value = 'user'; details.value = row},
    add() {typeForm.value = 'user'; details.value = getFormSchema('user'); status.value ='create';},
    info: "1. Человек может быть либо руководителем, либо сотрудником отдела;\n2. Чтобы открепить человека от отдела, необходимо откреплять его в форме редактировния отдела."
},
  {...getTableSchema('department'), name: 'department', data: [],
    async get() {this.data = (await axios.get('/api/user/department')).data.data},
    choose(row) {typeForm.value = 'department'; details.value = row; console.log(details.value)},
    add() {typeForm.value = 'department'; details.value = getFormSchema('department'); status.value ='create';},
    info: "1. Чтобы добавить руководителя или сотрудника, необходимо выбрать нужный отдел в форме редактирования/добавления пользователя;\n2. Вышестоящее руководство добавляется путём добавления дочернего отдела у вышестоящего."
},
  {...getTableSchema('classes'), name: 'class', data: [],
  async get() {this.data = (await axios.get('/api/user/class')).data.data},
  choose(row) {typeForm.value = 'class'; details.value = row},
  add() {typeForm.value = 'class'; details.value = getFormSchema('class'); status.value ='create';},
  info: "Вводите класс и параллель отдельно"
},
  {...getTableSchema('lessons'), name: 'lesson', data: [],
  async get() {this.data = (await axios.get('/api/user/lesson')).data.data},
  choose(row) {typeForm.value = 'lesson'; details.value = row},
  add() {typeForm.value = 'lesson'; details.value = getFormSchema('lesson'); status.value ='create';},
  info: "Вводите уроки в виде: *Название урока* *класс* *кабинет*",
},
 {...getTableSchema('collections'), name: 'collection', data: [],
 async get() {this.data = (await axios.get('/api/user/collection')).data.data},
 choose(row) {typeForm.value =  'collection'; details.value = row},
 add() {typeForm.value = 'collection'; details.value = getFormSchema('collection'); status.value = 'create';},
 info: "Участники - те кто будут принадлежать к группе.\nПисатели - те кто сможет обращаться (писать) в данную группу."
}
])

async function save() {
    await formSubmit.value.send()
}

async function remove() {
    await formSubmit.value.remove()
}

</script>

<template>
 <div class="w-[100vw] h-[100vh] flex flex-row p-5 pb-1 gap-10">
    <div class="flex-grow max-w-[65%] pe-1 h-full overflow-y-auto">
        <q-list bordered>
            <q-expansion-item
                v-for="table in tables"
                switch-toggle-side
                expand-separator
                header-class="brand-description"
                :label="table.label"
                @show="table.get()"
                >
                <q-card class="p-5 !rounded-none">
                    <q-table
                        :rows="table.data"
                        :columns="table.columns"
                        class="max-h-[400px] pb-2 !rounded-none"
                        virtual-scroll
                        v-model:pagination="pagination"
                        :rows-per-page-options="[0]"
                        @row-click="(evt, row, index) => {table.choose(row)}"
                    />
                    <q-btn @click="table.add()" class="brand-description" label="Добавить" flat color="brand-velvet" icon="add"/>
                </q-card>
            </q-expansion-item>
        </q-list>
    </div>
    <div class="w-[30%] h-full overflow-y-auto">
        <div class="flex flex-col m-2">
            <div class="flex flex-col gap-4 mb-5">
                <div class="flex flex-row justify-between">
                    <span class="font-bold text-gray-800 text-xl 2xl:text-2xl content-center"> Административная страница </span>
                    <q-btn
                    unelevated
                    :to="{name : 'Office'}"
                    icon="fa-solid fa-arrow-right-from-bracket text-brand-danger"/>
                </div>
                <div class="flex gap-4">
                    <q-btn
                        icon="fa-solid fa-pen"
                        padding="10px"
                        size="sm"
                        @click="status = (status != 'read') ? 'read' : 'edit'"
                        :color="!isRead ? 'brand-velvet' : 'grey-4'"
                        :text-color="!isRead ? 'white' : 'blue-grey-8'"
                        :unelevated="!isRead ? true : false"
                    />
                    <q-btn
                        icon="fa-solid fa-trash"
                        padding="10px"
                        size="sm"
                        @click="remove(); status = 'read'"
                        :color="status == 'delete' ? 'brand-velvet' : 'grey-4'"
                        :text-color="status == 'delete' ? 'white' : 'blue-grey-8'"
                        :unelevated="status == 'delete' ? true : false"
                    />
                </div>
                <span class="brand-title text-start">Описание</span>
                <span v-if="typeForm && tables.find(t => t.name.includes(typeForm))" class="brand-description text-start whitespace-pre-line">
                {{ tables.find(t => t.name.includes(typeForm)).info }}
                </span>
                <span v-else class="brand-description text-start">
                На этой странице вы можете управлять пользователями,
                отделами и уроками вашего образовательного центра,
                а также добавлять новые записи. Также здесь можно
                просматривать детали каждого элемента, что позволяет
                легко отслеживать и управлять всеми аспектами вашего центра.
                </span>
            </div>

            <q-card class="!min-h-[40vh] p-2">
                <q-card-section class="brand-title"> {{ status === 'edit' ? 'Редактировать' : status === 'create' ? 'Создать' : 'Подробности' }} </q-card-section>
                <q-separator inset />
                <q-card-section class="flex flex-col justify-center">
                    <q-form @submit="save(); status = 'read'">
                        <component ref="formSubmit" :is="forms[typeForm]" :model="details" :status="isRead" :mode="status" @update-list="tables.find(t => t.name.includes(typeForm)).get()"/>
                        <q-btn v-if="!isRead" type="submit" label="Сохранить" color="brand-velvet" class="mt-2"/>
                    </q-form>
                </q-card-section>
            </q-card>
        </div>
    </div>
</div>
</template>