<script setup>
import { ref } from 'vue';
import axios from 'axios';
import { useQuasar } from 'quasar';

const props = defineProps({
    model: {type: Object, required: true, default: {}},
    status: {type: Boolean, default: false},
    mode: {type: String, default: 'read'}
})

const emit = defineEmits(['update-list'])

const q = useQuasar()
const localModel = ref(JSON.parse(JSON.stringify(props.model)))
const buffOptions = ref([])
const successNotify = () => q.notify({type: 'positive', position: 'top', message: 'Успех!'})
const confirmNotify = () => q.notify({
    type: 'ongoing',
    position: 'top',
    color: 'red-5',
    message: 'Вы уверены?',
    actions: [
        {label: 'Подтвердить', color: 'white', handler: async () => {await axios.delete(`/api/user/class?id=${localModel.value.id}`); emit('update-list')}},
        {label: 'Отменить', color: 'white'}
]})

async function send() {
    let response = null

    if (props.mode == 'create')
        response = await axios.post('/api/user/class', localModel.value)

    if (props.mode == 'edit')
        response = await axios.patch('/api/user/class', localModel.value)

    if (response?.status == 200) successNotify()
    emit('update-list')
}

async function lazyLoad(url) {
    const data = (await axios.get(url)).data.data
    buffOptions.value = [...data]
}

async function remove() {
    if (props.mode != 'read') confirmNotify()
}

defineExpose({ send, remove })
</script>

<template>
    <q-list>
        <q-item>
            <q-input class="w-full" outlined label="Класс" :readonly="status" v-model="localModel.number"/>
        </q-item>
        <q-item>
            <q-input class="w-full" outlined label="Параллель" :readonly="status" v-model="localModel.parallel"/>
        </q-item>
        <q-item>
            <q-select
                label="Уклон"
                class="w-full"
                outlined
                emit-value
                map-options
                clearable
                :readonly="status"
                :options="buffOptions"
                :option-label="'title'"
                :option-value="'id'"
                @focus="lazyLoad('/api/user/department/short')"
                v-model="localModel.spec"
            />
        </q-item>
        <q-item>
            <q-input class="w-full" borderless readonly label="Обновлен" v-model="localModel.update_at"/>
        </q-item>
    </q-list>
</template>