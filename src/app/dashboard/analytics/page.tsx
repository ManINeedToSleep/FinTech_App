'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import {
  PieChart, Pie, Cell,
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer
} from 'recharts';
import Link from 'next/link';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChartLine } from '@fortawesome/free-solid-svg-icons';
import CosmicBackground from '@/components/background/CosmicBackground';
import FloatingIcons from '@/components/background/FloatingIcons';

// Nordic theme colors
const NORDIC_COLORS = ['#7CFCD0', '#FF61A6', '#E2E8F0'];

interface Transaction {
  id: number;
  type: string;
  amount: number;
  description: string;
  createdAt: string;
}

interface MonthlyData {
  [key: string]: {
    month: string;
    deposits: number;
    withdrawals: number;
    transfers: number;
  }
}

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

  // Calculate data for charts
  const pieData = [
    { name: 'Deposits', value: transactions.filter(t => t.type === 'DEPOSIT').reduce((sum, t) => sum + t.amount, 0) },
    { name: 'Withdrawals', value: Math.abs(transactions.filter(t => t.type === 'WITHDRAWAL').reduce((sum, t) => sum + t.amount, 0)) },
    { name: 'Transfers', value: Math.abs(transactions.filter(t => t.type === 'TRANSFER').reduce((sum, t) => sum + t.amount, 0)) }
  ];

  // Monthly data
  const monthlyData = transactions.reduce<MonthlyData>((acc, transaction) => {
    const date = new Date(transaction.createdAt);
    const month = date.toLocaleString('default', { month: 'short' });
    if (!acc[month]) {
      acc[month] = { month, deposits: 0, withdrawals: 0, transfers: 0 };
    }
    if (transaction.type === 'DEPOSIT') {
      acc[month].deposits += transaction.amount;
    } else if (transaction.type === 'WITHDRAWAL') {
      acc[month].withdrawals += Math.abs(transaction.amount);
    } else {
      acc[month].transfers += Math.abs(transaction.amount);
    }
    return acc;
  }, {});

  const barData = Object.values(monthlyData);

  if (loading) {
    return (
      <div className="min-h-screen bg-nordic-blue relative overflow-hidden">
        <div className="flex items-center justify-center h-64">
          <div className="text-aurora-green text-xl">Loading analytics...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-nordic-blue relative overflow-hidden">
      <CosmicBackground />
      <FloatingIcons />

      <main className="relative z-10">
        {/* Navigation */}
        <nav className="bg-white/5 backdrop-blur-sm border-b border-frost-blue/10 relative z-10">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <div className="flex justify-between items-center">
              <div className="flex space-x-8 items-center">
                <span className="text-xl font-semibold text-aurora-green">Fintech Financial Bank</span>
                <div className="flex space-x-4">
                  <Link 
                    href="/dashboard" 
                    className="text-frost-blue hover:text-aurora-green transition-colors px-3 py-2 rounded-md hover:bg-white/5"
                  >
                    Home
                  </Link>
                  <Link 
                    href="/dashboard/calculator" 
                    className="text-frost-blue hover:text-aurora-green transition-colors px-3 py-2 rounded-md hover:bg-white/5"
                  >
                    Calculator
                  </Link>
                  <Link 
                    href="/dashboard/analytics" 
                    className="text-aurora-green bg-white/5 transition-colors px-3 py-2 rounded-md"
                  >
                    Analytics
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </nav>

        {/* Content Container */}
        <div className="container mx-auto p-6">
          {/* Charts Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Transaction Distribution */}
            <div className="bg-white/5 p-6 rounded-xl border border-frost-blue/10">
              <h2 className="text-lg font-medium text-snow-white mb-4">Transaction Distribution</h2>
              <div className="h-80">
                <ResponsiveContainer>
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
                        <Cell key={`cell-${index}`} fill={NORDIC_COLORS[index % NORDIC_COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip contentStyle={{ backgroundColor: '#1E3D59', border: 'none', borderRadius: '8px' }} />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Monthly Trends */}
            <div className="bg-white/5 p-6 rounded-xl border border-frost-blue/10">
              <h2 className="text-lg font-medium text-snow-white mb-4">Monthly Activity</h2>
              <div className="h-80">
                <ResponsiveContainer>
                  <BarChart data={barData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#4C566A" />
                    <XAxis dataKey="month" stroke="#E5E9F0" />
                    <YAxis stroke="#E5E9F0" />
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: '#1E3D59', 
                        border: 'none', 
                        borderRadius: '8px' 
                      }}
                    />
                    <Bar dataKey="deposits" fill="#7CFCD0" name="Deposits" />
                    <Bar dataKey="withdrawals" fill="#FF61A6" name="Withdrawals" />
                    <Bar dataKey="transfers" fill="#E2E8F0" name="Transfers" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Summary Cards */}
            <div className="bg-white/5 p-6 rounded-xl border border-frost-blue/10 md:col-span-2">
              <h2 className="text-lg font-medium text-snow-white mb-4">Summary</h2>
              <div className="grid grid-cols-3 gap-4">
                <div className="p-4 bg-aurora-green/10 rounded-lg border border-aurora-green/20">
                  <p className="text-sm text-aurora-green">Total Deposits</p>
                  <p className="text-2xl font-semibold text-snow-white">
                    ${pieData[0].value.toFixed(2)}
                  </p>
                </div>
                <div className="p-4 bg-northern-pink/10 rounded-lg border border-northern-pink/20">
                  <p className="text-sm text-northern-pink">Total Withdrawals</p>
                  <p className="text-2xl font-semibold text-snow-white">
                    ${pieData[1].value.toFixed(2)}
                  </p>
                </div>
                <div className="p-4 bg-frost-blue/10 rounded-lg border border-frost-blue/20">
                  <p className="text-sm text-frost-blue">Total Transfers</p>
                  <p className="text-2xl font-semibold text-snow-white">
                    ${pieData[2].value.toFixed(2)}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}



