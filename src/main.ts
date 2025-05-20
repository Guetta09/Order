import { createApp } from 'vue';
import App from './App.vue';
import router from './router';
import { IonicVue } from '@ionic/vue';
import { createPinia } from 'pinia';
import { solicitarPermisosNotificaciones } from './utils/notifications';
import { useTaskStore } from './stores/taskStore';

// Ionic styles
import '@ionic/vue/css/core.css'
import '@ionic/vue/css/normalize.css'
import '@ionic/vue/css/structure.css'
import '@ionic/vue/css/typography.css'
import '@ionic/vue/css/padding.css'
import '@ionic/vue/css/float-elements.css'
import '@ionic/vue/css/text-alignment.css'
import '@ionic/vue/css/text-transformation.css'
import '@ionic/vue/css/flex-utils.css'
import '@ionic/vue/css/display.css'

// Registrar elementos personalizados (PWA)
import { defineCustomElements } from '@ionic/pwa-elements/loader';
defineCustomElements(window);

// Crear y montar app
const app = createApp(App);
app.use(IonicVue);
app.use(createPinia());
app.use(router);

router.isReady().then(() => {
  app.mount('#app');
  solicitarPermisosNotificaciones(); // ✅ Solicita notificaciones al iniciar

  const taskStore = useTaskStore();
  taskStore.cargarTareas();
});
