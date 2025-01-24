/**
 * Dashboard Page Component
 * 
 * Main interface for users to:
 * - View their current balance
 * - Make deposits, withdrawals, and expenses
 * - View recent transactions
 * - Access financial tools
 * 
 * Uses:
 * - TransactionModal for handling money operations
 * - Fetches user data and transactions on load
 * - Protected route (requires authentication)
 */

'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import TransactionModal from '@/components/TransactionModal';
import Link from 'next/link';

interface Transaction {
  id: number;
  type: string;
  amount: number;
  description: string;
  createdAt: string;
}

interface User {
  id: number;
  username: string;
  email: string;
  balance: number;
}

export default function Dashboard() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [isDepositModalOpen, setIsDepositModalOpen] = useState(false);
  const [isWithdrawModalOpen, setIsWithdrawModalOpen] = useState(false);
  const [isExpenseModalOpen, setIsExpenseModalOpen] = useState(false);

  const fetchUserData = useCallback(async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('/api/user', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (!response.ok) throw new Error('Failed to fetch user data');
      
      const userData = await response.json();
      setUser(userData);
      setLoading(false);
    } catch (error: unknown) {
      console.error('Error fetching user data:', error);
      router.push('/auth');
    }
  }, [router]);

  const fetchTransactions = useCallback(async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('/api/transactions', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (!response.ok) throw new Error('Failed to fetch transactions');
      
      const transactionData = await response.json();
      setTransactions(transactionData);
    } catch (error) {
      console.error('Error fetching transactions:', error);
    }
  }, []);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      router.push('/auth');
      return;
    }

    fetchUserData();
    fetchTransactions();
  }, [router, fetchUserData, fetchTransactions]);

  const handleDeposit = async (amount: number, description: string) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('/api/transactions/deposit', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ amount, description }),
      });

      if (!response.ok) {
        throw new Error((await response.json()).error || 'Failed to deposit money');
      }

      fetchUserData();
      fetchTransactions();
    } catch (error: unknown) {
      alert(error instanceof Error ? error.message : 'An error occurred');
    }
  };

  const handleWithdraw = async (amount: number, description: string) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('/api/transactions/withdraw', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ amount, description }),
      });

      if (!response.ok) {
        throw new Error((await response.json()).error || 'Failed to withdraw money');
      }

      fetchUserData();
      fetchTransactions();
    } catch (error: unknown) {
      alert(error instanceof Error ? error.message : 'An error occurred');
    }
  };

  const handleExpense = async (amount: number, description: string) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('/api/transactions/expense', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ amount, description }),
      });

      if (!response.ok) {
        throw new Error((await response.json()).error || 'Failed to add expense');
      }

      fetchUserData();
      fetchTransactions();
    } catch (error: unknown) {
      alert(error instanceof Error ? error.message : 'An error occurred');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navigation */}
      <nav className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center">
            <div className="flex space-x-8 items-center">
              <span className="text-xl font-semibold text-blue-600">FinTech</span>
              <div className="flex space-x-4">
                <Link 
                  href="/dashboard" 
                  className="text-gray-600 hover:text-blue-600 transition-colors px-3 py-2 rounded-md hover:bg-gray-50"
                >
                  Home
                </Link>
                <Link 
                  href="/calculator" 
                  className="text-gray-600 hover:text-blue-600 transition-colors px-3 py-2 rounded-md hover:bg-gray-50"
                >
                  Calculator
                </Link>
                <Link 
                  href="/analytics" 
                  className="text-gray-600 hover:text-blue-600 transition-colors px-3 py-2 rounded-md hover:bg-gray-50"
                >
                  Analytics
                </Link>
              </div>
            </div>
            <button 
              onClick={() => {
                localStorage.removeItem('token');
                router.push('/auth');
              }}
              className="text-gray-600 hover:text-blue-600 transition-colors"
            >
              Logout
            </button>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Balance Card */}
        <div className="bg-white rounded-xl shadow-md p-6 mb-8">
          <h2 className="text-lg font-medium text-gray-700">Available Balance</h2>
          <p className="text-4xl font-bold text-blue-600 mt-2">
            ${user?.balance.toFixed(2)}
          </p>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-3 gap-4 mb-8">
          <button 
            onClick={() => setIsDepositModalOpen(true)}
            className="bg-green-600 text-white p-4 rounded-lg hover:bg-green-700 transition-colors"
          >
            Deposit
          </button>
          <button 
            onClick={() => setIsWithdrawModalOpen(true)}
            className="bg-blue-600 text-white p-4 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Withdraw
          </button>
          <button 
            onClick={() => setIsExpenseModalOpen(true)}
            className="bg-red-600 text-white p-4 rounded-lg hover:bg-red-700 transition-colors"
          >
            Expense
          </button>
        </div>

        {/* Recent Transactions */}
        <div className="bg-white rounded-xl shadow-md p-6">
          <h2 className="text-lg font-medium text-gray-700 mb-4">Recent Transactions</h2>
          <div className="space-y-4">
            {transactions.map((transaction) => (
              <div 
                key={transaction.id}
                className="flex items-center justify-between p-4 bg-gray-50 rounded-lg"
              >
                <div className="flex items-center space-x-4">
                  <div className={`p-2 rounded-full ${
                    transaction.type === 'deposit' 
                      ? 'bg-green-100 text-green-600'
                      : transaction.type === 'withdrawal'
                      ? 'bg-blue-100 text-blue-600'
                      : transaction.type === 'expense'
                      ? 'bg-red-100 text-red-600'
                      : 'bg-gray-100 text-gray-600'
                  }`}>
                    {transaction.type === 'deposit' ? '↓' 
                      : transaction.type === 'withdrawal' ? '↑'
                      : transaction.type === 'expense' ? '×'
                      : '•'}
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">{transaction.description}</p>
                    <p className="text-sm text-gray-500">
                      <span className="capitalize">{transaction.type}</span> • {new Date(transaction.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                </div>
                <span className={`font-medium ${
                  transaction.type === 'deposit' 
                    ? 'text-green-600'
                    : transaction.type === 'withdrawal'
                    ? 'text-blue-600'
                    : transaction.type === 'expense'
                    ? 'text-red-600'
                    : 'text-gray-600'
                }`}>
                  {transaction.type === 'deposit' ? '+' : '-'}
                  ${Math.abs(transaction.amount).toFixed(2)}
                </span>
              </div>
            ))}
          </div>
        </div>
      </main>

      <TransactionModal
        isOpen={isDepositModalOpen}
        onClose={() => setIsDepositModalOpen(false)}
        type="deposit"
        onSubmit={handleDeposit}
      />
      <TransactionModal
        isOpen={isWithdrawModalOpen}
        onClose={() => setIsWithdrawModalOpen(false)}
        type="withdraw"
        onSubmit={handleWithdraw}
      />
      <TransactionModal
        isOpen={isExpenseModalOpen}
        onClose={() => setIsExpenseModalOpen(false)}
        type="expense"
        onSubmit={handleExpense}
      />
    </div>
  );
} 