<script setup>
import { ref, computed } from 'vue'
import axios from 'axios'

const props = defineProps(['visible'])
const emit = defineEmits(['update:visible', 'update-list'])

const visible = computed({
  get: () => props.visible,
  set: val => emit('update:visible', val)
})

const form = ref({
    title: '',
    file: null,
    infinitely: false,
    spec: [],
});

async function createDoc() {
    // await axios.post('/api/user/doc', form.value)
    emit('update-list')
}
</script>

<template>
    <q-dialog v-model="visible" backdrop-filter="blur(4px)">
        <q-card class="text-black !rounded-[15pt] !flex !w-[90vw] !min-w-[50%]">
            <q-form @submit="createDoc" class="bg-tile p-5 !flex flex-row w-full h-full gap-2">

                <q-card-section class="flex flex-col w-[55%] gap-y-4">
                    <q-input
                        label="Название дркумента"
                        v-model="form.title"
                        outlined
                        type="text"
                        :rules="[val => val.length >= 4 || 'Минимальная длина 4 символа', val => val.length <= 80 || 'Максимальная длина 80 символов']"
                    />
                    <div class="flex flex-row gap-x-4">
                        <q-file
                            v-model="form.file"
                            label="Прикрепить файлы"
                            outlined
                            hide-bottom-space=""
                            bg-color="brand-wait"
                            clearable
                            class="!w-[60%]"
                            :rules="[val => val != null|| 'Обязательно прикрепите файл']">
                                <template v-slot:append><q-icon name="attach_file" /></template>
                        </q-file>
                        <q-checkbox
                            class="text-gray-700 text-base"
                            label="Бессрочный"
                            indeterminate-value
                            keep-color
                            color="brand-velvet"
                            checked-icon="fa-solid fa-circle"
                            unchecked-icon="fa-solid fa-circle-notch"
                            v-model="form.infinitely"
                        />
                    </div>
                    
                    
                </q-card-section>

                <q-card-section class="flex flex-col gap-y-4 flex-grow">
                    <q-select v-model="form.departments" outlined use-chips label="Отделы" hint="Чтобы файл был доступен всем, оставьте поле пустым"/>
                    <q-select
                        v-model="form.spec"
                        outlined
                        use-chips
                        label="Направленность"
                        :rules="[val => val.length  > 0|| 'Обязательно выберите направленность']"
                        />
                    <q-btn label="Создать" type="submit" color="brand-velvet"/>
                </q-card-section>

                <!-- <q-card-section class="flex flex-col w-full gap-y-4">
                    <q-input
                        label="Название дркумента"
                        v-model="form.title"
                        outlined
                        type="text"
                        :rules="[val => val.length >= 4 || 'Минимальная длина 4 символа', val => val.length <= 80 || 'Максимальная длина 80 символов']"
                    />
                    <q-file
                        v-model="form.file"
                        label="Прикрепить файлы"
                        outlined
                        bg-color="brand-wait"
                        clearable>
                        <template v-slot:append><q-icon name="attach_file" /></template>
                    </q-file>
                    <q-select v-model="form.departments" outlined use-chips label="Отделы"/>
                    <q-select v-model="form.spec" outlined use-chips label="Направленность"/>
                    <q-btn label="Создать" type="submit" color="brand-velvet"/>
                </q-card-section> -->

            </q-form>
        </q-card>
    </q-dialog>
</template>

<style scoped>

</style>