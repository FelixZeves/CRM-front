<script setup>
import { ref } from 'vue'
import { fileIconsEnum as fileIcons } from '@/components/Enums.vue'
import AddDoc from '@/components/forms/AddDoc.vue';
import { downloadFile, FILE } from '@/components/Utils'

const props = defineProps(['body', 'user'])
const emit = defineEmits(['update-list'])

const extension = props.body.title.split('.').pop();

const visible = ref(false)

function parseTag(tag) {
    return tag.title
        .split(' ')
        .map(p => {
            if (p.length <= 3) return p
            if (p.length <= 6) return p.slice(0, 4) + '.'
            if (p.length <= 9) return p.slice(0, 3) + '.'
            return p.slice(0, 4) + '.'
        })
        .join(' ')
}

</script>

<template>
    <q-item class="my-4 mx-3 max-h-[200px]">
        <q-card class="flex-grow !min-w-[90%]">
            <q-card-section class="flex flex-row items-center">
                <q-icon :name="fileIcons[extension] || 'fa-regular fa-file'" size="xl" class="!max-w-[5%]"/>
                <div class="flex flex-row gap-x-3 px-4 !max-w-[90%] !min-w-[90%] !flex-nowrap">
                    <div class="flex flex-col content-start flex-grow w-[40%]">
                        <div class="flex flex-row w-full !flex-nowrap">
                            <span class="brand-title text-ellipsis line-clamp-1 pb-1 max-w-[80%]">{{ body.title }}</span>
                            <div v-if="body.owner.manager.id == user.profile.id" class="flex flex-row justify-end ps-2">
                                <q-chip dense square clickable @click="visible = true" size="md" color="white" text-color="grey-7">
                                    <q-icon name="fa-regular fa-edit"></q-icon>
                                    <q-tooltip
                                    anchor="top left"
                                    self="bottom right"
                                    :offset="[-5, 5]"
                                    class="!text-sm text-center bg-white !text-stone-700 shadow-xl"
                                    >
                                    Изменить файл
                                    </q-tooltip>
                                </q-chip>
                            </div>
                        </div>
                        <span class="brand-text">{{ body.owner.title }} | {{ body.owner.manager.init_name }}</span>
                    </div>
                    <div class="content-center !w-[50%]">
                        <div class="flex flex-row justify-end">
                            <q-chip v-if="body.permanent == true" outline dense square class="brand-text !p-2" label="Бессрочный"/>
                            <q-chip v-for="tag in body.tags" outline dense square class="brand-text !p-2" :label="tag.title.length < 12  ? tag.title : parseTag(tag)"/>
                            <q-chip outline dense square class="brand-text !p-2" :label="body.create_at"/>
                        </div>
                    </div>
                    <span class="brand-description !w-[6%] content-center text-end">{{ `${(body.size / (1024 * 1024)).toFixed(2)}MB` }}</span>
                </div>
                <q-btn flat class="!w-[5%] !px-1" @click="downloadFile(FILE, body.id)">
                    <q-icon name="download" size="lg"></q-icon>
                </q-btn>
            </q-card-section>
        </q-card>
    </q-item>
    <AddDoc v-model:visible='visible' @update-list="emit('update-list')" :body="body"></AddDoc>
</template>