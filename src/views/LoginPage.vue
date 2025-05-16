<template>
  <ion-page>
    <ion-content class="login-container">
      <div class="form-wrapper">
        <h1>Iniciar Sesión</h1>

        <input placeholder="Correo Electrónico" v-model="email" class="input" name="email" type="email" />
        <input placeholder="Contraseña" v-model="password" class="input" name="password" type="password" />

        <button class="login-button" @click="login" :disabled="loading">
          {{ loading ? 'Ingresando...' : 'Iniciar Sesión' }}
        </button>

        <div class="divider">
          <span>o</span>
        </div>

        <button @click="loginWithGoogle" class="social-button google">
          <img src="@/components/icons/google.png" alt="Google" class="google-icon" />
          <span class="button-text">Iniciar sesión con Google</span>
        </button>

        <div class="links-container">
          <p>¿No tiene cuenta? <router-link to="/register">Regístrese</router-link></p>
          <p><a href="#" @click.prevent="goToRecovery">¿Olvidó su contraseña?</a></p>
        </div>
      </div>
    </ion-content>
  </ion-page>
</template>

<script setup lang="ts">
import { IonPage, IonContent } from '@ionic/vue';
import { ref } from 'vue';
import { auth } from '../firebase';
import { signInWithEmailAndPassword, setPersistence, browserLocalPersistence, signInWithPopup, GoogleAuthProvider } from "firebase/auth";
import { useRouter } from 'vue-router';

const email = ref('');
const password = ref('');
const loading = ref(false);
const router = useRouter();
const googleProvider = new GoogleAuthProvider();

// Persistencia de sesión
setPersistence(auth, browserLocalPersistence).catch((error) => {
  console.error("Error en persistencia de sesión:", error);
});

const login = async () => {
  if (!email.value || !password.value) {
    alert("Por favor completa todos los campos.");
    return;
  }

  loading.value = true;

  try {
    await signInWithEmailAndPassword(auth, email.value, password.value);
    router.push('/dashboard');
  } catch (error: any) {
    handleAuthError(error.code);
  } finally {
    loading.value = false;
  }
};

const loginWithGoogle = async () => {
  try {
    const result = await signInWithPopup(auth, googleProvider);
    router.push('/home');
  } catch (error: any) {
    console.error('Error con Google:', error);
    alert('Error al iniciar sesión con Google.');
  }
};

const handleAuthError = (code: string) => {
  switch (code) {
    case "auth/user-not-found":
      alert("El usuario no existe.");
      break;
    case "auth/wrong-password":
      alert("Contraseña incorrecta.");
      break;
    case "auth/invalid-email":
      alert("Correo electrónico inválido.");
      break;
    default:
      alert("Error al iniciar sesión. Intenta nuevamente.");
  }
};

const goToRecovery = () => {
  router.push('/recover');
};
</script>

<style scoped>
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
  min-height: 100vh;
  padding: 20px;
  background: linear-gradient(135deg, #e1bb80, #9d8149);
  font-family: var(--main-font);
  /* Nuevas propiedades para centrado perfecto */
  width: 100vw;
  height: 100vh;
  margin: 0;
  box-sizing: border-box;
}

.form-wrapper {
  width: 100%;
  max-width: 400px;
  padding: 30px;
  background: #fff;
  border-radius: 12px;
  box-shadow: 0px 8px 20px rgba(53, 34, 8, 0.3);
  text-align: center;
  border: 2px solid #e1bb80;
  /* Asegura que el contenedor esté perfectamente centrado */
  margin: auto;
  /* Si necesitas un desplazamiento vertical específico */
  position: relative;
  top: 5%; /* Ajusta este valor si necesitas subirlo/bajarlo */
}

h1 {
  margin-bottom: 25px;
  color: #352208;
  font-weight: 700;
  letter-spacing: 0.5px;
  font-size: 1.75rem;
}

.input {
  font-family: var(--main-font);
  width: 100%;
  padding: 14px 12px;
  font-size: 1rem;
  border: 1.5px solid #352208;
  border-radius: 8px;
  box-shadow: 2px 3px 0 #352208;
  outline: none;
  transition: all 0.25s ease;
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
  box-shadow: 3px 4px 0 #352208;
  border-color: #e1bb80;
}

.login-button {
  font-family: var(--main-font);
  width: 100%;
  padding: 14px;
  margin: 15px 0;
  border: 2px solid #352208;
  border-radius: 8px;
  font-size: 1rem;
  font-weight: 600;
  color: #352208;
  background-color: transparent;
  cursor: pointer;
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;
}

.login-button:disabled {
  opacity: 0.7;
  cursor: not-allowed;
}

.login-button:not(:disabled):hover {
  color: white;
  background-color: #352208;
}

.divider {
  display: flex;
  align-items: center;
  margin: 20px 0;
  color: #6f5b3e;
}

.divider::before,
.divider::after {
  content: "";
  flex: 1;
  border-bottom: 1px solid #e1bb80;
}

.divider span {
  padding: 0 12px;
  font-size: 0.9rem;
}

.social-button {
  width: 100%;
  padding: 12px;
  margin: 8px 0;
  border: none;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  font-family: var(--main-font);
  transition: all 0.3s ease;
  font-size: 0.95rem;
}

.google {
  background-color: #4285F4;
  color: white;
}

.google:hover {
  background-color: #3367D6;
}

.google-icon {
  width: 20px;
  height: 20px;
  object-fit: contain;
}

.button-text {
  flex: 1;
  text-align: center;
}

.links-container {
  margin-top: 20px;
}

.links-container p {
  margin: 12px 0;
  color: #6f5b3e;
  font-family: var(--main-font);
  font-weight: 400;
  font-size: 0.9rem;
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

/* Media Queries para mejor responsividad */
@media (max-width: 480px) {
  .form-wrapper {
    padding: 20px 15px;
  }

  h1 {
    font-size: 1.5rem;
    margin-bottom: 20px;
  }

  .input {
    padding: 12px 10px;
    font-size: 0.95rem;
  }

  .login-button, .social-button {
    padding: 12px;
    font-size: 0.9rem;
  }

  .google-icon {
    width: 18px;
    height: 18px;
  }
}

@media (max-width: 360px) {
  .button-text {
    font-size: 0.85rem;
  }
  
  .links-container p {
    font-size: 0.85rem;
  }
}
</style>