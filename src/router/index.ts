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
    component: HomeView,
    emoji: "🏠"
  },
  {
    name: "Projects",
    path: "/projects",
    component: ProjectsView,
    emoji: "💼"
  },
  {
    name: "Experience",
    path: "/experience",
    component: ExperienceView,
    emoji: "🛠️"
  },
  {
    name: "Sources",
    path: "/sources",
    component: SourcesView,
    emoji: "📚"
  },
  {
    name: "Contact",
    path: "/contact",
    component: ContactView,
    emoji: "✉️"
  },
  // {
  //   name: "Perlin Noise",
  //   path: "/random",
  //   component: RandomView,
  //   emoji: "🎲"
  // }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router
