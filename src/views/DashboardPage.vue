<template>
  <ion-page>
    <!-- Encabezado -->
    <ion-header>
      <ion-toolbar style="--background: #800000;">
        <ion-title style="color: white; text-align: center;">Panel Principal</ion-title>
        <ion-buttons slot="end">
          <ion-button @click="logout" color="light">Cerrar Sesión</ion-button>
        </ion-buttons>
      </ion-toolbar>
    </ion-header>

    <!-- Contenido principal -->
    <ion-content class="ion-padding fondo-oscuro" :fullscreen="true">
      <div class="main-content">
        <h1 class="titulo">Panel Principal</h1>
        <p style="text-align: center; color: white;">
          Aquí puedes visualizar el resumen de tus hábitos, estadísticas o notificaciones.
        </p>
      </div>
    </ion-content>

    <!-- Footer de navegación -->
    <ion-footer>
      <ion-toolbar class="footer-bar">
        <ion-buttons class="footer-nav" slot="start">
          <ion-button
            v-for="(link, index) in navLinks"
            :key="index"
            fill="clear"
          >
            <router-link
              :to="link.route"
              class="custom-link"
              :class="{ activo: rutaActual === link.route }"
            >
              {{ link.label }}
            </router-link>
          </ion-button>
        </ion-buttons>
      </ion-toolbar>
    </ion-footer>
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
  IonFooter,
  IonTitle
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
  { label: 'Estadísticas', route: '/resumen' },
  { label: 'Configuración', route: '/configuration' }
];

</script>

<style scoped>
.fondo-oscuro {
  --background: #2e2e2e;
  color: #ffffff;
}

.main-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding-top: 40px;
}

.titulo {
  font-size: 2.5rem;
  font-weight: bold;
  margin-bottom: 20px;
  text-align: center;
  color: white;
}

.footer-bar {
  border-top: 1px solid rgba(255, 255, 255, 0.2);
  --background: #800000;
}

.footer-nav {
  display: flex;
  flex-wrap: wrap;
  gap: 4px;
  justify-content: space-around;
  width: 100%;
}

.footer-nav ion-button {
  flex: 1 1 45%; /* permite que se acomoden de a dos por línea si es necesario */
  min-width: 90px;
  color: white;
  font-weight: bold;
  font-size: 14px;
  transition: all 0.3s ease;
  border-radius: 6px;
  margin: 2px 0;
  text-align: center;
}


.custom-link {
  color: white;
  text-decoration: none;
  padding: 6px 12px;
  display: inline-block;
  width: 100%;
  height: 100%;
}

.custom-link.activo {
  background-color: rgba(255, 255, 255, 0.2);
  border-radius: 6px;
}
</style>
