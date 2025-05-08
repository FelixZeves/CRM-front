<script setup>
import { ref } from 'vue'

const eventCreation = ref(false)

const eventName = ref("")

const eventDescription = ref("")

const eventPlace = ref("")

function getTodayDate() {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, '0');
    const day = String(today.getDate()).padStart(2, '0');
    return `${day}/${month}/${year}`;
}

const eventDateSolo = ref(getTodayDate())

const eventDateRange = ref({ from: getTodayDate(), to: getTodayDate() })

const datepickerType = ref("one")
const datepickerName = ref("Один день")

function changeDateType(){
    datepickerType.value = (datepickerType.value == "one") ? "two" : "one"
    datepickerName.value = (datepickerType .value== "one") ? "Один день" : "Диапазон"
}

const props = defineProps(['iconNeed'])

</script>


<template>

    <q-btn v-if="iconNeed" style="background: var(--crm-c-light-yellow); text-transform:none; border-radius: 5pt;" unelevated text-color="black" icon-right="add" label="Добавить мероприятие" @click="eventCreation = true"></q-btn>
    <q-btn v-else style="background: var(--crm-c-light-yellow); text-transform:none;  border-radius: 5pt;" size="md" unelevated rounded text-color="black" label="Добавить мероприятие" @click="eventCreation = true"></q-btn>
    
    <q-dialog v-model="eventCreation" backdrop-filter="blur(4px)">
        <q-card style="max-width: 75%; min-width: 50%;" class="py-4 !rounded-[20px]">
            <q-card-section>
                <p class="text-lg text-black mb-2 ps-3 underline underline-offset-[6px]">Название мероприятия</p>
                <q-input
                    v-model="eventName"
                    :rules="[val => val && val.length > 0 || 'Введите название мероприятия']"
                    hide-bottom-space
                    dense
                    borderless
                    color="black"
                    label-color="black"
                    placeholder="Введите название мероприятия..."
                    class="ps-4 bg-[--vt-c-white-mute] !rounded-[10pt] border-[0.5pt] border-[--crm-c-medium-gray]">

                </q-input>
            </q-card-section>

            <q-card-section>
                <p class="text-lg text-black mb-2 ps-3 underline underline-offset-[6px]">Описание мероприятия</p>
                <q-input
                    v-model="eventDescription"
                    :rules="[val => val && val.length > 0 || 'Введите описание мероприятия']"
                    hide-bottom-space
                    dense
                    borderless
                    color="black"
                    label-color="black"
                    placeholder="Введите описание мероприятия..."
                    class="ps-4 bg-[--vt-c-white-mute] !rounded-[10pt] border-[0.5pt] border-[--crm-c-medium-gray]">
                </q-input>
            </q-card-section>
    
            <q-card-section>
                <p class="text-lg text-black mb-2 ps-3 underline underline-offset-[6px]">Место проведения</p>
                <q-input
                    v-model="eventPlace"
                    :rules="[val => val && val.length > 0 || 'Введите место проведения мероприятия']"
                    hide-bottom-space
                    dense
                    borderless
                    color="black" 
                    label-color="black"
                    placeholder="Место проведения мероприятия..."
                    class="ps-4 bg-[--vt-c-white-mute] !rounded-[10pt] border-[0.5pt] border-[--crm-c-medium-gray]">
                </q-input>
            </q-card-section>

            <q-card-section style="padding-left: 0; padding-right: 0;">
                
                <div class="flex flex-row justify-between ">
                    <div class="w-1/2 flex flex-col justify-between items-center">
                        <p class="text-lg text-black mb-2 underline underline-offset-[6px]">Формат мероприятия</p>
                        <q-btn @click="changeDateType()" style="margin-bottom: 16px; border-radius: 5pt; background: white; border-width: 0.5pt; border-color: var(--crm-c-medium-gray);">
                                <q-icon name="chevron_left" style="padding-right: 10px;"></q-icon>
                            {{ datepickerName }}
                                <q-icon name="navigate_next" style="padding-left: 10px;"></q-icon>
                        </q-btn>
                    </div>
                    <div class="w-1/2 flex flex-col justify-between items-center">
                        <p class="text-lg text-black mb-2 underline underline-offset-[6px]">Время проведения</p>
                        <q-tab-panels v-model="datepickerType" animated transition-next="slide-right" transition-prev="slide-left">
                            <q-tab-panel name="one" style="justify-items: center;">
                                    <q-input
                                    style="background: var(--crm-c-light-yellow); border-radius: 5pt; padding-left: 5pt; padding-right: 5pt; width: 75%"
                                    input-style="background-color: white; height:75%; align-self: center; border-radius: 5pt; padding-left: 5px; padding-right: 5px; justify-items: center"
                                    mask="## | ## | ####"
                                    dense
                                    borderless
                                    v-model="eventDateSolo" >
                                    <template v-slot:append>
                                        <q-icon name="event" class="cursor-pointer">
                                        <q-popup-proxy cover transition-show="scale" transition-hide="scale">
                                            <q-date minimal mask="DD/MM/YYYY" v-model="eventDateSolo">
                                                <div class="row items-center justify-end">
                                                    <q-btn v-close-popup color="primary" flat>
                                                        <q-icon name="close"></q-icon>
                                                    </q-btn>
                                                </div>
                                            </q-date>
                                        </q-popup-proxy>
                                        </q-icon>
                                    </template>
                                    </q-input>
                            </q-tab-panel>
        
                            <q-tab-panel name="two" style="justify-items: center;">
                                <div class="flex flex-row">
                                    <q-input
                                        style="background: var(--crm-c-light-yellow); border-start-start-radius: 5pt; border-end-start-radius: 5pt; padding-left: 5pt; padding-right: 5pt; width: 45%"
                                        input-style="background-color: white; height:75%; align-self: center; border-radius: 5pt; padding-left: 5px; padding-right: 5px; justify-items: center"
                                        mask="## | ## | ####"
                                        dense
                                        borderless
                                        v-model="eventDateRange.from" >
                                    </q-input>
                                    <q-input
                                        style="background: var(--crm-c-light-yellow); border-start-end-radius: 5pt; border-end-end-radius: 5pt; border-left-width: 1px; border-color: var(--vt-c-white-mute); padding-left: 5pt; padding-right: 5pt; width: 55%;"
                                        input-style="background-color: white; height:75%; align-self: center; border-radius: 5pt; padding-left: 5px; padding-right: 5px; justify-items: center"
                                        mask="## | ## | ####"
                                        dense
                                        borderless
                                        v-model="eventDateRange.to" >
                                    <template v-slot:append>
                                        <q-icon name="event" class="cursor-pointer">
                                        <q-popup-proxy cover transition-show="scale" transition-hide="scale">
                                            <q-date minimal mask="DD/MM/YYYY" v-model="eventDateRange" range>
                                                <div class="row items-center justify-end">
                                                    <q-btn v-close-popup color="primary" flat>
                                                        <q-icon name="close"></q-icon>
                                                    </q-btn>
                                                </div>
                                            </q-date>
                                        </q-popup-proxy>
                                        </q-icon>
                                    </template>
                                    </q-input>
                                </div>
                            </q-tab-panel>
                        </q-tab-panels>
                    </div>
                </div>
            </q-card-section>
    
            <q-card-actions align="center">
                <q-btn label="Создать" type="submit" style="background: var(--crm-c-light-velvet); width: 25%; border-radius: 5pt;" text-color="white" v-close-popup />
            </q-card-actions>
        </q-card>
    </q-dialog>
</template>