import { LocalNotifications } from '@capacitor/local-notifications';

/**
 * ✅ Solicita permisos para notificaciones locales
 *    y muestra una notificación de prueba solo una vez.
 */
export const solicitarPermisosNotificaciones = async () => {
  // Verifica si ya se mostró la notificación de bienvenida
  const yaMostrada = localStorage.getItem('notificacion_bienvenida');
  if (yaMostrada === 'true') {
    return;
  }

  const permission = await LocalNotifications.requestPermissions();

  if (permission.display === 'granted') {
    console.log('✅ Permiso otorgado para notificaciones.');

    // ⏰ Notificación de bienvenida después de 15 segundos
    const ahora = new Date();
    const en15segundos = new Date(ahora.getTime() + 15000);

    await LocalNotifications.schedule({
      notifications: [
        {
          id: 999, // ID único para esta prueba
          title: '🎉 ¡Notificaciones activadas!',
          body: 'Verificamos que puedes recibir recordatorios 🙂',
          schedule: { at: en15segundos },
          sound: undefined,
          smallIcon: 'ic_launcher', // opcional: debe existir en /res/drawable
        },
      ],
    });

    // 🔐 Marca que ya se mostró
    localStorage.setItem('notificacion_bienvenida', 'true');
  } else {
    alert('Debes permitir las notificaciones para recibir recordatorios 😉');
  }
};

/**
 * 🔔 Programa una notificación real para una tarea
 */
export const programarNotificacion = async (
  id: number,
  titulo: string,
  cuerpo: string,
  fecha: Date
) => {
  await LocalNotifications.schedule({
    notifications: [
      {
        id,
        title: titulo,
        body: cuerpo,
        schedule: { at: fecha },
        sound: undefined,
        smallIcon: 'ic_launcher',
      },
    ],
  });
};

/**
 * ❌ Cancela una notificación por ID
 */
export const cancelarNotificacion = async (id: number) => {
  await LocalNotifications.cancel({ notifications: [{ id }] });
};

/**
 * ❌❌ Cancela todas las notificaciones pendientes
 */
export const cancelarTodasNotificaciones = async () => {
  const pendientes = await LocalNotifications.getPending();
  const notifs = pendientes.notifications.map(n => ({ id: n.id }));
  await LocalNotifications.cancel({ notifications: notifs });
};
