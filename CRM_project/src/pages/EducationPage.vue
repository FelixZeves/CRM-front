<script setup>
import { ref, computed } from 'vue'
import NavigationColumn from '@/components/menus/NavigationColumn.vue'
import ClassCard from '@/components/cards/ClassCard.vue'

const classesSlide = ref(1)
const lessonsSlide = ref(1)

const classes = [
    {
        title: '5.4',
        people: 32,
        alergic: 4,
        description: 'Краткая информация/ заметка по классу, другая доп. информация',
        grades: [ 5, 17, 7, 3 ]
    },
    {
        title: '5.5',
        people: 34,
        alergic: 6,
        description: 'Краткая информация/ заметка по классу, другая доп. информация',
        grades: [ 5, 17, 8, 4 ]
    },
    {
        title: '5.6',
        people: 27,
        alergic: 1,
        description: 'Краткая информация/ заметка по классу, другая доп. информация',
        grades: [ 5, 16, 6, 0 ]
    },
]

const lessons = [
    {
        title: 'Алгебра',
        class: '5.4',
        people: 32,
        grades: [ 6, 16, 7, 3 ],
        schedule: 'Понедельник, 2 урок',
        cabinet: '3.4'
    },
    {
        title: 'Алгебра',
        class: '5.5',
        people: 34,
        grades: [ 2, 20, 8, 4 ],
        schedule: 'Понедельник, 4 урок',
        cabinet: '3.6'
    },
    {
        title: 'Алгебра',
        class: '5.6',
        people: 27,
        grades: [ 5, 16, 6, 0 ],
        schedule: 'Вторник, 3 урок',
        cabinet: '3.8'
    },
    {
        title: 'Геометрия',
        class: '5.4',
        people: 32,
        grades: [ 5, 17, 7, 3 ],
        schedule: 'Вторник, 5 урок',
        cabinet: '3.4'
    },
    {
        title: 'Геометрия',
        class: '5.5',
        people: 34,
        grades: [ 5, 17, 8, 4 ],
        schedule: 'Среда, 3 урок',
        cabinet: '3.6'
    },
]

const classGroups = computed(() => {
    const groups = []
    for (let i = 0; i < classes.length; i += 2) {
        groups.push(classes.slice(i, i + 2))
    }
    return groups
})

const lessonGroups = computed(() => {
    const groups = []
    for (let i = 0; i < lessons.length; i += 3) {
        groups.push(lessons.slice(i, i + 3))
    }
    return groups
})
</script>

<template>
    <div class="flex flex-row h-[100vh] w-[100vw] items-center px-8 gap-x-4 !flex-nowrap">
        <header class="min-w-[225px] w-[225px]">
            <NavigationColumn section='Education'/>
        </header>
        
        <main class="!flex !flex-col justify-between flex-grow !h-[80vh] w-full">
                <div class="flex flex-col">
                    <div class="brand-title ps-24">Классное руководство</div>
                    <q-carousel
                        v-model="classesSlide"
                        transition-prev="slide-right"
                        transition-next="slide-left"
                        animated
                        control-color="brand-velvet"
                        navigation-icon="fa-solid fa-circle-notch"
                        navigation-active-icon="fa-solid fa-circle"
                        arrows
                        navigation
                        infinite
                        padding
                        class="bg-brand-grey"
                    >
                        <q-carousel-slide
                            v-for="(group, idx) in classGroups"
                            :name="idx + 1"
                            class="justify-between"
                        >
                            <ClassCard
                                v-for="c in group"
                                type="class"
                                :body="c"
                            />
                        </q-carousel-slide>
    
                    </q-carousel>
                </div>

                <div class="flex flex-col">
                    <div class="brand-title ps-24">Проводимые занятия</div>
                    <q-carousel
                        v-model="lessonsSlide"
                        transition-prev="slide-right"
                        transition-next="slide-left"
                        animated
                        control-color="brand-velvet"
                        navigation-icon="fa-solid fa-circle-notch"
                        navigation-active-icon="fa-solid fa-circle"
                        arrows
                        navigation
                        infinite
                        padding
                        class="bg-brand-grey"
                    >
                        <q-carousel-slide
                            v-for="(group, idx) in lessonGroups"
                            :name="idx + 1"
                            class="justify-around"
                        >
                            <ClassCard
                                v-for="c in group"
                                type="lesson"
                                :body="c"
                            />
                        </q-carousel-slide>
    
                    </q-carousel>
                </div>
        </main>
    </div>
</template>

<style scoped>

.q-carousel{
    @apply !h-[320px] !pb-2 rounded-[15pt]
}

.q-carousel__slide{
    @apply !flex !flex-row !gap-x-10 !px-24 !content-center
}

</style>