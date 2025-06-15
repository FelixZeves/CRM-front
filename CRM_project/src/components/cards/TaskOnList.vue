<script setup>
import { ref } from 'vue'
import ApproveTaskForm from '@/components/forms/ApproveTask.vue'

import { StatusEnum } from '@/components/Enums.vue'

const props = defineProps(['name', 'description', 'deadline', 'creator', 'documents', 'comment', 'status', 'type'])

const tab = ref('main')
</script>

<template>
    <q-card class="!max-w-[90%] !min-w-[90%] flex flex-col bg-white !rounded-[15pt] mx-2 my-2 p-5 !shadow-xl !min-h-[250px] !max-h-[500px]">
        <div class="flex flex-row justify-between items-center gap-y-5">
            <span class="lg:text-lg 2xl:text-xl font-bold text-sm lg:text-base 2xl:text-lg mb-2">{{ name }}</span>
            <div class="absolute top-0 end-0 h-[40px] w-[30%] rounded-tr-[10pt] border-b-[8pt] border-s-[8pt]  border-[--vt-c-white-mute] rounded-bl-[25pt] cursor-help" :class="StatusEnum[status].color">
                <q-tooltip
                anchor="top right"
                self="bottom right"
                :offset="[10, 10]"
                max-width="200px"
                class="!text-sm text-center"
                :class="StatusEnum[props.status].color, StatusEnum[props.status].textColor">
                    {{ StatusEnum[status].description }}
                </q-tooltip>
            </div>
        </div>
        
        <q-tabs
          v-model="tab"
          dense
          class="!w-3/4 text-grey mb-4"
          active-color="brand-velvet"
          indicator-color="brand-velvet"
          align="left"
          narrow-indicator
        >
          <q-tab name="main" class="!normal-case text-lg" label="Основная информация" />
          <q-tab name="details" class="!normal-case" label="Дополнительная информация" />
          <q-tab name="files" class="!normal-case" label="Прикреплённые файлы" />
        </q-tabs>

        <q-tab-panels
        class="!max-h-[65%]"
        v-model="tab"
        transition-next="slide-up"
        transition-prev="slide-down"
        animated>
          <q-tab-panel name="main">
            <p class="text-base m-0 justify-self-end text-end text-gray-600 pb-4"><span class="text-lg text-gray-700">Срок выполнения:</span> <br/> {{ deadline }}</p>
            <div class="text-base text-gray-600 text-pretty truncate max-h-[70%]">{{ description }}</div>
          </q-tab-panel>

          <q-tab-panel name="details" class="overflow-y-auto">
            <p class="text-base m-0 justify-self-end text-end text-gray-600 pb-4"><span class="text-lg text-gray-700">Поставил(а) задачу: </span> <br/>{{ creator }}</p>
            <p class="text-base text-gray-600">{{ comment }}</p>
          </q-tab-panel>

          <q-tab-panel name="files" class="overflow-y-auto">
            <div class="flex flex-row" v-for="document in documents">
                <q-icon name="fa-solid fa-file-export pe-4" size="sm" color="gray-600">
                    <q-tooltip
                    anchor="top middle"
                    self="bottom middle"
                    :offset="[10, 10]"
                    max-width="200px"
                    class="!text-sm text-center">
                        {{ document }}
                    </q-tooltip>
                </q-icon>
                <p class="text-base text-gray-600">{{ document }}</p>
            </div>
          </q-tab-panel>
        </q-tab-panels>
        
        
        
        <div class="flex flex-row justify-end items-center mt-7">
            <div>
                <ApproveTaskForm 
                :name="name"
                :description="description"
                :deadline="deadline"
                :creator="creator"
                :status="status"
                :type="type"
                :comment="comment"
                :documents="documents">
                </ApproveTaskForm>
            </div>
            
        </div>
    </q-card>
</template>