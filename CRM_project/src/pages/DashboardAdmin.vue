<script setup>
import TmpRecord from '@/components/forms/TmpRecord.vue'
import axios from 'axios'
import { useQuasar, copyToClipboard } from 'quasar'
import { computed, ref } from 'vue'

const status = ref('read')
const isRead = computed(() => status.value != 'read'? false: true)
const api = ref(null)
const details = ref({})
const q = useQuasar()

const a = [
    { name: 'fio', label: 'Ф.И.О.', field: row => row.profile.fio, align: 'left', sortable: true },
    { name: 'post', label: 'Должность', field: row => row.profile.post, align: 'left', sortable: true },
    { name: 'email', label: 'E-mail', field: row => row.email, align: 'left', sortable: true},
    { name: 'role', label: 'Уровень доступа', field: row => row.role, align: 'right', sortable: true},
    { name: 'default_pass', label: 'Стандартный пароль', field: row => row.defaul_pass ? '✔' : '✖', align: 'center', sortable: true },
    { name: 'update_at', label: 'Обновлено', field: row => row.profile.update_at, align: 'center', sortable: true },
]

const b = [
    { name: 'title', label: 'Отдел', field: row => row.title, align: 'left', sortable: true },
    { name: 'head_department', label: 'Управляющий отдел', field: row => row.head_department, align: 'left', sortable: true },
    { name: 'supervisors', label: 'Руководители', field: row => row.supervisors, align: 'left', sortable: true },
    { name: 'update_at', label: 'Обновлено', field: row => row.update_at, align: 'center', sortable: true },
]

const c = [
    { name: 'class', label: 'Класс', field: row => `${row.number}.${row.parallel}`, align: 'left', sortable: true },
    { name: 'spec', label: 'Уклон', field: row => row.spec?.title || '', align: 'left', sortable: true },
    { name: 'update_at', label: 'Обновлено', field: row => row.update_at, align: 'left', sortable: true },
]

const d = [
    { name: 'title', label: 'Урок', field: row => row.title, align: 'left', sortable: true },
    { name: 'update_at', label: 'Обновлено', field: row => row.update_at, align: 'left', sortable: true },
]

const formSchemas = {
    user: {
        id: {label: 'ID', value: '', hidden: true},
        email: {label: 'E-mail', value: ''},
        default_pass: {label: 'Стандартный пароль', value: true, readonly: true},
        pass_reset: {label: 'Сбросить пароль', value: false},
        role: {label: 'Уровень доступа', value: 3},
        password: {label: 'Пароль', value: '123456', hidden: true},
        profile: {label: 'Профиль', value: {
            initials_name: {label: 'Инициалы', value: '', readonly: true},
            fio: {label: 'Ф.И.О.', value: ''},
            post: {label: 'Должность', value: ''},
            classes: {label: 'Классы', value: []},
            departments: {label: 'Отделы', value: []},
            lessons: {label: 'Уроки', value: []},
            create_at: {label: 'Создан', value: '', readonly: true},
            update_at: {label: 'Обновлен', value: '', readonly: true}
        }}
    },
    class: {
        id: {label: 'ID', value: '', hidden: true},
        number: {label: 'Номер класса', value: ''},
        parallel: {label: 'Параллель', value: ''},
        specialization: {label: 'Уклон', value: ''}
    },
    lesson: {
        id: {label: 'ID', value: '', hidden: true},
        title: {label: 'Название', value: ''}
    },
    department: {
        id: {label: 'ID', value: '', hidden: true},
        head_department: {label: 'Управляющий отдел', value: ''},
        title: {label: 'Название', value: ''}
    }
}

const tables = ref([
    { label: "Пользователи", caption: "Управление пользователями", path: '/user', data: [], columns: a, form: formSchemas['user']},
    { label: "Отделы", caption: "Управление отделами", path: '/user/department', data: [], columns: b, form: formSchemas['department'] },
    { label: "Классы", caption: "Управление классами", path: '/user/class', data: [], columns: c, form: formSchemas['class']},
    { label: "Уроки", caption: "Управление уроками", path: '/user/lesson', data: [], columns: d, form: formSchemas['lesson']}
])

