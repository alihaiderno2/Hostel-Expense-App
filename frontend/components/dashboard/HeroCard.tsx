import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Colors } from '../../constants/Colors';
import { ExpenseSummary } from '../../types';

interface HeroCardProps {
  summary: ExpenseSummary;
}

export default function HeroCard({ summary }: HeroCardProps) {
  const getStatusColor = () => {
    if (summary.status === 'owe') return Colors.status.owe;
    if (summary.status === 'owed') return Colors.status.owed;
    return Colors.status.neutral;
  };

  const getStatusText = () => {
    if (summary.balance === 0) return 'All Settled Up! 🎉';
    if (summary.balance < 0) return `You Owe: Rs. ${Math.abs(summary.balance).toFixed(2)}`;
    return `You are Owed: Rs. ${summary.balance.toFixed(2)}`;
  };

  return (
    <View style={styles.container}>
      {/* The Big Number */}
      <View style={styles.topSection}>
        <Text style={styles.label}>Total Group Expenses</Text>
        <Text style={styles.bigNumber}>Rs. {summary.totalGroupExpenses.toFixed(2)}</Text>
      </View>

      {/* The Split */}
      <View style={styles.splitSection}>
        <View style={styles.splitItem}>
          <Text style={styles.splitLabel}>Your Share</Text>
          <Text style={styles.splitValue}>Rs. {summary.yourShare.toFixed(2)}</Text>
        </View>

        <View style={styles.divider} />

        <View style={styles.splitItem}>
          <Text style={styles.splitLabel}>You Paid</Text>
          <Text style={styles.splitValue}>Rs. {summary.youPaid.toFixed(2)}</Text>
        </View>
      </View>

      {/* The Verdict */}
      <View style={[styles.statusContainer, { backgroundColor: getStatusColor() }]}>
        <Text style={styles.statusText}>{getStatusText()}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.background.card,
    marginHorizontal: 20,
    marginTop: 20,
    borderRadius: 16,
    padding: 24,
    elevation: 4,
    shadowColor: Colors.primary.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
  },
  topSection: {
    marginBottom: 20,
  },
  label: {
    fontSize: 14,
    color: Colors.text.onDark,
    opacity: 0.7,
    letterSpacing: 1,
    textTransform: 'uppercase',
    marginBottom: 8,
  },
  bigNumber: {
    fontSize: 42,
    fontWeight: '900',
    color: Colors.text.onDark,
    letterSpacing: -1,
  },
  splitSection: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  splitItem: {
    flex: 1,
  },
  splitLabel: {
    fontSize: 12,
    color: Colors.text.onDark,
    opacity: 0.6,
    marginBottom: 4,
  },
  splitValue: {
    fontSize: 18,
    fontWeight: '700',
    color: Colors.text.onDark,
  },
  divider: {
    width: 1,
    height: 40,
    backgroundColor: Colors.text.onDark,
    opacity: 0.2,
    marginHorizontal: 16,
  },
  statusContainer: {
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    alignItems: 'center',
  },
  statusText: {
    fontSize: 16,
    fontWeight: '700',
    color: Colors.text.onDark,
    letterSpacing: 0.5,
  },
});
