<template>
  <ion-page>
    <ion-header>
      <ion-toolbar>
        <ion-title>📋 Mis Tareas</ion-title>
        <ion-buttons slot="end">
          <ion-button @click="logout">Cerrar Sesión</ion-button>
        </ion-buttons>
      </ion-toolbar>
    </ion-header>
    
    <ion-content class="ion-padding">
      <ion-list>
        <ion-item v-for="task in tasks" :key="task.id">
          <ion-checkbox slot="start" :checked="task.completed" @ionChange="toggleTask(task.id, $event.detail.checked)"></ion-checkbox>
          <ion-label>
            <h2>{{ task.text }}</h2>
            <p>🕒 {{ task.time }}</p>
          </ion-label>
          <ion-button fill="clear" @click="deleteTask(task.id)">
            <ion-icon :icon="trashOutline"></ion-icon>
          </ion-button>
        </ion-item>
      </ion-list>

      <ion-item>
        <ion-input v-model="newTask" placeholder="Nueva tarea"></ion-input>
        <ion-datetime v-model="taskTime" presentation="time"></ion-datetime>
        <ion-button @click="addTask">Agregar</ion-button>
      </ion-item>
    </ion-content>
  </ion-page>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { IonPage, IonHeader, IonToolbar, IonTitle, IonContent, IonList, IonItem, IonLabel, IonButton, IonInput, IonCheckbox, IonDatetime } from '@ionic/vue';
import { auth, db } from '../firebase';
import { signOut } from "firebase/auth";
import { collection, addDoc, getDocs, deleteDoc, doc, updateDoc, query, where } from "firebase/firestore";
import { useRouter } from 'vue-router';
import { trashOutline } from 'ionicons/icons';
import { LocalNotifications } from '@capacitor/local-notifications';

const router = useRouter();
const newTask = ref('');
const taskTime = ref('');
const tasks = ref<{ id: string; text: string; completed: boolean; time: string }[]>([]);

// Obtener las tareas desde Firebase
const fetchTasks = async () => {
  const querySnapshot = await getDocs(collection(db, "tasks"));
  tasks.value = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })) as { id: string; text: string; completed: boolean; time: string }[];
};

// Alternar el estado de completado de una tarea
const toggleTask = async (id: string, completed: boolean) => {
  await updateDoc(doc(db, "tasks", id), { completed });
  fetchTasks(); // Actualizar la lista
};

// Agregar nueva tarea
const addTask = async () => {
  if (!newTask.value.trim() || !taskTime.value) return;

  await addDoc(collection(db, "tasks"), { 
    text: newTask.value, 
    completed: false, 
    time: taskTime.value 
  });

  newTask.value = '';
  taskTime.value = '';
  fetchTasks();
};

// Eliminar tarea
const deleteTask = async (id: string) => {
  await deleteDoc(doc(db, "tasks", id));
  fetchTasks();
};

// Reiniciar tareas completadas a medianoche
const resetTasksDaily = async () => {
  const now = new Date();
  const midnight = new Date(now);
  midnight.setHours(0, 0, 0, 0);

  const querySnapshot = await getDocs(query(collection(db, "tasks"), where("completed", "==", true)));
  querySnapshot.forEach(async (task) => {
    await deleteDoc(doc(db, "tasks", task.id)); // Eliminar tareas completadas
  });

  console.log("✅ Tareas completadas eliminadas a la medianoche");
};

// Verificar si la hora de la tarea ha llegado y enviar notificación
const checkTaskTimes = async () => {
  const now = new Date();
  const currentHour = now.getHours();
  const currentMinutes = now.getMinutes();
  
  tasks.value.forEach(async (task) => {
    const [taskHour, taskMinutes] = task.time.split(":").map(Number);
    if (taskHour === currentHour && taskMinutes === currentMinutes) {
      await LocalNotifications.schedule({
        notifications: [
          {
            id: task.id,
            title: "🔔 Recordatorio de Tarea",
            body: `Es hora de: ${task.text}`,
            schedule: { at: new Date() },
          }
        ]
      });
    }
  });
};

// Revisar cada minuto si hay notificaciones pendientes
setInterval(checkTaskTimes, 60000);

// Cerrar sesión
const logout = async () => {
  await signOut(auth);
  router.push('/');
};

// Ejecutar funciones al iniciar
onMounted(() => {
  resetTasksDaily();
  fetchTasks();
});
</script>
