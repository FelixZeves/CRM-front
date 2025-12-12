<script setup>
import { ref, watch, computed, nextTick } from 'vue'
import api from '@/main'
import { confirmNotify, errorNotify, successNotify } from '@/components/Notifies'
import { familyStatuses, houseConditions } from '@/components/Enums.vue'
import { getFormSchema, STUDENT, formatPhone } from '@/components/Utils'
import StudentParentForm from '../forms/StudentParentForm.vue'
import TransitionSetup from './TransitionSetup.vue'
import FamilyInfo from './FamilyInfo.vue'
import { SessionStorage } from 'quasar'

const props = defineProps(['body', 'edit'])
const bodyCopy = ref(JSON.parse(JSON.stringify(props.body)))
const classInfo =  ref(SessionStorage.getItem('selectedClass'))

watch(
    () => props.body,
    (v) => {
        // обновляем копию
        Object.assign(bodyCopy.value, JSON.parse(JSON.stringify(v)))

        // read-часть продолжает смотреть на props.body, так что всё ок
    },
    { deep: true, immediate: true }
)

const specAttention = computed({
    get() {
        return bodyCopy.value.sp_doctor != null || bodyCopy.value.sp_disease != null
    },
    set(val) {
        if (!val) {
            bodyCopy.value.sp_doctor = null
            bodyCopy.value.sp_disease = null
        }
        else {
            bodyCopy.value.sp_doctor = ''
            bodyCopy.value.sp_disease = ''
        }
    }
})

const studentForm = ref(null)

async function sendForm(){
    await nextTick()
    const formValid = await studentForm.value.validate()
    if (!formValid) {
        errorNotify('Не все поля заполнены')
        console.log(bodyCopy.value)
        return
    }
    let student = bodyCopy.value

    let form = {
       ...student,
       class_id: classInfo.value.id
    }
    form.phone = form.phone.replace(/\D/g, '')
    form.parents = form.parents.map(p => ({
        ...p,
        phone: p.phone.replace(/\D/g, '')
    }));

    if(form.id){
        return await api.patch(STUDENT, form)
    }

    return await api.post(STUDENT, form)
}

defineExpose({
    sendForm
})

const buffOptions = ref([])

watch(() => props.body, (newVal) => {
  bodyCopy.value = JSON.parse(JSON.stringify(newVal))
}, { deep: true })

const addParent = async () => {
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
    {value: 'achievementsInter', label: 'Международные конкурсы'}
]

const statusesOptions = Object.values(familyStatuses)
const houseOptions =  Object.values(houseConditions)
</script>

