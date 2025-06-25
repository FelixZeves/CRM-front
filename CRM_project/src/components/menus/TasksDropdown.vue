<script setup>
import { update } from 'immutable';
import {ref} from 'vue'

const emit = defineEmits(['show-dialog'])

const statusFilter = ref("Все состояния задач")

const datesFilter = ref("Старые задачи")

function onStatusClick(res){
  statusFilter.value=res
}

function onDateClick(res){
  datesFilter.value=res
}

</script>

<template>
  <div class="q-pa-md border-2 w-[95%] flex flex-row justify-between justify-self-center mx-2">
    <div class="flex flex-row items-center">
      <q-btn-dropdown
      :menu-offset="[0, 5]"
      class="shadow-xl me-5"
      color="white"
      text-color="black"
      :label=statusFilter>
        <q-list>
          <q-item clickable v-close-popup @click="onStatusClick('Все состояния задач')">
            <q-item-section>
              <q-item-label>Все состояния задач</q-item-label>
            </q-item-section>
          </q-item>

          <q-item clickable v-close-popup @click="onStatusClick('Ожидает выполнения')">
            <q-item-section>
              <q-item-label>Ожидает выполения</q-item-label>
            </q-item-section>
          </q-item>
  
          <q-item clickable v-close-popup @click="onStatusClick('На согласовании')">
            <q-item-section>
              <q-item-label>На согласовании</q-item-label>
            </q-item-section>
          </q-item>
  
          <q-item clickable v-close-popup @click="onStatusClick('Выполнено')">
            <q-item-section>
              <q-item-label>Выполнено</q-item-label>
            </q-item-section>
          </q-item>
        </q-list>
      </q-btn-dropdown>

      <q-btn-dropdown
      :menu-offset="[10, 5]"
      class="shadow-xl"
      color="white"
      text-color="black"
      :label=datesFilter>
        <q-list>
          <q-item clickable v-close-popup @click="onDateClick('Старые задачи')">
            <q-item-section>
              <q-item-label class="text-end">Дата</q-item-label>
            </q-item-section>
            <q-item-section>
              <q-icon name="fa-solid fa-arrow-up"/>
            </q-item-section>
          </q-item>

          <q-item clickable v-close-popup @click="onDateClick('Новые задачи')">
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
    <q-btn class="!bg-[--crm-c-light-yellow]" unelevated text-color="black" icon-right="add" label="Создать" @click="$emit('show-dialog')"></q-btn>
  </div>
  </template>