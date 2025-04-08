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
      <!-- Calendario con día actual -->
      <div class="calendario-hoy">
        <ion-icon :icon="calendarOutline" class="icono-calendario" />
        <div class="fecha-hoy">
          {{ diaSemana }}, {{ dia }} de {{ mes }} de {{ anio }}
        </div>
      </div>

      <!-- Horarios y tareas -->
      <div class="tareas">
        <div v-for="(tarea, index) in tareas" :key="index" class="tarea-item">
          <div class="hora">{{ tarea.hora }}</div>
          <div class="descripcion">{{ tarea.descripcion }}</div>
          <ion-toggle v-model="tarea.completado" color="success" />
        </div>
        <ion-button expand="block" color="medium">Agregar</ion-button>
      </div>

      <!-- Gráfico de resumen -->
      <div class="resumen">
        <h3>Resumen</h3>
        <div class="barras">
          <div v-for="(valor, index) in resumen" :key="index" class="barra-contenedor">
            <div class="barra" :style="{ height: valor + '%' }"></div>
          </div>
        </div>
      </div>
    </ion-content>
  </ion-page>
</template>

<script setup lang="ts">
import {
  IonPage,
  IonHeader,
  IonToolbar,
  IonTitle,
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

const router = useRouter();

const logout = async () => {
  await signOut(auth);
  router.push('/');
};

const tareas = [
  { hora: '6:00 a.m', descripcion: 'Despertar', completado: true },
  { hora: '7:00 a.m', descripcion: 'Desayuno', completado: false },
  { hora: '8:00 a.m', descripcion: 'Gym', completado: false }
];

const resumen = [100, 60, 30];

const fecha = new Date();
const diasSemana = ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'];
const meses = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'];

const diaSemana = diasSemana[fecha.getDay()];
const dia = fecha.getDate();
const mes = meses[fecha.getMonth()];
const anio = fecha.getFullYear();

// Rutas y estado activo
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
</script>

<style scoped>
.fondo-oscuro {
  --background: #2e2e2e;
  color: #ffffff;
}

/* NAV PERSONALIZADA */
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

/* Calendario */
.calendario-hoy {
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 20px 0;
  padding: 10px;
  border-radius: 10px;
  color: #ffffff;
  background: transparent;
}

.icono-calendario {
  font-size: 24px;
  margin-right: 10px;
}

.fecha-hoy {
  font-size: 1.2rem;
  font-weight: bold;
}

/* Tareas */
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
}

.hora {
  width: 80px;
  font-weight: bold;
  color: white !important;
}

.descripcion {
  flex-grow: 1;
  color: white !important;
}

.tarea-item {
  color: white !important;
}


/* Resumen */
.resumen {
  padding: 15px;
  border-radius: 12px;
  background: transparent;
}

.resumen h3 {
  margin-bottom: 10px;
  color: #fff;
}

.barras {
  display: flex;
  align-items: flex-end;
  justify-content: space-around;
  height: 150px;
  margin-top: 10px;
}

.barra-contenedor {
  width: 20px;
  background: #555;
  height: 100%;
  border-radius: 4px;
  display: flex;
  align-items: flex-end;
}

.barra {
  background-color: #4caf50;
  width: 100%;
  border-radius: 4px 4px 0 0;
}
</style>