<template>
    <q-list v-if="!edit" class="row items-start no-wrap max-h-[500px] overflow-y-auto">
        <q-item class="!max-w-[25%]">
            <q-item-section class="gap-y-2">
                <q-item-label class="brand-text font-medium">Основная информация</q-item-label>
                <q-item-label class="brand-text !font-light break-words whitespace-normal">
                    <q-icon name="fa-solid fa-phone" size="12px"/>
                    {{ formatPhone(body.phone) }}
                    <q-tooltip
                        anchor="top left"
                        outline
                        self="bottom left"
                        :offset="[5, 5]"
                        class="!text-sm text-center bg-brand-velvet !text-white shadow-xl !max-w-[250px]"
                    >
                        Телефон ученика
                    </q-tooltip>
                </q-item-label>
                <q-item-label class="flex flex-row gap-x-6 brand-text !font-light break-words whitespace-normal">
                    <div class="items-center">
                        <q-icon name="fa-solid fa-calendar-days" size="12px"/>
                        {{ formatPhone(body.birthday) }}
                        <q-tooltip
                            anchor="top left"
                            outline
                            self="bottom left"
                            :offset="[5, 5]"
                            class="!text-sm text-center bg-brand-velvet !text-white shadow-xl !max-w-[250px]"
                        >
                            День рождения ученика
                        </q-tooltip>
                    </div>
                    <div class="items-center">
                        <q-icon name="fa-solid fa-cake-candles" size="12px"/>
                        {{ body.age }}
                        <q-tooltip
                            anchor="top left"
                            outline
                            self="bottom left"
                            :offset="[5, 5]"
                            class="!text-sm text-center bg-brand-velvet !text-white shadow-xl !max-w-[250px]"
                        >
                            Возраст ученика
                        </q-tooltip>
                    </div>
                </q-item-label>
                <div class="flex flex-row gap-x-4 no-wrap">
                    <q-item-label class="brand-text !font-light">
                        <q-icon :name="body.gender == 'm' ? 'fa-solid fa-mars' : 'fa-solid fa-venus'" size="16px"/>
                        {{ body.gender == 'm' ? 'М' : 'Ж' }}
                        <q-tooltip
                            anchor="top left"
                            outline
                            self="bottom left"
                            :offset="[5, 5]"
                            class="!text-sm text-center bg-brand-velvet !text-white shadow-xl !max-w-[250px]"
                        >
                            Пол ученика
                        </q-tooltip>
                    </q-item-label>
                    <q-item-label class="brand-text !font-light !mt-0"><q-icon name="fa-solid fa-heart-pulse" size="16px"/> {{ body.health }} группа здоровья</q-item-label>
                </div>
                <q-item-label
                    v-if="body.sp_disease"
                    class="brand-text !font-light text-orange-6"
                >
                    <q-icon name="fa-solid fa-triangle-exclamation" size="16px" color="orange-6"/>
                    Требует особого внимания
                    <q-tooltip
                        anchor="top left"
                        outline
                        self="bottom left"
                        :offset="[5, 5]"
                        class="!text-sm text-start bg-brand-velvet !text-white shadow-xl max-w-[300px]"
                    >
                        <div><b>Заболевание:</b> {{ body.sp_disease || '-' }}</div>
                        <div><b>Специалист:</b> {{ body.sp_doctor || '-' }}</div>
                    </q-tooltip>
                </q-item-label>
                <q-item-label v-if="body.home_education" class="brand-text !font-light text-orange-6"><q-icon name="fa-solid fa-house-laptop" size="16px"/> На домашнем обучении</q-item-label>
                <q-item-label v-if="body.country_reg" class="brand-text !font-light"><q-icon name="fa-solid fa-passport" size="12px"/> Гражданство РФ</q-item-label>
                <q-item-label v-else class="brand-text !font-light text-orange-6"><q-icon name="fa-solid fa-ban" size="12px" color="orange-6"/> Нет гражданства РФ</q-item-label>
                <q-item-label class="brand-text !font-light break-words whitespace-normal">
                    <q-icon name="fa-solid fa-house-chimney" size="12px"/>
                    {{ body.address_type }}
                    <q-tooltip
                        anchor="top left"
                        outline
                        self="bottom left"
                        :offset="[5, 5]"
                        class="!text-sm text-center bg-brand-velvet !text-white shadow-xl !max-w-[250px]"
                    >
                        Жилищные условия
                    </q-tooltip>
                </q-item-label>
                <q-item-label class="brand-text !font-light break-words whitespace-normal">
                    <q-icon name="fa-solid fa-home" size="12px"/>
                    {{ body.address_living }}
                    <q-tooltip
                        anchor="top left"
                        outline
                        self="bottom left"
                        :offset="[5, 5]"
                        class="!text-sm text-center bg-brand-velvet !text-white shadow-xl !max-w-[250px]"
                    >
                        Адрес проживания ученика
                    </q-tooltip>
                </q-item-label>
                <q-item-label class="brand-text !font-light break-words whitespace-normal">
                    <q-icon name="fa-solid fa-map-location-dot" size="12px"/>
                    {{ body.address_reg }}
                    <q-tooltip
                        anchor="top left"
                        outline
                        self="bottom left"
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
                            <FamilyInfo :student="body"/>
                        </q-item-label>
                        <q-item-label
                            v-if="body.parents?.some(p => p.status)"
                            class="brand-text !font-light text-orange-6 !max-w-[250px] break-words whitespace-normal"
                        >
                            <q-icon name="fa-solid fa-medal" size="12px"/>
                            Родители - участники боевых действий
                            <q-tooltip
                                anchor="top left"
                                outline
                                self="bottom left"
                                :offset="[5, 5]"
                                class="!text-sm text-start bg-brand-velvet !text-white shadow-xl !max-w-[300px] flex flex-col gap-y-2"
                            >
                                <div v-for="(parent, index) in body.parents?.filter(p => p.status)">
                                    <div>{{ parent.fio || '-' }}</div>
                                    <div><b>Статус:</b> {{ parent.status || '-' }}</div>
                                </div>
                            </q-tooltip>
                        </q-item-label>
                    </div>

                    <q-list dense class="!flex !flex-col !gap-y-2">
                        <q-expansion-item
                        v-for="(parent, index) in body.parents"
                        expand-separator
                        dense
                        switch-toggle-side
                        header-class="break-words whitespace-normal w-[400px] brand-text !font-light"
                        :label="body.parents[index].fio"
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
                                    <q-item-label caption class="brand-text !font-medium">{{ parent.work || 'Не указано'}}</q-item-label>
                                </q-item-section>
                            </q-item>
                            <q-item dense>
                                <q-item-section class="!justify-start !gap-2 !w-[300px] break-words whitespace-normal">
                                    <q-item-label class="brand-text !font-semibold">Должность</q-item-label>
                                    <q-item-label caption class="brand-text !font-medium">{{ parent.post || 'Не указана'}}</q-item-label>
                                </q-item-section>
                            </q-item>
                            <q-item dense>
                                <q-item-section class="!justify-start !gap-2 !w-[300px] break-words whitespace-normal">
                                    <q-item-label class="brand-text !font-semibold">Образование</q-item-label>
                                    <q-item-label caption class="brand-text !font-medium">{{ parent.education || 'Не указано'}}</q-item-label>
                                </q-item-section>
                            </q-item>
                            <q-item dense class="brand-text !font-light !pb-2" v-if="parent.status">
                                <q-item-section class="!justify-start !gap-2 !w-[300px] break-words whitespace-normal">
                                    <div class="flex flex-row items-center text-orange-6 gap-x-2">
                                        <q-icon name="fa-solid fa-medal" size="12px"/>
                                        Участник боевых действий
                                    </div>
                                    <div class="pb-2"><b class="text-orange-6">Статус:</b> {{ parent.status || '-' }}</div>
                                </q-item-section>
                            </q-item>
                        </q-list>
                        </q-expansion-item>
                    </q-list>
                </div>
            </q-item-section>
        </q-item>
        <q-item class="max-w-[30%] flex flex-col gap-y-2">
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
            <q-item-section class="!m-0">
                <q-item-label class="brand-text font-medium">Дополнительная информация</q-item-label>
                <q-item-label class="break-words whitespace-normal">{{ body.comment }}</q-item-label>
            </q-item-section>
        </q-item>
    </q-list>

    <q-list v-if="edit" class="max-h-[500px] overflow-y-auto">
        <q-form ref="studentForm" class="row items-start no-wrap">
            <q-item class="!w-[25%]">
                <q-item-section class="gap-2 !w-full">
                    <q-item-label class="brand-text font-medium">Информация об ученике</q-item-label>
                    <q-expansion-item
                        dense
                        expand-separator
                        default-opened
                        switch-toggle-side
                        header-class="w-[315px]"
                        label="Основная информация"
                        group="studentInfo"
                    >
                    <div class="flex flex-col gap-y-2 py-2 w-full">
                        <q-input
                            hide-bottom-space
                            v-model="bodyCopy.fio"
                            dense
                            outlined
                            type="text"
                            class="brand-text !font-light"
                            label="Ф.И.О."
                            :rules="[
                                val => !!val || 'Обязательное поле',
                                val => !val || val.length <= 250 || 'Максимальная длина 250 символов'
                            ]"
                        />
                        <q-input
                            readonly
                            outlined
                            label="Дата рождения"
                            v-model="bodyCopy.birthday"
                            hide-bottom-space
                            dense
                            :rules="[
                                val => !!val || 'Обязательное поле',
                            ]"
                        >
                            <template v-slot:append>
                                <q-icon name="event" color="brand-velvet">
                                    <q-popup-proxy cover transition-show="scale" transition-hide="scale">
                                        <q-date
                                            v-model="bodyCopy.birthday"
                                            :rules="[
                                                val => !!val ||  'Обязательное поле'
                                            ]"
                                            minimal
                                            mask="DD.MM.YYYY"
                                            class="brand-description !min-w-[300px]"
                                            >
                                            <q-btn class="brand-description" v-close-popup label="Закрыть" color="brand-velvet"/>
                                        </q-date>
                                    </q-popup-proxy>
                                </q-icon>
                            </template>
                        </q-input>
                        <q-input
                            hide-bottom-space
                            v-model="bodyCopy.phone"
                            :mask="bodyCopy.phone.length <= 7 ? '#-##-###' : '#(###)###-##-##'"
                            dense
                            outlined
                            label="Телефон"
                            type="text"
                            class="brand-text !font-light"
                            :rules="[
                                val => !!val ||  'Обязательное поле'
                            ]"
                        />
                    </div>
                    </q-expansion-item>

                    <q-expansion-item
                        dense
                        expand-separator
                        switch-toggle-side
                        header-class="w-[315px]"
                        label="Состояние здоровья"
                        group="studentInfo"
                        
                    >
                    <div class="flex flex-col gap-y-2 py-2">
                        <div class="flex flex-row gap-x-2 no-wrap">
                            <q-card class="!shadow-none !rounded-[3pt] !bg-inherit flex-grow" bordered>
                                <q-card-section class="!p-1">
                                    <q-item-label class="text-xs text-grey-8 ps-1 pb-2"> Пол</q-item-label>
                                    <q-btn-toggle
                                        v-model="bodyCopy.gender"
                                        class="!flex !flex-row !justify-evenly"
                                        unelevated
                                        toggle-color="brand-velvet"
                                        :options="[
                                            {value: 'm', label: 'М'},
                                            {value: 'f', label: 'Ж'},
                                        ]"
                                    />
                                </q-card-section>
                            </q-card>
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
                        </div>
                        <q-checkbox
                            class="brand-text !font-light break-words whitespace-normal"
                            label="Требует особого внимания по СЗ"
                            indeterminate-value
                            keep-color
                            color="brand-velvet"
                            checked-icon="fa-solid fa-circle"
                            unchecked-icon="fa-solid fa-circle-notch"
                            v-model="specAttention"
                        />
                        <TransitionSetup
                            :items="specAttention ? ['disease', 'doctor'] : []"
                            direction="x"
                            :stagger="200"
                            tag="div"
                            class="flex flex-col gap-y-2"
                        >
                            <template #default="{ item, index, style, key }">
                                <q-input
                                    v-if="item === 'disease'"
                                    :style="style"
                                    hide-bottom-space
                                    v-model="bodyCopy.sp_disease"
                                    dense
                                    outlined
                                    type="text"
                                    class="brand-text !font-light"
                                    label="Заболевание"
                                    :rules="[
                                        val => specAttention && !!val ||  'Обязательное поле'
                                    ]"
                                />
                                <q-input
                                    v-else-if="item === 'doctor'"
                                    :style="style"
                                    hide-bottom-space
                                    v-model="bodyCopy.sp_doctor"
                                    dense
                                    outlined
                                    type="text"
                                    class="brand-text !font-light"
                                    label="Специалист"
                                    :rules="[
                                        val => specAttention && !!val ||  'Обязательное поле'
                                    ]"
                                />
                            </template>
                        </TransitionSetup>
                    </div>
                    </q-expansion-item>

                    <q-expansion-item
                        dense
                        expand-separator
                        switch-toggle-side
                        header-class="w-[315px]"
                        label="Дополнительная информация"
                        group="studentInfo"
                        
                    >
                    <div class="flex flex-col gap-y-2 pt-2">
                        <q-checkbox
                            class="brand-text !font-light break-words whitespace-normal"
                            label="Находится на домашнем обучении"
                            indeterminate-value
                            keep-color
                            color="brand-velvet"
                            checked-icon="fa-solid fa-circle"
                            unchecked-icon="fa-solid fa-circle-notch"
                            v-model="bodyCopy.home_education"
                        />
                        <q-checkbox
                            class="brand-text !font-light break-words whitespace-normal"
                            label="Наличие гражданства РФ"
                            indeterminate-value
                            keep-color
                            color="brand-velvet"
                            checked-icon="fa-solid fa-circle"
                            unchecked-icon="fa-solid fa-circle-notch"
                            v-model="bodyCopy.country_reg"
                        />
                        <q-select
                            emit-value
                            map-options
                            outlined
                            hide-bottom-space
                            dense
                            label="Жилищные условия"
                            menu-anchor="top right"
                            menu-self="top left"
                            :menu-offset="[5, 0]"
                            :options="houseOptions"
                            v-model="bodyCopy.address_type"
                            :rules="[
                                val => !!val ||  'Обязательное поле'
                            ]"
                        />
                        <q-input
                            hide-bottom-space
                            v-model="bodyCopy.address_living"
                            dense
                            outlined
                            type="text"
                            class="brand-text !font-light"
                            label="Адрес проживания"
                            :rules="[
                                val => !!val ||  'Обязательное поле'
                            ]"
                            />
                        <q-input
                            hide-bottom-space
                            v-model="bodyCopy.address_reg"
                            dense
                            outlined
                            type="text"
                            class="brand-text !font-light"
                            label="Адрес прописки"
                            :rules="[
                                val => !!val ||  'Обязательное поле'
                            ]"
                            />
                    </div>
                    </q-expansion-item>
                </q-item-section>
            </q-item>

            <q-item class="max-w-max">
                <q-item-section class="gap-2">
                    <q-item-label class="brand-text">Информация о семье</q-item-label>
                    <div class="flex flex-row no-wrap">
                        <div class="flex flex-col gap-y-2">
                            <q-select
                            outlined
                            use-chips
                            multiple
                            label="Категория семей"
                            menu-anchor="top right"
                            menu-self="top left"
                            :options="statusesOptions"
                            map-options
                            v-model="bodyCopy.family_type"
                            class="w-[300px] overflow-y-auto"
                            />
                            <FamilyInfo  :student="bodyCopy" mode="edit"/>
                        </div>
                        <div class="ps-2">
                                <TransitionSetup :items="bodyCopy.parents" direction="x" :stagger="0" tag="q-list">
                                    <template #default="{ item, index, style, key }">
                                        <StudentParentForm
                                            :model-value="item"
                                            @update:model-value="value => bodyCopy.parents[index] = value"
                                            :key="item.id || index"
                                            :style="style"
                                            @remove="removeInput(index)"
                                        />
                                    </template>
                                </TransitionSetup>
                            <q-item-label class="brand-text !font-light brand-velvet">
                                <q-btn class="brand-description" label="Добавить" flat color="brand-velvet" icon="add" @click="addParent"/>
                            </q-item-label>
                        </div>
                    </div>
                </q-item-section>
            </q-item>

            <q-item class="flex flex-col gap-y-2">
                <q-item-section>
                    <q-item-label class="brand-text">Олимпиады и мероприятия</q-item-label>
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
                <q-item-section class="!ms-0">
                    <q-item-label class="brand-text pb-2">Дополнительная информация</q-item-label>
                    <q-input
                        hide-bottom-space
                        v-model="bodyCopy.comment"
                        dense
                        outlined
                        type="textarea"
                        class="brand-text"
                        label="Комментарий об ученике"
                    />
                </q-item-section>
            </q-item>
        </q-form>
    </q-list>
</template>