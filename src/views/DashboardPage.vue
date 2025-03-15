<template>
    <ion-page>
      <ion-header>
        <ion-toolbar>
          <ion-title>Dashboard</ion-title>
          <ion-buttons slot="end">
            <ion-button @click="logout">Cerrar Sesión</ion-button>
          </ion-buttons>
        </ion-toolbar>
      </ion-header>
      <ion-content class="ion-padding">
        <h2>Bienvenido al Dashboard</h2>
      </ion-content>
    </ion-page>
  </template>
  
  <script setup lang="ts">
  import { IonPage, IonHeader, IonToolbar, IonTitle, IonContent, IonInput, IonButton } from '@ionic/vue';
  import { auth } from '../firebase';
  import { signOut } from "firebase/auth";
  import { useRouter } from 'vue-router';
  
  const router = useRouter();
  
  const logout = async () => {
    await signOut(auth);
    router.push('/');
  };
  </script>
  