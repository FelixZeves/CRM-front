<script setup>
import { ref } from 'vue'

const props = defineProps(['body'])

const tab = ref('school')

</script>

<template>
    <!-- <div class="flex flex-col gap-y-4 px-8 !no-wrap">
        <div class="flex flex-row justify-between">
            <div>
                <div class="brand-title pb-8">{{ body.name }}</div>

                <div>
                    <span class="brand-description">
                        Родители
                    </span>
                    <q-separator/>
                    <div v-for="parent in body.parents" class="brand-text">
                        {{ parent }}
                    </div>
                </div>
            </div>
            <div class="flex flex-col gap-y-4">

                <div class="flex flex-row gap-x-2 items-center">
                    <q-icon
                        name="fa-regular fa-address-book"
                        size="32px"
                    />
                    <div>
                        <div class="brand-text">{{ body.mainPhone }}</div>
                        <div class="brand-text">{{ body.subPhone }}</div>
                    </div>
                </div>

                <div class="flex flex-row gap-x-2 items-center">
                    <q-icon name="fa-solid fa-heart-pulse" size="32px"/>
                    <div class="brand-text">{{ body.health  + ' группа' }}</div>
                </div>

                <div class="flex flex-row gap-x-2 items-center">
                    <q-icon name="fa-solid fa-triangle-exclamation" size="32px" color="brand-danger"/>
                    <div class="brand-text">
                        Требует особого внимания
                    </div>
                </div>

                <div class="flex flex-row max-w-[250px] gap-x-1">
                    <q-chip
                    v-for="tutor in body.tutors">
                        {{ tutor.title }}
                    </q-chip>
                </div>
            </div>
        </div>
        <div class="flex flex-row gap-x-6">
            <q-card>
                <q-card-section class="brand-description">
                    Школьные конкурсы
                </q-card-section>
                <q-card-section>
                    <q-list>
                        <q-item v-for="achivement in body.schoolEvents">
                            <q-section class="!whitespace-normal !break-words brand-text">{{ achivement }}</q-section>
                        </q-item>
                    </q-list>
                </q-card-section>
            </q-card>

            <q-card>
                <q-card-section class="brand-description">
                    Всероссийские конкурсы
                </q-card-section>
                <q-card-section>
                    <q-list>
                        <q-item v-for="achivement in body.achievementsRus">
                            <q-section class="!whitespace-normal !break-words brand-text">{{ achivement }}</q-section>
                        </q-item>
                    </q-list>
                </q-card-section>
            </q-card>

            <q-card>
                <q-card-section class="brand-description">
                    Международные конкурсы
                </q-card-section>
                <q-card-section>
                    <q-list>
                        <q-item v-for="achivement in body.achievementsInter">
                            <q-section class="!whitespace-normal !break-words brand-text">{{ achivement }}</q-section>
                        </q-item>
                    </q-list>
                </q-card-section>
            </q-card>
        </div>
    </div> -->

    <div class="flex flex-row justify-between px-4 py-4 !no-wrap">
        <div class="flex flex-col gap-y-4">
            <q-list>
                <q-item>
                    <q-item-section class="brand-description">
                        <q-item-label>
                            Родители
                        </q-item-label>
                        <q-separator  class="!my-2"/>
                        <q-item-label v-for="parent in body.parents" class="brand-text">
                            {{ parent }}
                        </q-item-label>
                    </q-item-section>
                </q-item>
                <q-item>
                    <q-item-section  class="!flex !flex-row !gap-x-2  !justify-start !items-center">
                        <q-icon
                            name="fa-regular fa-address-book"
                            size="32px"
                        />
                        <div>
                            <div class="brand-text">{{ body.mainPhone }}</div>
                            <div class="brand-text">{{ body.subPhone }}</div>
                        </div>
                    </q-item-section>
                </q-item>
                <q-item class="flex flex-row gap-x-2 items-center">
                    <q-icon name="fa-solid fa-heart-pulse" size="32px"/>
                    <div class="brand-text">{{ body.health  + ' группа' }}</div>
                </q-item>
                <q-item v-if="body.specAttention">
                    <q-item-section  class="!flex !flex-row gap-x-2 items-center">
                        <q-icon name="fa-solid fa-triangle-exclamation" size="32px" color="brand-danger"/>
                        <div class="brand-text">
                            Требует особого внимания
                        </div>
                    </q-item-section>
                </q-item>
                <q-item>
                    <q-item-section class="!flex !flex-row !max-w-[250px] !gap-x-1">
                        <q-chip
                        v-for="tutor in body.tutors">
                            {{ tutor.title }}
                        </q-chip>
                    </q-item-section>
                </q-item>
            </q-list>
        </div>
        <div class="flex flex-row gap-x-6 w-[70%]">
            <q-card color>
                <q-card-section class="brand-description">
                    <q-tabs
                        v-model="tab"
                        dense
                        class="!w-3/4 brand-description mb-4"
                        active-color="brand-velvet"
                        indicator-color="brand-velvet"
                        align="left"
                        narrow-indicator
                        >
                        <q-tab name="school" class="brand-description" label="Школьные конкурсы" />
                        <q-tab name="russian" class="brand-description" label="Всероссийские конкурсы" />
                        <q-tab name="international" class="brand-description" label="Международные конкурсы"/>
                    </q-tabs>
                </q-card-section>
                <q-card-section  class="!p-0">
                    <q-tab-panels
                    v-model="tab"
                    transition-next="slide-left"
                    transition-prev="slide-right"
                    animated>
                        <q-tab-panel name="school" class="!max-h-[200px] !overflow-y-auto !py-0">
                            <q-list>
                                <q-item v-for="achivement in body.schoolEvents">
                                    <q-section class="brand-text">{{ achivement }}</q-section>
                                </q-item>
                            </q-list>
                        </q-tab-panel>
                        <q-tab-panel name="russian" class="!max-h-[200px] !overflow-y-auto !py-0">
                            <q-list class="!max-h-[250px] !overflow-y-auto">
                                <q-item v-for="achivement in body.achievementsRus">
                                    <q-section class="brand-text">{{ achivement }}</q-section>
                                </q-item>
                            </q-list>
                        </q-tab-panel>
                        <q-tab-panel name="international" class="!max-h-[200px] !overflow-y-auto !py-0">
                            <q-list >
                                <q-item v-for="achivement in body.schoolEvents">
                                    <q-section class="brand-text">{{ achivement }}</q-section>
                                </q-item>
                            </q-list>
                        </q-tab-panel>
                    </q-tab-panels>
                </q-card-section>
            </q-card>
        </div>
        <q-fab class="!flex !flex-col self-start" unelevated color="inherit" text-color="black" icon="fa-solid fa-ellipsis" active-icon="fa-solid fa-ellipsis-vertical" direction="down">
            <q-fab-action color="brand-velvet" text-color="white" icon="edit" />
            <q-fab-action color="brand-velvet" text-color="white" icon="delete" />
        </q-fab>
    </div>
</template>

<style scoped>

.q-card{
    @apply !w-full
}

</style>