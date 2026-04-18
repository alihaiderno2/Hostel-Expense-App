import React, { useState, useEffect } from 'react';
import { View, StyleSheet, SafeAreaView } from 'react-native';
import { Colors } from '../../constants/Colors';
import Header from '../../components/shared/Header';
import HeroCard from '../../components/dashboard/HeroCard';
import QuickActions from '../../components/dashboard/QuickActions';
import RecentActivity from '../../components/dashboard/RecentActivity';
import { ExpenseSummary, RecentActivityItem } from '../../types';
import { api } from '../../services/api';

export default function DashboardScreen() {
  // Mock data for demonstration purposes
  const [summary, setSummary] = useState<ExpenseSummary>({
    totalGroupExpenses: 12450.50,
    yourShare: 4150.17,
    youPaid: 3800.00,
    balance: -350.17,
    status: 'owe',
  });

  const [activities, setActivities] = useState<RecentActivityItem[]>([
    {
      id: '1',
      title: 'Groceries',
      paidBy: 'Ali',
      amount: 1200.00,
      date: new Date().toISOString(),
      category: 'groceries',
      icon: 'cart-outline',
    },
    {
      id: '2',
      title: 'Electricity Bill',
      paidBy: 'Ahmed',
      amount: 2500.00,
      date: new Date(Date.now() - 86400000).toISOString(), // Yesterday
      category: 'utilities',
      icon: 'bulb-outline',
    },
    {
      id: '3',
      title: 'Internet',
      paidBy: 'Hassan',
      amount: 1500.00,
      date: new Date(Date.now() - 172800000).toISOString(), // 2 days ago
      category: 'utilities',
      icon: 'wifi-outline',
    },
  ]);

  const [user, setUser] = useState({
    name: 'Loading...',
  });

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadDashboardData = async () => {
      try {
        setLoading(true);
        // getting the profile data first
        const userRes = await api.get('/auth/me');
        setUser({
          name: userRes.data.name,
        });

        // then getting the first group ID
        const groupId = userRes.data.groups[0]?._id;

        if(groupId){
          const [balanceRes, transactionsRes] = await Promise.all([
            api.get(`/groups/${groupId}/balances`),
            api.get(`/transactions/group/${groupId}`)
            ]);

            const total = transactionsRes.data.reduce((sum: number, transaction: any) => sum + transaction.amount, 0);
            const myBalanceEntry = balanceRes.data.find((entry: any) => entry.userId === userRes.data._id);
            const myNet = myBalanceEntry ?.netBalance ||0;

            const currentUserId = userRes.data._id;
            const allTransactions = transactionsRes.data;

            const totalPaidByUser = allTransactions.reduce((sum: number, transaction: any) => {
              const myPayment = transaction.payers?.find((p: any) => (p.user?._id || p.user) === currentUserId);
              return sum + (myPayment ? myPayment.amount : 0);
            }, 0);

            const totalUserShare = allTransactions.reduce((sum: number, tx: any) => {
              const mySplit = tx.splits?.find((s: any) => (s.user?._id || s.user) === currentUserId);
              return sum + (mySplit ? mySplit.share : 0);
            }, 0);

            setSummary({
              totalGroupExpenses: total,
              yourShare: totalUserShare,
              youPaid: totalPaidByUser,
              balance: myNet,
              status: myNet > 0 ? 'owed' : 'owe',
            }
            );

            const mappedActivities = transactionsRes.data.map((transaction: any) => ({
              ...transaction,
              id: transaction._id,
              title: transaction.description,
              amount: transaction.amount,
              date: transaction.createdAt,
              category: transaction.type || 'other',
            })
            );
            setActivities(mappedActivities);
        }
      }
      catch (error) {
        console.error('Error fetching dashboard data:', error);
      }
      finally {
        setLoading(false);
      }
    };
    loadDashboardData();
  }, []);
  const handleAddExpense = () => {
    console.log('Add Expense pressed');
    // Navigate to Add Expense screen
  };

  const handleSettleUp = () => {
    console.log('Settle Up pressed');
    // Navigate to Settle Up screen
  };

  const handleActivityPress = (id: string) => {
    console.log('Activity pressed:', id);
    // Navigate to expense detail screen
  };

  const handleSettingsPress = () => {
    console.log('Settings pressed');
    // Navigate to settings screen
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Zone 1: Header */}
      <Header
        userName={user.name}
        onSettingsPress={handleSettingsPress}
      />

      <View style={styles.content}>
        {/* Zone 2: Hero Card */}
        <HeroCard summary={summary} />

        {/* Zone 3: Quick Actions */}
        <QuickActions
          onAddExpense={handleAddExpense}
          onSettleUp={handleSettleUp}
        />

        {/* Zone 4: Recent Activity */}
        <RecentActivity
          activities={activities}
          onActivityPress={handleActivityPress}
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background.main,
  },
  content: {
    flex: 1,
  },
});
