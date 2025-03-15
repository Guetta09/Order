import { createApp } from 'vue';
import App from './App.vue';
import router from './router';
import { IonicVue } from '@ionic/vue';

// Importar estilos principales de Ionic
import '@ionic/vue/css/core.css';
import '@ionic/vue/css/normalize.css';
import '@ionic/vue/css/structure.css';
import '@ionic/vue/css/typography.css';

// Importar el tema de Ionic
import '@ionic/vue/css/display.css';
import '@ionic/vue/css/flex-utils.css';

// Intentar importar @ionic/pwa-elements si está disponible
try {
  import('@ionic/pwa-elements/loader').then(({ defineCustomElements }) => {
    defineCustomElements(window);
  });
} catch (error) {
  console.warn("No se pudo cargar @ionic/pwa-elements. Puede no ser necesario en este proyecto.");
}

// Crear la app y configurar IonicVue + Vue Router
const app = createApp(App);
app.use(IonicVue);
app.use(router);

// Esperar a que el router esté listo antes de montar la app
router.isReady().then(() => {
  app.mount('#app');
});
