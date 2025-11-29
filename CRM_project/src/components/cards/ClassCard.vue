<script setup>
import { ref, computed } from 'vue'
import router from '@/router'
import { SessionStorage } from 'quasar'

const props = defineProps(['body', 'type'])

function toClass(){
    if(props.type == 'class'){
        SessionStorage.set('selectedClass', props.body)
        router.push({name: 'ClassManipulation', params: {title: `${props.body.parallel}.${props.body.number}`}})
    }
    else if(props.type == 'teacher'){
        SessionStorage.set('selectedCollection', props.body)
        router.push({name: 'TeachersTable', params: {collection: props.body.title}})
    }

}
</script>

<template>
    <q-card class="flex no-wrap justify-between !bg-white/70 cursor-pointer max-h-[225px]" 
    :class="type == 'class' ? '!w-[45%] flex-col' : '!w-[30%] items-center'" @click="toClass">
        <q-card-section class="flex flex-row no-wrap gap-x-8">
            <q-icon 
                :name="type == 'class' ? 'fa-solid fa-chalkboard-teacher' : 'menu_book'" 
                size="75px" 
                class="text-brand-velvet" 
            />
            <div class="flex flex-col w-[70%]">
                <span v-if="type == 'class'" class="brand-title">Класс {{ `${body.parallel}.${body.number}` }}</span>
                <span v-else-if="type == 'teacher'" class="brand-title">{{ body.title }} классы</span>
                <div v-if="type == 'class'">
                    <span  class="brand-text text-ellipsis line-clamp-1">Учеников: {{ body.statistic?.total}}</span>
                </div>
                <div v-else-if="type === 'teacher'">
                    <span class="brand-text text-ellipsis line-clamp-1">Учителей: {{ body.people }}</span>
                    <span v-if="body.class" class="brand-text text-ellipsis line-clamp-1">Классов: {{ body.class }}</span>
                </div>
            </div>
        </q-card-section>
        <q-card-section  v-if="type == 'class'" class="!flex !flex-row justify-between bg-brand-grey !rounded-[15pt] mx-2 mb-2 no-wrap">
            <div class="flex flex-row gap-x-4">
                <div class="flex flex-col gap-y-2 items-center">
                    <div>
                        <q-icon name='fa-solid fa-venus' size="16px"/>
                        <span class="brand-text ps-2">Девочек</span>
                    </div>
                    <span class="brand-text">{{ body.statistic?.females}}</span>
                </div>
                <div class="flex flex-col gap-y-2 items-center">
                    <div>
                        <q-icon name='fa-solid fa-mars' size="16px"/>
                        <span class="brand-text ps-2">Мальчиков</span>
                    </div>
                    <span class="brand-text">{{ body.statistic?.males }}</span>
                </div>
            </div>
            <div class="flex flex-row gap-x-8">
                <div class="flex flex-col gap-y-2 items-center">
                    <q-icon name='fa-solid fa-passport' color="orange-6" size="16px"/>
                    <span class="brand-text text-orange-6">{{ body.statistic?.country_reg }}</span>
                    <q-tooltip
                        anchor="top middle"
                        outline
                        self="bottom middle"
                        :offset="[5, 5]"
                        class="!text-sm text-center bg-brand-velvet !text-white shadow-xl !max-w-[250px]"
                    >
                    Без гражданства РФ
                    </q-tooltip>
                </div>
                <div class="flex flex-col gap-y-2 items-center">
                    <q-icon name='fa-solid fa-triangle-exclamation' color="orange-6" size="16px"/>
                    <span class="brand-text text-orange-6" >{{ body.statistic?.spec_attention  }}</span>
                    <q-tooltip
                        anchor="top middle"
                        outline
                        self="bottom middle"
                        :offset="[5, 5]"
                        class="!text-sm text-center bg-brand-velvet !text-white shadow-xl !max-w-[250px]"
                    >
                    Учеников, требующих особого внимания
                    </q-tooltip>
                </div>
            </div>
        </q-card-section>
    </q-card>
</template>