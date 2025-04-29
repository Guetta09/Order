<template>
  <ion-page>
    <ion-header>
      <ion-toolbar style="--background: #800000;">
        <ion-title style="color: white; text-align: center;">Resumen de Estadísticas</ion-title>
      </ion-toolbar>
    </ion-header>

    <ion-content class="ion-padding fondo-oscuro" :fullscreen="true">
      <h1 style="text-align: center; color: white;">Tu efectividad semanal</h1>

      <!-- Gráfico de efectividad -->
      <div class="grafico-container">
        <canvas id="graficoEfectividad"></canvas>
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
  IonContent,
} from '@ionic/vue';

import { onMounted } from 'vue';
import { Chart, BarController, BarElement, CategoryScale, LinearScale, Tooltip, Legend } from 'chart.js';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { db } from '../firebase'; // Asegúrate de tener tu instancia de Firestore lista

// Registrar componentes de Chart.js
Chart.register(BarController, BarElement, CategoryScale, LinearScale, Tooltip, Legend);

// Crear el gráfico una vez que la página esté montada
onMounted(async () => {
  const tareasPorDia = {
    lunes: 0,
    martes: 0,
    miércoles: 0,
    jueves: 0,
    viernes: 0,
    sábado: 0,
    domingo: 0,
  };

  const now = new Date();
  const startOfWeek = new Date(now);
  startOfWeek.setDate(now.getDate() - now.getDay() + 1); // Lunes de la semana

  // Traer tareas completadas de Firestore
  const tareasRef = collection(db, 'tareas');
  const q = query(tareasRef, where('completed', '==', true));
  const snapshot = await getDocs(q);

  snapshot.forEach(doc => {
    const tarea = doc.data();
    const completedAt = tarea.completedAt?.toDate ? tarea.completedAt.toDate() : new Date(tarea.completedAt);

    if (completedAt >= startOfWeek) {
      const dayIndex = completedAt.getDay();
      const dias = ['domingo', 'lunes', 'martes', 'miércoles', 'jueves', 'viernes', 'sábado'];
      const diaNombre = dias[dayIndex] as keyof typeof tareasPorDia;
      if (tareasPorDia[diaNombre] !== undefined) {
        tareasPorDia[diaNombre]++;
      }
    }
  });

  // Definimos cuántas tareas posibles máximas hay por día (puedes ajustar)
  const maxTareasDia = 6;

  const ctx = document.getElementById('graficoEfectividad') as HTMLCanvasElement;

  const data = {
    labels: ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado', 'Domingo'],
    datasets: [{
      label: '% de efectividad',
      data: [
        (tareasPorDia.lunes / maxTareasDia) * 100,
        (tareasPorDia.martes / maxTareasDia) * 100,
        (tareasPorDia.miércoles / maxTareasDia) * 100,
        (tareasPorDia.jueves / maxTareasDia) * 100,
        (tareasPorDia.viernes / maxTareasDia) * 100,
        (tareasPorDia.sábado / maxTareasDia) * 100,
        (tareasPorDia.domingo / maxTareasDia) * 100,
      ],
      backgroundColor: '#4caf50',
    }]
  };

  new Chart(ctx, {
    type: 'bar',
    data: data,
    options: {
      responsive: true,
      plugins: {
        legend: {
          display: false,
        },
        tooltip: {
          callbacks: {
            label: (context) => `${context.parsed.y.toFixed(1)}%`
          }
        }
      },
      scales: {
        y: {
          beginAtZero: true,
          max: 100,
          title: {
            display: true,
            text: 'Porcentaje de tareas completadas'
          }
        }
      }
    }
  });
});
</script>


<style scoped>
.fondo-oscuro {
  --background: #ffffff;
  color: #af0707;
}

.grafico-container {
  margin-top: 30px;
  background: rgb(0, 0, 0);
  border-radius: 8px;
  padding: 16px;
}
</style>


  