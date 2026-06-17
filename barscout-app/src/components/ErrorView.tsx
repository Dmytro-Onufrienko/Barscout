import { Pressable, StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { spacing, typography, useTheme } from '@/theme';

type Props = {
  message?: string;
  onRetry?: () => void;
};

export default function ErrorView({ message = 'Something went wrong', onRetry }: Props) {

  const { theme, scheme } = useTheme();

  return (
    <View style={styles.container}>
      <Ionicons name="alert-circle-outline" size={48} color={theme.error} />
      <Text style={[styles.message, { color: theme.error }]}>{message}</Text>
      {onRetry && (
        <Pressable
          style={({ pressed }) => [
            styles.button,
            { backgroundColor: theme.primary, opacity: pressed ? 0.8 : 1 },
          ]}
          onPress={onRetry}
        >
          <Text style={styles.buttonText}>Try Again</Text>
        </Pressable>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.md,
    paddingHorizontal: spacing.lg,
  },
  message: {
    fontSize: typography.size.md,
    textAlign: 'center',
    lineHeight: typography.size.md * 1.5,
  },
  button: {
    paddingVertical: spacing.sm + 4,
    paddingHorizontal: spacing.xl,
    borderRadius: 12,
    marginTop: spacing.xs,
  },
  buttonText: {
    color: '#fff',
    fontSize: typography.size.md,
    fontWeight: typography.weight.semibold,
  },
});
