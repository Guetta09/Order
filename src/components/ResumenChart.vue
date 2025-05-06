<template>
  <Bar :data="chartData" :options="chartOptions" />
</template>

<script setup lang="ts">
import { Bar } from 'vue-chartjs';
import {
  Chart as ChartJS,
  Title,
  Tooltip,
  Legend,
  BarElement,
  CategoryScale,
  LinearScale,
} from 'chart.js';

import { computed } from 'vue';
import { useTaskStore } from '@/stores/taskStore';

ChartJS.register(Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale);

const taskStore = useTaskStore();

const chartData = computed(() => ({
  labels: ['Hábitos'],
  datasets: [
    {
      label: 'Progreso',
      backgroundColor: taskStore.progreso > 0 ? '#4caf50' : '#ccc',
      data: [taskStore.progreso],
      borderRadius: 10,
    },
  ],
}));

const chartOptions = {
  responsive: true,
  scales: {
    y: {
      beginAtZero: true,
      max: 100,
    },
  },
};
</script>
