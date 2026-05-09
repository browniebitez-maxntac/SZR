import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../navigation';
import { Colors, Typography, Spacing, Radius } from '../../constants/theme';

type Props = {
  navigation: NativeStackNavigationProp<RootStackParamList, 'AgeGate'>;
};

export default function AgeGateScreen({ navigation }: Props) {
  const [denied, setDenied] = useState(false);

  if (denied) {
    return (
      <View style={styles.container}>
        <Text style={styles.deniedTitle}>Access Restricted</Text>
        <Text style={styles.deniedBody}>
          SZR is only available to users 18 and older.
        </Text>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.inner}>
        <LinearGradient
          colors={['#C2527A', '#8B5E8C']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.logoContainer}
        >
          <Text style={styles.logoText}>SZR</Text>
        </LinearGradient>

        <Text style={styles.tagline}>For women who love women.</Text>

        <View style={styles.card}>
          <Text style={styles.question}>Are you 18 or older?</Text>
          <Text style={styles.subtext}>
            SZR contains adult content and is strictly for users aged 18+.
          </Text>

          <TouchableOpacity
            style={styles.btnYes}
            onPress={() => navigation.replace('Auth')}
          >
            <Text style={styles.btnYesText}>Yes, I'm 18+</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.btnNo}
            onPress={() => setDenied(true)}
          >
            <Text style={styles.btnNoText}>No, I'm under 18</Text>
          </TouchableOpacity>
        </View>

        <Text style={styles.legal}>
          By continuing you agree to our Terms of Service and Privacy Policy.
        </Text>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.bgPrimary,
    justifyContent: 'center',
    alignItems: 'center',
    padding: Spacing.xl,
  },
  inner: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
  },
  logoContainer: {
    width: 100,
    height: 100,
    borderRadius: Radius.card,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: Spacing.lg,
  },
  logoText: {
    fontSize: 36,
    fontWeight: '700',
    color: Colors.white,
    letterSpacing: 4,
  },
  tagline: {
    fontSize: Typography.bodySize,
    color: Colors.textSecondary,
    marginBottom: Spacing.xxxl,
    letterSpacing: 0.5,
  },
  card: {
    backgroundColor: Colors.bgCard,
    borderRadius: Radius.card,
    padding: Spacing.xl,
    width: '100%',
    borderWidth: 1,
    borderColor: Colors.border,
    marginBottom: Spacing.xl,
  },
  question: {
    fontSize: Typography.headingSize,
    fontWeight: Typography.headingWeight,
    color: Colors.textPrimary,
    textAlign: 'center',
    marginBottom: Spacing.sm,
  },
  subtext: {
    fontSize: Typography.labelSize,
    color: Colors.textSecondary,
    textAlign: 'center',
    marginBottom: Spacing.xl,
    lineHeight: 18,
  },
  btnYes: {
    backgroundColor: Colors.accentPrimary,
    borderRadius: Radius.button,
    paddingVertical: 14,
    alignItems: 'center',
    marginBottom: Spacing.md,
  },
  btnYesText: {
    color: Colors.white,
    fontSize: Typography.bodySize,
    fontWeight: '600',
  },
  btnNo: {
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: Radius.button,
    paddingVertical: 14,
    alignItems: 'center',
  },
  btnNoText: {
    color: Colors.textSecondary,
    fontSize: Typography.bodySize,
  },
  legal: {
    fontSize: 11,
    color: Colors.textSecondary,
    textAlign: 'center',
    opacity: 0.6,
  },
  deniedTitle: {
    fontSize: Typography.headingSize,
    fontWeight: Typography.headingWeight,
    color: Colors.textPrimary,
    marginBottom: Spacing.md,
  },
  deniedBody: {
    fontSize: Typography.bodySize,
    color: Colors.textSecondary,
    textAlign: 'center',
  },
});
