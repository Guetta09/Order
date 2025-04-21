import { defineStore } from 'pinia';
import { ref } from 'vue';

export const useTaskStore = defineStore('taskStore', () => {
  const tareas = ref([
    { hora: '6:00 a.m', descripcion: 'Despertar', completado: true },
    { hora: '7:00 a.m', descripcion: 'Desayuno', completado: false },
    { hora: '8:00 a.m', descripcion: 'Ir a clase', completado: false }
  ]);

  const agregarTarea = (hora: string, descripcion: string) => {
    tareas.value.push({ hora, descripcion, completado: false });
  };

  const eliminarTarea = (index: number) => {
    tareas.value.splice(index, 1);
  };

  return {
    tareas,
    agregarTarea,
    eliminarTarea
  };
});
