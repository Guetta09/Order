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

      <!-- Horarios y tareas organizadas por días -->
      <div class="tareas">
        <div
          v-for="(tareasDelDia, fecha) in tareasAgrupadasPorDia"
          :key="fecha"
          class="grupo-dia"
        >
          <!-- Encabezado con la fecha -->
          <div class="fecha-dia">
            {{ fecha }}
          </div>

          <!-- Tareas del día -->
          <div
            v-for="(tarea, index) in tareasDelDia"
            :key="index"
            class="tarea-item"
          >
            <div class="hora">{{ tarea.hora }}</div>
            <div class="descripcion">{{ tarea.descripcion }}</div>
            <ion-toggle v-model="tarea.completado" color="success" />

            <!-- Botón eliminar tarea -->
            <ion-button fill="clear" color="danger" @click="eliminarTarea(tarea.id)">
            <ion-icon :icon="trash" />
            </ion-button>
          </div>
        </div>
      </div>

      <!-- FAB botón agregar -->
      <ion-fab slot="fixed" vertical="bottom" horizontal="center" style="bottom: 80px;">
        <ion-fab-button @click="mostrarModal = true">
          <ion-icon :icon="add" />
        </ion-fab-button>
      </ion-fab>

      <!-- Modal agregar tarea -->
      <ion-modal :is-open="mostrarModal" @didDismiss="mostrarModal = false">
        <ion-header>
          <ion-toolbar style="--background: #800000;">
            <ion-title style="font-size: 18px;">Agregar Tarea</ion-title>
            <ion-buttons slot="end">
              <ion-button @click="mostrarModal = false" fill="clear">
                <ion-icon :icon="close" />
              </ion-button>
            </ion-buttons>
          </ion-toolbar>
        </ion-header>
        <ion-content class="ion-padding fondo-oscuro">
          <ion-item>
            <ion-label position="floating" style="font-size: 14px;">Nombre</ion-label>
            <ion-input v-model="nuevaDescripcion" style="font-size: 14px;" />
          </ion-item>
          <ion-item>
            <ion-label position="floating" style="font-size: 14px;">Hora</ion-label>
            <ion-datetime v-model="hora" presentation="time" hour-cycle="h23" style="font-size: 14px;" />
          </ion-item>
          <ion-item>
            <ion-label position="floating" style="font-size: 14px;">Fecha</ion-label>
            <ion-datetime v-model="fecha" presentation="date" style="font-size: 14px;" />
          </ion-item>
          <ion-button expand="block" @click="agregarTarea" style="margin-top: 14px;">Guardar</ion-button>
        </ion-content>
      </ion-modal>
    </ion-content>
  </ion-page>
</template>

<script setup lang="ts">
import {
  IonPage, IonHeader, IonToolbar, IonTitle, IonContent,
  IonFab, IonFabButton, IonModal, IonButton, IonInput,
  IonLabel, IonDatetime, IonIcon, IonItem, IonList,
  IonToggle, IonButtons
} from '@ionic/vue';
import { calendarOutline, add, close, trash } from 'ionicons/icons';
import { useRouter } from 'vue-router';
import { signOut } from 'firebase/auth';
import { auth } from '../firebase';
import { ref, computed } from 'vue';
import { useTaskStore } from '@/stores/taskStore';
import iconHome from '@/components/icons/home.png';
import iconTareas from '@/components/icons/tareas.png';
import iconResumen from '@/components/icons/resumen.png';
import iconCerrarSesion from '@/components/icons/cerrar-sesion.png';

const taskStore = useTaskStore();
const router = useRouter();

const mostrarModal = ref(false);
const nuevaDescripcion = ref('');
const fecha = ref('');
const hora = ref('');

// Cerrar sesión
const logout = async () => {
  await signOut(auth);
  router.push('/');
};

// Navegar
const navegar = (ruta: string) => {
  router.push(ruta);
  if (document.activeElement instanceof HTMLElement) {
    document.activeElement.blur();
  }
};

// Fecha actual
const fechaHoy = new Date();
const diasSemana = ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'];
const meses = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'];

const diaSemana = diasSemana[fechaHoy.getDay()];
const dia = fechaHoy.getDate();
const mes = meses[fechaHoy.getMonth()];
const anio = fechaHoy.getFullYear();

// Agrupación de tareas
const tareasAgrupadasPorDia = computed(() => {
  const tareas = taskStore.tareas;
  const agrupadas: Record<string, any[]> = {};

  tareas.forEach((tarea) => {
    const fechaTarea = new Date(tarea.fecha);
    const fechaFormateada = `${fechaTarea.getDate()}/${fechaTarea.getMonth() + 1}/${fechaTarea.getFullYear()}`;
    const diaSemana = diasSemana[fechaTarea.getDay()]; // Obtener el día de la semana
    const fechaCompleta = `${diaSemana}, ${fechaFormateada}`; // Agregar día de la semana

    if (!agrupadas[fechaCompleta]) {
      agrupadas[fechaCompleta] = [];
    }
    agrupadas[fechaCompleta].push(tarea);
  });

  const fechasOrdenadas = Object.keys(agrupadas).sort((a, b) => {
    const [diaA, mesA, anioA] = a.split('/').map(Number);
    const [diaB, mesB, anioB] = b.split('/').map(Number);
    return new Date(anioA, mesA - 1, diaA).getTime() - new Date(anioB, mesB - 1, diaB).getTime();
  });

  const agrupadasOrdenadas: Record<string, any[]> = {};
  fechasOrdenadas.forEach((fecha) => {
    agrupadasOrdenadas[fecha] = agrupadas[fecha];
  });

  return agrupadasOrdenadas;
});

// Agregar tarea
const agregarTarea = () => {
  if (!nuevaDescripcion.value || !fecha.value || !hora.value) {
    alert('Todos los campos son obligatorios');
    return;
  }
  taskStore.agregarTarea(hora.value, nuevaDescripcion.value, fecha.value);
  nuevaDescripcion.value = '';
  fecha.value = '';
  hora.value = '';
  mostrarModal.value = false;
};

// Eliminar tarea
const eliminarTarea = (id: string) => {
  taskStore.eliminarTarea(id);
};

// Ruta actual
const rutaActual = ref(router.currentRoute.value.path);
router.afterEach((to) => {
  rutaActual.value = to.path;
});

// Links
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

.grupo-dia {
  margin-bottom: 20px;
}

.fecha-dia {
  font-size: 1.2rem;
  font-weight: bold;
  color: #ffffff;
  padding: 10px;
  background: #800000;
  margin-bottom: 10px;
  border-radius: 5px;
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
</style>
