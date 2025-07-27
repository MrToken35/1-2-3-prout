import React, { useState } from 'react';
import { View, TouchableOpacity, StyleSheet, Text, Vibration } from 'react-native';
import { Audio } from 'expo-av';
import * as Haptics from 'expo-haptics';

export default function App() {
  const [tapCount, setTapCount] = useState(0);
  const [flash, setFlash] = useState(false);

  // Sons
  const pouicSound = require('./assets/pouic.mp3');
  const proutSound = require('./assets/prout1.mp3');
  const longPetSound = require('./assets/long_pet.mp3');

  const playSound = async (file) => {
    const { sound } = await Audio.Sound.createAsync(file);
    await sound.playAsync();
  };

  const triggerFlash = (colorFlash = false, duration = 200) => {
    setFlash(true);
    setTimeout(() => setFlash(false), duration);
  };

  const handlePress = () => {
    let newCount = tapCount + 1;

    // Feedback de base (toujours pouic + vibration + flash)
    playSound(pouicSound);
    Vibration.vibrate(100);
    triggerFlash();

    if (newCount >= 11) {
      const denominator = 21 - newCount; // 11 => 1/10, ... 20 => 1/1
      const chance = 1 / denominator;

      if (Math.random() < chance || newCount === 20) {
        // Déclenchement : prout normal 99%, long pet 1%
        if (Math.random() < 0.01) {
          playSound(longPetSound);
          Vibration.vibrate(1000); // vibration longue
          triggerFlash(true, 500); // flash plus long et visible
        } else {
          playSound(proutSound);
          Vibration.vibrate(300);
          triggerFlash(true, 300);
        }
        newCount = 0; // reset compteur après déclenchement
      }
    }

    if (newCount > 20) newCount = 0;
    setTapCount(newCount);
  };

  return (
    <TouchableOpacity
      style={[styles.container, flash && styles.flash]}
      onPress={handlePress}
      activeOpacity={1}
    >
      <Text style={styles.text}>1,2,3... Prout !</Text>
      <Text style={styles.counter}>Taps : {tapCount}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#A4FF6E'
  },
  flash: {
    backgroundColor: '#FFFF99'
  },
  text: {
    fontSize: 28,
    color: '#222'
  },
  counter: {
    marginTop: 10,
    fontSize: 20,
    color: '#444'
  }
});
