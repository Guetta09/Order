<script setup lang="ts">
import { IonApp, IonRouterOutlet } from '@ionic/vue';
import { onMounted } from 'vue';
import { solicitarPermisosNotificaciones } from './utils/notifications';

// Importa los estilos de Ionic (opcional, si no los has importado en main.ts)
import '@ionic/vue/css/core.css';
import '@ionic/vue/css/normalize.css';
import '@ionic/vue/css/structure.css';
import '@ionic/vue/css/typography.css';

onMounted(() => {
  solicitarPermisosNotificaciones();
});
</script>

<template>
  <ion-app>
    <ion-router-outlet />
  </ion-app>
</template>

<style>
/* Estilos globales */
ion-app {
  background: white;
  height: 100vh;
  width: 100vw;
}

/* Asegura que el router outlet ocupe todo el espacio */
ion-router-outlet {
  flex: 1;
  display: block;
  height: 100%;
  width: 100%;
}
</style>