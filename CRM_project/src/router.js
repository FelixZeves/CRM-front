import { createWebHistory, createRouter } from 'vue-router'

import AuthorizationPage from './AuthorizationPage.vue'
import PersonalOfficePage from './PersonalOfficePage.vue'
import DBManagePage from './DBManagePage.vue'
import PasswordChangingPage from './PasswordChangingPage.vue'
import DBTablePage from './DBTablePage.vue'
import TasksPage from './TasksPage.vue'
import EventsPage from './EventsPage.vue'
import DocumentsPage from './DocumentsPage.vue'

const routes = [
  { path: '/', name: 'Authorization', component: AuthorizationPage },
  { path: '/PasswordChanging', component: PasswordChangingPage},
  { path: '/Office', name: 'Office', component: PersonalOfficePage},
  { path: '/DBManage', name: 'Database', component: DBManagePage},
  { path: '/DBTable/:table', name: 'Table', component: DBTablePage},
  { path: '/Office/Tasks', name: 'Tasks', component: TasksPage},
  { path: '/Office/Events', name: 'Events', component: EventsPage},
  { path: '/Office/Documents', name: 'Documents', component: DocumentsPage},
]

const router = createRouter({
    history: createWebHistory(),
    routes,
})

export default router