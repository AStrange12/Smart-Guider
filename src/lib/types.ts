
import type { Timestamp } from 'firebase/firestore';

export type UserProfile = {
  uid: string;
  email: string | null;
  name: string | null;
  photoURL: string | null;
  createdAt: Timestamp;
  salary?: number;
  taxRegime?: 'old' | 'new';
  budget?: {
    needs: number;
    wants: number;
    savings: number;
  };
  bonus?: {
    amount: number;
    type: 'Promotion Hike' | 'Performance Bonus' | 'Joining Bonus' | 'Other';
  };
};

export type Expense = {
  id: string;
  userId: string;
  category: string;
  amount: number;
  date: Timestamp;
  description?: string;
  type: 'need' | 'want';
  emoji?: string;
};

export type SavingsGoal = {
  id:string;
  userId: string;
  name: string;
  category: 'Travel' | 'Gadget' | 'Emergency Fund' | 'Investment' | 'Down Payment' | 'Education' | 'Other';
  targetAmount: number;
  currentAmount: number;
  deadline: Timestamp;
};

export type Investment = {
  id: string;
  userId: string;
  name: string;
  type: 'Stocks' | 'Mutual Funds' | 'ETFs' | 'Crypto' | 'Bonds' | 'Real Estate' | 'Other';
  purchaseDate: Timestamp;
  quantity?: number;
  purchasePrice: number;
  currentValue: number;
};
