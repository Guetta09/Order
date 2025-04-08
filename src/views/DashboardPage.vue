<template>
  <ion-page>
    <ion-header>
      <ion-toolbar style="--background: #800000;">
        <ion-buttons slot="start" class="nav-links">
          <ion-button
            v-for="(link, index) in navLinks"
            :key="index"
            :router-link="link.route"
            :class="{ activo: rutaActual === link.route }"
            fill="clear"
          >
            {{ link.label }}
          </ion-button>
        </ion-buttons>
        <ion-buttons slot="end">
          <ion-button @click="logout" color="light">Cerrar Sesión</ion-button>
        </ion-buttons>
      </ion-toolbar>
    </ion-header>

    <ion-content class="ion-padding fondo-oscuro">
      <h1 class="titulo">Panel Principal</h1>
      <p style="text-align: center; color: white;">Aquí puedes visualizar el resumen de tus hábitos, estadísticas o notificaciones.</p>
      <!-- Aquí puedes agregar más tarjetas, gráficas o información -->
    </ion-content>
  </ion-page>
</template>

<script setup lang="ts">
import {
  IonPage,
  IonHeader,
  IonToolbar,
  IonButtons,
  IonButton,
  IonContent,
} from '@ionic/vue';
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { signOut } from 'firebase/auth';
import { auth } from '../firebase';

const router = useRouter();

const logout = async () => {
  await signOut(auth);
  router.push('/');
};

const rutaActual = ref(router.currentRoute.value.path);
router.afterEach((to) => {
  rutaActual.value = to.path;
});

const navLinks = [
  { label: 'Home', route: '/home' },
  { label: 'Tareas', route: '/tareas' },
  { label: 'Resumen', route: '/resumen' },
  { label: 'Configuración', route: '/configuration' }
];
</script>

<style scoped>
.fondo-oscuro {
  --background: #2e2e2e;
  color: #ffffff;
}

ion-content {
  color: white;
}

.titulo {
  font-size: 2.5rem;
  font-weight: bold;
  margin-bottom: 20px;
  text-align: center;
  color: white;
}

.nav-links ion-button {
  color: white;
  font-weight: bold;
  font-size: 16px;
  transition: all 0.3s ease;
  border-radius: 8px;
  margin-right: 5px;
}

.nav-links ion-button.activo {
  border: 2px solid rgba(255, 255, 255, 0.4);
}
</style>
