<template>
    <ion-page>
      <ion-content class="login-container">
        <div class="form-wrapper">
          <h1>Recuperar Contraseña</h1>
  
          <input
            placeholder="Correo Electrónico"
            v-model="email"
            class="input"
            name="email"
            type="email"
          />
  
          <button class="login-button" @click="recoverPassword" :disabled="loading">
            {{ loading ? 'Enviando...' : 'Enviar enlace de recuperación' }}
          </button>
  
          <p>
            <router-link to="/">Me acordé de la clave socio, chao!</router-link>
          </p>
        </div>
      </ion-content>
    </ion-page>
  </template>
  
  <script setup lang="ts">
  import { IonPage, IonContent } from '@ionic/vue';
  import { ref } from 'vue';
  import { sendPasswordResetEmail } from 'firebase/auth';
  import { auth } from '../firebase';
  
  const email = ref('');
  const loading = ref(false);
  
  const recoverPassword = async () => {
    if (!email.value) {
      alert("Por favor, introduce tu correo electrónico.");
      return;
    }
  
    loading.value = true;
  
    try {
      await sendPasswordResetEmail(auth, email.value);
      alert("Se ha enviado un enlace de recuperación a tu correo.");
    } catch (error: any) {
      handleRecoveryError(error.code);
    } finally {
      loading.value = false;
    }
  };
  
  const handleRecoveryError = (code: string) => {
    switch (code) {
      case "auth/user-not-found":
        alert("No hay ninguna cuenta con ese correo.");
        break;
      case "auth/invalid-email":
        alert("Correo electrónico inválido.");
        break;
      default:
        alert("Hubo un error. Intenta nuevamente.");
    }
  };
  </script>
  
  <style scoped>
  /* Usa los mismos estilos del login para mantener coherencia */
  @import url('https://fonts.googleapis.com/css2?family=Nunito:wght@300;400;600;700&display=swap');
  
  :root {
    --main-font: 'Nunito', sans-serif;
    --main-color: #352208;
    --accent-color: #e1bb80;
  }
  
  .login-container {
    display: flex;
    align-items: center;
    justify-content: center;
    height: 100%;
    background: linear-gradient(135deg, #e1bb80, #9d8149);
    font-family: var(--main-font);
    padding-top: 60px;
  }
  
  .form-wrapper {
    width: 90%;
    max-width: 400px;
    padding: 30px;
    background: #fff;
    border-radius: 12px;
    box-shadow: 0px 8px 20px rgba(53, 34, 8, 0.3);
    text-align: center;
    margin: 50px auto 0 auto;
    border: 2px solid #e1bb80;
    font-family: var(--main-font);
  }
  
  h1 {
    margin-bottom: 25px;
    color: #352208;
    font-weight: 700;
    font-size: 28px;
  }
  
  .input {
    font-family: var(--main-font);
    width: 100%;
    padding: 0.875rem;
    font-size: 1rem;
    border: 1.5px solid #352208;
    border-radius: 0.5rem;
    box-shadow: 2.5px 3px 0 #352208;
    outline: none;
    transition: ease 0.25s;
    background-color: #f9f4e8;
    color: #352208;
    margin-bottom: 16px;
  }
  
  .login-button {
    --color: #352208;
    font-family: var(--main-font);
    width: 100%;
    height: 2.8em;
    margin: 20px 0 5px;
    cursor: pointer;
    border: 2px solid var(--color);
    font-size: 17px;
    border-radius: 8px;
    font-weight: 600;
    color: var(--color);
    background-color: transparent;
    position: relative;
    overflow: hidden;
    transition: color 0.5s;
    z-index: 1;
  }
  
  .login-button:before {
    content: "";
    position: absolute;
    background: var(--color);
    height: 150px;
    width: 200px;
    border-radius: 50%;
    top: 100%;
    left: 100%;
    transition: all 0.7s;
    z-index: -1;
  }
  
  .login-button:hover {
    color: #fff;
  }
  
  .login-button:hover:before {
    top: -30px;
    left: -30px;
  }
  
  .login-button:active:before {
    background: #5a3d17;
    transition: background 0s;
  }
  
  p {
    margin-top: 20px;
    color: #6f5b3e;
    font-family: var(--main-font);
    font-weight: 400;
  }
  
  a {
    color: #352208;
    font-weight: 600;
    text-decoration: none;
    transition: color 0.3s ease;
  }
  
  a:hover {
    color: #e1bb80;
    text-decoration: underline;
  }
  </style>
  