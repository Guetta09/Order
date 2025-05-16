// src/stores/taskStore.ts
import { defineStore } from 'pinia';
import { ref, computed, watch } from 'vue';

export interface Tarea {
  id: string;
  hora: string;
  descripcion: string;
  fecha: string;
  completado: boolean;
}

export const useTaskStore = defineStore('taskStore', () => {
  const tareas = ref<Tarea[]>([]);

  // 🔁 Cargar tareas desde localStorage al inicio
  const cargarTareas = () => {
    const data = localStorage.getItem('tareas');
    if (data) {
      tareas.value = JSON.parse(data);
    }
  };

  // 💾 Guardar automáticamente en localStorage cada vez que cambian las tareas
  watch(tareas, (nuevas) => {
    localStorage.setItem('tareas', JSON.stringify(nuevas));
  }, { deep: true });

  const agregarTarea = (hora: string, descripcion: string, fecha: string) => {
    const nueva: Tarea = {
      id: crypto.randomUUID(),
      hora,
      descripcion,
      fecha,
      completado: false
    };
    tareas.value.push(nueva);
  };

  const eliminarTarea = (id: string) => {
    tareas.value = tareas.value.filter(t => t.id !== id);
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
// pinia.config.ts 
import { createPinia } from 'pinia';
import piniaPluginPersistedstate from 'pinia-plugin-persistedstate';

const pinia = createPinia();
pinia.use(piniaPluginPersistedstate);

export default pinia;
