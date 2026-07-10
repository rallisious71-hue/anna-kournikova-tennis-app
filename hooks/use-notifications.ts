// hooks/use-notifications.ts
import Toast from 'react-native-toast-message';
import * as Haptics from 'expo-haptics';
import { Platform } from 'react-native';
import { useLanguage } from '@/lib/language-context';

export function useNotifications() {
  const { language } = useLanguage();

  const showSuccess = (title?: string, message?: string) => {
    if (Platform.OS !== 'web') {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    }
    Toast.show({
      type: 'success',
      text1: title || (language === 'el' ? 'Επιτυχία!' : 'Success!'),
      text2: message,
      position: 'top',
      visibilityTime: 2500,
    });
  };

  const showError = (title?: string, message?: string) => {
    if (Platform.OS !== 'web') {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
    }
    Toast.show({
      type: 'error',
      text1: title || (language === 'el' ? 'Σφάλμα' : 'Error'),
      text2: message,
      position: 'top',
      visibilityTime: 4000,
    });
  };

  const showInfo = (title: string, message?: string) => {
    if (Platform.OS !== 'web') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
    Toast.show({
      type: 'info',
      text1: title,
      text2: message,
      position: 'top',
    });
  };

  const hapticButton = async () => {
    if (Platform.OS !== 'web') {
      await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    }
  };

  return {
    showSuccess,
    showError,
    showInfo,
    hapticButton,
  };
}
