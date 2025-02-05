'use client';

import { useState, useEffect, useMemo } from 'react';
import { Account } from '@/types/schema';

export interface TransactionData {
  amount: number;
  description: string;
  accountId: string;
  toAccountId?: string;
  categoryId?: string;
}

interface TransactionModalProps {
  isOpen: boolean;
  onClose: () => void;
  type: 'deposit' | 'withdraw' | 'transfer' | 'expense';
  accounts: Account[];
  onSubmit: (data: TransactionData) => Promise<void>;
  selectedAccountId?: string;
}

/**
 * Transaction Modal Component
 * 
 * Reusable modal for handling financial transactions:
 * - Supports deposits, withdrawals, and expenses
 * - Handles form submission and validation
 * - Provides different styling based on transaction type
 * 
 * Props:
 * @param isOpen - Controls modal visibility
 * @param onClose - Function to close modal
 * @param type - Transaction type ('deposit' | 'withdraw' | 'expense' | 'transfer')
 * @param accounts - List of accounts available for transactions
 * @param onSubmit - Handler for form submission
 * @param selectedAccountId - Optional selected account ID
 */
export default function TransactionModal({
  isOpen,
  onClose,
  type,
  accounts,
  onSubmit,
  selectedAccountId
}: TransactionModalProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    amount: '',
    description: '',
    accountId: '',
    toAccountId: '',
    categoryId: ''
  });

  // Sort accounts in the modal as well
  const sortedAccounts = useMemo(() => {
    const accountTypeOrder: Record<string, number> = {
      CHECKING: 0,
      SAVINGS: 1,
      INVESTMENT: 2
    };

    return [...accounts].sort((a, b) => {
      // Default to end of list if type not found
      const orderA = accountTypeOrder[a.accountType] ?? 999;
      const orderB = accountTypeOrder[b.accountType] ?? 999;
      return orderA - orderB;
    });
  }, [accounts]);

  useEffect(() => {
    if (isOpen && sortedAccounts.length > 0) {
      setFormData(prev => ({
        ...prev,
        accountId: selectedAccountId || sortedAccounts[0].id.toString()
      }));
    }
  }, [isOpen, sortedAccounts, selectedAccountId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const amount = parseFloat(formData.amount);
      if (isNaN(amount) || amount <= 0) {
        throw new Error('Please enter a valid positive amount');
      }

      if (!formData.description.trim()) {
        throw new Error('Please enter a description');
      }

      if (!formData.accountId) {
        throw new Error('Please select an account');
      }

      // Format data based on transaction type
      const transactionData: TransactionData = {
        amount,
        description: formData.description.trim(),
        accountId: formData.accountId,
      };

      // Add toAccountId for transfers
      if (type === 'transfer') {
        if (!formData.toAccountId) {
          throw new Error('Please select a destination account');
        }
        transactionData.toAccountId = formData.toAccountId;
      }

      await onSubmit(transactionData);
      onClose();
      
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Transaction failed');
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <div className="glass-card w-full max-w-md p-6 rounded-xl">
        <h2 className="text-2xl font-bold text-snow-white mb-4 capitalize">
          {type} {type === 'expense' ? 'Payment' : ''}
        </h2>

        {error && (
          <div className="bg-red-500/10 text-red-500 p-3 rounded-lg text-sm mb-4">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-frost-blue mb-1">
              From Account
            </label>
            <div className="relative">
              <select
                value={formData.accountId}
                onChange={(e) => setFormData({ ...formData, accountId: e.target.value })}
                className="appearance-none w-full glass-card bg-white/5 border border-frost-blue/20 rounded-lg 
                          px-4 py-2 pr-10 text-snow-white focus:outline-none focus:ring-2 
                          focus:ring-aurora-green hover:bg-white/10 transition-colors"
                required
              >
                {sortedAccounts.map((account) => (
                  <option 
                    key={account.id} 
                    value={account.id}
                    className="bg-nordic-blue text-snow-white"
                  >
                    {account.accountName} (${account.balance.toFixed(2)})
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

          {type === 'transfer' && (
            <div>
              <label className="block text-sm font-medium text-frost-blue mb-1">
                To Account
              </label>
              <div className="relative">
                <select
                  value={formData.toAccountId}
                  onChange={(e) => setFormData({ ...formData, toAccountId: e.target.value })}
                  className="appearance-none w-full glass-card bg-white/5 border border-frost-blue/20 rounded-lg 
                            px-4 py-2 pr-10 text-snow-white focus:outline-none focus:ring-2 
                            focus:ring-aurora-green hover:bg-white/10 transition-colors"
                  required
                >
                  <option value="" className="bg-nordic-blue text-snow-white">Select account</option>
                  {sortedAccounts
                    .filter(acc => acc.id.toString() !== formData.accountId)
                    .map((account) => (
                      <option 
                        key={account.id} 
                        value={account.id}
                        className="bg-nordic-blue text-snow-white"
                      >
                        {account.accountName} (${account.balance.toFixed(2)})
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
          )}

          <div>
            <label className="block text-sm font-medium text-frost-blue mb-1">
              Amount
            </label>
            <input
              type="number"
              min="0.01"
              step="0.01"
              required
              value={formData.amount}
              onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
              className="w-full px-4 py-2 bg-white/10 border border-frost-blue/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-aurora-green text-snow-white"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-frost-blue mb-1">
              Description
            </label>
            <input
              type="text"
              required
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="w-full px-4 py-2 bg-white/10 border border-frost-blue/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-aurora-green text-snow-white"
            />
          </div>

          <div className="flex space-x-3 pt-4">
            <button
              type="submit"
              disabled={loading}
              className="flex-1 py-2 px-4 bg-aurora-green text-nordic-blue rounded-lg font-medium hover:bg-aurora-green/90 transition-colors disabled:opacity-50"
            >
              {loading ? 'Processing...' : 'Confirm'}
            </button>
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-2 px-4 border border-frost-blue text-frost-blue rounded-lg hover:bg-frost-blue/10 transition-colors"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
} 