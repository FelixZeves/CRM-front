<script setup>
import { ref, computed, watch } from 'vue'
import { getToday } from '../Utils'
import TransitionSetup from './TransitionSetup.vue'
import { errorNotify } from '../Notifies'

const props = defineProps({
    student: {type: Object, default: () => null},
    mode:  { type: String, default: () => 'read'}
})
const emit  = defineEmits(['update:student'])

const localStudent = computed({
  get: () => props.student,
  set: (val) => emit('update:student', val)
})

const sigleParentOptions = ['мама', 'папа', 'бабушка', 'дедушка', 'отчим', 'мачеха']

const required = val => !!val || 'Обязательное поле'

const FTC = ref([
    {
        type: 'input',
        main_label: 'Многодетная',
        sub_label: 'Детей до 18 лет',
        hint: 'number',
        val: computed({
            get: () => localStudent.value?.count_childs,
            set: v => {
                if (!localStudent.value?.family_type?.includes('Многодетная')) {
                    localStudent.value.count_childs = null
                    return
                }
                localStudent.value.count_childs = v
            }
        }),
        rules: required,
        descriptions: computed(() => {
            const c = props.student?.count_childs
            return c ? [`${c} детей до 18 лет`] : []
        })
    },
    {
        type: 'select',
        main_label: 'Неполная',
        sub_label: 'Кто воспитывает',
        val: computed({
            get: () => localStudent.value?.parents?.[0]?.kinship ?? null,
            set: v => {
                if (!localStudent.value.family_type?.includes('Неполная')) {
                    if (localStudent.value.parents?.length) {
                    localStudent.value.parents[0].kinship = null
                    }
                    return
                }
                localStudent.value.parents[0].kinship = v
            }
        }),
        rules: required,
        options: sigleParentOptions,
        descriptions: computed(() => {
            const kinship = props.student?.parents?.find(p => p.kinship)?.kinship
            return kinship ? [`Воспитывает ${kinship}`] : []
        })
    },
    {
        main_label: 'Малообеспеченная',
        descriptions: []
    },
    {
        type: 'select',
        main_label: 'Дети под опекой',
        sub_label: 'Опекун',
        options: computed(() => localStudent.value?.parents || []),
        option_label: 'fio',
        val: computed({
            get: () => {
                const parents = localStudent.value?.parents || []
                return parents.find(p => p.curator) || null
            },
            set: selectedParent => {
                if (!localStudent.value.family_type?.includes('Дети под опекой')) {
                    localStudent.value.parents?.forEach(p => p.curator = false)
                    return
                }

                localStudent.value.parents.forEach(p => p.curator = false)
                if (selectedParent) {
                    const idx = localStudent.value.parents.findIndex(p => p.fio === selectedParent.fio)
                    if (idx !== -1) localStudent.value.parents[idx].curator = true
                    else errorNotify('Выбранный родитель не существует')
                }
            }
        }),
        rules: required,
        descriptions: computed(() => {
            const p = props.student?.parents?.find(p => p.curator)
            return p ? [`Опекун: ${p.fio}`] : []
        })
    },
    {
        type: 'input',
        main_label: 'Состоит на учёте в ОДН',
        sub_label: 'Дата постановки на учёт (ОДН)',
        val: computed({
            get: () => localStudent.value?.odn_date,
            set: v => {
                if (!localStudent.value.family_type?.includes('Состоит на учёте в ОДН')) {
                    localStudent.value.odn_date = null
                    return
                }
                localStudent.value.odn_date = v
            }
        }),
        rules: required,
        descriptions: computed(() => {
            const date = props.student?.odn_date
            return date ? [`На учёт поставлен с ${date}`] : []
        })
    },
    {
        type: 'input',
        main_label: 'Дети в состоянии социально опасного положения',
        sub_label: 'Дата постановки на учёт (СОП)',
        val: computed({
            get: () => localStudent.value?.sop_date,
            set: v => {
                if (!localStudent.value.family_type?.includes('Дети в состоянии социально опасного положения')) {
                    localStudent.value.sop_date = null
                    return
                }
                localStudent.value.sop_date = v
            }
        }),
        rules: required,
        descriptions: computed(() => {
            const date = props.student?.sop_date
            return date ? [`На учёт поставлен с ${date}`] : []
        })
    },
    {
        type: 'input',
        main_label: 'Дети в группе риска',
        sub_label: 'Причина постановки на учёт',
        hint: 'textarea',
        val: computed({
            get: () => localStudent.value?.gr_reason ?? '',
            set: v => {
                if (!localStudent.value.family_type?.includes('Дети в группе риска')) {
                    localStudent.value.gr_reason = null
                    return
                }
                localStudent.value.gr_reason = v
            }
        }),
        rules: required,
        descriptions: computed(() => {
            const reason = props.student?.gr_reason
            return reason ? [`Основание: ${reason}`] : []
        })
    },
    {
        type: 'input',
        main_label: 'Дети из неблагополучной семьи',
        sub_label: 'Состав семьи',
        hint: 'number',
        val: computed({
            get: () => localStudent.value?.count_family ?? '',
            set: v => {
                if (!localStudent.value.family_type?.includes('Дети из неблагополучной семьи')) {
                    localStudent.value.count_family = null
                    return
                }
                localStudent.value.count_family = v
            }
        }),
        rules: required,
    },
    {
        type: 'input',
        main_label: 'Дети из неблагополучной семьи',
        sub_label: 'Основание (Дети из неблагополучной семьи)',
        hint: 'textarea',
        val: computed({
            get: () => localStudent.value?.df_reason ?? '',
            set: v => {
                if (!localStudent.value.family_type?.includes('Дети из неблагополучной семьи')) {
                    localStudent.value.df_reason = null
                    return
                }
                localStudent.value.df_reason = v
            }
        }),
        rules: required,
        descriptions: computed(() => {
            const [reason, count] = [props.student?.df_reason, props.student?.count_family]
            return reason && count ? [`Состав семьи: ${count || 'не указан'}`,`Основание: ${reason}`] : []
        })
    },
    {
        type: 'input',
        main_label: 'Дети в ТЖС',
        sub_label: 'Состав семьи',
        hint: 'number',
        val: computed({
            get: () => localStudent.value?.count_family ?? '',
            set: v => {
                if (!localStudent.value.family_type?.includes('Дети в ТЖС')) {
                    localStudent.value.count_family = null
                    return
                }
                localStudent.value.count_family = v
            }
        }),
        rules: required,
    },
    {
        type: 'input',
        main_label: 'Дети в ТЖС',
        sub_label: 'Основание (Дети в ТЖС)',
        hint: 'textarea',
        val: computed({
            get: () => localStudent.value?.dls_reason ?? '',
            set: v => {
                if (!localStudent.value.family_type?.includes('Дети в ТЖС')) {
                    localStudent.value.dls_reason = null
                    return
                }
                localStudent.value.dls_reason = v
            }
        }),
        rules: required,
        descriptions: computed(() => {
            const [reason, count] = [props.student?.dls_reason, props.student?.count_family]
            return reason && count ? [`Состав семьи: ${count || 'не указан'}`,`Основание: ${reason}`] : []
        })
    },
])

