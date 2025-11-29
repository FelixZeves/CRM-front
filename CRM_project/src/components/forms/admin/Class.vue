<script setup>
import { ref, watch } from 'vue';
import api from '@/main';
import { successNotify, confirmNotify } from '@/components/Notifies';
import { CLASS } from '@/components/Utils';

const props = defineProps({
    model: {type: Object, required: true, default: {}},
    status: {type: Boolean, default: false},
    mode: {type: String, default: 'read'}
})

const emit = defineEmits(['update-list'])

const localModel = ref(JSON.parse(JSON.stringify(props.model)))
const buffOptions = ref([])

watch(() => props.model, (val) => {
  Object.assign(localModel.value, JSON.parse(JSON.stringify(val)))
}, { deep: true })

async function send() {
    let response = null

    if (props.mode == 'create')
        response = await api.post(CLASS, localModel.value)

    if (props.mode == 'edit') {
        const { statistic, spec, leader, ...payload } = localModel.value
        payload.lid = leader?.id || null

        response = await api.patch(CLASS, payload)
    }

    if (response?.status == 200) successNotify()
    emit('update-list')
}

const leaderOptions = ref([props.model.leader])

async function remove() {
    if (props.mode != 'read') confirmNotify(async () => {
        let response = await api.delete(`${CLASS}/${localModel.value.id}`)
        if(response.status == 200){
            successNotify('Класс успешно удалён')
            emit('update-list')
        }
    })
}

defineExpose({ send, remove })
</script>

<template>
    <q-list>
        <q-item>
            <q-input class="w-full brand-description" outlined label="Параллель" type="number" max="11" :readonly="status" v-model="localModel.parallel"/>
        </q-item>
        <q-item>
            <q-input class="w-full brand-description" outlined label="Класс" :readonly="status" type="number" v-model="localModel.number"/>
        </q-item>
        <q-item>
            <q-input class="w-full brand-description" outlined label="Уклон" :readonly="status" v-model="localModel.spec"/>
        </q-item>
        <q-item>
            <q-select
                label="Классный руководитель"
                class="w-full brand-description"
                outlined
                emit-value
                clearable
                map-options
                :readonly="status"
                :options="leaderOptions"
                :option-label="'fio'"
                :option-value="'id'"
                v-model="localModel.leader"
            />
        </q-item>
        <q-item>
            <q-input class="w-full brand-description" borderless readonly label="Обновлен" v-model="localModel.update_at"/>
        </q-item>
    </q-list>
</template>