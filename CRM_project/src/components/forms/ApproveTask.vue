<script setup>
import { ref } from 'vue'
import { StatusEnum, TypesEnum } from '@/components/Enums.vue'

const props = defineProps(['name', 'description', 'deadline', 'creator', 'documents', 'status', 'comments', 'type'])

const taskManipulation = ref(false)

const taskReport = ref("")

const taskComment = ref("")

</script>

<template>
    <q-btn v-if="type == 'execute'" @click="taskManipulation = true" style="height:30; width: 175px; background-color: var(--crm-c-light-velvet); border-color: var(--crm-c-velvet); border-width: 1.5pt; border-radius: 5pt; color: white;">Отчитаться</q-btn>
    <q-btn v-if="type == 'agree'" @click="taskManipulation = true" style="height:30; width: 175px; background-color: var(--crm-c-light-velvet); border-color: var(--crm-c-velvet); border-width: 1.5pt; border-radius: 5pt; color: white;">Согласовать</q-btn>
    <q-btn v-if="type == 'accept'" @click="taskManipulation = true" style="height:30; width: 175px; background-color: var(--crm-c-light-velvet); border-color: var(--crm-c-velvet); border-width: 1.5pt; border-radius: 5pt; color: white; font-size: small;">Проверить задачу</q-btn>
    <q-btn v-if="type == 'created'" @click="taskManipulation = true" style="height:30; width: 175px; background-color: var(--crm-c-light-velvet); border-color: var(--crm-c-velvet); border-width: 1.5pt; border-radius: 5pt; color: white;">Изучить ход задачи</q-btn>


    <q-dialog v-model="taskManipulation" backdrop-filter="blur(4px)">
        <q-card style="max-width: 75%; min-width: 50%;" class="py-4 px-3 !rounded-[20px]">
                <q-card-section style="padding-bottom: 0;">
                    <p class="content-center justify-self-center text-xl text-bold text-black mb-4 ps-3">{{ name }}</p>
                    <p class="text-lg justify-self-center text-black mb-4 ps-3">{{ description }}</p>
                    <p class="text-base text-black mb-2 ps-3"><b>Срок выполнения: </b>{{ deadline }}</p>
                    <p class="text-base text-black mb-2 ps-3"><b>Поставил(а) задачу: </b>{{ creator }}</p>
                    <div class="flex flex-row justify-between mb-2 px-3">
                        <p class="text-base text-black"><b>Статус: </b>{{ TypesEnum[type].translation }}</p>
                        <p v-if="documents != null" class="text-base text-black">
                            <q-icon name="upload_file" size="24px"></q-icon>
                            {{ documents }}
                        </p>
                    </div>
                </q-card-section>

                <q-card-section class="flex flex-col gap-y-4">
                    <q-input
                        v-if="type == 'execute'"
                        v-model="taskReport"
                        outlined
                        type="textarea"
                        :rules="[val => val && val.length > 0 || 'Введите текст отчёта']"
                        label="Текст отчёта">
                    </q-input>
                    <q-input
                        v-model="taskComment"
                        outlined
                        type="textarea"
                        label="Комментарий">
                    </q-input>
                </q-card-section>
        
                <q-card-actions style="justify-content: space-between; padding-inline: 8.75rem;">
                    <q-btn label="Прикрепить файл" icon="file_present" type="submit" style="background: var(--crm-c-light-yellow); width: 30%; border-radius: 5pt; font-size: small;"/>
                    <q-btn v-if="type == 'execute'" label="Отправить отчёт" type="submit" style="background: var(--crm-c-light-velvet); width: 35%; border-radius: 5pt; font-size: small;" text-color="white"/>
                    <q-btn v-if="type == 'agree'" label="Согласовать" type="submit" style="background: var(--crm-c-light-velvet); width: 25%; border-radius: 5pt; font-size: small;" text-color="white"/>
                    <q-btn v-if="type == 'agree'" label="На доработку" type="submit" style="background: var(--crm-c-light-velvet); width: 25%; border-radius: 5pt; font-size: small;" text-color="white"/>
                    <q-btn v-if="type == 'accept'" label="Подтвердить" type="submit" style="background: var(--crm-c-light-velvet); width: 25%; border-radius: 5pt; font-size: small;" text-color="white"/>
                    <q-btn v-if="type == 'accept'" label="На доработку" type="submit" style="background: var(--crm-c-light-velvet); width: 25%; border-radius: 5pt; font-size: small;" text-color="white"/>
                </q-card-actions>
        </q-card>
    </q-dialog>
</template>