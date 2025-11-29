<script setup>
import { computed } from 'vue'
import { combatantsOptions } from '../Enums.vue'

const combatOptions = Object.values(combatantsOptions)

const props = defineProps({
  modelValue: {
    type: Object,
    required: true
  }
})

const isVeteran = computed({
  get() {
    return props.modelValue.status !== null
  },
  set(value) {
    const newValue = { ...props.modelValue }

    if (!value) {
      newValue.status = null
    } else {
      if (!newValue.status) newValue.status = ''
    }

    emit('update:modelValue', newValue)
  }
})
const emit = defineEmits(['update:modelValue', 'remove'])

function removeParent(){
    emit('remove')
}

</script>

<template>
    <q-expansion-item
        expand-separator
        dense
        switch-toggle-side
        header-class="break-words whitespace-normal w-[400px]"
        :label="modelValue.name || 'Новый родитель'"
        icon="perm_identity"
        group="parentsEdit"
    >
        <template #header>
            <div class="flex flex-row items-center justify-between w-full no-wrap">
                <div class="flex flex-row items-center gap-x-4 no-wrap">
                    <q-icon name="perm_identity" />
                    <span>{{ modelValue.fio || 'Новый родитель' }}</span>
                </div>
                <q-btn
                    flat
                    round
                    dense
                    color="brand-danger"
                    class="opacity-[80%]"
                    icon="close"
                    @click.stop="removeParent"
                >
                    <q-tooltip
                        anchor="top right"
                        outline
                        self="bottom left"
                        :offset="[-5, 5]"
                        class="!text-sm text-center bg-brand-danger !text-white shadow-xl !max-w-[250px]"
                    >
                    Удалить родителя
                    </q-tooltip>
                </q-btn>
            </div>
        </template>
        <q-list class="flex flex-col !gap-y-2">
            <q-item dense>
                <q-item-section class="w-full">
                    <q-input
                        v-model="modelValue.fio"
                        hide-bottom-space
                        label="Ф.И.О."
                        dense
                        outlined
                        type="text"
                        class="brand-text !font-light"
                        :rules="[
                            val => !!val || 'Обязательное поле',
                            val => !val || val.length <= 250 || 'Максимальная длина 250 символов']"
                    >
                    </q-input>
                </q-item-section>
            </q-item>
            <q-item dense>
                <q-item-section class="w-full">
                    <q-input
                        hide-bottom-space
                        v-model="modelValue.phone"
                        :mask="modelValue.phone.length <= 7 ? '#-##-###' : '#(###)###-##-##'"
                        dense
                        outlined
                        label="Телефон"
                        type="text"
                        class="brand-text !font-light"
                    />
                </q-item-section>
            </q-item>
            <q-item dense>
                <q-item-section class="w-full">
                    <q-input
                        v-model="modelValue.work"
                        hide-bottom-space
                        label="Место работы"
                        dense
                        outlined
                        type="textarea"
                        class="brand-text !font-light"
                    />
                </q-item-section>
            </q-item>
            <q-item dense>
                <q-item-section class="w-full">
                    <q-input
                        v-model="modelValue.post"
                        hide-bottom-space
                        label="Должность"
                        dense
                        outlined
                        type="textarea"
                        class="brand-text !font-light"
                    />
                </q-item-section>
            </q-item>
            <q-item dense>
                <q-item-section class="w-full">
                    <q-input
                        v-model="modelValue.education"
                        hide-bottom-space
                        label="Образование"
                        dense
                        outlined
                        type="text"
                        class="brand-text !font-light"
                    />
                </q-item-section>
            </q-item>
            <q-item dense class="!pb-3">
                <q-item-section>
                    <q-checkbox
                        class="brand-text !font-light break-words whitespace-normal"
                        label="Участник боевых действий"
                        indeterminate-value
                        keep-color
                        color="brand-velvet"
                        checked-icon="fa-solid fa-circle"
                        unchecked-icon="fa-solid fa-circle-notch"
                        v-model="isVeteran"
                    />
                    <div class="flex flex-col gap-y-2" v-if="isVeteran">
                        <q-select
                        outlined
                        label="Статус участия"
                        menu-anchor="top right"
                        menu-self="top left"
                        :options="combatOptions"
                        v-model="modelValue.status"
                        class="overflow-y-auto break-words whitespace-normal"
                        />
                    </div>
                </q-item-section>
            </q-item>
        </q-list>
    </q-expansion-item>
</template>