<script setup>
import { ref } from 'vue'
import { DialogEnum } from '../Enums.vue';
import { useQuasar, copyToClipboard } from 'quasar';
const props = defineProps(['table', 'func'])

const recordCreation = ref(false)

const values = ref(DialogEnum[props.table].values)

const datas = ref(structuredClone(DialogEnum[props.table].params))

const creationFunction = DialogEnum[props.table].creationFunction

const q = useQuasar()

</script>

<template>
    <q-btn icon="fa-solid fa-plus" outline round color="brand-complete" size="sm" @click="recordCreation = true"></q-btn>

    <q-dialog v-model="recordCreation" backdrop-filter="blur(4px)">
        <q-card style="max-width: 75%; min-width: 75%;" class="py-4 !rounded-[20px] !overflow-y-hidden">
            <p align="center" class="text-bold !text-2xl">{{ DialogEnum[table].title }}</p>
            <q-form @submit="async () => 
                                {response = await creationFunction(datas);
                                if(response && 'password' in response){
                                    let notification = q.notify({
                                            message: `Пароль созданного пользователя ${response.password}`,
                                            position: 'top',actions: [
                                                {label: 'Копировать',
                                                color: 'white',
                                                handler: async () => {
                                                    await copyToClipboard(password)
                                                    notification({ // Обновляем существующее уведомление
                                                    message: `Пароль: ${response.password} (скопировано) ✅`, // Добавляем пометку
                                                    timeout: 2500 // Теперь закрываем через 2.5 сек
                                                    })
                                                }
                                                }]
                                    })
                                }}">
                <div class="max-h-[600px] overflow-y-auto">
                    <q-card-section
                v-for="value in values"
                class="!w-[90%] justify-self-center !py-2">
                    <div
                    v-if="!value.hidden"> 
                        <p>{{ value.name }}</p>
                        <q-select 
                        v-if="value.options"
                        v-model="datas[value.model]"
                        :options="value.options"
                        :multiple="value.multiple"
                        :hint="value.hint"
                        emit-value
                        map-options
                        hide-bottom-space
                        dense
                        borderless
                        :menu-offset="[15, 30]"
                        popup-content-class="gray-menu">
                        </q-select>
                        <q-input
                        v-else
                        hide-bottom-space
                        dense
                        borderless
                        clearable
                        color="black"
                        label-color="black"
                        v-model="datas[value.model]"
                        :hint="value.hint"
                        lazy-rules
                        :rules="value.rules">
                        </q-input>
                    </div>
                </q-card-section>
                </div>
                <q-card-section align="center">
                    <p>{{ gettedPassword }}</p>
                    <q-btn
                    type="submit"
                    label="Создать запись"
                    class="submit-btn"/>
                </q-card-section>
            </q-form>
        </q-card>
    </q-dialog>

</template>

<style scoped>

p{
    @apply text-xl text-black mb-2 ps-3 underline underline-offset-[6px]
}

.q-input, .q-select{
    @apply ps-4 bg-[--vt-c-white-mute] !rounded-[10pt] border-[0.5pt] border-[--crm-c-medium-gray] text-lg
}

</style>