import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Colors } from '../../constants/Colors';
import { Ionicons } from '@expo/vector-icons';

interface QuickActionsProps {
  onAddExpense: () => void;
  onSettleUp: () => void;
}

export default function QuickActions({ onAddExpense, onSettleUp }: QuickActionsProps) {
  return (
    <View style={styles.container}>
      {/* Add Expense - Primary Action */}
      <TouchableOpacity
        style={styles.primaryButton}
        onPress={onAddExpense}
        activeOpacity={0.8}
      >
        <Ionicons name="add-circle" size={24} color={Colors.text.onDark} />
        <Text style={styles.primaryButtonText}>Add Expense</Text>
      </TouchableOpacity>

      {/* Settle Up - Secondary Action */}
      <TouchableOpacity
        style={styles.secondaryButton}
        onPress={onSettleUp}
        activeOpacity={0.8}
      >
        <Ionicons name="checkmark-circle-outline" size={24} color={Colors.primary.black} />
        <Text style={styles.secondaryButtonText}>Settle Up</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    paddingVertical: 20,
    gap: 12,
  },
  primaryButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.background.card,
    paddingVertical: 16,
    paddingHorizontal: 20,
    borderRadius: 12,
    gap: 8,
    elevation: 2,
    shadowColor: Colors.primary.black,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  primaryButtonText: {
    fontSize: 16,
    fontWeight: '700',
    color: Colors.text.onDark,
    letterSpacing: 0.5,
  },
  secondaryButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.background.main,
    paddingVertical: 16,
    paddingHorizontal: 20,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: Colors.border.dark,
    gap: 8,
  },
  secondaryButtonText: {
    fontSize: 16,
    fontWeight: '700',
    color: Colors.text.primary,
    letterSpacing: 0.5,
  },
});
