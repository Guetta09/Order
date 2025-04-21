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
      <h1 class="titulo">Tareas del día</h1>
      
      <div v-for="(tarea, index) in taskStore.tareas" :key="index" class="tarea-item">
        <div class="hora">{{ tarea.hora }}</div>
        <div class="descripcion">{{ tarea.descripcion }}</div>
        <ion-toggle v-model="tarea.completado" color="success" />
        <ion-icon
          :icon="trashOutline"
          class="icono-basura"
          @click="taskStore.eliminarTarea(index)"
        />
      </div>

      <ion-button expand="block" color="medium" @click="mostrarAlertaAgregar">
        Agregar
      </ion-button>
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
  IonToggle,
  IonIcon,
  alertController
} from '@ionic/vue';
import { trashOutline } from 'ionicons/icons';
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { signOut } from 'firebase/auth';
import { auth } from '../firebase';

// 👉 Importar la store de tareas
import { useTaskStore } from '@/stores/taskStore';
const taskStore = useTaskStore();

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
  { label: 'Configuración', route: '/configuracion' }
];

const mostrarAlertaAgregar = async () => {
  const alert = await alertController.create({
    header: 'Nueva tarea',
    inputs: [
      {
        name: 'hora',
        type: 'time',
        placeholder: 'Hora'
      },
      {
        name: 'descripcion',
        type: 'text',
        placeholder: 'Descripción'
      }
    ],
    buttons: [
      {
        text: 'Cancelar',
        role: 'cancel'
      },
      {
        text: 'Agregar',
        handler: data => {
          if (data.hora && data.descripcion) {
            taskStore.agregarTarea(data.hora, data.descripcion);
          }
        }
      }
    ]
  });

  await alert.present();
};
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
  font-size: 2rem;
  font-weight: bold;
  margin-bottom: 20px;
  text-align: center;
  color: white;
}

.nav-links ion-button {
  --color: white !important;
  color: white !important;
  font-weight: bold;
  font-size: 16px;
  transition: all 0.3s ease;
  border-radius: 8px;
  margin-right: 5px;
}

.nav-links ion-button.activo {
  border: 2px solid rgba(255, 255, 255, 0.4);
}

.tarea-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 10px 0;
  border-bottom: 1px solid #444;
}

.hora {
  width: 80px;
  font-weight: bold;
  color: white;
}

.descripcion {
  flex-grow: 1;
  color: white;
}

.icono-basura {
  font-size: 20px;
  color: #ff4d4d;
  margin-left: 10px;
  cursor: pointer;
  transition: transform 0.2s;
}

.icono-basura:hover {
  transform: scale(1.2);
}
</style>
