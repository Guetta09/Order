<template>
  <ion-page>
    <ion-header>
      <ion-toolbar color="dark">
        <ion-title style="color: white;">Configuración</ion-title>
      </ion-toolbar>
    </ion-header>

    <ion-content class="ion-padding config-container">
      <ion-list>

        <!-- Modo oscuro -->
        <ion-item>
          <ion-label>Modo oscuro</ion-label>
          <ion-toggle :checked="isDarkMode" @ionChange="toggleDarkMode"></ion-toggle>
        </ion-item>

        <!-- Notificaciones -->
        <ion-item>
          <ion-label>Notificaciones</ion-label>
          <ion-toggle :checked="notificaciones" @ionChange="toggleNotificaciones"></ion-toggle>
        </ion-item>

        <!-- Ir al perfil -->
        <ion-item button @click="goToPerfil">
          <ion-label>Editar perfil</ion-label>
        </ion-item>

      </ion-list>
    </ion-content>
  </ion-page>
</template>

<script setup lang="ts">
import {
  IonPage,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonItem,
  IonLabel,
  IonToggle,
  IonList,
} from '@ionic/vue';
import { ref } from 'vue';
import { useRouter } from 'vue-router';

const router = useRouter();
const isDarkMode = ref(document.body.classList.contains('dark'));
const notificaciones = ref(true); // Puedes vincular esto con Firebase más adelante

const toggleDarkMode = (event: CustomEvent) => {
  const enabled = event.detail.checked;
  isDarkMode.value = enabled;
  document.body.classList.toggle('dark', enabled);
};

const toggleNotificaciones = (event: CustomEvent) => {
  notificaciones.value = event.detail.checked;
  // En un futuro: guardar preferencia en Firestore
};

const goToPerfil = () => {
  router.push('/perfil');
};
</script>

<style scoped>
.config-container {
  --background: linear-gradient(135deg, #f3e9d2, #e1bb80);
  min-height: 100%;
}
</style>
