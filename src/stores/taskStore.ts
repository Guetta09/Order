import { defineStore } from 'pinia';
import { ref, computed } from 'vue';

export interface Tarea {
  hora: string;
  descripcion: string;
  fecha: string; // Nueva propiedad
  completado: boolean;
}

export const useTaskStore = defineStore('taskStore', () => {
  const tareas = ref<Tarea[]>([
    { hora: '6:00', descripcion: 'Despertar', fecha: '2025-05-05', completado: true },
    { hora: '7:00', descripcion: 'Desayuno', fecha: '2025-05-05', completado: false },
    { hora: '8:00', descripcion: 'Ir a clase', fecha: '2025-05-05', completado: false },
  ]);

  const agregarTarea = (hora: string, descripcion: string, fecha: string) => {
    tareas.value.push({ hora, descripcion, fecha, completado: false });
  };

  const eliminarTarea = (index: number) => {
    tareas.value.splice(index, 1);
  };

  // Computed para ordenar por fecha y hora
  const tareasOrdenadas = computed(() => {
    return tareas.value.slice().sort((a, b) => {
      const fechaHoraA = new Date(`${a.fecha}T${a.hora}`);
      const fechaHoraB = new Date(`${b.fecha}T${b.hora}`);
      return fechaHoraA.getTime() - fechaHoraB.getTime();
    });
  });

  
  // Progreso gráfico (tareas completas %)
  const progreso = computed(() => {
    const total = tareas.value.length;
    const completadas = tareas.value.filter(t => t.completado).length;
    return total ? Math.round((completadas / total) * 100) : 0;
  });

  return {
    tareas,
    tareasOrdenadas,
    agregarTarea,
    eliminarTarea,
    progreso
  };
});
