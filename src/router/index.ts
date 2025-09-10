import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '@/view/HomeView.vue'
import ProjectsView from '@/view/ProjectsView.vue'
import SourcesView from '@/view/SourcesView.vue'
import ExperienceView from '@/view/ExperienceView.vue'
import ContactView from '@/view/ContactView.vue'

export const routes = [
  {
    path: '/',
    name: 'Home',
    component: HomeView
  },
  {
    name: "Projects",
    path: "/projects",
    component: ProjectsView
  },
  {
    name: "Experience",
    path: "/experience",
    component: ExperienceView
  },
  {
    name: "Sources",
    path: "/sources",
    component: SourcesView
  },
  {
    name: "Contact",
    path: "/contact",
    component: ContactView
  },
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router
