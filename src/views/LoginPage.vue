<template>
    <ion-page>
      <ion-header>
        <ion-toolbar>
          <ion-title>Iniciar Sesión</ion-title>
        </ion-toolbar>
      </ion-header>
      <ion-content class="ion-padding">
        <ion-input v-model="email" placeholder="Correo Electrónico"></ion-input>
        <ion-input v-model="password" type="password" placeholder="Contraseña"></ion-input>
        <ion-button expand="full" @click="login">Iniciar Sesión</ion-button>
        <p>¿No tienes cuenta? <router-link to="/register">Regístrate</router-link></p>
      </ion-content>
    </ion-page>
  </template>
  
  <script setup lang="ts">
  import { IonPage, IonHeader, IonToolbar, IonTitle, IonContent, IonInput, IonButton } from '@ionic/vue';
  import { ref } from 'vue';
  import { auth } from '../firebase';
  import { signInWithEmailAndPassword } from "firebase/auth";
  import { useRouter } from 'vue-router';
  
  const email = ref('');
  const password = ref('');
  const router = useRouter();
  
  const login = async () => {
    try {
      await signInWithEmailAndPassword(auth, email.value, password.value);
      alert("Inicio de sesión exitoso");
      router.push('/dashboard'); // Redirige al Dashboard
    } catch (error: any) {
      alert(error.message);
    }
  };
  </script>
  