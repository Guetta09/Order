<template>
  <ion-page>
    <ion-header>
      <ion-toolbar style="--background: #800000;">
        <ion-title style="color: white; text-align: center;">Resumen de Estadísticas</ion-title>
      </ion-toolbar>
    </ion-header>

    <ion-content class="ion-padding fondo-oscuro" :fullscreen="true">
      <h1 style="text-align: center; color: white;">Tu efectividad semanal</h1>

      <div class="grafico-container">
        <Bar :data="chartData" :options="chartOptions" />
      </div>
    </ion-content>
  </ion-page>
</template>

<script setup lang="ts">
import { IonPage, IonHeader, IonToolbar, IonTitle, IonContent } from '@ionic/vue';
import { Bar } from 'vue-chartjs';
import { Chart as ChartJS, Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale } from 'chart.js';
import { useTaskStore } from '@/stores/taskStore';
import { computed } from 'vue';

ChartJS.register(Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale);

const taskStore = useTaskStore();

const tareasPorDia = computed(() => {
  const dias = ['domingo', 'lunes', 'martes', 'miércoles', 'jueves', 'viernes', 'sábado'];
  const conteo: Record<string, number> = {
    lunes: 0, martes: 0, miércoles: 0, jueves: 0, viernes: 0, sábado: 0, domingo: 0
  };

  for (const tarea of taskStore.tareas) {
    if (tarea.completado) {
      const fecha = new Date(tarea.fecha);
      const diaNombre = dias[fecha.getDay()];
      conteo[diaNombre]++;
    }
  }

  return conteo;
});

const chartData = computed(() => ({
  labels: ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado', 'Domingo'],
  datasets: [
    {
      label: '% de efectividad',
      backgroundColor: '#4caf50',
      data: [
        tareasPorDia.value.lunes * 10,
        tareasPorDia.value.martes * 10,
        tareasPorDia.value.miércoles * 10,
        tareasPorDia.value.jueves * 10,
        tareasPorDia.value.viernes * 10,
        tareasPorDia.value.sábado * 10,
        tareasPorDia.value.domingo * 10,
      ],
      borderRadius: 8
    }
  ]
}));

const chartOptions = {
  responsive: true,
  scales: {
    y: {
      beginAtZero: true,
      max: 100,
      title: {
        display: true,
        text: 'Porcentaje'
      }
    }
  },
  plugins: {
    legend: {
      display: false
    }
  }
};
</script>

<style scoped>
.fondo-oscuro {
  --background: #2e2e2e;
  color: white;
}

.grafico-container {
  margin-top: 30px;
  background: #000;
  border-radius: 8px;
  padding: 16px;
}
</style>
<template>
  <div class="grafico-container">
    <h2>Efectividad Diaria (Barras)</h2>
    <Bar :data="chartData" :options="chartOptions" />
  </div>

  <div class="grafico-container">
    <h2>Porcentaje de Tareas Completadas (Pastel)</h2>
    <Pie :data="pieChartData" :options="pieChartOptions" />
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { Bar, Pie } from 'vue-chartjs';
import {
  Chart as ChartJS,
  Title,
  Tooltip,
  Legend,
  BarElement,
  ArcElement,
  CategoryScale,
  LinearScale
} from 'chart.js';

import { useTaskStore } from '@/stores/taskStore'; // Asegúrate de que la ruta sea correcta

ChartJS.register(
  Title,
  Tooltip,
  Legend,
  BarElement,
  ArcElement,
  CategoryScale,
  LinearScale
);

const taskStore = useTaskStore();

const dias = ['domingo', 'lunes', 'martes', 'miércoles', 'jueves', 'viernes', 'sábado'];

const tareasPorDia = computed(() => {
  const conteo: Record<string, number> = {
    lunes: 0, martes: 0, miércoles: 0, jueves: 0, viernes: 0, sábado: 0, domingo: 0
  };

  for (const tarea of taskStore.tareas) {
    if (tarea.completado) {
      const fecha = new Date(tarea.fecha);
      const diaNombre = dias[fecha.getDay()];
      conteo[diaNombre]++;
    }
  }

  return conteo;
});

const chartData = computed(() => ({
  labels: ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado', 'Domingo'],
  datasets: [
    {
      label: '% de efectividad',
      backgroundColor: '#4caf50',
      data: [
        tareasPorDia.value.lunes * 10,
        tareasPorDia.value.martes * 10,
        tareasPorDia.value.miércoles * 10,
        tareasPorDia.value.jueves * 10,
        tareasPorDia.value.viernes * 10,
        tareasPorDia.value.sábado * 10,
        tareasPorDia.value.domingo * 10,
      ],
      borderRadius: 8
    }
  ]
}));

const chartOptions = {
  responsive: true,
  scales: {
    y: {
      beginAtZero: true,
      max: 100,
      title: {
        display: true,
        text: 'Porcentaje'
      }
    }
  },
  plugins: {
    legend: {
      display: false
    }
  }
};

const pieChartData = computed(() => {
  const completadas: Record<string, number> = {
    lunes: 0, martes: 0, miércoles: 0, jueves: 0, viernes: 0, sábado: 0, domingo: 0
  };
  const totales: Record<string, number> = {
    lunes: 0, martes: 0, miércoles: 0, jueves: 0, viernes: 0, sábado: 0, domingo: 0
  };

  for (const tarea of taskStore.tareas) {
    const fecha = new Date(tarea.fecha);
    const diaNombre = dias[fecha.getDay()];
    totales[diaNombre]++;
    if (tarea.completado) {
      completadas[diaNombre]++;
    }
  }

  const porcentajes = dias.map(dia => {
    const diaKey = dia as keyof typeof totales;
    return totales[diaKey] === 0 ? 0 : Math.round((completadas[diaKey] / totales[diaKey]) * 100);
  });

  return {
    labels: ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado', 'Domingo'],
    datasets: [{
      label: 'Tareas completadas (%)',
      backgroundColor: ['#4caf50', '#2196f3', '#ff9800', '#9c27b0', '#00bcd4', '#ffc107', '#f44336'],
      data: porcentajes
    }]
  };
});

const pieChartOptions = {
  responsive: true,
  plugins: {
    legend: {
      position: 'bottom'
    },
    tooltip: {
      callbacks: {
        label: function (context: any) {
          return `${context.label}: ${context.parsed}%`;
        }
      }
    }
  }
};
</script>

<style scoped>
.grafico-container {
  margin-top: 30px;
  background: #1e1e1e;
  border-radius: 8px;
  padding: 16px;
  color: white;
}
</style>
