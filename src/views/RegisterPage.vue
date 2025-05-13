<template>
  <ion-page>
    <ion-content class="register-container">
      <div class="form-wrapper">
        <h1>Registro</h1>

        <input v-model="firstName" class="input" placeholder="Nombre" />
        <input v-model="lastName" class="input" placeholder="Apellido" />
        <input v-model="email" class="input" placeholder="Correo Electrónico" type="email" />
        <input v-model="password" class="input" placeholder="Contraseña" type="password" />
        <input v-model="phone" class="input" placeholder="Teléfono (opcional)" type="tel" />

        <button class="register-button" @click="register">
          Registrarse
        </button>

        <p>
          ¿Ya tienes cuenta?
          <router-link to="/">Iniciar sesión</router-link>
        </p>
      </div>
    </ion-content>
  </ion-page>
</template>

<script setup lang="ts">
import { IonPage, IonContent } from '@ionic/vue'
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { auth } from '../firebase'
import { createUserWithEmailAndPassword } from 'firebase/auth'

const router = useRouter()

const firstName = ref('')
const lastName = ref('')
const email = ref('')
const password = ref('')
const phone = ref('')

const register = async () => {
  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email.value, password.value)
    const user = userCredential.user

    // Guardar los datos del perfil en localStorage
    localStorage.setItem('userProfile', JSON.stringify({
      nombre: firstName.value,
      apellido: lastName.value,
      telefono: phone.value || ''
    }))

    alert('🎉 Registro exitoso. Bienvenido(a), ' + firstName.value + '!')
    router.push('/home') // Redirigir a home directamente
  } catch (error: any) {
    console.error('❌ Error al registrar:', error)
    if (error.code === 'auth/email-already-in-use') {
      alert('Este correo ya está registrado.')
    } else {
      alert('Error al registrar: ' + error.message)
    }
  }
}
</script>

<style scoped>
.register-container {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100%;
  background: linear-gradient(135deg, #e1bb80, #9d8149);
}

.form-wrapper {
  width: 90%;
  max-width: 400px;
  padding: 30px;
  background: #fff;
  border-radius: 12px;
  box-shadow: 0px 8px 20px rgba(53, 34, 8, 0.3);
  text-align: center;
  margin: 0 auto;
  border: 2px solid #e1bb80;
}

.input {
  width: 100%;
  padding: 0.875rem;
  font-size: 1rem;
  border: 1.5px solid #352208;
  border-radius: 0.5rem;
  box-shadow: 2px 3px 0 #352208;
  outline: none;
  background-color: #f9f4e8;
  color: #352208;
  margin-bottom: 16px;
  box-sizing: border-box;
}

.register-button {
  padding: 12px;
  font-size: 16px;
  background-color: #352208;
  color: white;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  transition: 0.3s;
  width: 100%;
}

.register-button:hover {
  background-color: #5a3d17;
}
</style>
