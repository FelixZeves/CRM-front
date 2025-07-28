<script setup>
import {ref} from 'vue'
import { DocEnum, StatusEnum_ as St } from '@/components/Enums.vue'

const emit = defineEmits(['show-dialog', 'apply-filters'])

const sortFilters = ref ({status: {key: null, label: "Все статусы"}, sort: {key: "desc", label:'Сначала новые', icon: 'fa-solid fa-arrow-down'}, is_creator: {key: null, label: "Все создатели"}, type: {key: null, label: "Все типы"}})

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
                <span class="text-start flex-grow">{{ sortFilters.status.label }}</span>
              </template>
              <q-list class="brand-description">
                <q-item clickable v-close-popup @click="filterChanging('status', {key: null, label: 'Все статусы'})">
                  <q-item-section>
                    <q-item-label>Все статусы</q-item-label>
                  </q-item-section>
                </q-item>

                <q-item clickable v-close-popup @click="filterChanging('status', {key: St.PROGRESS, label: 'В работе'})">
                  <q-item-section>
                    <q-item-label>В работе</q-item-label>
                  </q-item-section>
                </q-item>

                <q-item clickable v-close-popup @click="filterChanging('status', {key: null, label: 'Просрочено'})">
                  <q-item-section>
                    <q-item-label>Просрочено</q-item-label>
                  </q-item-section>
                </q-item>

                <q-item clickable v-close-popup @click="filterChanging('status', {key: St.REJECTED, label: 'Отклонено'})">
                  <q-item-section>
                    <q-item-label>Отклонено</q-item-label>
                  </q-item-section>
                </q-item>

                <q-item clickable v-close-popup @click="filterChanging('status', {key: St.APPROVED, label: 'Выполнено'})">
                  <q-item-section>
                    <q-item-label>Выполнено</q-item-label>
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
                <span class="text-start">{{ sortFilters.sort.label }}</span>
                <q-icon class="flex-grow" :name="sortFilters.sort.icon" size="14px" />
              </template>
              <q-list>
                <q-item clickable v-close-popup @click="filterChanging('sort', {key: 'desc', label:'Сначала новые', icon: 'fa-solid fa-arrow-down'})">
                  <q-item-section class="!flex !flex-row items-center">
                    <q-item-label class="brand-description pe-4">Сначала новые</q-item-label>
                    <q-icon name="fa-solid fa-arrow-down"/>
                  </q-item-section>
                </q-item>

                <q-item clickable v-close-popup @click="filterChanging('sort', {key: 'asc', label:'Сначала старые', icon: 'fa-solid fa-arrow-up'})">
                  <q-item-section class="!flex !flex-row items-center">
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
                <span class="text-start flex-grow">{{ sortFilters.is_creator.label }}</span>
              </template>
              <q-list class="brand-description">
                <q-item clickable v-close-popup @click="filterChanging('is_creator', {key: null, label: 'Все создатели'})">
                  <q-item-section>
                    <q-item-label>Все создатели</q-item-label>
                  </q-item-section>
                </q-item>

                <q-item clickable v-close-popup @click="filterChanging('is_creator', {key: true, label: 'Поставленные мной'})">
                  <q-item-section>
                    <q-item-label>Поставленные мной</q-item-label>
                  </q-item-section>
                </q-item>

                <q-item clickable v-close-popup @click="filterChanging('is_creator', {key: false, label: 'Полученные мной'})">
                  <q-item-section>
                    <q-item-label>Полученные мной</q-item-label>
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
                <span class="text-start flex-grow">{{ sortFilters.type.label }}</span>
              </template>
              <q-list class="brand-description">
                <q-item clickable v-close-popup @click="filterChanging('type', {key: null, label: 'Все типы'})">
                  <q-item-section>
                    <q-item-label>Все типы</q-item-label>
                  </q-item-section>
                </q-item>

                <q-item clickable v-close-popup @click="filterChanging('type', {key: DocEnum.ORDER, label: 'Задачи'})">
                  <q-item-section>
                    <q-item-label>Задачи</q-item-label>
                  </q-item-section>
                </q-item>

                <q-item clickable v-close-popup @click="filterChanging('type', {key: DocEnum.MEMO, label: 'Служебные записки'})">
                  <q-item-section>
                    <q-item-label>Служебные записки</q-item-label>
                  </q-item-section>
                </q-item>

                <q-item clickable v-close-popup @click="filterChanging('type', {key: DocEnum.APPLICATION, label: 'Заявки'})">
                  <q-item-section>
                    <q-item-label>Заявки</q-item-label>
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