<script setup>
import {ref} from 'vue'
import { CreatorEnum } from '../Enums.vue';

const emit = defineEmits(['show-dialog', 'apply-filters']);

const creators = Object.values(CreatorEnum)
const sortFilters = ref ({sort: {key: "desc", label:'Сначала новые', icon: 'fa-solid fa-arrow-down'}, is_creator: {key: null, title: "Все создатели"}})

function filterChanging(filter, val){
  sortFilters.value[filter] = val
}

const buildQueryParams = () => {
  const params = {};
  for (const [key, filter] of Object.entries(sortFilters.value)) {
      if (filter.key !== null) {
      params[key] = filter.key;
    }
  }
  return params;
}

function applyFilters() {
  const params = buildQueryParams();
  emit('apply-filters', params);
}

</script>

<template>
    <div class="q-pa-md border-2 w-[98%] flex flex-row justify-between justify-self-center">
      <div class="flex flex-row items-center gap-x-5">
        <q-btn-dropdown class="brand-description !w-[240px]" color="white" text-color="black" :menu-offset="[0, 5]">
          <template v-slot:label>
            <span class="text-start flex-grow">{{ sortFilters.is_creator.title }}</span>
          </template>
          <q-list class="brand-description">
            <q-item v-for="creator in creators" clickable v-close-popup @click="filterChanging('is_creator', creator)">
              <q-item-section>
                <q-item-label>{{creator.title}}</q-item-label>
              </q-item-section>
            </q-item>
          </q-list>
        </q-btn-dropdown>
  
        <q-btn-dropdown class="brand-description !w-[225px]" color="white" text-color="black":menu-offset="[0, 5]">
          <template v-slot:label>
            <span class="text-start">{{ sortFilters.sort.label }}</span>
            <q-icon class="flex-grow" :name="sortFilters.sort.icon" size="14px" />
          </template>
          <q-list>
            <q-item clickable v-close-popup @click="filterChanging('sort', {key: 'desc', label:'Сначала новые', icon: 'fa-solid fa-arrow-down'})">
              <q-item-section class="!flex !flex-row items-center !justify-start">
                <q-item-label class="brand-description pe-[25px]">Сначала новые</q-item-label>
                <q-icon name="fa-solid fa-arrow-down"/>
              </q-item-section>
            </q-item>

            <q-item clickable v-close-popup @click="filterChanging('sort', {key: 'asc', label:'Сначала старые', icon: 'fa-solid fa-arrow-up'})">
              <q-item-section class="!flex !flex-row items-center !justify-start">
                <q-item-label class="brand-description pe-4">Сначала старые</q-item-label>
                <q-icon name="fa-solid fa-arrow-up"/>
              </q-item-section>
            </q-item>
          </q-list>
        </q-btn-dropdown>
        <q-btn color="brand-velvet" unelevated  label="Фильтровать" class="!flex !justify-self-end" @click="applyFilters"></q-btn>
      </div>
      <q-btn color="brand-wait" unelevated text-color="black" icon-right="add" label="Создать" @click="$emit('show-dialog')"></q-btn>

    </div>
  </template>