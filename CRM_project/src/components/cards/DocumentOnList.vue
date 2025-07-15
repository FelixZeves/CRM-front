<script setup>
import axios from 'axios'
import { downloadFile } from '@/components/Utils';

const props = defineProps(['body'])

const extension = props.body.title.split('.').pop();

const fileIcons = {
    'pdf': 'fa-regular fa-file-pdf',
    'jpg': 'fa-regular fa-file-image',
    'png': 'fa-regular fa-file-image',
    'docx': 'fa-regular fa-file-word',
    'pptx': 'fa-regular fa-file-powerpoint',
    'xlsx': 'fa-regular fa-file-excel',
    'txt': 'fa-regular fa-file-lines',
    '7z': 'fa-regular fa-file-zipper'
}

</script>

<template>
    <q-item class="my-4 mx-3 max-h-[200px]">
        <q-card class="flex-grow !min-w-[90%]">
            <q-card-section class="flex flex-row items-center">
                <q-icon :name="fileIcons[extension] || 'fa-regular fa-file'" size="xl" class="!max-w-[5%]"/>
                <div class="flex flex-col px-4 !max-w-[90%] !min-w-[90%]">
                    <div class="brand-title !max-w-full text-ellipsis line-clamp-2 pb-4">{{ body.title }}</div>
                    <div class="flex flex-row justify-end">
                        <q-chip v-for="tag in body.tags" clickable outline square class="brand-text" :label="tag.title"/>
                        <q-chip outline square class="brand-text" :label="body.create_at"></q-chip>
                    </div>
                </div>
                <q-btn flat class="!max-w-[5%] !px-1" @click="downloadFile(body.id)">
                    <q-icon name="download" size="lg"></q-icon>
                </q-btn>
            </q-card-section>
        </q-card>
    </q-item>
</template>