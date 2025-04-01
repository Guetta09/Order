<!-- RegisterPage.vue -->
<template>
  <ion-page>
    <ion-content class="register-container">
      <div class="form-wrapper">
        <h1>Registro</h1>
        
        <input placeholder="Correo Electrónico" v-model="email" class="input" name="email" type="email" />
        <input placeholder="Contraseña" v-model="password" class="input" name="password" type="password" />
        
        <button class="register-button" @click="register">Registrarse</button>
        <p>¿Ya tienes cuenta? <router-link to="/">Iniciar sesión</router-link></p>
      </div>
    </ion-content>
  </ion-page>
</template>

<script setup lang="ts">
import { IonPage, IonContent } from '@ionic/vue';
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
    router.push('/dashboard');
  } catch (error: any) {
    alert(error.message);
  }
};
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Nunito:wght@300;400;600;700&display=swap');

:root {
  --main-font: 'Nunito', sans-serif;
  --main-color: #352208;
  --accent-color: #e1bb80;
}

.register-container {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100%;
  background: linear-gradient(135deg, #e1bb80, #9d8149);
  font-family: var(--main-font);
  
}

.form-wrapper {
  width: 90%;
  max-width: 400px;
  padding: 30px;
  background: #fff;
  border-radius: 12px;
  box-shadow: 0px 8px 20px rgba(53, 34, 8, 0.3);
  text-align: center;
  margin: 50px auto 0 auto; /* Baja el cuadro */
  border: 2px solid #e1bb80;
  font-family: var(--main-font);
}


h1 {
  margin-bottom: 25px;
  color: #352208;
  font-weight: 700;
  letter-spacing: 0.5px;
  font-family: var(--main-font);
  font-size: 28px;
}

.input {
  font-family: var(--main-font);
  width: 100%;
  max-width: 100%;
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
  box-sizing: border-box;
}

.input::placeholder {
  color: #9d8149;
  opacity: 0.7;
}

.input:focus {
  box-shadow: 4px 5px 0 #352208;
  border-color: #e1bb80;
}

.register-button {
  --color: #352208;
  font-family: var(--main-font);
  display: inline-block;
  width: 100%;
  height: 2.8em;
  line-height: 2.5em;
  margin: 20px 0 5px;
  position: relative;
  cursor: pointer;
  overflow: hidden;
  border: 2px solid var(--color);
  transition: color 0.4s ease-in-out, background 0.4s ease-in-out;
  z-index: 1;
  font-size: 17px;
  border-radius: 8px;
  font-weight: 600;
  color: var(--color);
  background-color: transparent;
}

.register-button::before {
  content: "";
  position: absolute;
  z-index: -1;
  background: var(--color);
  height: 300%;
  width: 300%;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%) scale(0);
  transition: transform 0.4s ease-in-out;
  border-radius: 50%;
}

.register-button:hover {
  color: #fff;
  background-color: var(--color);
}

.register-button:hover::before {
  transform: translate(-50%, -50) scale(1);
}



.register-button:active:before {
  background: #5a3d17;
  transition: background 0.7s;
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