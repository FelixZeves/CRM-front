<script setup>
import { getTableSchema, getFormSchema} from '@/components/Utils.js'
import User from '@/components/forms/admin/User.vue'
import Department from '@/components/forms/admin/Deparment.vue'
import Class from '@/components/forms/admin/Class.vue'
import Lesson from '@/components/forms/admin/Lesson.vue'
import axios from 'axios'
import { useQuasar, copyToClipboard } from 'quasar'
import { computed, ref } from 'vue'

const q = useQuasar()
const status = ref('read')
const isRead = computed(() => status.value != 'read'? false: true)
const url = ref(null)
const typeForm = ref(null)
const formSubmit = ref(null)
const details = ref(null)

const forms = {
    user: User,
    department: Department,
    class: Class,
    lesson: Lesson
}

const tables = ref([
  {...getTableSchema('user'), path: '/api/user', data: [],
    async get() {this.data = (await axios.get('/api/user')).data.data},
    choose(row) {typeForm.value = 'user'; details.value = row},
    add() {typeForm.value = 'user'; details.value = getFormSchema('user'); status.value ='create';}
},
  {...getTableSchema('department'), path: '/api/user/department', data: [],
    async get() {this.data = (await axios.get('/api/user/department')).data.data},
    choose(row) {typeForm.value = 'department'; details.value = row},
    add() {typeForm.value = 'department'; details.value = getFormSchema('department'); status.value ='create';}
},
  {...getTableSchema('classes'), path: '/api/user/class', data: [],
  async get() {this.data = (await axios.get('/api/user/class')).data.data},
  choose(row) {typeForm.value = 'class'; details.value = row},
  add() {typeForm.value = 'class'; details.value = getFormSchema('class'); status.value ='create';}
},
  {...getTableSchema('lessons'), path: '/api/user/lesson', data: [],
  async get() {this.data = (await axios.get('/api/user/lesson')).data.data},
  choose(row) {typeForm.value = 'lesson'; details.value = row},
  add() {typeForm.value = 'lesson'; details.value = getFormSchema('lesson'); status.value ='create';}
},
])

async function save() {
    await formSubmit.value.send()
}

async function remove() {
    await formSubmit.value.remove()
}

</script>

<template>
 <div class="w-full h-full flex flex-row p-5 pb-1 gap-10">
    <div class="flex-grow max-w-[67%] pr-1 h-full overflow-y-auto">
        <q-list bordered>
            <q-expansion-item
                v-for="table in tables"
                switch-toggle-side
                expand-separator
                :label="table.label"
                @show="table.get()"
                >
                <q-card class="p-5">
                    <q-table
                        :rows="table.data"
                        :columns="table.columns"
                        @row-click="(evt, row, index) => {table.choose(row)}"
                    />
                    <q-btn @click="table.add()" label="Добавить" flat color="brand-velvet" icon="add"/>
                </q-card>
            </q-expansion-item>
        </q-list>
    </div>
    <div class="w-[30%] h-full overflow-y-auto">
        <div class="flex flex-col m-2">
            <div class="flex flex-col gap-4 mb-5">
                <div class="flex flex-row justify-between">
                    <span class="font-bold text-gray-800 text-2xl text-start"> Административная страница </span>
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
                        @click="remove"
                        :color="status == 'delete' ? 'brand-velvet' : 'grey-4'"
                        :text-color="status == 'delete' ? 'white' : 'blue-grey-8'"
                        :unelevated="status == 'delete' ? true : false"
                    />
                </div>
                <span class="font-bold text-gray-800 text-xl text-start">Описание</span>
                <span class="font-normal text-base text-gray-700 text-start">
                    На этой странице вы можете управлять пользователями,
                    отделами и уроками вашего образовательного центра,
                    а также добавлять новые записи. Также здесь можно
                    просматривать детали каждого элемента, что позволяет
                    легко отслеживать и управлять всеми аспектами вашего центра.
                </span>
            </div>

            <q-card class="!shadow-xl !rounded-[15pt] p-2">
                <q-card-section class="text-h5"> {{ status === 'edit' ? 'Редактировать' : status === 'create' ? 'Создать' : 'Подробности' }} </q-card-section>
                <q-separator inset />
                <q-card-section class="flex flex-col justify-center">
                    <q-form @submit="save">
                        <component ref="formSubmit" :is="forms[typeForm]" :model="details" :status="isRead" :mode="status"/>
                        <q-btn v-if="!isRead" type="submit" label="Сохранить" color="brand-velvet" class="mt-2"/>
                    </q-form>
                </q-card-section>
            </q-card>
        </div>
    </div>
</div>
</template>