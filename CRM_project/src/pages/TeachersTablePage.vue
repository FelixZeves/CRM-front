<script setup>
import { SessionStorage } from 'quasar'
import { ref, computed } from 'vue'
import AddTask from '@/components/forms/AddTask.vue'
import NavigationColumn from '@/components/menus/NavigationColumn.vue'
import { DocEnum as D} from '@/components/Enums.vue'
import { getTableSchema, getToday, formatPhone } from '@/components/Utils'

const body = ref(SessionStorage.getItem('selectedCollection'))
console.log(body.value)
const user = SessionStorage.getItem('user')

const visible = ref(false)
const tmpBody = ref({
    title: 'СЗ от ' + user.profile.initials_name,
    description: '',
    comment:  '',
    deadline: getToday(),
    ref: null,
    gid: null,
    files: [],
    executors: [],
    reviewers: [],
    checkers: [],
    type: D.MEMO,
    place: null
})

const pagination = ref({rowsPerPage: 0})
const schema = getTableSchema('teachers')

const classFilter = ref('')

function filterByClass(rows, terms) {
    if (!terms) return rows

    const needle = terms.toLowerCase()

    return rows.filter(row => {
        const classValue = `${row.parallel}.${row.number} ${row.spec || ''}`.toLowerCase()

        return classValue.includes(needle)
    })
}

function mapTeacher(teacher) {
  return {
    id: teacher.id,
    fio: teacher.fio
  }
} 

</script>

<template>
    <div class="flex flex-row h-[100vh] w-[100vw] items-center px-8 gap-x-4 justify-evenly !flex-nowrap">
        <header class="min-w-[225px] w-[225px]">
            <NavigationColumn section='Education'/>
        </header>
        
        <main class="!flex !flex-col gap-y-8 !h-[80vh] w-[80%]">
            <div class="border-1 border-2 no-wrap flex flex-col gap-y-2 py-2">
                <q-breadcrumbs active-color="brand-velvet" class="brand-text ps-4">
                    <q-breadcrumbs-el :label="user.profile.initials_name" :to="{name: 'Office'}" />
                    <q-breadcrumbs-el label="Учебная деятельность" :to="{name : 'Education'}"/>
                    <q-breadcrumbs-el :label="body.title + ' классы'" />
                </q-breadcrumbs>
            </div>
            <q-table
            flat bordered
            class="h-[72vh]"
            :rows="body.classes"
            :columns="schema.columns"
            virtual-scroll
            v-model:pagination="pagination"
            :rows-per-page-options="[0]"
            separator="cell"
            hide-bottom
            :filter="classFilter"
            :filter-method="filterByClass"
            >

            <template v-slot:top>
                <div class="w-full flex flex-row items-center justify-end px-2 py-0">

                    <q-input
                    v-model="classFilter"
                        label="Поиск класса"
                        dense
                        outlined
                        clearable
                        debounce="300"
                        placeholder="1.5"
                        class="brand-text !font-light"
                    >
                    <template #append>
                        <q-icon name="search" />
                    </template>
                    </q-input>
                </div>
            </template>

            <template v-slot:header="props">
                <q-tr :props="props">
                    <q-th
                        v-for="col in props.cols"
                        :key="col.name"
                        :props="props"
                    >                       
                        {{ col.label }}
                    </q-th>
                    <q-th> Действия </q-th>
                </q-tr>
            </template>

            <template v-slot:body="props">
                <q-tr :props="props">
                    <q-td
                        v-for="col in props.cols"
                        :key="col.name"
                        :props="props"
                    >
                    <q-td v-if="col.name === 'phone'">
                        {{ formatPhone(col.value) }}
                    </q-td>
                    <span v-else class=" break-words whitespace-normal">{{ col.value }}</span>
                    </q-td>
                    <q-td>
                        <div  class="flex flex-row justify-center">
                            <q-btn flat text-color="brand-velvet" icon="fa-regular fa-comment-dots" dense @click="tmpBody.reviewers = [mapTeacher(props.row.leader)]; visible=true">
                                <q-tooltip
                                    anchor="top left"
                                    outline
                                    self="bottom right"
                                    :offset="[-5, 5]"
                                    class="!text-sm text-center bg-brand-velvet !text-white shadow-xl !max-w-[250px]"
                                    >
                                    Написать преподавателю
                                </q-tooltip>
                            </q-btn>
                            
                        </div>
                    </q-td>
                </q-tr>
            </template>
            </q-table>
        </main>
    </div>
    <AddTask v-model:visible="visible" :me="user" :body="tmpBody" :isMessage="true"></AddTask>
</template>