<script setup>
import { RoleEnum } from '@/components/Enums.vue';
import { ref } from 'vue';
import { successNotify, passClipboardNotify, confirmNotify } from '@/components/Notifies';
import axios from 'axios';

const props = defineProps({
    model: {type: Object, required: true, default: {}},
    status: {type: Boolean, default: false},
    mode: {type: String, default: 'read'}
})

const emit = defineEmits(['update-list'])

const isPassReset = ref(false)
const roleOptions = Object.entries(RoleEnum).map(([key, value]) => ({label: value.translation, value: Number(key)}))
const buffOptions = ref([{title: 'Пусто', id: null}])

async function lazyLoad(url) {
    const data = (await axios.get(url)).data.data
    buffOptions.value = [{title: 'Пусто', id: null}, ...data]
}

async function send() {
    if (!props.status) {
        if (isPassReset.value) {
            let response = await axios.put('/api/user/pass-reset', {id: props.model.id})
            if (response.data?.password) passClipboardNotify(response.data.password)
        }
        if (props.model.profile.department?.id) {props.model.profile.department = props.model.profile.department.id}

        if (props.mode == 'create') {
            let response = await axios.post('/api/user', props.model);
            if (response.data?.password) passClipboardNotify(response.data.password)
        }

        if (props.mode == 'edit') {await axios.patch('/api/user', props.model); successNotify()}

        emit('update-list')
    }
}

async function remove() {
    if (!props.status &&  props.model?.id) confirmNotify(async () => {await axios.delete('/api/user', { params: { id: props.model.id } }); emit('update-list')})
}

defineExpose({send, remove})
</script>

<template>
    <q-list>
        <q-item>
            <q-input class="w-full brand-description" outlined label="Email" :readonly="status" v-model="model.email"/>
        </q-item>
        <q-item>
            <q-checkbox
                class="w-full brand-description"
                label="Стандартный пароль"
                disable
                keep-color
                color="brand-velvet"
                checked-icon="fa-solid fa-circle"
                unchecked-icon="fa-solid fa-circle-notch"
                v-model="model.default_pass"
            />
        </q-item>
        <q-item>
            <q-checkbox
                class="w-full brand-description"
                label="Сбросить пароль"
                indeterminate-value
                :disable="status"
                keep-color
                color="brand-velvet"
                checked-icon="fa-solid fa-circle"
                unchecked-icon="fa-solid fa-circle-notch"
                v-model="isPassReset"
            />
        </q-item>
        <q-item>
            <q-select
                class="w-full brand-description"
                outlined
                label="Уровень доступа"
                :readonly="status"
                :options="roleOptions"
                emit-value
                map-options
                v-model="model.role"
            />
        </q-item>
        <q-expansion-item class="w-full brand-title" label="Профиль">
            <q-item>
                <q-input class="w-full brand-description" outlined label="Ф.И.О." :readonly="status" v-model="model.profile.fio"/>
            </q-item>
            <q-item>
                <q-input class="w-full brand-description" outlined label="Должность" :readonly="status" v-model="model.profile.post"/>
            </q-item>
            <q-item>
                <q-select
                    class="w-full brand-description"
                    outlined
                    label="Классное руководство"
                    :readonly="status"
                    emit-value
                    map-options
                    v-model="model.profile.classes"
                />
            </q-item>
            <q-item>
                <q-select
                    class="w-full brand-description"
                    outlined
                    label="Проводимые уроки"
                    :readonly="status"
                    emit-value
                    map-options
                    v-model="model.profile.lessons"
                />
            </q-item>
            <q-item>
                <q-select
                    label="Руководитель"
                    class="w-full brand-description"
                    outlined
                    emit-value
                    map-options
                    :readonly="status"
                    :options="buffOptions"
                    :option-label="'title'"
                    :option-value="'id'"
                    @focus="lazyLoad('/api/user/department')"
                    v-model="model.profile.manager"
                />
            </q-item>
            <q-item>
                <q-select
                    label="Сотрудник"
                    class="w-full brand-description"
                    outlined
                    emit-value
                    map-options
                    :readonly="status"
                    :options="buffOptions"
                    :option-label="'title'"
                    :option-value="'id'"
                    @focus="lazyLoad('/api/user/department')"
                    v-model="model.profile.department"
                />
            </q-item>
        </q-expansion-item>
        <q-item>
            <q-input class="w-full brand-description" borderless readonly label="Создан" v-model="model.profile.create_at"/>
        </q-item>
        <q-item>
            <q-input class="w-full brand-description" borderless readonly label="Обновлен" v-model="model.profile.update_at"/>
        </q-item>
    </q-list>
</template>