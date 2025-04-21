import { createApp } from 'vue';
import App from './App.vue';
import router from './router';
import { IonicVue } from '@ionic/vue';
import { createPinia } from 'pinia'; // 👉 NUEVO

// Estilos de Ionic
import '@ionic/vue/css/core.css';
import '@ionic/vue/css/normalize.css';
import '@ionic/vue/css/structure.css';
import '@ionic/vue/css/typography.css';
import '@ionic/vue/css/display.css';
import '@ionic/vue/css/flex-utils.css';

// Cargar elementos PWA de Ionic si están disponibles
try {
  import('@ionic/pwa-elements/loader').then(({ defineCustomElements }) => {
    defineCustomElements(window);
  });
} catch (error) {
  console.warn("No se pudo cargar @ionic/pwa-elements. Puede no ser necesario en este proyecto.");
}

// Crear app
const app = createApp(App);
const pinia = createPinia(); // 👉 NUEVO

app.use(IonicVue);
app.use(router);
app.use(pinia); // 👉 NUEVO

// Montar app después de que el router esté listo
router.isReady().then(() => {
  app.mount('#app');
});
