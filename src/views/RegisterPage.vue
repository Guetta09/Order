<template>
    <ion-page>
      <ion-header>
        <ion-toolbar>
          <ion-title>Registro</ion-title>
        </ion-toolbar>
      </ion-header>
      <ion-content class="ion-padding">
        <ion-input v-model="email" placeholder="Correo Electrónico"></ion-input>
        <ion-input v-model="password" type="password" placeholder="Contraseña"></ion-input>
        <ion-button expand="full" @click="register">Registrarse</ion-button>
        <p>¿Ya tienes cuenta? <router-link to="/">Iniciar sesión</router-link></p>
      </ion-content>
    </ion-page>
  </template>
  
  <script setup lang="ts">
  import { IonPage, IonHeader, IonToolbar, IonTitle, IonContent, IonInput, IonButton } from '@ionic/vue';
  import { ref } from 'vue';
  import { auth } from '../firebase';
  import { createUserWithEmailAndPassword } from "firebase/auth";
  import { useRouter } from 'vue-router';
  
  const email = ref('');
  const password = ref('');
  const router = useRouter();
  
  const register = async () => {
    try {
      await createUserWithEmailAndPassword(auth, email.value, password.value);
      alert("Registro exitoso");
      router.push('/dashboard'); // Redirige al usuario al Dashboard
    } catch (error: any) {
      alert(error.message);
    }
  };
  </script>
  