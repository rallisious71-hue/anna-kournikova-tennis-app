import { useCallback } from 'react';
import { Platform } from 'react-native';

// Web Audio API for generating 8-bit sounds
const generateBeep = async (frequency: number, duration: number, volume: number = 0.3) => {
  if (Platform.OS === 'web') {
    try {
      const audioContext = new (window as any).AudioContext();
      const oscillator = audioContext.createOscillator();
      const gainNode = audioContext.createGain();

      oscillator.connect(gainNode);
      gainNode.connect(audioContext.destination);

      oscillator.frequency.value = frequency;
      oscillator.type = 'square'; // 8-bit style square wave

      gainNode.gain.setValueAtTime(volume, audioContext.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + duration / 1000);

      oscillator.start(audioContext.currentTime);
      oscillator.stop(audioContext.currentTime + duration / 1000);
    } catch (error) {
      console.log('Web Audio API not available');
    }
  }
};

export const useSoundEffects = () => {
  const playButtonClick = useCallback(async () => {
    // Classic 8-bit button click sound
    await generateBeep(800, 100, 0.2); // High beep
    setTimeout(() => generateBeep(600, 50, 0.15), 100); // Lower beep
  }, []);

  const playSuccess = useCallback(async () => {
    // Victory/success sound - ascending notes
    await generateBeep(523, 150, 0.25); // C5
    setTimeout(() => generateBeep(659, 150, 0.25), 150); // E5
    setTimeout(() => generateBeep(784, 300, 0.25), 300); // G5
  }, []);

  const playError = useCallback(async () => {
    // Error/defeat sound - descending notes
    await generateBeep(784, 150, 0.25); // G5
    setTimeout(() => generateBeep(659, 150, 0.25), 150); // E5
    setTimeout(() => generateBeep(523, 300, 0.25), 300); // C5
  }, []);

  const playMatchStart = useCallback(async () => {
    // Match start sound - fanfare
    await generateBeep(523, 100, 0.25); // C5
    setTimeout(() => generateBeep(659, 100, 0.25), 100); // E5
    setTimeout(() => generateBeep(784, 100, 0.25), 200); // G5
    setTimeout(() => generateBeep(1047, 200, 0.25), 300); // C6
  }, []);

  const playMatchEnd = useCallback(async () => {
    // Match end sound
    await generateBeep(1047, 150, 0.25); // C6
    setTimeout(() => generateBeep(784, 150, 0.25), 150); // G5
    setTimeout(() => generateBeep(659, 150, 0.25), 300); // E5
    setTimeout(() => generateBeep(523, 300, 0.25), 450); // C5
  }, []);

  return {
    playButtonClick,
    playSuccess,
    playError,
    playMatchStart,
    playMatchEnd,
  };
};
