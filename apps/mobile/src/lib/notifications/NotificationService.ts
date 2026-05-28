import * as Notifications from 'expo-notifications';
import * as Permissions from 'expo-permissions';

export async function requestPermissions() {
  const { status } = await Notifications.requestPermissionsAsync();
  return status === 'granted';
}

export async function scheduleLocalNotification(title: string, body: string, at: Date) {
  const id = await Notifications.scheduleNotificationAsync({
    content: { title, body },
    trigger: at
  } as any);
  return id;
}

export async function cancelNotification(id: string) {
  await Notifications.cancelScheduledNotificationAsync(id);
}

export default { requestPermissions, scheduleLocalNotification, cancelNotification };
