<script setup>
import { ref } from 'vue'

const passwordVerification = ref("")
const password = ref("")


function passwordCheck(){
    return password.value == passwordVerification.value && password.value
}
</script>

<template>
    <div id="authorizationBody" class="shadow-2xl">
        <h2 class="underline decoration-2 underline-offset-8 font-medium">Смена пароля</h2>

        <input type="text" v-model="password" class="inputDiv" placeholder="Пароль" />

        <input type="text" v-model="passwordVerification" class="inputDiv" placeholder="Повторите пароль" />

        <RouterLink class="velvetButton text-2xl" v-if="passwordCheck()" to="/Office">Войти</RouterLink>
        <div v-else>
            <button class="velvetButton text-2xl cursor-not-allowed">Войти</button>
            <div class="verificationError">Проверьте введённые пароли</div>
        </div>
    </div>
</template>

<style>
#authorizationBody{
    display: block;
    width: 665px;
    height: 560px;
    border-radius: 20pt;
    background: white;
}

#authorizationBody h2{
    text-align: center;
    padding-top: 7%;
    padding-bottom: 5%;
    color: black;
    font-size: 32px;
}

.inputDiv{
    display: flex;
    justify-self: center;
    width: 465px;
    height: 55px;
    border-radius: 30pt;
    border-color: var(--crm-c-medium-gray);
    border-width: 0.5pt;
    background-color: var(--vt-c-white-mute);
    margin: 7%;
    padding-left: 3%;
    font-size: 16px;
}

.inputDiv:focus::placeholder{
    transition: 0.3s;
    opacity: 0;
}

.inputDiv:hover{
    border-color: var(--crm-c-medium-gray);
}

.velvetButton{
    display: flex;
    justify-self: center;
    justify-content: center;
    align-items: center;
    width: 250px;
    height: 55px;
    background-color: var(--crm-c-light-velvet);
    border-radius: 30pt;
    border-color: var(--crm-c-velvet);
    margin-top: 14%;
    border-width: 2pt;
    color: white;
}

.velvetButton:hover{
    background-color: var(--crm-c-velvet);
}

.verificationError{
    margin-top: 15px;
    justify-self: center;
    margin-left: 10%;
    margin-right: 10%;
    color: red;
}

</style>