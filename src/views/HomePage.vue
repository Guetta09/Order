<template>
  <ion-page>
    <ion-header>
      <ion-toolbar style="--background: #800000;">
        <ion-buttons slot="start" class="nav-links">
          <ion-button
            v-for="(link, index) in navLinks"
            :key="index"
            @click="navegar(link.route)"
            :class="{ activo: rutaActual === link.route }"
            fill="clear"
          >
            <img
              :src="link.icon"
              alt="icon"
              style="width: 20px; height: 20px; margin-right: 6px"
            />
            {{ link.label }}
          </ion-button>
        </ion-buttons>

        <ion-buttons slot="end">
          <ion-button @click="logout" color="light">
          <img :src="iconCerrarSesion" alt="cerrar" style="width: 20px; height: 20px; margin-right: 6px" />
          Cerrar Sesión
          </ion-button>
        </ion-buttons>
      </ion-toolbar>
    </ion-header>

    <ion-content class="ion-padding fondo-oscuro">
      <!-- Calendario con día actual -->
      <div class="calendario-hoy">
        <ion-icon :icon="calendarOutline" class="icono-calendario" />
        <div class="fecha-hoy">
          {{ diaSemana }}, {{ dia }} de {{ mes }} de {{ anio }}
        </div>
      </div>

      <!-- Horarios y tareas -->
      <div class="tareas">
        <div
          v-for="(tarea, index) in taskStore.tareas"
          :key="index"
          class="tarea-item"
        >
          <div class="hora">{{ tarea.hora }}</div>
          <div class="descripcion">{{ tarea.descripcion }}</div>
          <ion-toggle v-model="tarea.completado" color="success" />
        </div>
      </div>

      <!-- Gráfico de resumen -->
      <div class="resumen">
        <h3>Resumen</h3>
        <ResumenChart />
      </div>
    </ion-content>
  </ion-page>
</template>

<script setup lang="ts">
import ResumenChart from '@/components/ResumenChart.vue';
import {
  IonPage,
  IonHeader,
  IonToolbar,
  IonButtons,
  IonButton,
  IonContent,
  IonToggle,
  IonIcon
} from '@ionic/vue';
import { calendarOutline } from 'ionicons/icons';
import { useRouter } from 'vue-router';
import { signOut } from 'firebase/auth';
import { auth } from '../firebase';
import { ref } from 'vue';
import { useTaskStore } from '@/stores/taskStore';
import iconHome from '@/components/icons/home.png';
import iconTareas from '@/components/icons/tareas.png';
import iconResumen from '@/components/icons/resumen.png';
import iconCerrarSesion from '@/components/icons/cerrar-sesion.png';

const taskStore = useTaskStore();
const router = useRouter();

const logout = async () => {
  await signOut(auth);
  router.push('/');
};

const navegar = (ruta: string) => {
  router.push(ruta);
  if (document.activeElement instanceof HTMLElement) {
    document.activeElement.blur();
  }
};

const fecha = new Date();
const diasSemana = ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'];
const meses = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'];

const diaSemana = diasSemana[fecha.getDay()];
const dia = fecha.getDate();
const mes = meses[fecha.getMonth()];
const anio = fecha.getFullYear();

const rutaActual = ref(router.currentRoute.value.path);
router.afterEach((to) => {
  rutaActual.value = to.path;
});

const navLinks = [
  { label: 'Home', route: '/home', icon: iconHome },
  { label: 'Tareas', route: '/tareas', icon: iconTareas },
  { label: 'Resumen', route: '/resumen', icon: iconResumen }
];
</script>

<style scoped>
.fondo-oscuro {
  --background: #2e2e2e;
  color: #ffffff;
}

.nav-links ion-button {
  --color: white !important;
  font-weight: bold;
  font-size: 16px;
  transition: all 0.3s ease;
  border-radius: 8px;
  margin-right: 5px;
}

.nav-links ion-button.activo {
  border: 2px solid rgba(255, 255, 255, 0.4);
}

.calendario-hoy {
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 20px 0;
  padding: 10px;
  border-radius: 10px;
  color: #ffffff;
  background: transparent;
  cursor: pointer;
}

.icono-calendario {
  font-size: 24px;
  margin-right: 10px;
}

.fecha-hoy {
  font-size: 1.2rem;
  font-weight: bold;
}

.tareas {
  padding: 15px;
  border-radius: 12px;
  margin-bottom: 20px;
  background: transparent;
}

.tarea-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 10px;
  border-bottom: 1px solid #555;
  padding-bottom: 5px;
  color: white !important;
}

.hora {
  width: 80px;
  font-weight: bold;
}

.descripcion {
  flex-grow: 1;
}

.resumen {
  padding: 15px;
  border-radius: 12px;
  background: transparent;
}

.resumen h3 {
  margin-bottom: 10px;
  color: #fff;
}
</style>
