<script setup>
import { onMounted, ref } from 'vue'
import ModalError from '@/components/forms/BugReport.vue'
import { LocalStorage, SessionStorage } from 'quasar'

const props = defineProps(['name', 'section'])
const fio = ref("");
const role = ref("");
const defaultPass =  ref(false)
const visibleBugReport = ref(false);

async function getUser(){
    const me = SessionStorage.getItem('user')

    fio.value = me.profile.initials_name
    role.value = me.role
    defaultPass.value = me.default_pass

}

onMounted(async () => {await getUser()})
</script>

<template>
    <div class="!flex !flex-col p-4 bg-[--crm-c-dark-velvet] rounded-[15pt] min-h-[80vh] justify-between">

        <div class="flex flex-col gap-y-3 items-center">
            <q-btn :to="{name: 'Office'}" flat>
            <div class="flex flex-col items-center">
                <q-img src="@\assets\worker-photo.jpg" class="!rounded-full" width="90%" height="90%"></q-img>
                <span class="brand-description !font-bold mt-2" :class="section == 'Office' ? 'text-brand-wait' : 'text-white'">{{ fio }}</span>
            </div>
            </q-btn>
            <q-btn 
            flat
            disable
            class="cursor-not-allowed brand-description"
            label="Учебная деятельность"
            :class="section == 'Education' ? 'text-brand-wait' : 'text-white'"/>
            <q-btn
            flat
            class="brand-description"
            :class="section == 'Tasks' ? 'text-brand-wait' : 'text-white'"
            :to="{name : 'Tasks'}"
            label="Задачи"/>
            <q-btn
            flat
            class="brand-description"
            :class="section == 'Events' ? 'text-brand-wait' : 'text-white'"
            :to="{name : 'Events'}"
            label="Мероприятия"/>
            <q-btn
            flat
            class="brand-description"
            :class="section == 'Documents' ? 'text-brand-wait' : 'text-white'"
            :to="{name : 'Documents'}"
            label="Документы"/>
            <q-btn 
            flat
            class="brand-description"
            label="Архив"
            :to="{name : 'Archive'}"
            :class="section == 'Archive' ? 'text-brand-wait' : 'text-white'"/>
            <q-btn
            v-if="role == 0"
            flat
            label="Админ. панель"
            class="text-white brand-title"
            :to="{name : 'Database'}">
            </q-btn>
        </div>

        <div class="flex flex-col gap-y-4 items-center">
            <q-btn @click="visibleBugReport = true" label="Нашли ошибку?" color="brand-white brand-description" unelevated>
            <ModalError v-model:visible="visibleBugReport" />
            </q-btn>
            <q-btn flat class="text-white brand-description" @click="localStorage.removeItem('jwtToken')" to="/" label="Выйти"></q-btn>
        </div>
    </div>
</template>

<style scoped>

.q-hoverable:hover {
    background-image: linear-gradient(to right, var(--crm-c-velvet), var(--crm-c-light-velvet), var(--crm-c-light-velvet));
    opacity: 1;
}

.q-btn{
    @apply !font-bold !w-[90%]
}

</style>