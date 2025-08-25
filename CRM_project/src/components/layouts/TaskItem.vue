<script setup>
const props = defineProps(['task', 'section'])

function pluralizeFiles(count) {
  if (count === 1) return 'файл'
  if (count >= 2 && count <= 4) return 'файла'
  return 'файлов' // сюда попадает и 0, и 5+
}

</script>

<template>
    <q-item>
        <q-item-section class="min-w-0">
            <q-item-label overline class="!text-sm !font-semibold text-">{{ task.fio }}</q-item-label>
            <q-item-label v-if="section.key !== 'progress'" class="!text-xs text-stone-600 !font-semibold text-">
            {{ `${task.update_at}` }} : {{ `${task.files.length} ${pluralizeFiles(task.files.length)}` }}
            </q-item-label>
            <q-item-label v-else class="!text-xs text-stone-600 !font-semibold text-ellipsis">
            {{ task.update_at }}
            </q-item-label>
        </q-item-section>

        <q-item-section side shrink>
            <q-btn flat color="brand-velvet" class="!h-[32px] !w-[42px]">
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
</template>