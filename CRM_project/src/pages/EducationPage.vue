<script setup>
import { ref, computed, onMounted } from 'vue'
import NavigationColumn from '@/components/menus/NavigationColumn.vue'
import ClassCard from '@/components/cards/ClassCard.vue'
import { SessionStorage } from 'quasar'
import { RoleEnum_ } from '@/components/Enums.vue'
import EPPagination from '@/components/layouts/EPPagination.vue'
import EPChart from '@/components/layouts/EPChart.vue'
import { getClasses } from '@/components/Utils'

const classesSlide = ref(1)
const classesTab = ref('user')
const user = SessionStorage.getItem('user')

const classes = ref([])
async function updateList() {
    classes.value = await getClasses()
    for (let key in classes.value){
        classes.value[key] = classSlider(classes.value[key])
    }
}

function classSlider(classes){
    const groups = []
    for (let i = 0; i < classes.length; i+= 2){
        groups.push(classes.slice(i, i + 2))
    }
    return groups
}

const teachers = [
    {
        title: '1-4',
        class: 41,
        people: 32,
    },
    {
        title: '5-9',
        class: 55,
        people: 45,
    },
    {
        title: '10-11',
        class: 18,
        people: 18,
    }
]



const chartData = [
    { className: '5.1', avgScore: 4.2 },
    { className: '5.2', avgScore: 4.1 },
    { className: '5.3', avgScore: 3.9 },
    { className: '5.4', avgScore: 4.4 },
    { className: '5.5', avgScore: 3.5 },
    { className: '5.6', avgScore: 3.2 },
    { className: '5.7', avgScore: 4.6 },
    { className: '5.8', avgScore: 3.8 },
    { className: '5.9', avgScore: 3.7 },
    { className: '5.10', avgScore: 4.3 },
]

onMounted(async () => {await updateList()})
</script>

<template>
    <div class="flex flex-row h-[100vh] w-[100vw] items-center px-8 gap-x-4 !flex-nowrap">
        <header class="min-w-[225px] w-[225px]">
            <NavigationColumn section='Education'/>
        </header>
        
        <main class="!flex !flex-col justify-between flex-grow !h-[80vh] w-full">
                <div class="flex flex-col">
                    <div class="brand-title ps-24">Списки классов</div>
                    <q-tabs
                    v-model="classesTab"
                    active-color="brand-velvet"
                    indicator-color="brand-velvet"
                    align="left"
                    narrow-indicator
                    class="ps-24">
                        <q-tab name="user" @click="classesSlide = 1">Ваши классы</q-tab>
                        <q-tab v-if="user.role == RoleEnum_.LEADER" name="junior" @click="classesSlide = 1">Начальные классы</q-tab>
                        <q-tab v-if="user.role == RoleEnum_.LEADER" name="middle" @click="classesSlide = 1">Классы средней школы</q-tab>
                        <q-tab v-if="user.role == RoleEnum_.LEADER" name="high" @click="classesSlide = 1">Классы старшей школы</q-tab>
                    </q-tabs>
                    <q-tab-panels
                    v-model="classesTab"
                    animated
                    transition-next="fade"
                    transition-prev="fade"
                    class="!bg-inherit"
                    >
                        <q-tab-panel name="user">
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
                                    v-for="(group, idx) in classes.my_classes"
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
                        </q-tab-panel>

                        <q-tab-panel name="junior">
                            <q-carousel
                                v-model="classesSlide"
                                transition-prev="slide-right"
                                transition-next="slide-left"
                                animated
                                padding
                                class="bg-brand-grey"
                            >
                                <q-carousel-slide
                                    v-for="(group, idx) in classes.junior_classes"
                                    :name="idx + 1"
                                    class="justify-between"
                                >
                                    <ClassCard
                                        v-for="c in group"
                                        type="class"
                                        :body="c"
                                    />
                                </q-carousel-slide>
                                <template #control>
                                    <EPPagination v-model:slideNumber="classesSlide" :slideLength="classes.junior_classes.length" />
                                </template>
                            </q-carousel>
                        </q-tab-panel>

                        <q-tab-panel name="middle">
                            <q-carousel
                                v-model="classesSlide"
                                transition-prev="slide-right"
                                transition-next="slide-left"
                                animated
                                padding
                                class="bg-brand-grey"
                            >
                                <q-carousel-slide
                                    v-for="(group, idx) in classes.middle_classes"
                                    :name="idx + 1"
                                    class="justify-between"
                                >
                                    <ClassCard
                                        v-for="c in group"
                                        type="class"
                                        :body="c"
                                    />
                                </q-carousel-slide>
                                <template #control>
                                    <EPPagination v-model:slideNumber="classesSlide" :slideLength="classes.middle_classes.length" />
                                </template>
                            </q-carousel>
                        </q-tab-panel>

                        <q-tab-panel name="high">
                            <q-carousel
                                v-model="classesSlide"
                                transition-prev="slide-right"
                                transition-next="slide-left"
                                animated
                                padding
                                class="bg-brand-grey"
                            >
                                <q-carousel-slide
                                    v-for="(group, idx) in classes.hight_classes"
                                    :name="idx + 1"
                                    class="justify-between"
                                >
                                    <ClassCard
                                        v-for="c in group"
                                        type="class"
                                        :body="c"
                                    />
                                </q-carousel-slide>
                                <template #control>
                                    <EPPagination v-model:slideNumber="classesSlide" :slideLength="classes.hight_classes.length" />
                                </template>
                            </q-carousel>
                        </q-tab-panel>
                    </q-tab-panels>
                    
                </div>

                <div class="flex flex-col flex-grow">
                    <div class="brand-title ps-24 pb-2">Классные руководители</div>
                    <div class="flex flex-row justify-between px-24">
                        <ClassCard
                            v-for="group in teachers"
                            type="teacher"
                            :body="group"
                        />
                    </div>
                </div>
                <div class="px-24">
                    <EPChart :data="chartData"/>
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

.q-tab-panel{
    @apply !pb-0
}

</style>