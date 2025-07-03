<script setup>
import {ref} from 'vue'

const emit = defineEmits(['show-dialog']);
const typesFilter = ref("Все документы")
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
    <div class="q-pa-md border-2 flex-grow !w-[80%] flex flex-row justify-between justify-self-center mx-3">
        <div class="flex flex-row items-center gap-x-2">
            <q-btn-dropdown menu-anchor="bottom right" class="shadow-xl rounded-[15pt]" color="white" text-color="black" :label=typesFilter :menu-offset="[0, 5]">
              <q-list>
                <q-item clickable v-close-popup @click="onTypeClick('Все документы')">
                  <q-item-section>
                    <q-item-label>Все документы</q-item-label>
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
      
            <!-- <q-btn-dropdown
            menu-anchor="bottom right"
            :menu-offset="[5, 5]"
            class="shadow-xl rounded-[15pt]"
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
            </q-btn-dropdown> -->
      
            <q-btn-dropdown menu-anchor="bottom right" class="shadow-xl rounded-[15pt]" color="white" text-color="black" :label=focusesFilter :menu-offset="[0, 5]">
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
        <div class="flex flex-row gap-x-2">
          <div class="flex flex-row items-center border-2">
            <q-input v-model="searchText" borderless label-color="black" label="Поиск документа">

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
          icon-right="add"
          color="brand-wait"
          text-color="black"
          @click="$emit('show-dialog')">
          </q-btn>
        </div>
        

    </div>
  </template>