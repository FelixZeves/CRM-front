<script setup>
import axios from 'axios'
import { ref } from 'vue'
import ModalError from '@/components/forms/BugReport.vue';
import TaskCreationDialog from '@/components/forms/AddTask.vue';

const props = defineProps(['name', 'role', 'section'])
const fio = ref("");
const role = ref("");
const visibleBugReport = ref(false);

async function getUser(){

    try {
        const response = await axios.get('/api/user/me');

        fio.value = response.data.profile.initials_name;
        role.value = response.data.role;
        
    } catch (error) {
        console.error('Ошибка авторизации:', error.response?.data || error.message);
    }

}

getUser()

</script>

<template>
        <div id="navigationBody">
            <RouterLink :to="{name: 'Office'}" class="w-full flex flex-col items-center">
                <div id="person" class="q-hoverable">
                    <img class="select-none" src="@\assets\worker-photo.jpg" alt="">
                    <h3 v-if="section == 'Office'" class="select-none activeSection">{{ fio }}</h3>
                    <h3 v-else class="select-none">{{ fio }}</h3>
                </div>
            </RouterLink>
            
            <p class="cursor-not-allowed select-none">Учебная деятельность</p>
            <RouterLink :to="{name : 'Tasks'}" class="select-none">
                <p v-if="section == 'Tasks'" class="select-none activeSection q-hoverable">Задачи</p>
                <p v-else class="select-none q-hoverable">Задачи</p>
            </RouterLink>
            <RouterLink :to="{name : 'Events'}" class="select-none">
                <p v-if="section == 'Events'" class="select-none activeSection q-hoverable">Мероприятия</p>
                <p v-else class="select-none q-hoverable">Мероприятия</p>
            </RouterLink>
            <RouterLink :to="{name : 'Documents'}" class="select-none">
                <p v-if="section == 'Documents'" class="select-none activeSection q-hoverable">Документы</p>
                <p v-else class="select-none q-hoverable">Документы</p>
            </RouterLink>
            <Suspense>
                <q-btn-dropdown
                flat
                label="Создать"
                dropdown-icon="sym_o_play_arrow"
                menu-anchor="top end"
                menu-self="top start"
                :menu-offset="[25, 0]"
                content-style="border-radius: 20pt;"
                style="width: 95%;
                height: 50px;
                justify-content: center;
                align-items: center;
                margin-bottom: 5%;
                padding-left: 45px;
                color:white;
                font-size: 16px;
                text-align: center;
                font-weight: bold;
                text-transform: capitalize;">
                    <q-list style="background-color: var(--crm-c-dark-velvet); border-radius: 5pt; color: white; text-align: center; font-size: 16px; font-weight: bold;" class="py-[8px] px-[12px]">
                        <q-item v-if="role != 3" clickable style="border-radius: 10pt;">
                            <TaskCreationDialog
                            taskType="task">
                            </TaskCreationDialog>
                        </q-item>
                        <q-separator v-if="role != 3" spaced inset size="1px" style="background-color: var(--crm-c-velvet);"></q-separator>
                        <q-item clickable style="border-radius: 10pt;">
                            <TaskCreationDialog
                            taskType="application">
                            </TaskCreationDialog>
                        </q-item>
                        <q-separator spaced inset size="1px" style="background-color: var(--crm-c-velvet);"></q-separator>
                        <q-item clickable style="border-radius: 10pt;">
                            <TaskCreationDialog
                            taskType="memo">
                            </TaskCreationDialog>
                        </q-item>
                    </q-list>
                </q-btn-dropdown>
            </Suspense>
            <p class="cursor-not-allowed select-none q-hoverable">Архив</p>
            <q-btn @click="visibleBugReport = true" label="Нашли ошибку?" color="brand-white">
                <ModalError v-model:visible="visibleBugReport" />
            </q-btn>
            <RouterLink class="v-link q-hoverable" to="/">Выйти</RouterLink>
        </div> 
</template>

<style scoped>
#navigationBody{
display: flex;
flex-direction: column;
justify-content: center;
height: 650px;
width: 200px;
background-color: var(--crm-c-dark-velvet);
border-radius: 20pt;
padding: 7%;
}

#navigationBody #additionalButton{
    margin-top: 5%;
}

@media(min-width: 1024px){
    #navigationBody{
    display: flex;
    flex-direction: column;
    justify-content: center;
    height: 690px;
    width: 210px;
    background-color: var(--crm-c-dark-velvet);
    border-radius: 20pt;
    padding: 7%;
    }

    #navigationBody #additionalButton{
        margin-top: 25%;
    }
}

@media(min-width: 1536px){
    #navigationBody{
    display: flex;
    flex-direction: column;
    justify-content: center;
    height: 720px;
    width: 210px;
    background-color: var(--crm-c-dark-velvet);
    border-radius: 20pt;
    padding: 7%;
    }

    #navigationBody #additionalButton{
        margin-top: 35%;
    }
}

#navigationBody img{
    border-radius: 50%;
    display: flex;
    justify-self: center;
    height: 100px;
    width: 100px;
}

#navigationBody h3, #navigationBody p, #navigationBody .v-link{
    display: flex;
    justify-self: center;
}

#person{
    padding: 5%;
    padding-bottom: 0%;
    border-radius: 10pt;
}

.activeSection{
    color: var(--crm-c-light-yellow) !important;
}

#person h3{
    align-self: center;
    justify-self: center;
    width: 100%;
    margin-top: 5%;
    margin-bottom: 10%;
    font-size: 20px;
    font-weight: bold;
    color:white;
}


#navigationBody p, #navigationBody .v-link{
    width: 95%;
    height: 50px;
    border-radius: 10pt;
    justify-content: center;
    align-items: center;
    margin-bottom: 5%;
    color:white;
    font-size: 16px;
    text-align: center;
    font-weight: bold;
}

.q-menu{
    border-radius: 20px;
}

/* #navigationBody .v-link:hover, #navigationBody p:hover, #navigationBody #person:hover {
    background-image: linear-gradient(to right, var(--crm-c-velvet), var(--crm-c-light-velvet), var(--crm-c-light-velvet));
} */

.q-hoverable:hover {
    background-image: linear-gradient(to right, var(--crm-c-velvet), var(--crm-c-light-velvet), var(--crm-c-light-velvet));
    opacity: 1;
}

/* .q-menu{
    background: transparent !important;
    box-shadow: none !important;
} */

</style>