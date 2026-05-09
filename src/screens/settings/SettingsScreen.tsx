import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Colors } from '../../constants/theme';

// Full implementation in Step 10
export default function SettingsScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>Settings / Safety — Step 10</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.bgPrimary, justifyContent: 'center', alignItems: 'center' },
  text: { color: Colors.textPrimary },
});
