import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Colors } from '../../constants/theme';

// Full implementation in Step 6
export default function ChatListScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>Chat List — Step 6</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.bgPrimary, justifyContent: 'center', alignItems: 'center' },
  text: { color: Colors.textPrimary },
});
