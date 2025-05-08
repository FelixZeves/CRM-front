<script setup>
import { update } from 'immutable';
import {ref} from 'vue'

const typesFilter = ref("Все типы документов")

const datesFilter = ref("Все года")

const focusesFilter = ref("Любая направленность")

const searchText =ref("")

function onTypeClick(res){
  typesFilter.value=res
}

function onDateClick(res){
  datesFilter.value=res
}

function onFocusClick(res){
    focusesFilter.value=res
}

</script>

<template>
    <div class="q-pa-md border-2 w-[90%] flex flex-row justify-between mx-3">
        <div class="flex flex-row items-center">
            <q-btn-dropdown menu-anchor="bottom right" class="shadow-xl rounded-[20pt] me-5" color="white" text-color="black" :label=typesFilter :menu-offset="[0, 5]">
              <q-list>
                <q-item clickable v-close-popup @click="onTypeClick('Все типы документов')">
                  <q-item-section>
                    <q-item-label>Все типы документов</q-item-label>
                  </q-item-section>
                </q-item>
      
                <q-item clickable v-close-popup @click="onTypeClick('Приказы')">
                  <q-item-section>
                    <q-item-label>Приказы</q-item-label>
                  </q-item-section>
                </q-item>
        
                <q-item clickable v-close-popup @click="onTypeClick('Нормативные документы')">
                  <q-item-section>
                    <q-item-label>Нормативные документы</q-item-label>
                  </q-item-section>
                </q-item>
                
              </q-list>
            </q-btn-dropdown>
      
            <q-btn-dropdown
            menu-anchor="bottom right"
            :menu-offset="[5, 5]"
            class="shadow-xl rounded-[20pt] me-5"
            color="white"
            text-color="black"
            :label=datesFilter>
              <q-list>
                <q-item clickable v-close-popup @click="onDateClick('Все года')">
                  <q-item-section>
                    <q-item-label>Все года</q-item-label>
                  </q-item-section>
                </q-item>
      
                <q-item clickable v-close-popup @click="onDateClick('Этот учебный год')">
                  <q-item-section>
                    <q-item-label>Этот учебный год</q-item-label>
                  </q-item-section>
                </q-item>
        
                <q-item clickable v-close-popup @click="onDateClick('Самые старые')">
                  <q-item-section>
                    <q-item-label>Самые старые</q-item-label>
                  </q-item-section>
                </q-item>
      
              </q-list>
            </q-btn-dropdown>
      
            <q-btn-dropdown menu-anchor="bottom right" class="shadow-xl rounded-[20pt] me-5" color="white" text-color="black" :label=focusesFilter :menu-offset="[0, 5]">
              <q-list>
                <q-item clickable v-close-popup @click="onFocusClick('Любая направленность')">
                  <q-item-section>
                    <q-item-label>Любая направленность</q-item-label>
                  </q-item-section>
                </q-item>
      
                <q-item clickable v-close-popup @click="onFocusClick('Образование')">
                  <q-item-section>
                    <q-item-label>Образование</q-item-label>
                  </q-item-section>
                </q-item>
        
                <q-item clickable v-close-popup @click="onFocusClick('Отчётность')">
                  <q-item-section>
                    <q-item-label>Отчётность</q-item-label>
                  </q-item-section>
                </q-item>
      
              </q-list>
            </q-btn-dropdown>
        </div>

        <div class="flex flex-row items-center border-2 px-2">
            <q-input v-model="searchText" borderless color="black" label-color="black" label="Поиск документа" class="md:w-[200px] 2xl:w-[400px]">

                <template v-slot:append>
                    <q-icon v-if="searchText !== ''" name="close" color="black" size="md" @click="searchText = ''" class="cursor-pointer" />
                </template>

                <template v-slot:after>
                    <button class="ms-1">
                        <q-icon color="black" name="search" size="md"></q-icon>
                    </button>
                </template>
                
            </q-input>
        
        </div>

    </div>
  </template>