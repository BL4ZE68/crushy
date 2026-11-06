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
      name: 'Petites surprises',
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

export function cancelSurpriseNotification(notificationId: string): Promise<void> {
  return Notifications.cancelScheduledNotificationAsync(notificationId);
}
