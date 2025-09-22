import { createWebHistory, createRouter } from 'vue-router'

import AuthorizationPage from './pages/Auth.vue'
import PersonalOfficePage from './pages/DashboardUser.vue'
import DBManagePage from './pages/DashboardAdmin.vue'
import PasswordChangingPage from './pages/_PasswordChangingPage.vue'
import TasksPage from './pages/Tasks.vue'
import EventsPage from './pages/Events.vue'
import DocumentsPage from './pages/Docs.vue'
import Archive from './pages/Archive.vue'
import EducationPage from './pages/EducationPage.vue'
import ClassManipulationPage from './pages/ClassManipulationPage.vue'

const routes = [
  { path: '/', name: 'Authorization', component: AuthorizationPage },
  { path: '/PasswordChanging', component: PasswordChangingPage},
  { path: '/Office', name: 'Office', component: PersonalOfficePage},
  { path: '/DBManage', name: 'Database', component: DBManagePage},
  { path: '/Office/Education', name:  'Education', component: EducationPage},
  { path: '/Office/Education/:title', name: 'ClassManipulation', component: ClassManipulationPage},
  { path: '/Office/Tasks', name: 'Tasks', component: TasksPage},
  { path: '/Office/Events', name: 'Events', component: EventsPage},
  { path: '/Office/Documents', name: 'Documents', component: DocumentsPage},
  { path: '/Office/Archive', name: 'Archive', component: Archive}
]

const router = createRouter({
    history: createWebHistory(),
    routes,
})

export default router