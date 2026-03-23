import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Colors } from '../../constants/Colors';
import { Ionicons } from '@expo/vector-icons';

interface HeaderProps {
  userName: string;
  roomNumber?: string;
  onSettingsPress?: () => void;
}

export default function Header({ userName, roomNumber, onSettingsPress }: HeaderProps) {
  return (
    <View style={styles.container}>
      <View style={styles.leftSection}>
        <Text style={styles.greeting}>Hello, {userName}</Text>
        {roomNumber && <Text style={styles.roomNumber}>{roomNumber}</Text>}
      </View>

      <TouchableOpacity
        style={styles.settingsButton}
        onPress={onSettingsPress}
      >
        <Ionicons name="settings-outline" size={24} color={Colors.primary.black} />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    paddingTop: 50, // Account for status bar
    backgroundColor: Colors.background.main,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border.light,
  },
  leftSection: {
    flex: 1,
  },
  greeting: {
    fontSize: 24,
    fontWeight: '700',
    color: Colors.text.primary,
    letterSpacing: 0.5,
  },
  roomNumber: {
    fontSize: 14,
    color: Colors.text.secondary,
    marginTop: 2,
  },
  settingsButton: {
    padding: 8,
  },
});
