<script setup>
import {ref} from 'vue'

const statusFilter = ref("Все мероприятия")
const datesFilter = ref("Старые мероприятия")
const emit = defineEmits(['show-dialog']);

function onStatusClick(res){
  statusFilter.value=res
}

function onDateClick(res){
  datesFilter.value=res
}

</script>

<template>
    <div class="q-pa-md border-2 w-[90%] flex flex-row justify-between mx-3">
      <div class="flex flex-row items-center">
        <q-btn-dropdown class="shadow-xl rounded-[20pt] me-5 !normal-case" color="white" text-color="black" :label=statusFilter :menu-offset="[0, 5]">
          <q-list>
            <q-item clickable v-close-popup @click="onStatusClick('Все мероприятия')">
              <q-item-section>
                <q-item-label>Все мероприятия</q-item-label>
              </q-item-section>
            </q-item>
  
            <q-item clickable v-close-popup @click="onStatusClick('Созданные вами')">
              <q-item-section>
                <q-item-label>Созданные вами</q-item-label>
              </q-item-section>
            </q-item>
    
            <q-item clickable v-close-popup @click="onStatusClick('Созданные другими')">
              <q-item-section>
                <q-item-label>Созданные другими</q-item-label>
              </q-item-section>
            </q-item>
            
          </q-list>
        </q-btn-dropdown>
  
        <q-btn-dropdown class="shadow-xl rounded-[20pt] !normal-case" color="white" text-color="black" :label=datesFilter :menu-offset="[0, 5]">
          <q-list>
          <q-item clickable v-close-popup @click="onDateClick('Старые мероприятия')">
            <q-item-section>
              <q-item-label class="text-end">Дата</q-item-label>
            </q-item-section>
            <q-item-section>
              <q-icon name="fa-solid fa-arrow-up"/>
            </q-item-section>
          </q-item>

          <q-item clickable v-close-popup @click="onDateClick('Новые мероприятия')">
            <q-item-section>
              <q-item-label class="text-end">Дата</q-item-label>
            </q-item-section>
            <q-item-section>
              <q-icon name="fa-solid fa-arrow-down"/>
            </q-item-section>
          </q-item>

        </q-list>
        </q-btn-dropdown>
      </div>
      <q-btn class="!border-[5pt]  !bg-[--crm-c-light-yellow] !normal-case" unelevated text-color="black" icon-right="add" label="Добавить мероприятие" @click="$emit('show-dialog')"></q-btn>

    </div>
  </template>