import { createContext, PropsWithChildren, useCallback, useContext } from 'react';
import { useAudioPlayer } from 'expo-audio';
import { useCrushyStore } from '../store/useCrushyStore';

const tapSound = require('../../assets/sounds/soft-tap.wav');
const AudioFeedbackContext = createContext<() => void>(() => undefined);

export function CrushyAudioProvider({ children }: PropsWithChildren) {
  const player = useAudioPlayer(tapSound);
  const soundsEnabled = useCrushyStore((state) => state.soundsEnabled);

  const playButtonSound = useCallback(() => {
    if (!soundsEnabled) return;
    void player.seekTo(0)
      .then(() => player.play())
      .catch((error: unknown) => console.warn('Le son de CRUSHY n’a pas pu être lu.', error));
  }, [player, soundsEnabled]);

  return (
    <AudioFeedbackContext.Provider value={playButtonSound}>
      {children}
    </AudioFeedbackContext.Provider>
  );
}

export function useCrushyButtonSound() {
  return useContext(AudioFeedbackContext);
}
