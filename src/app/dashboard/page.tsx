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

import { useState, useEffect, useCallback, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import TransactionModal from '@/components/TransactionModal';
import Link from 'next/link';
import { User, Transaction, Account } from '@/types/schema';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faChartLine, faShieldHalved, faBolt, faCoins, faChartPie,
  faWallet, faCreditCard, faBell
} from '@fortawesome/free-solid-svg-icons';
import CosmicBackground from '@/components/background/CosmicBackground';
import FloatingIcons from '@/components/background/FloatingIcons';

// Update transaction types to match our schema
type TransactionType = 'DEPOSIT' | 'WITHDRAWAL' | 'TRANSFER';

// Import TransactionData type from TransactionModal
import { TransactionData } from '@/components/TransactionModal';

// Add a helper function to format dates
const formatDate = (date: Date | string) => {
  const dateObj = date instanceof Date ? date : new Date(date);
  return dateObj.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
};

// Add a helper function to get account name
const getAccountName = (transaction: Transaction, accounts: Account[]) => {
  return transaction.account?.accountName || 'Unknown Account';
};

export default function Dashboard() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedAccountId, setSelectedAccountId] = useState<string>('');
  const [isDepositModalOpen, setIsDepositModalOpen] = useState(false);
  const [isWithdrawModalOpen, setIsWithdrawModalOpen] = useState(false);
  const [isExpenseModalOpen, setIsExpenseModalOpen] = useState(false);
  const [isTransferModalOpen, setIsTransferModalOpen] = useState(false);
  const [notifications, setNotifications] = useState<string[]>([]);
  const [showNotifications, setShowNotifications] = useState(false);

  const fetchUserData = useCallback(async () => {
    try {
      const token = localStorage.getItem('token');
      
      if (!token) {
        router.push('/auth');
        return;
      }

      const response = await fetch('/api/user', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to fetch user data');
      }

      const userData = await response.json();
      setUser(userData);
      setLoading(false);
    } catch (error: unknown) {
      console.error('Error fetching user data:', error);
      localStorage.removeItem('token'); // Clear invalid token
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

  useEffect(() => {
    if (user && user.accounts.length > 0) {
      setNotifications([
        "Welcome to Nordic Finance! 🎉",
        "You have two test accounts ready for use.",
        "Try making some transactions to test the system!"
      ]);
    }
  }, [user]);

  // Add a function to sort accounts
  const sortedAccounts = useMemo(() => {
    if (!user?.accounts) return [];
    
    const accountTypeOrder: Record<string, number> = {
      CHECKING: 0,
      SAVINGS: 1,
      INVESTMENT: 2
    };

    return [...user.accounts].sort((a, b) => {
      // Default to end of list if type not found
      const orderA = accountTypeOrder[a.accountType] ?? 999;
      const orderB = accountTypeOrder[b.accountType] ?? 999;
      return orderA - orderB;
    });
  }, [user?.accounts]);

  // Update the useEffect for initial account selection
  useEffect(() => {
    if (user?.accounts?.length ?? 0 > 0) {
      setSelectedAccountId(sortedAccounts[0]?.id.toString() || '');
    }
  }, [user, sortedAccounts]);

  // Get the selected account object
  const selectedAccount = user?.accounts.find(
    account => account.id.toString() === selectedAccountId
  );

  // Update handlers to match our API routes
  const handleDeposit = async (data: TransactionData) => {
    try {
      console.log('Deposit data:', data);
      const token = localStorage.getItem('token');
      const response = await fetch('/api/transactions/deposit', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          ...data,
          type: 'DEPOSIT'
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to deposit money');
      }

      await fetchUserData();
      await fetchTransactions();
      setIsDepositModalOpen(false);
    } catch (error: unknown) {
      if (error instanceof Error) {
        throw new Error(error.message);
      }
      throw new Error('Failed to process deposit');
    }
  };

  const handleWithdraw = async (data: TransactionData) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('/api/transactions/withdraw', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          ...data,
          type: 'WITHDRAWAL'
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to withdraw money');
      }

      await fetchUserData();
      await fetchTransactions();
      setIsWithdrawModalOpen(false);
    } catch (error: unknown) {
      if (error instanceof Error) {
        throw new Error(error.message);
      }
      throw new Error('Failed to process withdrawal');
    }
  };

  const handleExpense = async (data: TransactionData) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('/api/transactions/expense', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error((await response.json()).error || 'Failed to add expense');
      }

      fetchUserData();
      fetchTransactions();
      setIsExpenseModalOpen(false);
    } catch (error: unknown) {
      throw error;
    }
  };

  const handleTransfer = async (data: TransactionData) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('/api/transactions/transfer', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          ...data,
          type: 'TRANSFER'
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to transfer money');
      }

      await fetchUserData();
      await fetchTransactions();
      setIsTransferModalOpen(false);
    } catch (error: unknown) {
      if (error instanceof Error) {
        throw new Error(error.message);
      }
      throw new Error('Failed to process transfer');
    }
  };

  // Update transaction display
  const getTransactionIcon = (type: TransactionType) => {
    switch (type) {
      case 'DEPOSIT':
        return '↓';
      case 'WITHDRAWAL':
        return '↑';
      case 'TRANSFER':
        return '⇄';
      default:
        return '•';
    }
  };

  const getTransactionColor = (type: TransactionType) => {
    switch (type) {
      case 'DEPOSIT':
        return 'aurora-green';
      case 'WITHDRAWAL':
        return 'frost-blue';
      case 'TRANSFER':
        return 'northern-pink';
      default:
        return 'snow-white';
    }
  };

  // Group transactions by date
  const groupedTransactions = useMemo(() => {
    const groups = transactions.reduce((acc, transaction) => {
      const date = new Date(transaction.createdAt).toLocaleDateString();
      if (!acc[date]) {
        acc[date] = [];
      }
      acc[date].push(transaction);
      return acc;
    }, {} as Record<string, Transaction[]>);

    // Sort dates in descending order
    return Object.entries(groups).sort((a, b) => 
      new Date(b[0]).getTime() - new Date(a[0]).getTime()
    );
  }, [transactions]);

  if (loading) {
    return (
      <div className="min-h-screen bg-nordic-blue flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-aurora-green"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-nordic-blue relative overflow-hidden">
      <CosmicBackground />
      <FloatingIcons />

      {/* Navigation */}
      <nav className="bg-white/5 backdrop-blur-sm border-b border-frost-blue/10 relative z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center">
            <div className="flex space-x-8 items-center">
              <span className="text-xl font-semibold text-aurora-green">Nordic Finance</span>
              <div className="flex space-x-4">
                <Link 
                  href="/dashboard" 
                  className="text-frost-blue hover:text-aurora-green transition-colors px-3 py-2 rounded-md hover:bg-white/5"
                >
                  Home
                </Link>
                <Link 
                  href="/calculator" 
                  className="text-frost-blue hover:text-aurora-green transition-colors px-3 py-2 rounded-md hover:bg-white/5"
                >
                  Calculator
                </Link>
                <Link 
                  href="/analytics" 
                  className="text-frost-blue hover:text-aurora-green transition-colors px-3 py-2 rounded-md hover:bg-white/5"
                >
                  Analytics
                </Link>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              {/* Notification Bell */}
              <div className="relative">
                <button
                  onClick={() => setShowNotifications(!showNotifications)}
                  className="text-frost-blue hover:text-aurora-green transition-colors p-2"
                >
                  <FontAwesomeIcon icon={faBell} />
                  {notifications.length > 0 && (
                    <span className="absolute top-0 right-0 transform translate-x-1/2 -translate-y-1/2 bg-northern-pink text-snow-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                      {notifications.length}
                    </span>
                  )}
                </button>

                {/* Notification Dropdown */}
                {showNotifications && notifications.length > 0 && (
                  <div className="absolute right-0 mt-2 w-72 bg-nordic-blue border border-frost-blue/10 rounded-xl shadow-xl p-4 space-y-3 z-50">
                    {notifications.map((notification, index) => (
                      <div 
                        key={index}
                        className="text-snow-white text-sm p-2 rounded-lg bg-white/5 border border-frost-blue/10"
                      >
                        {notification}
                      </div>
                    ))}
                  </div>
                )}
              </div>
              <button 
                onClick={() => {
                  localStorage.removeItem('token');
                  router.push('/auth');
                }}
                className="text-frost-blue hover:text-aurora-green transition-colors"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-4 py-8">
        {/* Account Selection */}
        <div className="glass-card p-6 mb-8 rounded-xl border border-frost-blue/10">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-medium text-snow-white">Accounts</h2>
            <div className="relative">
              <select
                value={selectedAccountId}
                onChange={(e) => setSelectedAccountId(e.target.value)}
                className="appearance-none glass-card bg-white/5 border border-frost-blue/20 rounded-lg 
                          px-4 py-2 pr-10 text-snow-white focus:outline-none focus:ring-2 
                          focus:ring-aurora-green hover:bg-white/10 transition-colors"
              >
                {sortedAccounts.map((account) => (
                  <option 
                    key={account.id} 
                    value={account.id.toString()}
                    className="bg-nordic-blue text-snow-white"
                  >
                    {account.accountName} - ${account.balance.toFixed(2)}
                  </option>
                ))}
              </select>
              {/* Custom dropdown arrow */}
              <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
                <svg 
                  className="w-4 h-4 text-frost-blue" 
                  fill="none" 
                  stroke="currentColor" 
                  viewBox="0 0 24 24"
                >
                  <path 
                    strokeLinecap="round" 
                    strokeLinejoin="round" 
                    strokeWidth={2} 
                    d="M19 9l-7 7-7-7"
                  />
                </svg>
              </div>
            </div>
          </div>
          <p className="text-4xl font-bold text-aurora-green">
            ${selectedAccount?.balance.toFixed(2) ?? '0.00'}
          </p>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <button 
            onClick={() => setIsDepositModalOpen(true)}
            className="glass-card p-4 rounded-xl hover:bg-aurora-green/10 transition-colors text-snow-white border border-frost-blue/10"
          >
            Deposit
          </button>
          <button 
            onClick={() => setIsWithdrawModalOpen(true)}
            className="glass-card p-4 rounded-xl hover:bg-frost-blue/10 transition-colors text-snow-white border border-frost-blue/10"
          >
            Withdraw
          </button>
          <button 
            onClick={() => setIsExpenseModalOpen(true)}
            className="glass-card p-4 rounded-xl hover:bg-northern-pink/10 transition-colors text-snow-white border border-frost-blue/10"
          >
            Expense
          </button>
          <button 
            onClick={() => setIsTransferModalOpen(true)}
            className="glass-card p-4 rounded-xl hover:bg-aurora-green/10 transition-colors text-snow-white border border-frost-blue/10"
          >
            Transfer
          </button>
        </div>

        {/* Transaction Modals */}
        <TransactionModal
          isOpen={isDepositModalOpen}
          onClose={() => setIsDepositModalOpen(false)}
          type="deposit"
          accounts={sortedAccounts}
          onSubmit={handleDeposit}
          selectedAccountId={selectedAccountId}
        />
        <TransactionModal
          isOpen={isWithdrawModalOpen}
          onClose={() => setIsWithdrawModalOpen(false)}
          type="withdraw"
          accounts={sortedAccounts}
          onSubmit={handleWithdraw}
          selectedAccountId={selectedAccountId}
        />
        <TransactionModal
          isOpen={isExpenseModalOpen}
          onClose={() => setIsExpenseModalOpen(false)}
          type="expense"
          accounts={sortedAccounts}
          onSubmit={handleExpense}
          selectedAccountId={selectedAccountId}
        />
        <TransactionModal
          isOpen={isTransferModalOpen}
          onClose={() => setIsTransferModalOpen(false)}
          type="transfer"
          accounts={sortedAccounts}
          onSubmit={handleTransfer}
          selectedAccountId={selectedAccountId}
        />

        {/* Recent Transactions */}
        <div className="glass-card rounded-xl p-6 border border-frost-blue/10">
          <h2 className="text-lg font-medium text-snow-white mb-4">Recent Transactions</h2>
          <div className="space-y-6">
            {groupedTransactions.map(([date, dayTransactions]) => (
              <div key={date} className="space-y-3">
                <div className="flex items-center space-x-2">
                  <div className="h-px flex-grow bg-frost-blue/20"></div>
                  <span className="text-sm text-frost-blue font-medium">
                    {new Date(date).toLocaleDateString('en-US', { 
                      weekday: 'long',
                      month: 'long',
                      day: 'numeric'
                    })}
                  </span>
                  <div className="h-px flex-grow bg-frost-blue/20"></div>
                </div>

                <div className="space-y-2">
                  {dayTransactions.map((transaction) => {
                    // Get the current account balance at the time of transaction
                    const currentAccount = user?.accounts.find(
                      acc => acc.id === transaction.account.id
                    );

                    return (
                      <div 
                        key={transaction.id}
                        className="flex items-center justify-between p-4 bg-white/5 rounded-lg border border-frost-blue/10 hover:bg-white/10 transition-colors"
                      >
                        <div className="flex items-center space-x-4">
                          <div className={`p-2 rounded-full ${
                            getTransactionColor(transaction.type as TransactionType)
                          }`}>
                            {getTransactionIcon(transaction.type as TransactionType)}
                          </div>
                          <div>
                            <p className="font-medium text-snow-white">
                              {transaction.description}
                            </p>
                            <div className="text-sm text-frost-blue space-x-2">
                              <span className="capitalize">
                                {transaction.type.toLowerCase()}
                              </span>
                              <span>•</span>
                              <span>
                                {getAccountName(transaction, user?.accounts || [])}
                              </span>
                              <span>•</span>
                              <span>
                                {formatDate(transaction.createdAt)}
                              </span>
                            </div>
                          </div>
                        </div>
                        <div className="text-right">
                          <span className={`font-medium text-lg ${
                            getTransactionColor(transaction.type as TransactionType)
                          }`}>
                            {transaction.amount > 0 ? '+' : ''}
                            ${Math.abs(transaction.amount).toFixed(2)}
                          </span>
                          {currentAccount && (
                            <p className="text-sm text-frost-blue">
                              Balance: ${currentAccount.balance.toFixed(2)}
                            </p>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}

            {transactions.length === 0 && (
              <div className="text-center py-8 text-frost-blue">
                No transactions yet. Make your first transaction to get started!
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
} 