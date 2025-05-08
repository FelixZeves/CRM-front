<script setup>
import { ref } from 'vue'

const open = ref(false)
const report = ref("")
</script>

<template>
    <button @click="open=true">
        Нашли ошибку?
    </button>
    <div v-if="open" class="start-0 top-0 fixed h-full w-full backdrop-blur z-50">
        <div class="modalError shadow-2xl">
            <div class="grayModal">
                <h4 class="pt-6 text-xl font-bold">Отчёт об ошибке</h4>
                <h5 class="text-md font-medium py-6 px-8">Если вы обнаружили ошибку, пожалуйста, сделайте скрин экрана (кнопка “Print screen” или же сочетание клавишь “Win”+”Shift”+”S”), прикрепите его к данному отчёту. Также опишите проблему в текстовом блоке.</h5>
                <input type="text" v-model="report" placeholder="Введите описание ошибки..." />
                <div class="buttons pt-5 text-sm font-medium">
                    <button @click="open = false" class="close">
                        Закрыть
                    </button>
                    <button class="flex content-center items-center addFile cursor-not-allowed">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-4">
                            <path stroke-linecap="round" stroke-linejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 0 0-3.375-3.375h-1.5A1.125 1.125 0 0 1 13.5 7.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H8.25m3.75 9v6m3-3H9m1.5-12H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 0 0-9-9Z" />
                        </svg>
                        Прикрепить файл
                    </button>
                    <button @click="open = false" class="sendReport cursor-not-allowed">
                        Отправить отчёт
                    </button>
                </div>
            </div>
        </div>
    </div>
</template>

<style>
@media(min-width: 800px){
    .modalError{
    background-color: white;
    position: fixed;
    top: 15%;
    left: 30%;
    width: 700px;
    height: 600px;
    border-radius: 20pt;
    z-index: 1000;
    justify-items: center;
    align-content: center;
}}

@media(min-width: 1540px){
    .modalError{
    background-color: white;
    position: fixed;
    top: 15%;
    left:30%;
    width: 700px;
    height: 600px;
    border-radius: 20pt;
    z-index: 1000;
    justify-items: center;
    align-content: center;
}}

.grayModal{
    height:90%;
    width:90%;
    background-color: var(--vt-c-white-mute);
    border-radius: 20pt;
}
.modalError *{
    color:black;
}

.modalError input{
    height: 200px;
    width: 90%;
}

.modalError input::placeholder{
    position: fixed;
    transition: 0.3s;
    top:10%;
}

.modalError input:focus::placeholder{
    opacity: 0;
}

.modalError label, input{
    border-color: var(--crm-c-medium-gray);
    border-width: 1px;
    border-radius: 10pt;
    padding-left: 20px;
}

.modalError .buttons{
    display: flex;
    justify-self: center;
    width: 80%;
    justify-content: space-between;
}

.buttons button{
    height: 30px;
    width: 150px;
    border-radius: 20pt;
}

.buttons .close{
    background-color: white;
    border-color: var(--crm-c-medium-gray);
    border-width: 1.5pt;
}

.buttons .close:hover{
    background-color: var(--vt-c-white-mute);
}

.buttons .addFile{
    padding-inline-start: 5px;
    background-color: var(--crm-c-light-yellow);
    border-color: var(--crm-c-dark-yellow);
    border-width: 1.5pt;
}

.buttons .addFile:hover{
    background-color: var(--crm-c-yellow);
}

.buttons .sendReport{
    background-color: var(--crm-c-light-velvet);
    border-color: var(--crm-c-velvet);
    border-width: 1.5pt;
}

.buttons .sendReport:hover{
    background-color: var(--crm-c-velvet);
}

</style>