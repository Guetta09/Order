<template>
  <ion-page>
    <ion-header>
      <ion-toolbar class="toolbar-custom">
        <ion-title>Tareas</ion-title>
      </ion-toolbar>
    </ion-header>

    <ion-content class="fondo-oscuro ion-padding">
      <ion-fab slot="fixed" vertical="bottom" horizontal="center" style="bottom: 80px;">
        <ion-fab-button @click="mostrarModal = true">
          <ion-icon :icon="add" />
        </ion-fab-button>
      </ion-fab>

      <!-- Modal para agregar tareas -->
      <ion-modal :is-open="mostrarModal" @didDismiss="mostrarModal = false">
        <ion-header>
          <ion-toolbar class="toolbar-custom">
            <ion-title>Agregar Tarea</ion-title>
            <ion-buttons slot="end">
              <ion-button @click="mostrarModal = false" fill="clear">
                <ion-icon :icon="close" />
              </ion-button>
            </ion-buttons>
          </ion-toolbar>
        </ion-header>
        <ion-content class="ion-padding fondo-oscuro">
          <ion-item>
            <ion-label position="floating">Nombre</ion-label>
            <ion-input v-model="nuevaDescripcion" />
          </ion-item>
          <ion-item>
            <ion-label position="floating">Hora</ion-label>
            <ion-datetime v-model="hora" presentation="time" hour-cycle="h23" />
          </ion-item>
          <ion-item>
            <ion-label position="floating">Fecha</ion-label>
            <ion-datetime v-model="fecha" presentation="date" />
          </ion-item>
          <ion-button expand="block" @click="agregarTarea">Guardar</ion-button>
        </ion-content>
      </ion-modal>

      <!-- Lista de tareas -->
      <ion-list>
        <ion-item v-for="tarea in taskStore.tareasOrdenadas" :key="tarea.id">
          <ion-label>
            <h2>{{ tarea.descripcion }}</h2>
            <p>{{ formatearFecha(tarea.fecha) }} - {{ tarea.hora }}</p>
          </ion-label>
          <ion-checkbox :checked="tarea.completado" @ionChange="cambiarEstado(tarea.id!, $event.detail.checked)" />
          <ion-button color="danger" @click="eliminarTarea(tarea.id!)">Eliminar</ion-button>
        </ion-item>
      </ion-list>
    </ion-content>
  </ion-page>
</template>

<script setup lang="ts">
import {
  IonPage, IonHeader, IonToolbar, IonTitle, IonContent,
  IonFab, IonFabButton, IonModal, IonButton, IonInput,
  IonLabel, IonDatetime, IonIcon, IonItem, IonCheckbox, IonList, IonButtons
} from '@ionic/vue';
import { ref, onMounted } from 'vue';
import { add, close } from 'ionicons/icons';
import { useTaskStore } from '@/stores/taskStore';

const taskStore = useTaskStore();
const mostrarModal = ref(false);
const nuevaDescripcion = ref('');
const fecha = ref('');
const hora = ref('');

onMounted(() => {
  taskStore.cargarTareas();
});

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

const eliminarTarea = (id: string) => {
  taskStore.eliminarTarea(id);
};

const cambiarEstado = (id: string, estado: boolean) => {
  taskStore.toggleCompletado(id, estado);
};

const formatearFecha = (fecha: string) => {
  const date = new Date(fecha);
  return new Intl.DateTimeFormat('es-ES', { day: '2-digit', month: 'short' }).format(date);
};
</script>

<style scoped>
.fondo-oscuro {
  --background: #2e2e2e;
  background-color: #2e2e2e !important;
  color: white;
}
.toolbar-custom {
  --background: #7d0a0a;
  color: white;
}
</style>
