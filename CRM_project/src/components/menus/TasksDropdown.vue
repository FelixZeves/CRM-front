<script setup>
import {ref} from 'vue'
import { CreatorEnum, TaskDocEnum, TaskStatusEnum } from '@/components/Enums.vue'

const emit = defineEmits(['show-dialog', 'apply-filters'])

const taskStatuses = Object.values(TaskStatusEnum)
const creators = Object.values(CreatorEnum)
const types = Object.values(TaskDocEnum)

const sortFilters = ref ({status: {key: null, title: "Все статусы"}, sort: {key: "desc", title:'Сначала новые', icon: 'fa-solid fa-arrow-down'}, is_creator: {key: null, title: "Все создатели"}, type: {key: null, title: "Все типы"}})

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
  <div class="q-pa-md border-2 w-[97%] flex flex-row justify-between justify-self-center">
    <div class="flex flex-row items-center">
      <q-btn-dropdown
      :menu-offset="[0, 5]"
      menu-anchor="bottom left"
      menu-self="top left"
      color="white" text-color="black" label="Фильтры"  class="brand-description">
        <div class="p-4 flex flex-col gap-y-4 w-[600px]">
          <div class="flex flex-row gap-x-6 !flex-nowrap">
            <q-btn-dropdown
            :menu-offset="[0, 5]"
            unelevated
            class="brand-description !w-[50%]"
            color="brand-grey"
            text-color="black">
              <template v-slot:label>
                <span class="text-start flex-grow">{{ sortFilters.status.title }}</span>
              </template>
              <q-list class="brand-description">
                <q-item v-for="status in taskStatuses" clickable v-close-popup @click="filterChanging('status', status)">
                  <q-item-section>
                    <q-item-label>{{ status.title }}</q-item-label>
                  </q-item-section>
                </q-item>
              </q-list>
            </q-btn-dropdown>

            <q-btn-dropdown
            :menu-offset="[0, 5]"
            class="brand-description !flex-grow"
            unelevated
            color="brand-grey"
            text-color="black">
              <template v-slot:label>
                <span class="text-start">{{ sortFilters.sort.title }}</span>
                <q-icon class="flex-grow" :name="sortFilters.sort.icon" size="14px" />
              </template>
              <q-list>
                <q-item clickable v-close-popup @click="filterChanging('sort', {key: 'desc', title:'Сначала новые', icon: 'fa-solid fa-arrow-down'})">
                  <q-item-section class="!flex !flex-row items-center !justify-start">
                    <q-item-label class="brand-description pe-[25px]">Сначала новые</q-item-label>
                    <q-icon name="fa-solid fa-arrow-down"/>
                  </q-item-section>
                </q-item>

                <q-item clickable v-close-popup @click="filterChanging('sort', {key: 'asc', title:'Сначала старые', icon: 'fa-solid fa-arrow-up'})">
                  <q-item-section class="!flex !flex-row items-center !justify-start">
                    <q-item-label class="brand-description pe-4">Сначала старые</q-item-label>
                    <q-icon name="fa-solid fa-arrow-up"/>
                  </q-item-section>
                </q-item>
              </q-list>
            </q-btn-dropdown>
          </div>

          <div class="flex flex-row gap-x-6 !flex-nowrap">
            <q-btn-dropdown
            :menu-offset="[0, 5]"
            class="brand-description !w-[50%]"
            unelevated
            color="brand-grey"
            text-color="black">
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

            <q-btn-dropdown
            :menu-offset="[0, 5]"
            class="brand-description !flex-grow"
            unelevated
            color="brand-grey"
            text-color="black">
            <template v-slot:label>
                <span class="text-start flex-grow">{{ sortFilters.type.title }}</span>
              </template>
              <q-list class="brand-description">
                <q-item v-for="type in types" clickable v-close-popup @click="filterChanging('type', type)">
                  <q-item-section>
                    <q-item-label>{{ type.title }}</q-item-label>
                  </q-item-section>
                </q-item>
              </q-list>
            </q-btn-dropdown>
          </div>
          <div>
            <q-btn color="brand-velvet" unelevated  label="Фильтровать" class="!flex !justify-self-end" @click="applyFilters"></q-btn>
          </div>
        </div>
      </q-btn-dropdown>

    </div>
    <q-btn class="!bg-[--crm-c-light-yellow]" unelevated text-color="black" icon-right="add" label="Создать" @click="emit('show-dialog')"></q-btn>
  </div>
</template>