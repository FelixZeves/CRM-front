<script setup>
import { ref } from 'vue'
import ApproveTaskForm from '@/components/forms/ApproveTask.vue'
import { TaskTypeEnum as T, StatusEnum as S, RoleEnum_ as R, fileIconsEnum as FI} from '@/components/Enums.vue'
import AddTask from '../forms/AddTask.vue'
import axios from 'axios'
import { downloadFile } from '../Utils'

const props = defineProps(['body', 'user'])
const emit = defineEmits(['update-list'])
const tab = ref('main')
const visibleApprove = ref(false)
const visibleAdd = ref(false)
const me =  ref(props.body.steps.find(step => step.user.id == props.user.profile.id))
const btn = ref({
  [T.EXECUTOR]: 'Отчитаться',
  [T.REVIEWER]: 'Согласовать',
  [T.CHECKER]: 'Утвердить',
  [T.CREATOR]: 'Ознакомиться'
})

async function lazyLoad(step){
    if(!step.files[0].title)
        step.files = (await axios.get(`/api/user/file?id=${step.files}`)).data.data
}
</script>

<template>
    <q-card class="flex flex-col flex-grow bg-white mx-2 my-2 pt-3 pb-5 px-5 !min-h-[250px] !max-h-[600px] !flex-nowrap">
        <div class="flex flex-row w-[70%] justify-between">
            <span class="lg:text-lg 2xl:text-xl font-bold text-sm lg:text-base 2xl:text-lg mb-2">{{ body.title }}</span>
            <div v-if="user.role != R.TEACHER">
              <q-chip dense square clickable @click="visibleAdd = true" size="lg" color="white" text-color="grey-7">
                <q-icon name="fa-regular fa-copy"></q-icon>
                <q-tooltip
                anchor="top left"
                self="bottom right"
                :offset="[-5, 5]"
                class="!text-sm text-center bg-white !text-stone-700 shadow-xl"
                >
                Скопировать задачу
                </q-tooltip>
              </q-chip>
            </div>
            <div class="absolute top-0 end-0 h-[40px] w-[30%] rounded-tr-[10pt] border-b-[8pt] border-s-[8pt]  border-[--vt-c-white-mute] rounded-bl-[25pt] cursor-help" :class="S[body.status].color">
                <q-tooltip
                anchor="top right"
                self="bottom right"
                :offset="[10, 10]"
                class="brand-text text-center"
                :class="S[body.status].color, S[body.status].textColor">
                    {{ S[body.status].description }}
                </q-tooltip>
            </div>
        </div>
        
        <q-tabs
          v-model="tab"
          dense
          class="!w-3/4 brand-description mb-4"
          active-color="brand-velvet"
          indicator-color="brand-velvet"
          align="left"
          narrow-indicator
        >
          <q-tab name="main" class="brand-description" label="Основная" />
          <q-tab name="details" class="brand-description" label="Дополнительная" />
          <q-tab v-if="Array.isArray(body.steps[0].files) && body.steps[0].files.length > 0" name="files" label="файлы" @click="lazyLoad(body.steps[0])"/>
        </q-tabs>

        <q-tab-panels
        class="!max-h-[65%]"
        v-model="tab"
        transition-next="slide-up"
        transition-prev="slide-down"
        animated>
          <q-tab-panel name="main">
            
            <p class="brand-text m-0 justify-self-end text-end pb-4"><span>Получена: {{ body.steps[0].update_at }} <br/> <span>Срок: {{ body.deadline }}</span> </span></p>
            <div class="brand-description text-pretty text-ellipsis line-clamp-2">{{ body.description }}</div>
          </q-tab-panel>

          <q-tab-panel name="details" class="overflow-y-auto">
            <p class="brand-text m-0 justify-self-end text-end pb-4"><span class="brand-text">Поставил(а) задачу: </span> <br/>{{ body.steps[0].user.fio }}</p>
            <p class="brand-description">{{ body.steps[0].comment }}</p>
          </q-tab-panel>

          <q-tab-panel name="files" class="overflow-y-auto">
            <q-list class="!flex !flex-col !gap-y-2">
              <q-item v-for="file in body.steps[0].files" class="gap-x-2 !px-0 !items-center">
                <q-icon :name="FI[file.title.split('.').pop()] || 'fa-regular fa-file'" size="md"/>
                <span class="brand-description flex-grow text-ellipsis line-clamp-1">{{ file.title }}</span>
                <span class="brand-description w-[10%]">{{ `${(file.size / (1024 * 1024)).toFixed(2)}MB` }}</span>
                <q-btn color="brand-wait" class="!w-[225px]" text-color="black" label="Скачать" icon-right="bi-download ps-5" @click="downloadFile(file.id)"/>
              </q-item>
            </q-list>
          </q-tab-panel>
        </q-tab-panels>
        <div class="flex flex-row justify-end items-center mt-7">
          <q-btn :label="btn[me.type]" @click="visibleApprove = true" class="brand-text" color="brand-velvet"/>
        </div>
    </q-card>
    <ApproveTaskForm 
      @update-list="emit('update-list')"
      v-model:visible="visibleApprove"
      :user="user"
      :body="body">
    </ApproveTaskForm>
    <AddTask
      @update-list="emit('update-list')"
      v-model:visible="visibleAdd"
      :body="body"
      :me="user"
    />
</template>