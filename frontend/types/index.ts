// TypeScript Interfaces for the Hostel Expense Manager

export interface User {
  _id: string;
  name: string;
  email: string;
}

export interface Group {
  _id: string;
  name: string;
  members: User[];
  createdAt: string;
}

export interface Transaction {
  _id: string;
  groupId: string;
  description: string;
  amount: number;
  paidBy: User;
  splitBetween: User[];
  category?: 'groceries' | 'utilities' | 'rent' | 'other';
  receipt?: string;
  createdAt: string;
}

export interface ExpenseSummary {
  totalGroupExpenses: number;
  yourShare: number;
  youPaid: number;
  balance: number; // Negative = you owe, Positive = you're owed
  status: 'owe' | 'owed' | 'settled';
}

export interface RecentActivityItem {
  id: string;
  title: string;
  paidBy: string;
  amount: number;
  date: string;
  category: string;
  icon: string;
}
