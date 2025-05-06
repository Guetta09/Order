<template>
  <ion-page>
    <!-- Barra de Navegación -->
    <ion-header>
      <ion-toolbar class="toolbar-custom">
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
      <!-- Botón para agregar tarea -->
      <ion-fab slot="fixed" vertical="bottom" horizontal="center" style="bottom: 80px;">
        <ion-fab-button @click="mostrarModal = true">
          <ion-icon :icon="add" />
        </ion-fab-button>
      </ion-fab>

      <!-- MODAL para agregar tarea -->
      <ion-modal :is-open="mostrarModal" @didDismiss="mostrarModal = false">
        <ion-header>
          <ion-toolbar class="toolbar-custom">
            <ion-title class="titulo-modal">Agregar Tarea</ion-title>
            <ion-buttons slot="end">
              <ion-button @click="mostrarModal = false" fill="clear" class="boton-cerrar">
                <ion-icon :icon="close" />
              </ion-button>
            </ion-buttons>
          </ion-toolbar>
        </ion-header>

        <ion-content class="ion-padding fondo-oscuro">
          <div class="form-container">
            <ion-item>
              <ion-label position="floating">Nombre</ion-label>
              <ion-input
                v-model="nuevaDescripcion"
                placeholder="Escribe el nombre de la tarea"
              ></ion-input>
            </ion-item>

            <ion-item>
              <ion-label position="floating">Hora</ion-label>
              <ion-datetime
                v-model="hora"
                presentation="time"
                hour-cycle="h23"
                class="transparente"
              ></ion-datetime>
            </ion-item>

            <ion-item>
              <ion-label position="floating">Fecha</ion-label>
              <ion-datetime
                v-model="fecha"
                presentation="date"
                class="transparente"
              ></ion-datetime>
            </ion-item>

            <ion-button
              expand="block"
              @click="agregarTarea"
              class="boton-guardar"
            >
              Guardar Tarea
            </ion-button>
          </div>
        </ion-content>
      </ion-modal>

      <!-- Lista de tareas -->
      <ion-list>
        <ion-item
          v-for="(tarea, index) in taskStore.tareasOrdenadas"
          :key="index"
        >
          <ion-label>
            <h2>{{ tarea.descripcion }}</h2>
            <p>{{ formatearFecha(tarea.fecha) }} - {{ tarea.hora }}</p>
          </ion-label>
          <ion-button @click="eliminarTarea(index)" color="danger">
            Eliminar
          </ion-button>
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
  IonModal,
  IonButton,
  IonInput,
  IonLabel,
  IonDatetime,
  IonFab,
  IonFabButton,
  IonIcon,
  IonButtons,
  IonList,
  IonItem,
} from "@ionic/vue";
import { add, close } from "ionicons/icons";
import { ref } from "vue";
import { useTaskStore } from "@/stores/taskStore";
import { useRoute } from "vue-router";

const taskStore = useTaskStore();
const route = useRoute();

const mostrarModal = ref(false);
const nuevaDescripcion = ref("");
const fecha = ref("");
const hora = ref("");
const rutaActual = route.path;

const agregarTarea = () => {
  if (!nuevaDescripcion.value || !fecha.value || !hora.value) {
    alert("Por favor completa todos los campos");
    return;
  }

  taskStore.agregarTarea(hora.value, nuevaDescripcion.value, fecha.value);

  nuevaDescripcion.value = "";
  fecha.value = "";
  hora.value = "";
  mostrarModal.value = false;
};

const eliminarTarea = (index: number) => {
  taskStore.eliminarTarea(index);
};

const formatearFecha = (fecha: string) => {
  const date = new Date(fecha);
  const options: Intl.DateTimeFormatOptions = {
    day: "2-digit",
    month: "short",
  };
  return new Intl.DateTimeFormat("es-ES", options).format(date);
};

const navLinks = [
  { label: "Home", route: "/home" },
  { label: "Tareas", route: "/tareas" },
  { label: "Resumen", route: "/resumen" },
  { label: "Configuración", route: "/configuracion" },
];

