import { createRouter, createWebHistory } from '@ionic/vue-router';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from '../firebase';

// Vistas
import LoginPage from '../views/LoginPage.vue';
import RegisterPage from '../views/RegisterPage.vue';
import HomePage from '../views/HomePage.vue';
import TareasPage from '../views/TareasPage.vue';
import ResumenPage from '../views/ResumenPage.vue';
import ConfiguracionPage from '../views/ConfiguracionPage.vue';
import Recover from '../views/Recover.vue';
import PerfilPage from '../views/Perfil.vue';

const routes = [
  { path: '/', component: LoginPage },
  { path: '/register', component: RegisterPage },
  { path: '/recover', component: Recover },
  { path: '/home', component: HomePage, meta: { requiresAuth: true } },
  { path: '/tareas', component: TareasPage, meta: { requiresAuth: true } },
  { path: '/resumen', component: ResumenPage, meta: { requiresAuth: true } },
  { path: '/configuration', component: ConfiguracionPage, meta: { requiresAuth: true } },
  { path: '/perfil', component: PerfilPage, meta: { requiresAuth: true } },
];

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes
});

router.beforeEach(async (to, from, next) => {
  const requiresAuth = to.matched.some(record => record.meta.requiresAuth);
  if (requiresAuth) {
    const user = auth.currentUser;
    if (user) {
      next();
    } else {
      onAuthStateChanged(auth, (user) => {
        if (user) {
          next();
        } else {
          next('/');
        }
      });
    }
  } else {
    next();
  }
});

export default router;
