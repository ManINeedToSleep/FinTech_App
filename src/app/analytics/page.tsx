/**
 * Analytics Page
 * 
 * Visualizes user's financial data:
 * - Transaction distribution (Pie Chart)
 * - Monthly trends (Bar Chart)
 * - Summary statistics
 * 
 * Uses:
 * - Recharts for data visualization
 * - Fetches transaction history
 * - Protected route (requires authentication)
 */

'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  PieChart, Pie, Cell,
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer
} from 'recharts';

interface Transaction {
  id: number;
  type: string;
  amount: number;
  description: string;
  createdAt: string;
}

const COLORS = ['#22c55e', '#3b82f6', '#ef4444'];

export default function Analytics() {
  const router = useRouter();
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          router.push('/auth');
          return;
        }

        const response = await fetch('/api/transactions', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });

        if (!response.ok) throw new Error('Failed to fetch transactions');

        const data = await response.json();
        setTransactions(data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching transactions:', error);
        setLoading(false);
      }
    };

    fetchTransactions();
  }, [router]);

  // Calculate totals by type
  const totals = transactions.reduce((acc, transaction) => {
    const amount = Math.abs(transaction.amount);
    if (transaction.type === 'deposit') {
      acc.deposits += amount;
    } else if (transaction.type === 'withdrawal') {
      acc.withdrawals += amount;
    } else if (transaction.type === 'expense') {
      acc.expenses += amount;
    }
    return acc;
  }, { deposits: 0, withdrawals: 0, expenses: 0 });

  const pieData = [
    { name: 'Deposits', value: totals.deposits },
    { name: 'Withdrawals', value: totals.withdrawals },
    { name: 'Expenses', value: totals.expenses },
  ];

  // Monthly analysis
  const monthlyData = transactions.reduce((acc: any, transaction) => {
    const date = new Date(transaction.createdAt);
    const monthYear = `${date.getMonth() + 1}/${date.getFullYear()}`;
    
    if (!acc[monthYear]) {
      acc[monthYear] = { deposits: 0, withdrawals: 0, expenses: 0 };
    }

    const amount = Math.abs(transaction.amount);
    if (transaction.type === 'deposit') {
      acc[monthYear].deposits += amount;
    } else if (transaction.type === 'withdrawal') {
      acc[monthYear].withdrawals += amount;
    } else if (transaction.type === 'expense') {
      acc[monthYear].expenses += amount;
    }

    return acc;
  }, {});

  const barData = Object.entries(monthlyData).map(([month, data]: [string, any]) => ({
    month,
    ...data
  }));

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50">
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
                  className="text-blue-600 transition-colors px-3 py-2 rounded-md bg-gray-50"
                >
                  Analytics
                </Link>
              </div>
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Transaction Distribution */}
          <div className="bg-white p-6 rounded-xl shadow-md">
            <h2 className="text-lg font-medium text-gray-900 mb-4">Transaction Distribution</h2>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={pieData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {pieData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Monthly Trends */}
          <div className="bg-white p-6 rounded-xl shadow-md">
            <h2 className="text-lg font-medium text-gray-900 mb-4">Monthly Trends</h2>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={barData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="deposits" fill="#22c55e" name="Deposits" />
                  <Bar dataKey="withdrawals" fill="#3b82f6" name="Withdrawals" />
                  <Bar dataKey="expenses" fill="#ef4444" name="Expenses" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Summary Statistics */}
          <div className="bg-white p-6 rounded-xl shadow-md md:col-span-2">
            <h2 className="text-lg font-medium text-gray-900 mb-4">Summary</h2>
            <div className="grid grid-cols-3 gap-4">
              <div className="p-4 bg-green-50 rounded-lg">
                <p className="text-sm text-green-600">Total Deposits</p>
                <p className="text-2xl font-semibold text-green-700">
                  ${totals.deposits.toFixed(2)}
                </p>
              </div>
              <div className="p-4 bg-blue-50 rounded-lg">
                <p className="text-sm text-blue-600">Total Withdrawals</p>
                <p className="text-2xl font-semibold text-blue-700">
                  ${totals.withdrawals.toFixed(2)}
                </p>
              </div>
              <div className="p-4 bg-red-50 rounded-lg">
                <p className="text-sm text-red-600">Total Expenses</p>
                <p className="text-2xl font-semibold text-red-700">
                  ${totals.expenses.toFixed(2)}
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
} 