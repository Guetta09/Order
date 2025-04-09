import { createRouter, createWebHistory } from '@ionic/vue-router';

// Importación de vistas
import LoginPage from '../views/LoginPage.vue';
import RegisterPage from '../views/RegisterPage.vue';
import DashboardPage from '../views/DashboardPage.vue';
import HomePage from '../views/HomePage.vue';
import TareasPage from '../views/TareasPage.vue';
import ResumenPage from '../views/ResumenPage.vue';
import ConfiguracionPage from '../views/ConfiguracionPage.vue';
import Recover from '@/views/Recover.vue';
import { Component } from 'ionicons/dist/types/stencil-public-runtime';

// Definición de rutas
const routes = [
  { path: '/', component: LoginPage },
  { path: '/register', component: RegisterPage },
  { path: '/dashboard', component: DashboardPage },
  { path: '/home', component: HomePage },
  { path: '/tareas', component: TareasPage },
  { path: '/resumen', component: ResumenPage },
  { path: '/configuration', component: ConfiguracionPage },
  { path: '/recover', component: Recover}
];

// Crear el router
const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes
});

export default router;
