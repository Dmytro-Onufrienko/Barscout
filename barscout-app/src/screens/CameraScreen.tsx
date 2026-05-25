import { useRef, useState } from 'react';
import { ActivityIndicator, Pressable, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { CameraView } from 'expo-camera';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { spacing, typography, useTheme } from '@/theme';
import { useCameraPermission } from '@/hooks/useCameraPermission';
import type { JournalStackParamList } from '@/types/navigation';

type Props = NativeStackScreenProps<JournalStackParamList, 'Camera'>;

export default function CameraScreen({ navigation }: Props) {

  const { theme } = useTheme();
  const cameraRef = useRef<CameraView>(null);
  const [facing, setFacing] = useState<'front' | 'back'>('back');
  const [capturing, setCapturing] = useState(false);
  const { state, request, openSettings } = useCameraPermission();

  const handleCapture = async () => {
    if (!cameraRef.current || capturing) return;
    setCapturing(true);
    try {
      const photo = await cameraRef.current.takePictureAsync({ quality: 0.8 });
      if (photo?.uri) {
        navigation.navigate('JournalEntry', { photoUri: photo.uri });
      }
    } finally {
      setCapturing(false);
    }
  };

  if (state.status === 'idle') {
    return (
      <SafeAreaView style={[styles.centered, { backgroundColor: theme.background }]}>
        <Text style={styles.emoji}>📷</Text>
        <Text style={[styles.hint, { color: theme.textMuted }]}>
          Потрібен доступ до камери
        </Text>
        <Pressable
          style={[styles.button, { backgroundColor: theme.primary }]}
          onPress={request}
        >
          <Text style={styles.buttonText}>Дозволити</Text>
        </Pressable>
      </SafeAreaView>
    );
  }

  if (state.status === 'requesting') {
    return (
      <SafeAreaView style={[styles.centered, { backgroundColor: theme.background }]}>
        <ActivityIndicator size="large" color={theme.primary} />
      </SafeAreaView>
    );
  }

  if (state.status === 'denied') {
    return (
      <SafeAreaView style={[styles.centered, { backgroundColor: theme.background }]}>
        <Text style={styles.emoji}>🚫</Text>
        <Text style={[styles.hint, { color: theme.textMuted }]}>
          Доступ до камери заборонено
        </Text>
        {state.canAskAgain ? (
          <Pressable
            style={[styles.button, { backgroundColor: theme.primary }]}
            onPress={request}
          >
            <Text style={styles.buttonText}>Спробувати знову</Text>
          </Pressable>
        ) : (
          <Pressable
            style={[styles.button, { backgroundColor: theme.primary }]}
            onPress={openSettings}
          >
            <Text style={styles.buttonText}>Відкрити налаштування</Text>
          </Pressable>
        )}
      </SafeAreaView>
    );
  }

  return (
    <View style={styles.container}>
      <CameraView ref={cameraRef} style={styles.camera} facing={facing} />

      <SafeAreaView style={styles.controls} edges={['bottom']}>
        <Pressable
          style={styles.flipButton}
          onPress={() => setFacing((f) => (f === 'back' ? 'front' : 'back'))}
        >
          <Text style={styles.flipText}>🔄</Text>
        </Pressable>

        <Pressable
          style={[styles.shutter, capturing && styles.shutterCapturing]}
          onPress={handleCapture}
          disabled={capturing}
        >
          <View style={styles.shutterInner} />
        </Pressable>

        <Pressable style={styles.flipButton} onPress={() => navigation.goBack()}>
          <Text style={styles.flipText}>✕</Text>
        </Pressable>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  centered: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.md,
    paddingHorizontal: spacing.lg,
  },
  camera: {
    flex: 1,
  },
  controls: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.xl,
    paddingBottom: spacing.lg,
    paddingTop: spacing.md,
    backgroundColor: 'rgba(0,0,0,0.4)',
  },
  shutter: {
    width: 72,
    height: 72,
    borderRadius: 36,
    borderWidth: 4,
    borderColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  shutterCapturing: {
    opacity: 0.5,
  },
  shutterInner: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#fff',
  },
  flipButton: {
    width: 44,
    height: 44,
    alignItems: 'center',
    justifyContent: 'center',
  },
  flipText: {
    fontSize: 24,
  },
  emoji: {
    fontSize: 48,
  },
  hint: {
    fontSize: typography.size.md,
    textAlign: 'center',
  },
  button: {
    paddingVertical: spacing.sm + 4,
    paddingHorizontal: spacing.xl,
    borderRadius: 12,
  },
  buttonText: {
    color: '#fff',
    fontSize: typography.size.md,
    fontWeight: typography.weight.semibold,
  },
});
