<template>
  <ion-page>
    <ion-header>
      <ion-toolbar style="--background: #800000;">
        <ion-buttons slot="start">
          <ion-button @click="goBack" color="light">
            <img src="@/components/icons/atras.png" alt="Atrás" style="height: 20px; margin-right: 8px;" />
            Atrás
          </ion-button>
        </ion-buttons>
        <ion-title style="color: white; text-align: center;">Resumen de Estadísticas</ion-title>
      </ion-toolbar>
    </ion-header>

    <ion-content class="ion-padding fondo-oscuro" :fullscreen="true">
      <!-- Gráfico de pastel -->
      <div class="grafico-container">
        <h3 style="color: white; text-align: center;">Tareas Completadas</h3>
        <Pie :data="pieChartData" :options="pieChartOptions" />
      </div>

      <!-- Selector de semana -->
      <div class="selector-semana">
        <ion-button @click="abrirSelectorSemana" expand="block" color="tertiary">
          Semana del {{ semanaFormateada }}
        </ion-button>
      </div>

      <!-- Gráfico de barras -->
      <div class="grafico-container">
        <h3 style="color: white; text-align: center;">Efectividad por Día (%)</h3>
        <Bar :data="barChartData" :options="barChartOptions" />
      </div>
    </ion-content>
  </ion-page>
</template>

<script setup lang="ts">
import {
  IonPage, IonHeader, IonToolbar, IonTitle, IonContent,
  IonButtons, IonButton, pickerController
} from '@ionic/vue';
import { Pie, Bar } from 'vue-chartjs';
import {
  Chart as ChartJS, Title, Tooltip, Legend, ArcElement,
  BarElement, CategoryScale, LinearScale
} from 'chart.js';
import { computed, ref } from 'vue';
import { useTaskStore } from '@/stores/taskStore';
import { useRouter } from 'vue-router';

ChartJS.register(
  Title, Tooltip, Legend, ArcElement, BarElement, CategoryScale, LinearScale
);

const router = useRouter();
const taskStore = useTaskStore();
const dias = ['domingo', 'lunes', 'martes', 'miércoles', 'jueves', 'viernes', 'sábado'];

// Generar semanas desde la actual
function generarSemanasDesde(actual: Date, cantidad: number) {
  const lista = [];
  const hoy = new Date(actual);
  hoy.setHours(0, 0, 0, 0);

  const diaSemana = hoy.getDay();
  const lunesActual = new Date(hoy);
  lunesActual.setDate(hoy.getDate() - (diaSemana === 0 ? 6 : diaSemana - 1));
  const domingoActual = new Date(lunesActual);
  domingoActual.setDate(lunesActual.getDate() + 6);

  lista.push({ inicio: new Date(lunesActual), fin: new Date(domingoActual) });

  for (let i = 1; i < cantidad; i++) {
    const inicio = new Date(lunesActual);
    const fin = new Date(domingoActual);
    inicio.setDate(inicio.getDate() - 7 * i);
    fin.setDate(fin.getDate() - 7 * i);
    lista.push({ inicio, fin });
  }

  return lista;
}

const semanas = generarSemanasDesde(new Date(), 8);
const semanaSeleccionada = ref(semanas[0]);

const semanaFormateada = computed(() => {
  const sem = semanaSeleccionada.value;
  return `${sem.inicio.toLocaleDateString()} al ${sem.fin.toLocaleDateString()}`;
});

const abrirSelectorSemana = async () => {
  const picker = await pickerController.create({
    columns: [{
      name: 'semanas',
      options: semanas.map((s, index) => ({
        text: `${s.inicio.toLocaleDateString()} - ${s.fin.toLocaleDateString()}`,
        value: index
      }))
    }],
    buttons: [
      { text: 'Cancelar', role: 'cancel' },
      {
        text: 'Aceptar',
        handler: (selected: { semanas: { value: number } }) => {
          semanaSeleccionada.value = semanas[selected.semanas.value];
        }
      }
    ]
  });
  await picker.present();
};

const tareasFiltradasSemana = computed(() => {
  return taskStore.tareas.filter(t => {
    const fecha = new Date(t.fecha);
    return fecha >= semanaSeleccionada.value.inicio && fecha <= semanaSeleccionada.value.fin;
  });
});

// Gráfico de pastel
const pieChartData = computed(() => {
  const completadas = tareasFiltradasSemana.value.filter(t => t.completado).length;
  const pendientes = tareasFiltradasSemana.value.length - completadas;

  return {
    labels: ['Completadas', 'Pendientes'],
    datasets: [{
      backgroundColor: ['#4caf50', '#f44336'],
      data: [completadas, pendientes]
    }]
  };
});

const pieChartOptions = {
  responsive: true,
  plugins: {
    legend: {
      position: 'bottom' as const
    }
  }
};

// Gráfico de barras: efectividad diaria (%)
const tareasPorDia = computed(() => {
  const conteoTotal: Record<string, number> = {
    lunes: 0, martes: 0, miércoles: 0, jueves: 0,
    viernes: 0, sábado: 0, domingo: 0
  };
  const completadas: Record<string, number> = {
    lunes: 0, martes: 0, miércoles: 0, jueves: 0,
    viernes: 0, sábado: 0, domingo: 0
  };

  for (const tarea of tareasFiltradasSemana.value) {
    const fecha = new Date(tarea.fecha);
    const diaNombre = dias[fecha.getDay()];
    conteoTotal[diaNombre]++;
    if (tarea.completado) {
      completadas[diaNombre]++;
    }
  }

  return {
    lunes: calcularPorcentaje(completadas.lunes, conteoTotal.lunes),
    martes: calcularPorcentaje(completadas.martes, conteoTotal.martes),
    miércoles: calcularPorcentaje(completadas.miércoles, conteoTotal.miércoles),
    jueves: calcularPorcentaje(completadas.jueves, conteoTotal.jueves),
    viernes: calcularPorcentaje(completadas.viernes, conteoTotal.viernes),
    sábado: calcularPorcentaje(completadas.sábado, conteoTotal.sábado),
    domingo: calcularPorcentaje(completadas.domingo, conteoTotal.domingo)
  };
});

const calcularPorcentaje = (hechas: number, total: number) => {
  return total === 0 ? 0 : Math.round((hechas / total) * 100);
};

const barChartData = computed(() => ({
  labels: ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado', 'Domingo'],
  datasets: [{
    label: 'Efectividad diaria (%)',
    backgroundColor: '#2196f3',
    data: [
      tareasPorDia.value.lunes,
      tareasPorDia.value.martes,
      tareasPorDia.value.miércoles,
      tareasPorDia.value.jueves,
      tareasPorDia.value.viernes,
      tareasPorDia.value.sábado,
      tareasPorDia.value.domingo
    ]
  }]
}));

const barChartOptions = {
  responsive: true,
  scales: {
    y: {
      beginAtZero: true,
      max: 100
    }
  },
  plugins: {
    legend: {
      display: false
    }
  }
};

const goBack = () => router.push('/home');
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

.selector-semana {
  margin: 20px 0;
  text-align: center;
}
</style>
