import * as Notifications from 'expo-notifications';
import { Platform } from 'react-native';

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowBanner: true,
    shouldShowList: true,
    shouldPlaySound: false,
    shouldSetBadge: false,
  }),
});

export async function requestNotificationPermission(): Promise<boolean> {
  if (Platform.OS === 'android') {
    await Notifications.setNotificationChannelAsync('crushy-updates', {
      name: 'Contenu du jour et surprises',
      importance: Notifications.AndroidImportance.DEFAULT,
      lightColor: '#B53D5E',
    });
  }
  const current = await Notifications.getPermissionsAsync();
  if (current.granted) return true;

  const requested = await Notifications.requestPermissionsAsync();
  return requested.granted;
}
export async function scheduleSurpriseNotification(
  title: string,
  body: string,
  scheduledAt: Date,
): Promise<string> {
  return Notifications.scheduleNotificationAsync({
    content: { title, body, sound: false },
    trigger: {
      type: Notifications.SchedulableTriggerInputTypes.DATE,
      date: scheduledAt,
      channelId: Platform.OS === 'android' ? 'crushy-updates' : undefined,
    },
  });
}

export async function scheduleDailyContentReminder(): Promise<string> {
  await cancelDailyContentReminder();
  return Notifications.scheduleNotificationAsync({
    content: {
      title: 'Ton contenu du jour est prêt',
      body: 'Une citation, une blague et un défi t’attendent dans CRUSHY.',
      data: { type: 'daily-content-reminder' },
      sound: false,
    },
    trigger: {
      type: Notifications.SchedulableTriggerInputTypes.DAILY,
      hour: 9,
      minute: 15,
      channelId: Platform.OS === 'android' ? 'crushy-updates' : undefined,
    },
  });
}

export async function cancelDailyContentReminder(): Promise<void> {
  const scheduledNotifications = await Notifications.getAllScheduledNotificationsAsync();
  const reminders = scheduledNotifications.filter(
    (notification) => notification.content.data?.type === 'daily-content-reminder'
  );
  await Promise.all(
    reminders.map((notification) => Notifications.cancelScheduledNotificationAsync(notification.identifier))
  );
}

export function cancelSurpriseNotification(notificationId: string): Promise<void> {
  return Notifications.cancelScheduledNotificationAsync(notificationId);
}

export async function sendTestNotification(): Promise<string> {
  const granted = await requestNotificationPermission();
  if (!granted) {
    throw new Error('Permission de notification non accordée.');
  }
  return Notifications.scheduleNotificationAsync({
    content: {
      title: 'Pip te fait coucou ! 💖',
      body: 'Coucou ! Les notifications CRUSHY fonctionnent parfaitement.',
      data: { type: 'test' },
      sound: false,
    },
    trigger: null,
  });
}
