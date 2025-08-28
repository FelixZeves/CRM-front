<script setup>
import { computed, ref, watch } from 'vue'
import api from '@/main'
import { confirmNotify, successNotify } from '@/components/Notifies'
import TaskItem from '../layouts/TaskItem.vue'
import { getTasks, TASK } from '../Utils'

const emit = defineEmits(['update:visible', 'update-list'])
const props = defineProps(['visible', 'id', 'user'])

const visible = computed({
  get: () => props.visible,
  set: val => emit('update:visible', val)
})

const body = ref(null)

const loading = ref(false)

watch(visible, async (val) => {
    if (val) {
        loading.value = true
        try {
        if(body.value == null){
            body.value = (await getTasks(null, false, {id: props.id}))[0]
        }
        } finally {
         loading.value = false
        }
    }
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
    let response = await api.put(`${TASK}/archive/${props.id}`)

    if (response.status == 200){
        successNotify('Задача отправлена в архив')
        visible.value = false
        emit('update-list')
    }
}

async function deleteTask(){
    let response = await api.delete(`${TASK}/${props.id}`)

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
  
        <!-- Заголовок -->
        <q-card-section>
          <div class="text-xl font-bold text-center pb-2">
            <q-skeleton v-if="loading" type="text" width="40%" />
            <span v-else>{{ body.title }}</span>
          </div>
          <q-separator inset spaced />
          <div class="brand-description leading-relaxed pt-2 text-justify px-4">
            <q-skeleton v-if="loading" type="text" class="mb-1" />
            <q-skeleton v-if="loading" type="text" width="80%" />
            <span v-else>{{ body.description }}</span>
          </div>
        </q-card-section>
  
        <!-- Секции -->
        <q-card-section class="h-[50vh] flex-grow overflow-y-hidden">
          <div v-if="loading" class="px-4">
            <q-skeleton type="rect" class="h-[40vh] rounded-xl" />
          </div>
          <div v-else class="flex flex-row justify-between">
            <q-expansion-item
              v-for="section in sections"
              :key="section.key"
              group="tasks"
              hide-expand-icon
              :header-class="section.headerClass"
              class="w-[33%]"
              :label="section.label"
              :caption="`${body[section.key].length}/${body.total}`"
            >
              <q-list class="max-h-[40vh] overflow-y-auto">
                <TaskItem
                  v-for="task in body[section.key]"
                  :key="task.id"
                  :task="task"
                  :section="section"
                />
              </q-list>
            </q-expansion-item>
          </div>
        </q-card-section>

        <q-card-section class="!mt-auto">

        <div v-if="loading" class="flex flex-row flex-grow justify-between pt-2">
            <q-skeleton type="QBtn" class="navigation-btn opacity-[80%] brand-description" />
            <q-skeleton type="QBtn" class="navigation-btn brand-description" />
        </div>

        <div v-else-if="body.approved.length == body.total || body.rejected.length > 0"
            class="flex flex-row flex-grow justify-between pt-2">
            <q-btn
            color="brand-danger"
            @click="confirmNotify(deleteTask)"
            label="Удалить"
            class="navigation-btn opacity-[80%] brand-description"
            />
            <q-btn
            color="brand-velvet"
            @click="confirmNotify(toArchive)"
            label="В архив"
            class="navigation-btn brand-description"
            />
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