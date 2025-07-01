<script setup>
import { reactive, ref, watch } from 'vue';
import { useQuasar } from 'quasar'
import axios from 'axios';

const props = defineProps({
    model: {type: Object, required: true, default: {}},
    status: {type: Boolean, default: false},
    mode: {type: String, default: 'read'}
})

const emit = defineEmits(['update-list'])

const q = useQuasar()
const localModel = ref(JSON.parse(JSON.stringify(props.model)))
const buffOptions = ref([{title: 'Пусто', id: null}])
const staffOptions = ref([...props.model.staff])
const managerOption = ref([props.model.manager])
const successNotify = () => q.notify({type: 'positive', position: 'top', message: 'Успех!'})
const confirmNotify = () => q.notify({
    type: 'ongoing',
    position: 'top',
    color: 'red-5',
    message: 'Вы уверены?',
    actions: [
        {label: 'Подтвердить', color: 'white', handler: async () => {await axios.delete(`/api/user/department?id=${localModel.value.id}`); emit('update-list')}},
        {label: 'Отменить', color: 'white'}
]})

watch(() => props.model, (val) => {
  Object.assign(localModel, JSON.parse(JSON.stringify(val)))
}, { deep: true })

async function send() {
    if (!props.status) {
        localModel.value.manager = localModel.value.manager?.id
        localModel.value.staff = [...localModel.value.staff.map(item => item.id)]
        if (props.mode == 'create') {await axios.post('/api/user/department', localModel.value)}
        if (props.mode == 'edit') {await axios.patch('/api/user/department', localModel.value)}
        successNotify()
        emit('update-list')
    }
}

async function getDepartments() {
    const data = (await axios.get('/api/user/department?limit=100')).data.data
    buffOptions.value = [...data.filter(item => item.id !== localModel.id)
                                .map(item => ({id: item.id, title: item.title}))]
}

async function lazyLoad(url) {
    const data = (await axios.get(url)).data.data
    buffOptions.value = [{title: 'Пусто', id: null}, ...data]
}

async function remove() {
    if (!props.status && localModel.value?.id) confirmNotify()
}

defineExpose({send, remove})
</script>

<template>
    <q-list>
        <q-item>
            <q-input class="w-full" outlined label="Название" :readonly="status" v-model="localModel.title"/>
        </q-item>
        <q-item>
            <q-select
                label="Руководитель"
                class="w-full"
                outlined
                emit-value
                map-options
                :readonly="status"
                :options="managerOption"
                :option-label="'fio'"
                :option-value="'id'"
                @focus="lazyLoad('/api/user/department')"
                v-model="localModel.manager"
            />
        </q-item>
        <q-item>
            <q-select
                label="Вышестоящее руководство"
                class="w-full"
                outlined
                emit-value
                map-options
                multiple
                use-chips
                :readonly="status"
                :options="buffOptions.manager"
                :option-label="'title'"
                :option-value="'id'"
                @focus="getDepartments"
                v-model="localModel.parents"
            />
        </q-item>
        <q-item>
            <q-select
                label="Дочерние отделы"
                class="w-full"
                outlined
                emit-value
                map-options
                multiple
                use-chips
                :readonly="status"
                :options="buffOptions"
                :option-label="'title'"
                :option-value="'id'"
                @focus="getDepartments"
                v-model="localModel.childrens"
            />
        </q-item>
        <q-item>
            <q-select
                label="Сотрудники"
                class="w-full"
                outlined
                emit-value
                map-options
                multiple
                :readonly="status"
                :options="staffOptions"
                :option-label="'init_name'"
                :option-value="'id'"
                v-model="localModel.staff"
            />
        </q-item>
        <q-item>
            <q-input class="w-full" borderless readonly label="Обновлен" v-model="localModel.update_at"/>
        </q-item>
    </q-list>
</template>