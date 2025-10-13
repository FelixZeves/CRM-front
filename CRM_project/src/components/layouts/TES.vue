<script setup>
import { ref, watchEffect } from 'vue'
import { confirmNotify, errorNotify } from '@/components/Notifies'
import { familyStatuses } from '@/components/Enums.vue'
import { getFormSchema } from '@/components/Utils'
import StudentParentForm from '../forms/StudentParentForm.vue'

const props = defineProps(['body', 'edit'])

const bodyCopy = ref(JSON.parse(JSON.stringify(props.body)))

const buffOptions = ref([])

watchEffect(() => {
  if (props.edit) {
    bodyCopy.value = JSON.parse(JSON.stringify(props.body))
  }
})

const addInput = async () => {
  if (bodyCopy.value.parents.length >= 4)
    return errorNotify('Количество родителей не может превышать 4')

  bodyCopy.value.parents.push(getFormSchema('parent'))
}

const removeInput = (index) => {
    confirmNotify(() => {bodyCopy.value.parents.splice(index, 1)})
}

const lists = [
    {value: 'schoolEvents', label: 'Школьные конкурсы'},
    {value: 'achievementsRus', label: 'Всероссийские конкурсы'},
    {value: 'achievementsInter', label: 'Международные конкурсы'}]

 const statusesOptions = Object.values(familyStatuses)

function formatPhone(phone) {
  if (!phone) return ''

  // если мобильный (11 цифр, начинается с 7 или 8)
  if (/^(\+7|7|8)\d{10}$/.test(phone)) {
    return phone.replace(/(\d)(\d{3})(\d{3})(\d{2})(\d{2})/, '8 ($2) $3-$4-$5')
  }

  // если домашний (например, 6 цифр)
  if (/^\d{5}$/.test(phone)) {
    return phone.replace(/(\d{1})(\d{2})(\d{2})/, '$1-$2-$3')
  }

  return phone // fallback
}
</script>

