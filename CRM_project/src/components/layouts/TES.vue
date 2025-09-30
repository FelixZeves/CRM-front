<script setup>
import { ref, watch } from 'vue'
import { errorNotify } from '../Notifies'

const props = defineProps(['body', 'edit'])

const bodyCopy = ref(JSON.parse(JSON.stringify(props.body)))

watch(() => props.edit, (val) => {
  if (val) {
    bodyCopy.value = JSON.parse(JSON.stringify(props.body))
  }
})

const addInput = () => {
    if(bodyCopy.value.parents.length < 4)
        bodyCopy.value.parents.push("")
    else
        errorNotify('Количество родителей превышает 4')
}

const removeInput = (index) => {
    bodyCopy.value.parents.splice(index, 1)
}

const lists = [
    {value: 'schoolEvents', label: 'Школьные конкурсы'},
    {value: 'achievementsRus', label: 'Всероссийские конкурсы'},
    {value: 'achievementsInter', label: 'Международные конкурсы'}]

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
    <q-list v-if="!edit" class="row items-start no-wrap">
        <q-item>
            <q-item-section class="max-w-[25%] break-words whitespace-normal">
                <q-item-label class="brand-text font-medium">Родители</q-item-label>
                <q-item-label v-for="parent in body.parents" class="brand-text !font-light"> <q-icon name="fa-solid fa-user" size="12px"/> {{ parent }}</q-item-label>
            </q-item-section>
        </q-item>
        <q-item>
            <q-item-section>
                <q-item-label class="brand-text font-medium">Телефон</q-item-label>
                <q-item-label class="brand-text !font-light"> <q-icon name="fa-solid fa-phone" size="12px"/> {{ formatPhone(body.mainPhone) }}</q-item-label>
                <q-item-label class="brand-text !font-light"> <q-icon name="fa-solid fa-phone" size="12px"/> {{ formatPhone(body.subPhone) }}</q-item-label>
            </q-item-section>
        </q-item>
        <q-item>
            <q-item-section>
                <q-item-label class="brand-text font-medium"> Физическое состояние</q-item-label>
                <q-item-label class="brand-text !font-light"><q-icon name="fa-solid fa-heart-pulse" size="12px"/> {{ body.health }} группа здоровья</q-item-label>
                <q-item-label v-if="body.specAttention == 'Да'" class="brand-text !font-light text-orange-6"><q-icon name="fa-solid fa-triangle-exclamation" size="12px" color="orange-6"/> Требует особого внимания</q-item-label>
            </q-item-section>
        </q-item>
        <q-item>
            <q-item-section>
                <q-item-label class="brand-text font-medium"> Репетиторы</q-item-label>
                <q-item-label v-for="tutor in body.tutors" caption  class="brand-text !font-light">- {{tutor.title}}</q-item-label>
            </q-item-section>
        </q-item>
        <q-item>
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
                        <q-list>
                            <q-item dense v-for="val in body[lists[index].value]">
                                <q-item-section class="w-[300px] break-words whitespace-normal">- {{ val }}</q-item-section>
                            </q-item>
                        </q-list>
                    </q-expansion-item>
                </q-list>
            </q-item-section>
        </q-item>
    </q-list>

    <q-list v-if="edit">
        <q-form class="row items-start no-wrap">
            <q-item>
                <q-item-section class="gap-2">
                    <q-item-label class="brand-text font-medium">Родители</q-item-label>
                    <q-input
                        v-for="(item, index) in bodyCopy.parents"
                        v-model="bodyCopy.parents[index]"
                        hide-bottom-space
                        dense
                        outlined
                        type="text"
                        class="brand-text !font-light"
                    >
                    <template #append>
                        <q-btn
                        flat
                        round
                        dense
                        color="negative"
                        icon="remove"
                        @click="removeInput(index)"
                        />
                    </template>
                    </q-input>
                    <q-item-label class="brand-text !font-light brand-velvet"><q-btn class="brand-description" label="Добавить" flat color="brand-velvet" icon="add" @click="addInput"/></q-item-label>
                </q-item-section>
            </q-item>
            <q-item>
                <q-item-section class="gap-2">
                    <q-item-label class="brand-text font-medium">Телефон</q-item-label>
                    <q-input
                        hide-bottom-space
                        v-model="bodyCopy.mainPhone"
                        :mask="bodyCopy.mainPhone.length <= 7 ? '#-##-###' : '#(###) ###-##-##'"
                        dense
                        outlined
                        label="Основной"
                        type="text"
                        class="brand-text !font-light"
                    />
                    <q-input
                        hide-bottom-space
                        v-model="bodyCopy.subPhone"
                        :mask="bodyCopy.subPhone.length <= 7 ? '#-##-###' : '#(###) ###-##-##'"
                        dense
                        outlined
                        label="Дополнительный"
                        type="text"
                        class="brand-text !font-light"
                    />
                </q-item-section>
            </q-item>
            <q-item>
                <q-item-section class="gap-2">
                    <q-item-label class="brand-text"> Физическое состояние</q-item-label>
                    <q-card class="!shadow-none !rounded-[3pt] !bg-inherit" bordered>
                        <q-card-section class="!p-1">
                            <q-item-label class="text-xs text-grey-8 pb-2 ps-2"> Группа здоровья</q-item-label>
                            <q-btn-toggle
                                v-model="bodyCopy.health"
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
                    <q-input
                        hide-bottom-space
                        v-model="bodyCopy.specAttention"
                        dense
                        outlined
                        label="Требует особого внимания"
                        type="text"
                        class="brand-text !font-light"
                    />
                </q-item-section>
            </q-item>
            <q-item>
                <q-item-section>
                    <q-item-label class="brand-text font-medium"> Репетиторы</q-item-label>
                    <q-select
                            emit-value
                            map-options
                            outlined
                            use-chips
                            multiple
                            class="w-[200px]"
                            :options="buffOptions"
                            :option-label="'title'"
                            :option-value="'id'"
                            v-model="bodyCopy.tutors"
                        />
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