const visibleFamilyTypes = computed(() =>
  FTC.value.filter(i =>
    props.student?.family_type?.includes(i.main_label) && i.descriptions
  )
)

watch(
  () => localStudent.value.family_type?.includes('Состоит на учёте в ОДН'),
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
  () => localStudent.value.family_type?.includes('Дети в состоянии социально опасного положения'),
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
        <div class="mb-1">Категория семей</div>
        <q-list dense class="w-[300px]">
            
            <q-item
                v-for="item in visibleFamilyTypes"
                dense
            >
                <q-item-section class="!font-medium break-words whitespace-normal">
                    - {{ item.main_label }}
                    <q-tooltip
                        v-if="item.descriptions?.length > 0"
                        anchor="top left"
                        outline
                        self="bottom left"
                        :offset="[5, 5]"
                        class="!text-sm text-start bg-brand-velvet !text-white shadow-xl !max-w-[300px] flex flex-col gap-y-1"
                    >
                        <div v-for="(desc, index) in item.descriptions" :key="index">
                            <div>{{ desc || '-' }}</div>
                        </div>
                    </q-tooltip>
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
                    localStudent.family_type?.includes(item.main_label)"
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
                        localStudent.family_type?.includes(item.main_label)"
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
                        localStudent.family_type?.includes(item.main_label)"
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