<template>
    <q-list v-if="!edit" class="row items-start no-wrap max-h-[450px] overflow-y-auto">
        <q-item class="!max-w-[25%]">
            <q-item-section class="gap-y-2">
                <q-item-label class="brand-text font-medium">Основная информация</q-item-label>
                <q-item-label class="brand-text !font-light break-words whitespace-normal">
                    <q-icon name="fa-solid fa-phone" size="12px"/>
                    {{ formatPhone(body.mainPhone) }}
                    <q-tooltip
                        anchor="top left"
                        outline
                        self="bottom right"
                        :offset="[5, 5]"
                        class="!text-sm text-center bg-brand-velvet !text-white shadow-xl !max-w-[250px]"
                    >
                        Телефон ученика
                    </q-tooltip>
                </q-item-label>
                <q-item-label class="flex flex-row gap-x-6 brand-text !font-light break-words whitespace-normal">
                    <div>
                        <q-icon name="fa-solid fa-calendar-days" size="12px"/>
                        {{ formatPhone(body.birthday) }}
                        <q-tooltip
                            anchor="top left"
                            outline
                            self="bottom right"
                            :offset="[5, 5]"
                            class="!text-sm text-center bg-brand-velvet !text-white shadow-xl !max-w-[250px]"
                        >
                            День рождения ученика
                        </q-tooltip>
                    </div>
                    <div>
                        <q-icon name="fa-solid fa-cake-candles" size="12px"/>
                        12
                        <q-tooltip
                            anchor="top left"
                            outline
                            self="bottom right"
                            :offset="[5, 5]"
                            class="!text-sm text-center bg-brand-velvet !text-white shadow-xl !max-w-[250px]"
                        >
                            Возраст ученика
                        </q-tooltip>
                    </div>
                </q-item-label>
                <q-item-label class="brand-text !font-light"><q-icon name="fa-solid fa-heart-pulse" size="12px"/> {{ body.health }} группа здоровья</q-item-label>
                <q-item-label v-if="body.specAttention" class="brand-text !font-light text-orange-6"><q-icon name="fa-solid fa-triangle-exclamation" size="12px" color="orange-6"/> Требует особого внимания</q-item-label>
                <q-item-label class="brand-text !font-light break-words whitespace-normal">
                    <q-icon name="fa-solid fa-home" size="12px"/>
                    {{ body.resAddress }}
                    <q-tooltip
                        anchor="top left"
                        outline
                        self="bottom right"
                        :offset="[5, 5]"
                        class="!text-sm text-center bg-brand-velvet !text-white shadow-xl !max-w-[250px]"
                    >
                        Адрес проживания ученика
                    </q-tooltip>
                </q-item-label>
                <q-item-label class="brand-text !font-light break-words whitespace-normal">
                    <q-icon name="fa-solid fa-map-location-dot" size="12px"/>
                    {{ body.regAddress }}
                    <q-tooltip
                        anchor="top left"
                        outline
                        self="bottom right"
                        :offset="[5, 5]"
                        class="!text-sm text-center bg-brand-velvet !text-white shadow-xl !max-w-[250px]"
                    >
                        Адрес прописки ученика
                    </q-tooltip>
                </q-item-label>
            </q-item-section>
        </q-item>
        <q-item class="max-w-max">
            <q-item-section class="break-words whitespace-normal">
                <q-item-label class="brand-text">Информация о семье</q-item-label>
                <div class="flex flex-row no-wrap">
                    <div>
                        <q-item-label class="brand-text !font-light">
                            Категория семей
                            <q-list>
                                <q-item dense v-for="status in body.familyStatus">
                                    <q-item-section class="w-[250px] !font-light break-words whitespace-normal">- {{ status }}</q-item-section>
                                </q-item>
                            </q-list>
                        </q-item-label>
                        <q-item-label v-if="body.veterans" class="brand-text !font-light text-orange-6 !max-w-[250px] break-words whitespace-normal">
                            <q-icon name="fa-solid fa-medal" size="12px"/>
                            Родители - участники боевых действий
                        </q-item-label>
                    </div>

                    <q-list dense class="!flex !flex-col !gap-y-2">
                        <q-expansion-item
                        v-for="(parent, index) in body.parents"
                        expand-separator
                        dense
                        switch-toggle-side
                        header-class="break-words whitespace-normal w-[400px] brand-text !font-light"
                        :label="body.parents[index].name"
                        :caption="'Телефон: ' + formatPhone(body.parents[index].phone)"
                        icon="perm_identity"
                        group="parents"
                        >
                        <q-list class="!flex !flex-col !gap-y-2">
                            <q-item dense>
                                <q-item-section class="!justify-start !w-[300px] break-words whitespace-normal">
                                    <q-item-label class="brand-text !font-semibold">
                                        Место работы
                                    </q-item-label>
                                    <q-item-label caption class="brand-text !font-medium">{{ parent.workPlace }}</q-item-label>
                                </q-item-section>
                            </q-item>
                            <q-item dense>
                                <q-item-section class="!justify-start !gap-2 !w-[300px] break-words whitespace-normal">
                                    <q-item-label class="brand-text !font-semibold">Должность</q-item-label>
                                    <q-item-label caption class="brand-text !font-medium">{{ parent.workPost }}</q-item-label>
                                </q-item-section>
                            </q-item>
                            <q-item dense class="!pb-2">
                                <q-item-section class="!justify-start !gap-2 !w-[300px] break-words whitespace-normal">
                                    <q-item-label class="brand-text !font-semibold">Образование</q-item-label>
                                    <q-item-label caption class="brand-text !font-medium">{{ parent.education }}</q-item-label>
                                </q-item-section>
                            </q-item>
                        </q-list>
                        </q-expansion-item>
                    </q-list>
                </div>
            </q-item-section>
        </q-item>
        <q-item class="max-w-[30%]">
            <q-item-section>
                <q-item-label class="brand-text font-medium"> Олимпиады и мероприятия</q-item-label>
                <q-list dense>
                    <q-expansion-item
                    v-for="(list, index) in lists"
                    expand-separator
                    dense
                    :content-inset-level="1"
                    switch-toggle-side
                    header-class="font-semibold"
                    :label="lists[index].label"
                    group="achivements"
                    >
                        <q-list class="!flex !flex-col !gap-y-2">
                            <q-item dense v-for="val in body[lists[index].value]">
                                <q-item-section class="w-[300px] !font-light break-words whitespace-normal">- {{ val }}</q-item-section>
                            </q-item>
                        </q-list>
                    </q-expansion-item>
                </q-list>
            </q-item-section>
        </q-item>
    </q-list>

    <q-list v-if="edit" class="max-h-[450px] overflow-y-auto">
        <q-form class="row items-start no-wrap">
            <q-item class="!w-[25%]">
                <q-item-section class="gap-2">
                    <q-item-label class="brand-text font-medium">Основные данные</q-item-label>
                    <q-input
                        hide-bottom-space
                        v-model="bodyCopy.name"
                        dense
                        outlined
                        type="text"
                        class="brand-text !font-light"
                        label="Ф.И.О."
                        >

                    </q-input>
                    <q-input
                        hide-bottom-space
                        v-model="bodyCopy.mainPhone"
                        :mask="bodyCopy.mainPhone.length <= 7 ? '#-##-###' : '#(###) ###-##-##'"
                        dense
                        outlined
                        label="Телефон"
                        type="text"
                        class="brand-text !font-light"
                    />
                    <q-input label="Дата рождения" v-model="bodyCopy.birthday" readonly outlined>
                        <template v-slot:append>
                            <q-icon name="event" color="brand-velvet">
                                <q-popup-proxy cover transition-show="scale" transition-hide="scale">
                                    <q-date
                                        v-model="bodyCopy.birthday"
                                        minimal
                                        mask="DD.MM.YYYY"
                                        class="brand-description !min-w-[300px]"
                                        >
                                        <q-btn class="flex flex-row brand-description" v-close-popup label="Закрыть" flat/>
                                    </q-date>
                                </q-popup-proxy>
                            </q-icon>
                        </template>
                    </q-input>
                    <q-card class="!shadow-none !rounded-[3pt] !bg-inherit" bordered>
                        <q-card-section class="!p-1">
                            <q-item-label class="text-xs text-grey-8 ps-1 pb-2"> Группа здоровья</q-item-label>
                            <q-btn-toggle
                                v-model="bodyCopy.health"
                                class="!flex !flex-row !justify-evenly"
                                unelevated
                                toggle-color="brand-velvet"
                                :options="[
                                    {value: 1, label: '1'},
                                    {value: 2, label: '2'},
                                    {value: 3, label: '3'},
                                    {value: 4, label: '4'},
                                    {value: 5, label: '5'}
                                ]"
                            />
                        </q-card-section>
                    </q-card>
                    <q-checkbox
                        class="brand-text !font-light break-words whitespace-normal"
                        label="Требует особого внимания"
                        indeterminate-value
                        keep-color
                        color="brand-velvet"
                        checked-icon="fa-solid fa-circle"
                        unchecked-icon="fa-solid fa-circle-notch"
                        v-model="bodyCopy.specAttention"
                    />
                    <q-input
                        hide-bottom-space
                        v-model="bodyCopy.resAddress"
                        dense
                        outlined
                        type="text"
                        class="brand-text !font-light"
                        label="Адрес проживания"
                        >
                    </q-input>
                    <q-input
                        hide-bottom-space
                        v-model="bodyCopy.regAddress"
                        dense
                        outlined
                        type="text"
                        class="brand-text !font-light"
                        label="Адрес прописки"
                        >
                    </q-input>
                </q-item-section>
            </q-item>

            <q-item class="max-w-max">
                <q-item-section class="gap-2">
                    <q-item-label class="brand-text">Информация о семье</q-item-label>
                    <div class="flex flex-row no-wrap">
                        <div>
                            <q-select
                                emit-value
                                map-options
                                outlined
                                use-chips
                                multiple
                                label="Категория семей"
                                menu-anchor="top right"
                                menu-self="top left"
                                :options="statusesOptions"
                                v-model="bodyCopy.familyStatus"
                                class="w-[250px] overflow-y-auto"
                            />
                            <q-checkbox
                                class="w-[250px] brand-text !font-light break-words whitespace-normal"
                                label="Родители - участники боевых действий"
                                indeterminate-value
                                keep-color
                                color="brand-velvet"
                                checked-icon="fa-solid fa-circle"
                                unchecked-icon="fa-solid fa-circle-notch"
                                v-model="bodyCopy.veterans"
                            />
                        </div>
                        <div class="ps-2">
                            <q-list>
                                <transition-group
                                    name="fade"
                                    tag="q-list"
                                    enter-active-class="transition ease-out duration-500"
                                    enter-from-class="opacity-0 translate-x-8"
                                    enter-to-class="opacity-100 translate-x-0"
                                    leave-active-class="transition ease-in duration-500"
                                    leave-from-class="opacity-100 translate-x-0"
                                    leave-to-class="opacity-0 translate-x-8"
                                >
                                    <StudentParentForm
                                        v-for="(parent, index) in bodyCopy.parents"
                                        :key="index"
                                        v-model="bodyCopy.parents[index]"
                                        @remove="removeInput(index)"
                                    />
                                </transition-group>
                            </q-list>
                            <q-item-label class="brand-text !font-light brand-velvet">
                                <q-btn class="brand-description" label="Добавить" flat color="brand-velvet" icon="add" @click="addInput"/>
                            </q-item-label>
                        </div>
                    </div>
                </q-item-section>
            </q-item>

            <q-item>
                <q-item-section>
                    <q-item-label class="brand-text font-medium"> Олимпиады и мероприятия</q-item-label>
                    <q-list dense>
                        <q-expansion-item
                        v-for="(list, index) in lists"
                        dense
                        switch-toggle-side
                        header-class="font-semibold"
                        :label="lists[index].label"
                        group="achivements"
                        >
                            <q-select
                                emit-value
                                map-options
                                outlined
                                use-chips
                                multiple
                                :options="buffOptions"
                                :option-label="'title'"
                                :option-value="'id'"
                                v-model="bodyCopy[lists[index].value]"
                                class="w-[300px]"
                            />
                        </q-expansion-item>
                    </q-list>
                </q-item-section>
            </q-item>
        </q-form>
    </q-list>
</template>

<style scoped>

.q-card{
    @apply !w-full
}

</style>