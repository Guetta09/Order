<template>
  <ion-page>
    <ion-content class="profile-container">
      <div class="form-wrapper">
        <h1>Mi Perfil</h1>

        <!-- Vista modo lectura -->
        <div v-if="!editando">
          <p><strong>Nombre:</strong> {{ nombre || 'No registrado' }}</p>
          <p><strong>Apellido:</strong> {{ apellido || 'No registrado' }}</p>
          <p><strong>Correo:</strong> {{ email }}</p>
          <p><strong>Teléfono:</strong> {{ telefono || 'No registrado' }}</p>
          <ion-button expand="block" color="medium" @click="editando = true">Editar Información</ion-button>
        </div>

        <!-- Vista modo edición -->
        <div v-else>
          <input v-model="nombre" class="input" placeholder="Nombre" />
          <input v-model="apellido" class="input" placeholder="Apellido" />
          <input v-model="telefono" class="input" placeholder="Teléfono" />
          <ion-button expand="block" @click="guardarCambios" :disabled="loading">
            {{ loading ? 'Guardando...' : 'Guardar cambios' }}
          </ion-button>
          <ion-button expand="block" color="light" @click="cancelarEdicion">Cancelar</ion-button>
        </div>

        <p class="status" v-if="status">{{ status }}</p>
      </div>
    </ion-content>
  </ion-page>
</template>

<script setup lang="ts">
import { IonPage, IonContent, IonButton } from '@ionic/vue';
import { ref, onMounted } from 'vue';
import { auth, db } from '../firebase';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { onAuthStateChanged } from 'firebase/auth';

const nombre = ref('');
const apellido = ref('');
const telefono = ref('');
const email = ref('');
const loading = ref(false);
const status = ref('');
const editando = ref(false);

// ✅ Espera que el usuario esté autenticado antes de acceder a su info
onMounted(() => {
  onAuthStateChanged(auth, async (user) => {
    if (user) {
      email.value = user.email || '';
      const docRef = doc(db, 'usuarios', user.uid);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        const data = docSnap.data();
        nombre.value = data.nombre || '';
        apellido.value = data.apellido || '';
        telefono.value = data.telefono || '';
      } else {
        console.log('No hay datos guardados aún');
      }
    }
  });
});

// ✅ Guardar cambios en Firestore
const guardarCambios = async () => {
  const user = auth.currentUser;
  if (!user) return;

  loading.value = true;
  status.value = '';

  try {
    await setDoc(doc(db, 'usuarios', user.uid), {
      uid: user.uid,
      nombre: nombre.value,
      apellido: apellido.value,
      telefono: telefono.value,
      email: user.email,
      actualizadoEn: new Date()
    });

    status.value = '✅ Cambios guardados exitosamente.';
    editando.value = false;
  } catch (err) {
    console.error(err);
    status.value = '❌ Error al guardar los cambios.';
  } finally {
    loading.value = false;
  }
};

const cancelarEdicion = () => {
  editando.value = false;
  status.value = '';
};
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Nunito:wght@400;600;700&display=swap');

:root {
  --main-font: 'Nunito', sans-serif;
  --main-color: #352208;
  --accent-color: #e1bb80;
}

.profile-container {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 2rem;
  background: linear-gradient(135deg, #e1bb80, #9d8149);
  min-height: 100%;
  font-family: var(--main-font);
}

.form-wrapper {
  width: 100%;
  max-width: 400px;
  background: #fff;
  padding: 30px;
  border-radius: 12px;
  border: 2px solid var(--accent-color);
  box-shadow: 0px 8px 20px rgba(53, 34, 8, 0.3);
  text-align: center;
}

h1 {
  margin-bottom: 25px;
  color: var(--main-color);
  font-size: 26px;
  font-weight: 700;
}

.input {
  width: 100%;
  padding: 12px;
  font-size: 16px;
  border: 1.5px solid var(--main-color);
  border-radius: 8px;
  margin-bottom: 16px;
  background-color: #f9f4e8;
  box-shadow: 2px 3px 0 var(--main-color);
}

.status {
  margin-top: 12px;
  font-weight: 600;
  color: #352208;
}
</style>
