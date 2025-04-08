<template>
  <ion-page>
    <ion-content class="register-container">
      <div class="form-wrapper">
        <h1>Registro</h1>

        <!-- Campos de entrada para el formulario -->
        <input
          placeholder="Nombre"
          v-model="firstName"
          class="input"
          name="firstName"
          type="text"
        />
        <input
          placeholder="Apellido"
          v-model="lastName"
          class="input"
          name="lastName"
          type="text"
        />
        <input
          placeholder="Correo Electrónico"
          v-model="email"
          class="input"
          name="email"
          type="email"
        />
        <input
          placeholder="Contraseña"
          v-model="password"
          class="input"
          name="password"
          type="password"
        />

        <!-- Campo opcional de teléfono -->
        <input
          placeholder="Teléfono (Opcional)"
          v-model="phone"
          class="input"
          name="phone"
          type="tel"
        />

        <!-- Carga de foto de perfil (no usada por ahora, pero se incluye el input) -->
        <div class="profile-photo">
          <label for="file-upload" class="custom-file-upload">
            Subir Foto de Perfil
          </label>
          <input type="file" id="file-upload" @change="handleFileChange" />
        </div>

        <!-- Botón de registro -->
        <button class="register-button" @click="register">
          Registrarse
        </button>

        <!-- Enlace para ir a la página de inicio de sesión -->
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
import { auth, db } from '../firebase'
import { createUserWithEmailAndPassword } from 'firebase/auth'
import { doc, setDoc } from 'firebase/firestore'

// Variables reactivas para los campos del formulario
const firstName = ref('')
const lastName = ref('')
const email = ref('')
const password = ref('')
const phone = ref('')

// Para navegación
const router = useRouter()

// Función que maneja el registro del usuario
const register = async () => {
  try {
    // Crear usuario con Firebase Authentication
    const userCredential = await createUserWithEmailAndPassword(
      auth,
      email.value,
      password.value
    )
    const user = userCredential.user

    // Guardar información adicional en Firestore
    await setDoc(doc(db, 'usuarios', user.uid), {
      uid: user.uid,
      nombre: firstName.value,
      apellido: lastName.value,
      email: email.value,
      telefono: phone.value || null,
      creadoEn: new Date()
    })

    // Redirigir al dashboard
    alert('Registro exitoso')
    router.push('/dashboard')
  } catch (error: any) {
    alert(error.message)
    console.error('Error en el registro:', error)
  }
}

// Manejo del archivo de imagen (no implementado aún)
const handleFileChange = (event: Event) => {
  const fileInput = event.target as HTMLInputElement
  const file = fileInput.files ? fileInput.files[0] : null
  if (file) {
    console.log('Foto seleccionada:', file)
    // Aquí se podría subir la foto a Firebase Storage o algún otro backend
  }
}
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Nunito:wght@300;400;600;700&display=swap');

:root {
  --main-font: 'Nunito', sans-serif;
  --main-color: #352208;
  --accent-color: #e1bb80;
}

/* Estilo general del contenedor */
.register-container {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100%;
  background: linear-gradient(135deg, #e1bb80, #9d8149);
  font-family: var(--main-font);
}

/* Estilo del formulario */
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

/* Título */
h1 {
  margin-bottom: 25px;
  color: var(--main-color);
  font-weight: 700;
  font-size: 28px;
  letter-spacing: 0.5px;
}

/* Estilos de los inputs */
.input {
  width: 100%;
  padding: 0.875rem;
  font-size: 1rem;
  border: 1.5px solid var(--main-color);
  border-radius: 0.5rem;
  box-shadow: 2.5px 3px 0 var(--main-color);
  outline: none;
  transition: 0.25s;
  background-color: #f9f4e8;
  color: var(--main-color);
  margin-bottom: 16px;
  box-sizing: border-box;
}

.input::placeholder {
  color: #9d8149;
  opacity: 0.7;
}

.input:focus {
  box-shadow: 4px 5px 0 var(--main-color);
  border-color: var(--accent-color);
}

/* Subida de archivo */
.profile-photo {
  margin-bottom: 20px;
}

.custom-file-upload {
  display: inline-block;
  background: var(--accent-color);
  padding: 8px 15px;
  cursor: pointer;
  color: var(--main-color);
  font-size: 16px;
  border-radius: 8px;
  font-weight: 600;
  border: 2px solid var(--accent-color);
}

/* Botón de registro */
.register-button {
  display: inline-block;
  width: 100%;
  height: 2.8em;
  line-height: 2.5em;
  margin: 20px 0 5px;
  position: relative;
  cursor: pointer;
  overflow: hidden;
  border: 2px solid var(--main-color);
  font-size: 17px;
  border-radius: 8px;
  font-weight: 600;
  color: var(--main-color);
  background-color: transparent;
  transition: color 0.5s;
  z-index: 1;
}

.register-button:before {
  content: "";
  position: absolute;
  z-index: -1;
  background: var(--main-color);
  height: 150px;
  width: 200px;
  border-radius: 50%;
  top: 100%;
  left: 100%;
  transition: all 0.7s;
}

.register-button:hover {
  color: #fff;
}

.register-button:hover:before {
  top: -30px;
  left: -30px;
}

.register-button:active:before {
  background: #5a3d17;
  transition: background 0s;
}

/* Texto inferior */
p {
  margin-top: 20px;
  color: #6f5b3e;
  font-weight: 400;
}

a {
  color: var(--main-color);
  font-weight: 600;
  text-decoration: none;
  transition: color 0.3s ease;
}

a:hover {
  color: var(--accent-color);
  text-decoration: underline;
}
</style>
