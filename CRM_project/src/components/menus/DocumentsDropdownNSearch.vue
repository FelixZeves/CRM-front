<script setup>
import {onMounted, ref} from 'vue'
import { getMe } from '@/components/Utils';
import { RoleEnum_ as R, FileTypeEnum, FileFocusEnum} from '@/components/Enums.vue';

const emit = defineEmits(['show-dialog', 'apply-filters']);
const role = ref(null)

const searchText =ref("")

const typesOptions = Object.values(FileTypeEnum)
const focusOptions = Object.values(FileFocusEnum)

const sortFilters = ref({type: {key: "Все документы"}, sort: {key: "desc", label:'Сначала новые', icon: 'fa-solid fa-arrow-down'}, focus: {key: "Все направления"}, this_year: {key: false}})

function filterChanging(filter, val){
  sortFilters.value[filter] = val
}

const buildQueryParams = () => {
  const params = {};
  params['sort'] = sortFilters.value.sort.key
  params['this_year'] = sortFilters.value.this_year.key
  params['tags'] = []
  if(sortFilters.value.type.key != null && sortFilters.value.type.key != "Все документы")
    params['tags'].push(sortFilters.value.type.key)
  if(sortFilters.value.focus.key != null && sortFilters.value.focus.key != "Все направления")
    params['tags'].push(sortFilters.value.focus.key)
  console.log(params)
  return params;
}

function applyFilters() {
  const params = buildQueryParams();
  emit('apply-filters', params);
}

onMounted(async () => {role.value = (await getMe()).data.role})

</script>

<template>
    <div class="q-pa-md border-2 w-[97%] flex flex-row justify-between justify-self-center">
        <div class="flex flex-row items-center gap-x-5">
          <q-btn-dropdown
            :menu-offset="[0, 5]"
            menu-anchor="bottom left"
            menu-self="top left"
            color="white"
            text-color="black" 
            label="Фильтры" 
            class="brand-description"
          >
            <div class="p-4 flex flex-col gap-y-4 w-[600px]">
              <div class="flex flex-row gap-x-6 !flex-nowrap">
                <q-btn-dropdown
                  :menu-offset="[0, 5]"
                  unelevated
                  class="brand-description !w-[50%]"
                  color="brand-grey"
                  text-color="black"
                >
                  <template v-slot:label>
                    <span class="text-start flex-grow">{{ sortFilters.type.key }}</span>
                  </template>
                  <q-list class="brand-description">
                    <q-item clickable v-close-popup @click="filterChanging('type', {key: 'Все документы'})">
                      <q-item-section>
                        <q-item-label>Все документы</q-item-label>
                      </q-item-section>
                    </q-item>
                    <q-item v-for="type in typesOptions" clickable v-close-popup @click="filterChanging('type', {key: type})">
                      <q-item-section>
                        <q-item-label>{{ type }}</q-item-label>
                      </q-item-section>
                    </q-item>
                  </q-list>
                </q-btn-dropdown>

                <q-btn-dropdown
                  :menu-offset="[0, 5]"
                  unelevated
                  class="brand-description !flex-grow"
                  color="brand-grey"
                  text-color="black"
                >
                  <template v-slot:label>
                    <span class="text-start flex-grow">{{ sortFilters.sort.label }}</span>
                    <q-icon class="flex-grow" :name="sortFilters.sort.icon" size="14px" />
                  </template>
                  <q-list class="brand-description">

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
              </div>

              <div class="flex flex-row gap-x-6 !flex-nowrap">
                <q-btn-dropdown
                  :menu-offset="[0, 5]"
                  unelevated
                  class="brand-description !w-[50%]"
                  color="brand-grey"
                  text-color="black"
                >
                  <template v-slot:label>
                    <span class="text-start flex-grow">{{ sortFilters.focus.key }}</span>
                  </template>
                  <q-list class="brand-description">
                    <q-item clickable v-close-popup @click="filterChanging('focus', {key: 'Все направления'})">
                      <q-item-section>
                        <q-item-label>Все направления</q-item-label>
                      </q-item-section>
                    </q-item>

                    <q-item v-for="type in focusOptions" clickable v-close-popup @click="filterChanging('focus', {key: type})">
                      <q-item-section>
                        <q-item-label>{{ type }}</q-item-label>
                      </q-item-section>
                    </q-item>
                  </q-list>
                </q-btn-dropdown>
                <q-checkbox
                    class="brand-description !flex-grow"
                    label="Текущий год"
                    indeterminate-value
                    keep-color
                    color="brand-velvet"
                    checked-icon="fa-solid fa-circle"
                    unchecked-icon="fa-solid fa-circle-notch"
                    v-model="sortFilters.this_year.key"
                />
              </div>
              
              <div>
                <q-btn color="brand-velvet" unelevated  label="Фильтровать" class="!flex !justify-self-end" @click="applyFilters"></q-btn>
              </div>
            </div>
          </q-btn-dropdown>
        </div>
        <div class="flex flex-row gap-x-2">
          <div class="flex flex-row items-center border-2">
            <q-input v-model="searchText" borderless label-color="black" class="ps-2 pe-1 brand-description" label="Поиск документа">

                <template v-slot:append>
                    <q-icon v-if="searchText !== ''" name="close" color="black" size="sm" @click="searchText = ''" class="cursor-pointer" />
                </template>

                <template v-slot:after>
                    <button>
                        <q-icon color="black" name="search" size="sm"></q-icon>
                    </button>
                </template>
            </q-input>
          </div>
          <q-btn
          v-if="role == R.LEADER"
          icon-right="add"
          unelevated
          color="brand-wait"
          text-color="black"
          @click="$emit('show-dialog')">
          </q-btn>
        </div>
        

    </div>
  </template>