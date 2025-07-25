<script setup>
import {ref} from 'vue'

const emit = defineEmits(['show-dialog']);

const sortFilters = ref ({deadline: {key: "desc", label:'Сначала новые', icon: 'fa-solid fa-arrow-down'}, is_creator: {key: null, label: "Все мероприятия"}})

function filterChanging(filter, val){
  sortFilters.value[filter] = val
}

</script>

<template>
    <div class="q-pa-md border-2 w-[98%] flex flex-row justify-between justify-self-center">
      <div class="flex flex-row items-center">
        <q-btn-dropdown class="brand-description me-5 !w-[240px]" color="white" text-color="black" :menu-offset="[0, 5]">
          <template v-slot:label>
            <span class="text-start flex-grow">{{ sortFilters.is_creator.label }}</span>
          </template>
          <q-list class="brand-description">
            <q-item clickable v-close-popup @click="filterChanging('is_creator', {key: null, label: 'Все мероприятия'})">
              <q-item-section>
                <q-item-label>Все создатели</q-item-label>
              </q-item-section>
            </q-item>

            <q-item clickable v-close-popup @click="filterChanging('is_creator', {key: true, label: 'Созданные мной'})">
              <q-item-section>
                <q-item-label>Созданные мной</q-item-label>
              </q-item-section>
            </q-item>

            <q-item clickable v-close-popup @click="filterChanging('is_creator', {key: false, label: 'Созданные другими'})">
              <q-item-section>
                <q-item-label>Созданные другими</q-item-label>
              </q-item-section>
            </q-item>
          </q-list>
        </q-btn-dropdown>
  
        <q-btn-dropdown class="brand-description !w-[225px]" color="white" text-color="black":menu-offset="[0, 5]">
          <template v-slot:label>
            <span class="text-start">{{ sortFilters.deadline.label }}</span>
            <q-icon class="flex-grow" :name="sortFilters.deadline.icon" size="14px" />
          </template>
          <q-list>
            <q-item clickable v-close-popup @click="filterChanging('deadline', {key: 'desc', label:'Сначала новые', icon: 'fa-solid fa-arrow-down'})">
              <q-item-section class="!flex !flex-row items-center">
                <q-item-label class="brand-description pe-4">Сначала новые</q-item-label>
                <q-icon name="fa-solid fa-arrow-down"/>
              </q-item-section>
            </q-item>

            <q-item clickable v-close-popup @click="filterChanging('deadline', {key: 'asc', label:'Сначала старые', icon: 'fa-solid fa-arrow-up'})">
              <q-item-section class="!flex !flex-row items-center">
                <q-item-label class="brand-description pe-4">Сначала старые</q-item-label>
                <q-icon name="fa-solid fa-arrow-up"/>
              </q-item-section>
            </q-item>
          </q-list>
        </q-btn-dropdown>
      </div>
      <q-btn color="brand-wait" unelevated text-color="black" icon-right="add" label="Создать" @click="$emit('show-dialog')"></q-btn>

    </div>
  </template>