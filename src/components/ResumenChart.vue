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
  
  ChartJS.register(Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale);
  
  const chartData = {
    labels: ['Habitos'],
    datasets: [
      {
        label: 'Progreso',
        backgroundColor: ['#4caf50', '#2196f3', '#ff9800'],
        data: [0, 0, 0], // Barras vacías inicialmente
        borderRadius: 10,
      },
    ],
  };
  
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
  