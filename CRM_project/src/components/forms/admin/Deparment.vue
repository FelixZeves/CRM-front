<script setup>
import { ref, watch } from 'vue';
import api from '@/main';
import { successNotify, confirmNotify } from '@/components/Notifies';
import { DEPARTMENT, getDepartments } from '@/components/Utils';

const props = defineProps({
    model: {type: Object, required: true, default: {}},
    status: {type: Boolean, default: false},
    mode: {type: String, default: 'read'}
})

const emit = defineEmits(['update-list'])

const localModel = ref(JSON.parse(JSON.stringify(props.model)))

const buffOptions = ref([])
const staffOptions = ref([...props.model.staff])
const managerOption = ref([props.model.manager])

watch(() => props.model, (val) => {
  Object.assign(localModel.value, JSON.parse(JSON.stringify(val)))
}, { deep: true })

async function send() {
    if (!props.status) {
        localModel.value.manager = localModel.value.manager?.id
        localModel.value.staff = [...localModel.value.staff.map(item => item.id)]
        localModel.value.childrens = [...localModel.value.childrens.map(item => item.id ? item.id : item)]
        localModel.value.parents = [...localModel.value.parents.map(item => item.id ? item.id : item)]
        if (props.mode == 'create') {
            let response = await api.post(DEPARTMENT, localModel.value)
            if (response.status == 200) successNotify('Отдел создан')
        }
        if (props.mode == 'edit') {
            let response = await api.patch(DEPARTMENT, localModel.value)
            if (response.status == 200) successNotify('Отдел отредактирован')
        }

        emit('update-list')    
    }
}

async function getDeps() {
    const data = (await getDepartments()).data
    buffOptions.value = [...data.filter(item => item.id !== localModel.id)
                                .map(item => ({id: item.id, title: item.title}))]
}

async function remove() {
    if (!props.status && localModel.value?.id) confirmNotify(async () => {
        let response = await api.delete(`${DEPARTMENT}?id=${localModel.value.id}`)
        if(response.status == 200){
            successNotify('Отдел успешно удалён')
            emit('update-list')
        }
    })
}

defineExpose({send, remove})
</script>

<template>
    <q-list>
        <q-item>
            <q-input
                class="w-full brand-description"
                outlined
                label="Название"
                :readonly="status"
                v-model="localModel.title"
                :rules="[
                    val => !!val || 'Обязательное поле'
                ]"
                hide-bottom-space
            />
        </q-item>
        <q-item>
            <q-select
                label="Руководитель"
                class="w-full brand-description"
                outlined
                emit-value
                clearable
                map-options
                :readonly="status"
                :options="managerOption"
                :option-label="'fio'"
                :option-value="'id'"
                v-model="localModel.manager"
            />
        </q-item>
        <q-item>
            <q-select
                label="Вышестоящее руководство"
                class="w-full brand-description"
                outlined
                emit-value
                map-options
                multiple
                use-chips
                :readonly="status"
                :options="buffOptions.manager"
                :option-label="'title'"
                :option-value="'id'"
                @focus="getDeps"
                v-model="localModel.parents"
            />
        </q-item>
        <q-item>
            <q-select
                label="Дочерние отделы"
                class="w-full brand-text"
                outlined
                emit-value
                map-options
                multiple
                use-chips
                :readonly="status"
                :options="buffOptions"
                :option-label="'title'"
                :option-value="'id'"
                @focus="getDeps"
                v-model="localModel.childrens"
            />
        </q-item>
        <q-item>
            <q-select
                label="Сотрудники"
                class="w-full brand-text"
                outlined
                emit-value
                :use-chips="!status"
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
            <q-input class="w-full brand-description" borderless readonly label="Создан" v-model="localModel.create_at"/>
        </q-item>
        <q-item>
            <q-input class="w-full brand-description" borderless readonly label="Обновлен" v-model="localModel.update_at"/>
        </q-item>
    </q-list>
</template>