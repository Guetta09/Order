import { createRouter, createWebHistory } from '@ionic/vue-router';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from '../firebase';

// Importación de vistas
import LoginPage from '../views/LoginPage.vue';
import RegisterPage from '../views/RegisterPage.vue';
import DashboardPage from '../views/DashboardPage.vue';
import HomePage from '../views/HomePage.vue';
import TareasPage from '../views/TareasPage.vue';
import ResumenPage from '../views/ResumenPage.vue';
import ConfiguracionPage from '../views/ConfiguracionPage.vue';
import Recover from '@/views/Recover.vue';
import PerfilPage from '../views/Perfil.vue'; // 👈 Importamos la nueva vista

// Definición de rutas
const routes = [
  { path: '/', component: LoginPage },
  { path: '/register', component: RegisterPage },
  { path: '/recover', component: Recover },

  // ✅ Rutas privadas (requieren autenticación)
  { path: '/dashboard', component: DashboardPage, meta: { requiresAuth: true } },
  { path: '/home', component: HomePage, meta: { requiresAuth: true } },
  { path: '/tareas', component: TareasPage, meta: { requiresAuth: true } },
  { path: '/resumen', component: ResumenPage, meta: { requiresAuth: true } },
  { path: '/configuration', component: ConfiguracionPage, meta: { requiresAuth: true } },
  { path: '/perfil', component: PerfilPage, meta: { requiresAuth: true } }, // ✅ Ruta del perfil
];

// Crear el router
const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes
});

// ✅ Guard para rutas privadas
router.beforeEach(async (to, from, next) => {
  const requiresAuth = to.matched.some(record => record.meta.requiresAuth);

  // Si la ruta requiere autenticación
  if (requiresAuth) {
    const user = auth.currentUser;

    // Espera por el estado de autenticación si es necesario
    if (user) {
      next(); // Usuario autenticado
    } else {
      onAuthStateChanged(auth, (user) => {
        if (user) {
          next();
        } else {
          next('/'); // Redirigir al login
        }
      });
    }
  } else {
    next(); // Rutas públicas
  }
});

export default router;
