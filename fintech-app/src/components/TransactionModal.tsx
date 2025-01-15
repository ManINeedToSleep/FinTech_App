'use client';

interface TransactionModalProps {
  isOpen: boolean;
  onClose: () => void;
  type: 'deposit' | 'withdraw' | 'expense';
  onSubmit: (amount: number, description: string) => Promise<void>;
}

export default function TransactionModal({ isOpen, onClose, type, onSubmit }: TransactionModalProps) {
  if (!isOpen) return null;

  const titles = {
    deposit: 'Deposit Money',
    withdraw: 'Withdraw Money',
    expense: 'Add Expense'
  };

  const buttonColors = {
    deposit: 'bg-green-600 hover:bg-green-700',
    withdraw: 'bg-blue-600 hover:bg-blue-700',
    expense: 'bg-red-600 hover:bg-red-700'
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const amount = parseFloat(form.amount.value);
    const description = form.description.value;
    await onSubmit(amount, description);
    onClose();
    form.reset();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md">
        <h2 className="text-xl font-bold mb-4">
          {titles[type]}
        </h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="amount" className="block text-sm font-medium text-gray-700">
              Amount ($)
            </label>
            <input
              type="number"
              id="amount"
              name="amount"
              step="0.01"
              min="0.01"
              required
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md"
            />
          </div>
          <div>
            <label htmlFor="description" className="block text-sm font-medium text-gray-700">
              Description
            </label>
            <input
              type="text"
              id="description"
              name="description"
              required
              placeholder={`Enter ${type} description`}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md"
            />
          </div>
          <div className="flex space-x-3">
            <button
              type="submit"
              className={`flex-1 py-2 px-4 rounded-md text-white ${buttonColors[type]}`}
            >
              Confirm
            </button>
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-2 px-4 border border-gray-300 rounded-md hover:bg-gray-50"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
} 