import { createRouter, createWebHistory } from '@ionic/vue-router';
import LoginPage from '../views/LoginPage.vue';
import RegisterPage from '../views/RegisterPage.vue';
import DashboardPage from '../views/DashboardPage.vue';
import TasksPage from '../views/TasksPage.vue'; // ✅ Nueva página
import { Component } from 'ionicons/dist/types/stencil-public-runtime';
import Recover from '@/views/Recover.vue';

const routes = [
  { path: '/', component: LoginPage },
  { path: '/register', component: RegisterPage },
  { path: '/dashboard', component: DashboardPage },
  { path: '/tasks', component: TasksPage }, // ✅ Nueva ruta
  { path: '/recover', component: Recover }

  
];

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes
});

export default router;
