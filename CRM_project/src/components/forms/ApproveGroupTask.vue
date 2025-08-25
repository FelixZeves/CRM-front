<script setup>
import { computed } from 'vue'
import axios from 'axios'
import { confirmNotify, successNotify } from '@/components/Notifies'
import TaskItem from '../layouts/TaskItem.vue'

const emit = defineEmits(['update:visible', 'update-list'])
const props = defineProps(['visible', 'body', 'user'])
const url = '/api/user/task'

const visible = computed({
  get: () => props.visible,
  set: val => emit('update:visible', val)
})

const sections = [
  {
    key: 'approved',
    label: 'Выполнено',
    headerClass: 'brand-description text-brand-complete',
    icon: 'fa-solid fa-info',
    tooltip: 'Изучить'
  },
  {
    key: 'rejected',
    label: 'Отклонено',
    headerClass: 'brand-description text-center text-brand-danger',
    icon: 'fa-solid fa-info',
    tooltip: 'Изучить'
  },
  {
    key: 'progress',
    label: 'В процессе',
    headerClass: 'brand-description text-end text-brand-velvet',
    icon: 'fa-regular fa-edit',
    tooltip: 'Написать сотруднику'
  }
]

async function toArchive(){
    let response = await axios.put(`${url}/archive/${props.body.id}`)

    if (response.status == 200){
        successNotify('Задача отправлена в архив')
        visible.value = false
        emit('update-list')
    }
}

async function deleteTask(){
    let response = await axios.delete(`${url}/${props.body.id}`)

    if (response.status == 200){
        successNotify('Задача удалена')
        visible.value = false
        emit('update-list')
    }
}
</script>

<template>
    <q-dialog v-model="visible" backdrop-filter="blur(4px)">
        <q-card class="flex flex-col py-4 px-3 min-w-[50%] max-w-[50%] h-[80vh] !flex-nowrap !overflow-y-hidden">
            <q-card-section>
            <div class="text-xl font-bold text-center pb-2">
                {{ body.title }}
            </div>
            <q-separator inset spaced />
            <div class="brand-description leading-relaxed pt-2 text-justify px-4">
                {{ body.description }}
            </div>
            </q-card-section>

            <q-card-section class="h-[50vh] flex-grow overflow-y-hidden">
                <div class="flex flex-row justify-between">
                    <q-expansion-item
                    v-for="section in sections"
                    :key="section.key"
                    group="tasks"
                    hide-expand-icon
                    :header-class="section.headerClass"
                    class="w-[33%]"
                    :label="section.label"
                    :caption="`${body[section.key].length}/${body.all}`"
                    >
                    <q-list class="max-h-[40vh] overflow-y-auto">
                        <TaskItem
                        v-for="task in body[section.key]"
                        :task="task"
                        :section="section"
                        />
                    </q-list>
                    </q-expansion-item>
                </div>
            </q-card-section>

            <q-card-section class="!mt-auto">
                <div class="flex flex-row flex-grow justify-between pt-2">
                    <q-btn color="brand-danger" @click="confirmNotify(deleteTask)" label="Удалить" class="navigation-btn opacity-[80%] brand-description" />
                    <q-btn color="brand-velvet" @click="confirmNotify(toArchive)" label="В архив" class="navigation-btn brand-description" />
                </div>
            </q-card-section>
        </q-card>
    </q-dialog>
</template>

<style scoped>

.navigation-btn{
    @apply !min-w-[150px]
}

</style>