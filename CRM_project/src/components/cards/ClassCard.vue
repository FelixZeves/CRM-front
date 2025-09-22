<script setup>
import { ref, computed } from 'vue'
import router from '@/router'
import { SessionStorage } from 'quasar'

const props = defineProps(['body', 'type'])

const segmentsStyles = [
    { color: "bg-green-5", borderColor: "border-green-500", textColor: "green-6", tooltip: 'Отличники', textTooltip: 'white' },
    { color: "bg-yellow-7", borderColor: "border-yellow-400", textColor: "yellow-8", tooltip: 'Хорошисты', textTooltip: 'grey-9' },
    { color: "bg-orange-4", borderColor: "border-orange-400", textColor: "orange-6", tooltip: 'Троечники', textTooltip: 'white' },
    { color: "bg-red-4", borderColor: "border-red-400", textColor: "red-6", tooltip: 'Двоечники', textTooltip: 'white' },
]

const segments = computed(() => {
    let seg = null
    if (props.body.grades)
        seg = props.body.grades.map((item) => ({
            value: item,
            percent: ((item / props.body.people) * 100).toFixed(2),
        }))
    return seg
    }
)

function toClass(){
    if(props.type == 'class'){
        SessionStorage.set('selectedClass', props.body)
        router.push({name: 'ClassManipulation', params: {title: props.body.title}})
    }
    else
        console.log('Это не класс')

}
</script>

<template>
    <q-card class="flex flex-col no-wrap justify-between !bg-white/70 cursor-pointer"
    :class="type == 'class' ? '!w-[45%]' : '!w-[30%]'" @click="toClass">
        <q-card-section class="flex flex-row no-wrap flex-center justify-evenly">
            <q-icon 
                :name="type == 'class' ? 'fa-solid fa-chalkboard-teacher' : 'menu_book'" 
                size="75px" 
                class="text-brand-velvet" 
            />
            <div class="flex flex-col w-[70%]">
                <div class="flex flex-row gap-x-4">
                    <span class="brand-text text-ellipsis line-clamp-1">Учеников: {{ body.people }}</span>
                    <span v-if="body.alergic" class="brand-text text-ellipsis line-clamp-1">Алергиков: {{ body.alergic }}</span>
                    <span v-if="body.class" class="brand-text text-ellipsis line-clamp-1">Класс: {{ body.class }}</span>
                </div>
                <span class="brand-title">{{ body.title }}</span>
                <span v-if="body.description" class="brand-text text-ellipsis line-clamp-2">{{ body.description }}</span>
                <span v-if="body.schedule" class="brand-text text-ellipsis line-clamp-1">{{ body.schedule }}</span>
            </div>
        </q-card-section>
        <q-card-section class="!flex !flex-row justify-between bg-brand-grey !rounded-[15pt] mx-2 mb-4 no-wrap">
            <div class="flex flex-col w-[50%]">
                <span class="brand-text pb-2">Успеваемость</span>
                <div class="flex items-center w-full no-wrap">
                    <div
                        v-for="(item, index) in segments"
                        :key="index"
                        class="relative flex items-center"
                        :style="{ width: item.percent + '%' }"
                        >
                        <div
                            v-if="item.value > 0"
                            class="h-2 rounded-full w-full"
                            :class="segmentsStyles[index].color"
                        ></div>

                        <q-badge
                            v-if="item.value > 0"
                            color="white"
                            :text-color="segmentsStyles[index].textColor"
                            class="border-2 absolute top-1/2 -translate-y-1/2 -translate-x-1/2 z-10"
                            rounded
                            :class="segmentsStyles[index].borderColor"
                            style="left: 50%"
                        >
                            {{ item.value }}
                            <q-tooltip
                                anchor="top right"
                                outline
                                self="bottom right"
                                :offset="[-5, 5]"
                                class="brand-text text-center shadow-xl !max-w-[250px]"
                                :class="segmentsStyles[index].color + ' text-' + segmentsStyles[index].textTooltip"
                            >
                                {{ segmentsStyles[index].tooltip}}
                            </q-tooltip>
                        </q-badge>
                    </div>
                </div>
            </div>
            <div class="flex flex-col w-[40%]">
                <span v-if="body.cabinet" class="brand-text pb-2">Кабинет <br/>{{ body.cabinet }}</span>
            </div>
        </q-card-section>
    </q-card>
</template>