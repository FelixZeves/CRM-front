<script setup>
import { ref } from 'vue';
import axios from 'axios';
import { successNotify, confirmNotify } from '@/components/Notifies';

const props = defineProps({
    model: {type: Object, required: true, default: {}},
    status: {type: Boolean, default: false},
    mode: {type: String, default: 'read'}
})

const emit = defineEmits(['update-list'])

const localModel = ref(JSON.parse(JSON.stringify(props.model)))
const buffOptions = ref([])


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
    if (props.mode != 'read') confirmNotify(async () => {await axios.delete(`/api/user/class?id=${localModel.value.id}`); emit('update-list')})
}

defineExpose({ send, remove })
</script>

<template>
    <q-list>
        <q-item>
            <q-input class="w-full brand-description" outlined label="Класс" :readonly="status" v-model="localModel.number"/>
        </q-item>
        <q-item>
            <q-input class="w-full brand-description" outlined label="Параллель" :readonly="status" v-model="localModel.parallel"/>
        </q-item>
        <q-item>
            <q-select
                label="Уклон"
                class="w-full brand-description"
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
            <q-input class="w-full brand-description" borderless readonly label="Обновлен" v-model="localModel.update_at"/>
        </q-item>
    </q-list>
</template>