<script setup>
import { ref } from 'vue'
import AddTask from '../forms/AddTask.vue'
import ApproveTask from '../forms/ApproveTask.vue'
import { SessionStorage } from 'quasar'
const props = defineProps(['task', 'section'])

const visibleApprove = ref(false)
const visibleAdd = ref(false)

const user = SessionStorage.getItem('user')

function pluralizeFiles(count) {
  if (count === 1) return 'файл'
  if (count >= 2 && count <= 4) return 'файла'
  return 'файлов' // сюда попадает и 0, и 5+
}

</script>

<template>
    <q-item>
        <q-item-section class="min-w-0">
            <q-item-label overline class="!text-sm !font-semibold text-">{{ task.active[1].user.init_name }}</q-item-label>
            <q-item-label v-if="section.key !== 'progress'" class="!text-xs text-stone-600 !font-semibold text-">
            {{ `${task.update_at}` }} : {{ `${task.active[1].files.length} ${pluralizeFiles(task.active[1].files.length)}` }}
            </q-item-label>
            <q-item-label v-else class="!text-xs text-stone-600 !font-semibold text-ellipsis">
            {{ task.update_at }}
            </q-item-label>
        </q-item-section>

        <q-item-section side shrink>
            <q-btn
                flat
                color="brand-velvet"
                class="!h-[32px] !w-[42px]"
                @click="section.key === 'progress' ? visibleAdd = true : visibleApprove = true"
            >
                <q-icon :name="section.icon" size="sm">

                </q-icon>
                <q-tooltip
                    anchor="top left"
                    outline
                    self="bottom right"
                    :offset="[-5, 5]"
                    class="!text-sm text-center bg-brand-velvet !text-white shadow-xl"
                >
                    {{ section.tooltip }}
                </q-tooltip>
            </q-btn>
        </q-item-section>
    </q-item>
    <ApproveTask
      v-model:visible="visibleApprove"
      :user="user"
      :body="task">
    </ApproveTask>
    <AddTask
      v-model:visible="visibleAdd"
      :body="task"
      :me="user"
    />
</template>