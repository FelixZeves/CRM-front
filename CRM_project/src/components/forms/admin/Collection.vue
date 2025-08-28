<script setup>
import {ref } from 'vue';
import { successNotify, confirmNotify } from '@/components/Notifies';
import api from '@/main';
import { COLLECTION, USER } from '@/components/Utils';

const props = defineProps({
    model: {type: Object, required: true, default: {}},
    status: {type: Boolean, default: false},
    mode: {type: String, default: 'read'}
})

const emit = defineEmits(['update-list'])

const buffOptions = ref([])
const allOptions = ref([])

async function lazyLoad(url) {
  const data = (await api.get(url)).data.data
  buffOptions.value = [
  { init_name: 'Выбрать всех', id: '__all__' },
    ...data.map(item => ({
      init_name: item.profile.initials_name,
      id: item.profile.id
    }))
  ]
  allOptions.value = buffOptions.value
}

function filterFn(val, update) {
  if (val === '') {
    update(() => {
      buffOptions.value = allOptions.value
    })
    return
  }

  update(() => {
    const needle = val.toLowerCase()
    buffOptions.value = allOptions.value.filter(opt =>
      opt.init_name?.toLowerCase().includes(needle)
    )
  })
}

function onSelectionChange(val, targetField) {
  if (val.includes('__all__')) {
    props.model[targetField] = allOptions.value
      .filter(opt => opt.id !== '__all__')
      .map(opt => opt.id)
  }
}

function getNameById(record, targetField) {
  return props.model[targetField].find(opt => opt.id === record.id)?.init_name || allOptions.value.find(opt => opt.id === record)?.init_name || ''
}

function removeUser(id, targetField) {
    if  (!props.status){props.model[targetField] = props.model[targetField].filter(sid => sid !== id)}
}

async function send() {
    if (!props.status) {
        if (props.mode == 'create') {
            let response = await api.post(COLLECTION, props.model)
            if (response.status == 200) successNotify('Коллекция создана')
        }

        if (props.mode == 'edit') {
            props.model.subs = [...props.model.subs.map(item => item.id || item)]
            props.model.pubs = [...props.model.pubs.map(item => item.id || item)]
            let response = await api.patch(COLLECTION, props.model)
            if (response.status == 200) successNotify('Коллекция изменена')
        }

        emit('update-list')
    }
}

async function remove() {
    if (!props.status &&  props.model?.id) confirmNotify(async () => {
        let response = await api.delete(`${COLLECTION}/${props.model.id}`)
        if(response.status == 200) {
            successNotify('Группа удалена')
            emit('update-list')
        }
    })
}

defineExpose({send, remove})
</script>

<template>
    <q-list>
        <q-item>
            <q-input class="w-full brand-description" outlined label="Название" :readonly="status" v-model="model.title"/>
        </q-item>
        <q-item>
            <q-select
                label="Участники"
                class="w-full brand-text"
                outlined
                emit-value
                map-options
                :use-chips="!status"
                multiple
                use-input
                input-debounce="200"
                :readonly="status"
                :options="buffOptions"
                option-label="init_name"
                option-value="id"
                @focus="lazyLoad(USER)"
                @filter="filterFn"
                v-model="model.subs"
                @update:model-value="val => onSelectionChange(val, 'subs')"
            >
                <template v-slot:selected>
                    <q-chip
                        v-for="(id, index) in model.subs.slice(0, 5)"
                        :key="id"
                        removable
                        @remove="removeUser(id, 'subs')"
                    >
                        {{ getNameById(id, 'subs') }}
                    </q-chip>
                    <q-chip v-if="model.subs.length > 5" color="brand-velvet" text-color="white">
                        +{{ model.subs.length - 5 }}
                    </q-chip>
                </template>
            </q-select>
        </q-item>
        <q-item>
            <q-select
                label="Писатели"
                class="w-full brand-text"
                outlined
                emit-value
                map-options
                multiple
                use-input
                input-debounce="200"
                :readonly="status"
                :options="buffOptions"
                option-label="init_name"
                option-value="id"
                @focus="lazyLoad(USER)"
                @filter="filterFn"
                v-model="model.pubs"
                @update:model-value="val => onSelectionChange(val, 'pubs')"
            >
                <template v-slot:selected>
                    <q-chip
                        :readonly="status"
                        v-for="(id, index) in model.pubs.slice(0, 5)"
                        :key="id"
                        removable
                        @remove="removeUser(id, 'pubs')"
                    >
                        {{ getNameById(id, 'pubs') }}
                    </q-chip>
                    <q-chip v-if="model.pubs.length > 5" color="brand-velvet" text-color="white">
                        +{{ model.pubs.length - 5 }}
                    </q-chip>
                </template>
            </q-select>

        </q-item>
        <q-item>
            <q-input class="w-full brand-description" borderless readonly label="Создан" v-model="model.create_at"/>
        </q-item>
        <q-item>
            <q-input class="w-full brand-description" borderless readonly label="Обновлен" v-model="model.update_at"/>
        </q-item>
    </q-list>
</template>