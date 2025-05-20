// src/stores/taskStore.ts
import { defineStore } from 'pinia';
import { ref, computed, watch } from 'vue';
import { programarNotificacion, cancelarNotificacion } from '@/utils/notifications';

export interface Tarea {
  id: string;
  hora: string;
  descripcion: string;
  fecha: string;
  completado: boolean;
  notificacionId: number;
}

export const useTaskStore = defineStore('taskStore', () => {
  const tareas = ref<Tarea[]>([]);

  // 🟡 Cargar tareas desde localStorage
  const cargarTareas = () => {
    const data = localStorage.getItem('tareas');
    if (data) {
      tareas.value = JSON.parse(data);
    }
  };

  // 🟢 Guardar tareas cada vez que se actualicen
  watch(tareas, (nuevas) => {
    localStorage.setItem('tareas', JSON.stringify(nuevas));
  }, { deep: true });

  // 🟠 Agregar tarea con notificación
  const agregarTarea = (hora: string, descripcion: string, fecha: string) => {
    const notifId = Date.now();
    const nueva: Tarea = {
      id: crypto.randomUUID(),
      hora,
      descripcion,
      fecha,
      completado: false,
      notificacionId: notifId
    };
    tareas.value.push(nueva);

    const fechaHora = new Date(`${fecha}T${hora}`);
    if (fechaHora > new Date()) {
      programarNotificacion(notifId, 'Recordatorio', descripcion, fechaHora);
    }
  };

  // 🔴 Eliminar tarea
  const eliminarTarea = (id: string) => {
    const tarea = tareas.value.find(t => t.id === id);
    if (tarea) {
      cancelarNotificacion(tarea.notificacionId);
      tareas.value = tareas.value.filter(t => t.id !== id);
    }
  };

  const toggleCompletado = (id: string, estado: boolean) => {
    const tarea = tareas.value.find(t => t.id === id);
    if (tarea) tarea.completado = estado;
  };

  const tareasOrdenadas = computed(() => {
    return tareas.value.slice().sort((a, b) => {
      const fechaA = new Date(`${a.fecha}T${a.hora}`);
      const fechaB = new Date(`${b.fecha}T${b.hora}`);
      return fechaA.getTime() - fechaB.getTime();
    });
  });

  const progreso = computed(() => {
    const total = tareas.value.length;
    const completadas = tareas.value.filter(t => t.completado).length;
    return total ? Math.round((completadas / total) * 100) : 0;
  });

  return {
    tareas,
    tareasOrdenadas,
    progreso,
    cargarTareas,
    agregarTarea,
    eliminarTarea,
    toggleCompletado
  };
});
