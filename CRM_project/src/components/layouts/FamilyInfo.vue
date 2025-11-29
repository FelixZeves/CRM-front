<script setup>
import { ref, computed, watch } from 'vue'
import { getToday } from '../Utils'
import TransitionSetup from './TransitionSetup.vue'

const props = defineProps({
    student: {type: Object, default: () => null},
    mode:  { type: String, default: () => 'read'}
})
const emit  = defineEmits(['update:statuses'])

const localStudent = computed({
  get: () => props.student,
  set: (val) => emit('update:student', val)
})

const sigleParentOptions = ['мама', 'папа', 'бабушка', 'дедушка', 'отчим', 'мачеха']

const FTC = computed(() => [
    {
        type: 'input',
        main_label: 'Многодетная',
        sub_label: 'Детей до 18 лет',
        hint: 'number',
        val: localStudent.count_childs,
        rules: required,
        descriptions: [`${props.student?.count_childs} детей до 18 лет` || '']
    },
    {
        type: 'select',
        main_label: 'Неполная',
        sub_label: 'Кто воспитывает',
        val: props.student?.parents?.find(p => p.kinship)?.kinship || null,
        rules: required,
        options: sigleParentOptions,
        descriptions: [`Воспитывает ${props.student?.parents?.find(p => p.kinship)?.kinship}` || '']
    },
    {
        main_label: 'Малообеспеченная',
        descriptions: []
    },
    {
        type: 'select',
        main_label: 'Дети под опекой',
        sub_label: 'Опекун',
        options: props.student.parents,
        option_label: 'fio',
        val: props.student.parents?.find(p => p.curator) || null,
        rules: required,
        descriptions: [`Опекун: ${props.student?.parents?.find(p => p.curator)?.fio}` || '']
    },
    {
        type: 'input',
        main_label: 'Состоит на учёте в ОДН',
        sub_label: 'Дата постановки на учёт (ОДН)',
        val: localStudent.odn_date,
        rules: required,
        descriptions: [`На учёт поставлен с ${props.student?.odn_date}` || '']
    },
    {
        type: 'input',
        main_label: 'Дети в состоянии социально опасного положения',
        sub_label: 'Дата постановки на учёт (СОП)',
        val: localStudent.sop_date,
        rules: required,
        descriptions: [`На учёт поставлен с ${props.student?.sop_date}` || '']
    },
    {
        type: 'input',
        main_label: 'Дети в группе риска',
        sub_label: 'Причина постановки на учёт',
        hint: 'textarea',
        val: localStudent.gr_reason,
        rules: required,
        descriptions: [`Причина: ${props.student?.gr_reason}` || '']
    },
    {
        type: 'input',
        main_label: 'Дети из неблагополучной семьи',
        sub_label: 'Основание (Дети из неблагополучной семьи)',
        hint: 'textarea',
        val: localStudent.df_reason,
        rules: required,
        descriptions: [`Причина: ${props.student?.df_reason}` || '']
    },
    {
        type: 'input',
        main_label: 'Дети в ТЖС',
        sub_label: 'Основание (Дети в ТЖС)',
        hint: 'textarea',
        val: localStudent.dls_reason,
        rules: required,
        descriptions: [`Основание: ${props.student?.dls_reason}` || '']
    }
])

const visibleFamilyTypes = computed(() =>
  FTC.value.filter(i =>
    props.student?.family_type?.includes(i.main_label)
  )
)

const required = val => !!val || 'Обязательное поле'

// "Дети под опекой"
watch(
    () => FTC.value.find(i => i.main_label === 'Дети под опекой')?.val,
    (newVal) => {
        if (!props.student?.parents) return
        props.student.parents.forEach(p => {
        p.curator = p === newVal
        })
    }
)

// "Неполная"
watch(
    () => FTC.value.find(i => i.main_label === 'Неполная')?.val,
    (newVal) => {
        if (props.student?.parents?.length != 0)
            props.student.parents[0].kinship = newVal
    }
)

