<script setup>
import { ref, computed } from 'vue'
import axios from 'axios'
import { getFormSchema } from '@/components/Utils'

const props = defineProps(['visible'])
const emit = defineEmits(['update:visible', 'update-list'])

const visible = computed({
  get: () => props.visible,
  set: val => emit('update:visible', val)
})

const isDelegate = ref(false)
const today = new Date().toLocaleDateString('ru-RU', { day: '2-digit', month: '2-digit', year: 'numeric' });
const date = ref({ from: today, to: today });

const formatDate = computed(() => {
    const { from, to } = date.value;
    return from === to ? from : `${from} - ${to}`;
});

function selectDate(val) {
    let newDate;
    if (typeof val === 'object')
    newDate = {...val};

if (typeof val === 'string')
newDate = { from: val, to: val };

    date.value = newDate;
    form.value.at = newDate.from;
    form.value.to = newDate.to;
}

const form = ref(getFormSchema('event'));

async function createEvent() {
    await axios.post('/api/user/event', form.value)
    emit('update-list')
}
</script>

<template>
    <q-dialog v-model="visible" backdrop-filter="blur(4px)">
        <q-card class="text-black !rounded-[15pt] !flex !w-[90vw] !min-w-[50%]">
            <q-form @submit="createEvent" class="bg-tile p-5 !flex flex-row w-full h-full gap-2">

                <q-card-section class="flex flex-col w-[60%] gap-y-4">
                    <q-input
                        label="Название мероприятия"
                        v-model="form.title"
                        outlined
                        type="text"
                        :rules="[val => val.length >= 4 || 'Минимальная длина 4 символа', val => val.length <= 80 || 'Максимальная длина 80 символов']"
                        class="brand-description"
                    />
                    <q-input
                        label="Место проведения"
                        v-model="form.place"
                        outlined
                        type="text"
                        :rules="[val => val.length >= 4 || 'Минимальная длина 4 символа', val => val.length <= 80 || 'Максимальная длина 80 символов']"
                        class="brand-description"
                    />
                    <q-input label="Дата мероприятия" v-model="formatDate" readonly outlined>
                        <template v-slot:append>
                            <q-icon name="event" color="brand-velvet">
                                <q-popup-proxy cover transition-show="scale" transition-hide="scale">
                                    <q-date
                                        v-model="date"
                                        minimal
                                        range
                                        mask="DD.MM.YYYY"
                                        @update:model-value="selectDate"
                                        class="brand-description"
                                        >
                                        <q-btn class="flex flex-row" v-close-popup label="Закрыть" flat/>
                                    </q-date>
                                </q-popup-proxy>
                            </q-icon>
                        </template>
                    </q-input>
                </q-card-section>

                <q-card-section class="flex flex-col gap-y-4 flex-grow">
                    <q-input
                        label="Описание мероприятия"
                        v-model="form.description"
                        outlined
                        type="textarea"
                        class="brand-description"
                        :rules="[val => val.length >= 4 || 'Минимальная длина 4 символа', val => val.length <= 255 || 'Максимальная длина 255 символов']"
                    />
                    <q-btn label="Создать" type="submit" class="brand-description" color="brand-velvet"/>
                </q-card-section>

            </q-form>
        </q-card>
    </q-dialog>
</template>