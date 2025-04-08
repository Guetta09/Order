<template>
    <ion-page>
      <ion-header>
        <ion-toolbar>
          <ion-title>Configuración</ion-title>
        </ion-toolbar>
      </ion-header>
  
      <ion-content class="ion-padding">
        <ion-item>
          <ion-label>Modo oscuro</ion-label>
          <ion-toggle />
        </ion-item>
  
        <ion-item>
          <ion-label>Notificaciones</ion-label>
          <ion-toggle />
        </ion-item>
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
    IonItem,
    IonLabel,
    IonToggle,
  } from '@ionic/vue';
  </script>
  