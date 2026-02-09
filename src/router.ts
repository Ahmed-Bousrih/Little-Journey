import { createRouter, createWebHashHistory } from 'vue-router'
import Journey from './views/Journey.vue'

const routes = [
  {
    path: '/:name?',
    name: 'journey',
    component: Journey
  }
]

export const router = createRouter({
  history: createWebHashHistory(),
  routes
})
