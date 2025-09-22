<script setup>
import { ref } from 'vue'

const props = defineProps(['body'])
const ach = [
    {label: 'Олимпиады и мероприятия',
    children: [
        {label: 'Школьные мероприятия', children: [{label: 'Олимпиада "Кенгуру"'}, {label: 'Олимпиада "Медвежонок"'}]},
        {label: 'Всероссийские мероприятия', children: [{label: 'Олимпиада "Кенгуру"'}, {label: 'Олимпиада "Медвежонок"'}]},
        {label: 'Международные мероприятия', children: [{label: 'Олимпиада "Кенгуру"'}, {label: 'Олимпиада "Медвежонок"'}]},
    ]
    }]

const tab = ref('school')

</script>

<template>
    <q-list class="row items-start">
        <q-item>
            <q-item-section>
                <q-item-label class="brand-text font-medium">Родители</q-item-label>
                <q-item-label v-for="parent in body.parents" class="brand-text !font-light"> <q-icon name="fa-solid fa-user" size="12px"/> {{ parent }}</q-item-label>
            </q-item-section>
        </q-item>
        <q-item>
            <q-item-section>
                <q-item-label class="brand-text font-medium">Телефон</q-item-label>
                <q-item-label class="brand-text !font-light"> <q-icon name="fa-solid fa-phone" size="12px"/> 8(929)-123-45-56</q-item-label>
                <q-item-label class="brand-text !font-light"> <q-icon name="fa-solid fa-phone" size="12px"/> 5-64-88</q-item-label>
            </q-item-section>
        </q-item>
        <q-item>
            <q-item-section>
                <q-item-label class="brand-text font-medium"> Физическое состояние</q-item-label>
                <q-item-label class="brand-text !font-light"><q-icon name="fa-solid fa-heart-pulse" size="12px"/> 3 группа здоровья</q-item-label>
                <q-item-label class="brand-text !font-light text-orange-6"><q-icon name="fa-solid fa-triangle-exclamation" size="12px" color="orange-6"/> Требует особого внимания</q-item-label>
            </q-item-section>
        </q-item>
        <q-item>
            <q-item-section>
                <q-item-label class="brand-text font-medium"> Репетиторы</q-item-label>
                <q-item-label v-for="tutor in body.tutors" caption  class="brand-text !font-light">- {{tutor.title}}</q-item-label>
            </q-item-section>
        </q-item>
        <q-tree :nodes="ach" dense no-connectors accordion node-key="label">
            <template v-slot:default-header="prop">
                <div class="brand-text !font-light">{{ prop.node.label }}</div>
            </template>
        </q-tree>
    </q-list>
    <q-list class="row items-start">
        <q-item>
            <q-item-section class="gap-2">
                <q-item-label class="brand-text font-medium">Родители</q-item-label>
                <q-input
                    v-for="parent in body.parents"
                    hide-bottom-space
                    dense
                    outlined
                    type="text"
                    class="brand-text !font-light"
                />
                <q-item-label class="brand-text !font-light brand-velvet"><q-btn class="brand-description" label="Добавить" flat color="brand-velvet" icon="add"/></q-item-label>
            </q-item-section>
        </q-item>
        <q-item>
            <q-item-section class="gap-2">
                <q-item-label class="brand-text font-medium">Телефон</q-item-label>
                <q-input
                    hide-bottom-space
                    dense
                    outlined
                    label="Основной"
                    type="text"
                    class="brand-text !font-light"
                />
                <q-input
                    hide-bottom-space
                    dense
                    outlined
                    label="Дополнительный"
                    type="text"
                    class="brand-text !font-light"
                />
            </q-item-section>
        </q-item>
        <q-item>
            <q-item-section>
                <q-item-label class="brand-text font-medium"> Физическое состояние</q-item-label>
                <q-item-label class="brand-text !font-light"><q-icon name="fa-solid fa-heart-pulse" size="12px"/> 3 группа здоровья</q-item-label>
                <q-item-label class="brand-text !font-light text-orange-6"><q-icon name="fa-solid fa-triangle-exclamation" size="12px" color="orange-6"/> Требует особого внимания</q-item-label>
            </q-item-section>
        </q-item>
        <q-item>
            <q-item-section>
                <q-item-label class="brand-text font-medium"> Репетиторы</q-item-label>
                <q-item-label v-for="tutor in body.tutors" caption  class="brand-text !font-light">- {{tutor.title}}</q-item-label>
            </q-item-section>
        </q-item>
        <q-tree :nodes="ach" dense no-connectors accordion node-key="label">
            <template v-slot:default-header="prop">
                <div class="brand-text !font-light">{{ prop.node.label }}</div>
            </template>
        </q-tree>
    </q-list>
    <q-fab class="!flex !flex-col self-start" unelevated color="inherit" text-color="black" icon="fa-solid fa-ellipsis" active-icon="fa-solid fa-ellipsis-vertical" direction="down">
        <q-fab-action color="brand-velvet" text-color="white" icon="edit" />
        <q-fab-action color="brand-velvet" text-color="white" icon="delete" />
    </q-fab>
</template>

<style scoped>

.q-card{
    @apply !w-full
}

</style>