watch(
  () => localStudent.value.family_type.includes('Состоит на учёте в ОДН'),
  (visible) => {
    if (visible) {
      const item = FTC.value.find(i => i.main_label === 'Состоит на учёте в ОДН')
      if (item && !item.val) {
        item.val = getToday()
      }
    } else {
        const item = FTC.value.find(i => i.main_label === 'Состоит на учёте в ОДН')
        if (item) {
            item.val = null
        }
    }
  },
  { immediate: true }
)

watch(
  () => localStudent.value.family_type.includes('Дети в состоянии социально опасного положения'),
  (visible) => {
    if (visible) {
      const item = FTC.value.find(i => i.main_label === 'Дети в состоянии социально опасного положения')
      if (item && !item.val) {
        item.val = getToday()
      }
    } else {
        const item = FTC.value.find(i => i.main_label === 'Дети в состоянии социально опасного положения')
        if (item) {
            item.val = null
        }
    }
  },
  { immediate: true }
)
</script>

<template>
    <div v-if="mode === 'read'">
        <div class="mb-4">Категория семей</div>
        <q-list class="w-[250px]">
            
            <q-item
                v-for="item in visibleFamilyTypes"
                dense
                class="!flex !flex-col"
            >
                <q-item-section class="!font-light break-words whitespace-normal">
                    - {{ item.main_label }}
                </q-item-section>
                <q-item-section
                    v-for="(desc, index) in item.descriptions"
                    :key="index"
                    class="!font-light break-words whitespace-normal"
                >
                    {{ desc }}
                </q-item-section>
            </q-item>
        </q-list>
    </div>


    <TransitionSetup
        v-if="mode === 'edit'"
        :items="FTC"
        direction="x"
        :stagger="70"
        tag="div"
        class="!flex !flex-col !gap-y-2"
        >
        <template #default="{ item, style }">

            <!-- Input поля -->
            <q-input
            v-if="item.type === 'input' &&
                !['Состоит на учёте в ОДН',
                    'Дети в состоянии социально опасного положения'].includes(item.main_label) &&
                    localStudent.family_type.includes(item.main_label)"
            :style="style"
            hide-bottom-space
            dense
            outlined
            :type="item.hint || 'text'"
            class="brand-text"
            :label="item.sub_label"
            v-model="item.val"
            :rules="item.rules ? [item.rules] : []"
            />

            <!-- Input с календарём -->
            <q-input
            v-else-if="['Состоит на учёте в ОДН',
                        'Дети в состоянии социально опасного положения'].includes(item.main_label) &&
                        localStudent.family_type.includes(item.main_label)"
            :style="style"
            :label="item.sub_label"
            v-model="item.val"
            hide-bottom-space
            readonly
            outlined
            :rules="item.rules ? [item.rules] : []"
            >
            <template #append>
                <q-icon name="event" color="brand-velvet">
                <q-popup-proxy cover transition-show="scale" transition-hide="scale">
                    <q-date
                    v-model="item.val"
                    minimal
                    mask="DD.MM.YYYY"
                    class="brand-description !min-w-[300px]"
                    >
                    <q-btn
                        class="brand-description"
                        v-close-popup
                        label="Закрыть"
                        color="brand-velvet"
                    />
                    </q-date>
                </q-popup-proxy>
                </q-icon>
            </template>
            </q-input>

            <!-- Select поля -->
            <q-select
            v-else-if="item.type === 'select' &&
                        localStudent.family_type.includes(item.main_label)"
            :style="style"
            outlined
            hide-bottom-space
            clearable
            :label="item.sub_label"
            menu-anchor="top right"
            menu-self="top left"
            :options="item.options"
            :option-label="item.option_label"
            map-options
            v-model="item.val"
            :rules="item.rules ? [item.rules] : []"
            />

        </template>
    </TransitionSetup>
</template>

<style scoped>

.q-input, .q-select{
    @apply w-[300px] !font-light
}

</style>