const logout = () => {
  alert("Cerrar sesión");
};
</script>

<style scoped>
/* Asegúrate de que el texto en la barra de navegación sea blanco */
.toolbar-custom {
  --background: #7d0a0a !important;
  --ion-toolbar-background: #80000082 !important;
  --ion-background-color: #800000 !important;
  color: rgb(255, 255, 255) !important; /* Asegura que todo el texto en la barra de navegación sea blanco */
}

.toolbar-custom ion-title,
.toolbar-custom ion-button {
  color: rgb(255, 255, 255) !important; /* Blanco en el título y los botones de la barra */
}

/* Estilo para el texto del botón "Agregar Tarea" */
ion-fab-button {
  --color: white; /* Blanco para el ícono del botón "Agregar Tarea" */
}

/* Estilo para la "X" del modal */
.boton-cerrar {
  color: rgb(255, 255, 255) !important; /* Blanco para el botón de cierre */
  font-size: 24px;
}

/* Asegúrate que la "X" del modal sea blanca */
ion-modal .boton-cerrar ion-icon {
  color: rgb(255, 255, 255) !important;
}

/* Asegúrate de que el texto en la barra de navegación sea blanco */
ion-datetime {
  --background: transparent !important;  /* Fondo transparente */
  --color: white !important;  /* Texto blanco */
  --border-color: transparent !important;  /* Sin borde */
  --placeholder-color: rgba(255, 255, 255, 0.7) !important;  /* Color del texto placeholder */
}

/* Hacer que el fondo de la selección del reloj también sea transparente */
ion-datetime .datetime-text {
  color: white !important;  /* Asegura que el texto sea blanco */
}

ion-datetime .datetime-picker {
  background: transparent !important;  /* Fondo transparente en el selector de hora */
}

/* Ajuste de los selectores (de hora, minutos, etc.) */
ion-datetime .datetime-column {
  color: white !important;  /* Asegura que los números de hora, minutos, etc., sean blancos */
  background: transparent !important;  /* Fondo transparente */
}

/* Asegurando que todo el contenido de la página tenga fondo oscuro */
.fondo-oscuro {
  --background: #2e2e2e;
  background-color: #2e2e2e !important;
  color: rgba(255, 255, 255, 0);
}

ion-content {
  --background: #2e2e2e !important;
  background-color: #f5f4f400 !important;
  color: rgb(41, 40, 40);
  min-height: 100vh;
}

ion-list {
  --background: transparent;
  background-color: transparent !important;
  padding: 0;
}

ion-item {
  --background: transparent;
  background-color: transparent !important;
  color: rgb(255, 255, 255) !important;
  border-bottom: 1px solid #ffffff;
  border-radius: 8px;
  margin-bottom: 10px;
}

ion-label h2,
ion-label p {
  margin: 0;
  color: rgb(255, 255, 255);
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
  border: 2px solid rgba(17, 16, 16, 0.4);
}

.form-container {
  background-color: #0303038a;
  padding: 20px;
  border-radius: 10px;
}

/* Espaciado entre los campos del formulario */
.form-container ion-item {
  margin-bottom: 20px; /* Aumenta el margen entre cada ion-item */
}

/* Agrega más espacio entre la etiqueta y el campo de texto */
ion-item ion-label {
  margin-bottom: 10px; /* Agrega espacio entre la etiqueta y el campo de entrada */
}

/* Ajusta el espaciado entre el campo de texto (Nombre) y la hora */
ion-item ion-input {
  margin-bottom: 15px; /* Espacio después del campo de entrada de Nombre */
}

/* Separador entre Nombre y Hora, con más margen */
ion-item:nth-child(2) {
  margin-top: 20px; /* Agrega más espacio arriba del campo Hora */
}

/* Separador entre Hora y Fecha (calendario), con más margen */
ion-item:nth-child(3) {
  margin-top: 20px; /* Agrega más espacio arriba del campo Fecha */
}

/* Estilo para la palabra 'Agregar Tarea' */
.titulo-modal {
  color: rgb(255, 255, 255);
  font-weight: bold;
}
</style>
