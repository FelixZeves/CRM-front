<script setup>
import { SessionStorage } from 'quasar'
import { ref, computed } from 'vue'
import AddTask from '@/components/forms/AddTask.vue'
import NavigationColumn from '@/components/menus/NavigationColumn.vue'
import { DocEnum as D} from '@/components/Enums.vue'
import { getTableSchema, getToday } from '@/components/Utils'

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

const teachers = ref([
    {id: 'b2cb1e2f-ffa6-4eb4-bd72-f8a4a4a2db8d', email: 't1@mail.ru', profile: { full_name: 'Исполнительный Сергей Витальевич', classes: ['1.2', '1.4', '4.6', '6.4'], phone: '89291238765' }}
])

const expandedTeachers = computed(() => {
  // диапазон для текущей группы
  const [min, max] = body.value.title.split('-').map(Number)

  const result = []

  teachers.value.forEach(teacher => {
    teacher.profile.classes.forEach(className => {
      // выделяем номер параллели (первая часть до точки)
      const classNumber = parseInt(className.split('.')[0])

      // если этот класс входит в диапазон группы
      if (classNumber >= min && classNumber <= max) {
        // добавляем "развёрнутую" запись
        result.push({
          ...teacher,
          class: className
        })
      }
    })
  })

  return result
})

function formatPhone(phone) {
  if (!phone) return ''

  // если мобильный (11 цифр, начинается с 7 или 8)
  if (/^(7|8)\d{10}$/.test(phone)) {
    return phone.replace(/(\d)(\d{3})(\d{3})(\d{2})(\d{2})/, '$1 ($2) $3-$4-$5')
  }

  // если домашний (например, 6 цифр)
  if (/^\d{5}$/.test(phone)) {
    return phone.replace(/(\d{1})(\d{2})(\d{2})/, '$1-$2-$3')
  }

  return phone // fallback
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
            >
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