async function save() {
    const f = form => {
        let obj = {}
        for (let key in form) {
            if (Array.isArray(form[key]['value']))
                obj[key] = [...form[key]['value']]

            else if (typeof form[key]['value'] == 'object')
                obj[key] = {...f(form[key]['value'])}

            else
                obj[key] = form[key]['value'] == '' ? null : form[key]['value']
        }
        return obj
    }

    if (!isRead.value && api?.value) {
        let path = `/api${api.value}`
        let response = null
        let data = f(details.value)
        
        if (status.value == 'create') { response = await axios.post(path, data) }
        if (status.value == 'edit') { response = await axios.patch(path, data) }
        
        if (response?.status == 200) {
            q.notify({
                type: 'positive',
                position: 'top',
                color: 'brand-velvet',
                progress: true,
                message: 'myPass',
                caption: 'Это ваш временный пароль',
                actions: [
                    {label: 'Копировать', color: 'white', handler: copyToClipboard(response.data['gen_pass'])}
                ]})

            response = await axios.get(path, { params: { ids: response.data['ids'] } })
            select(response.data.data[0], details.value, api.value)

            response = await get(api.value)
            status.value = 'read'
        }
}
}

async function del() {
    let response = null
    if (details?.value?.id.value && api?.value) {
        response = await axios.delete(`/api${api.value}`, { params: { ids: details?.value?.id.value } })
    }

    if (response?.status == 200)
        response = await get(api.value)

status.value = 'read'
}

async function get(path) {
    let response = await axios.get(`/api${path}`);
    let table = tables.value.find(t => t.path === path);

    if (table)
        table.data = response.data.data;
}

async function add(schema, path) {
    const f = schema => {
        let obj = {};
        for (let key in schema) {
            obj[key] = {...schema[key]}

            if (Array.isArray(schema[key]['value']))
                obj[key]['value'] = [...schema[key]['value']]

            else if (typeof schema[key]['value'] === 'object'){
                obj[key]['value'] = {...f(schema[key]['value'])}
            }
        }
        return obj
    }
    details.value = f(schema)
    api.value = path
    status.value = 'create'
}

function select(row, schema, path) {
    const f = (schema, row) => {
        let obj = {};
        for (let key in schema) {
            obj[key] = {...schema[key]}

            if (Array.isArray(schema[key]['value']))
                obj[key]['value'] = Array.isArray(row?.[key]) ? [...row[key]] : [];

            else if (typeof schema[key]['value'] === 'object'){
                obj[key]['value'] = {...f(schema[key]['value'], row[key])};
            }

            else if (row[key])
                obj[key]['value'] = row[key];
        }
        return obj;
    }

    details.value = f(schema, row);
    api.value = path
}

</script>

<template>
 <div class="w-full h-full flex flex-row p-5 pb-1 gap-10">
    <div class="flex-grow max-w-[67%] pr-1 h-full overflow-y-auto">
        <q-list bordered>
            <q-expansion-item
                v-for="table in tables"
                :switch-toggle-side="true"
                expand-separator
                :label="table.label"
                :caption="table.caption"
                @show="get(table.path)"
                >
                <q-card class="p-5">
                    <q-table
                        :rows="table.data"
                        :columns="table.columns"
                        @row-click="(evt, row, index) => select(row, table.form, table.path)"
                    />
                    <q-btn @click="add(table.form, table.path)" label="Добавить" flat color="brand-velvet" icon="add"/>
                </q-card>
            </q-expansion-item>
        </q-list>
    </div>
    <div class="w-[30%] h-full overflow-y-auto">
        <div class="flex flex-col m-2">
            <div class="flex flex-col gap-4 mb-5">
                <span class="font-bold text-gray-800 text-2xl text-start"> Административная страница </span>
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
                        @click="del"
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
                    <TmpRecord :dict="details" :status="isRead"/>
                    <q-btn v-if="!isRead" @click="save" label="Сохранить" color="brand-velvet" class="mt-2"/>
                </q-card-section>
            </q-card>
        </div>
    </div>
 </div>
</template>

<style>
#d-1 {
    background-color: red;
}
#d-2 {
    background-color: blue;
}
#d-3 {
    background-color: green;
}
</style>