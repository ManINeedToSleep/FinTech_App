export interface Account {
  id: number;
  accountType: 'CHECKING' | 'SAVINGS' | 'INVESTMENT';
  accountName: string;
  balance: number;
  userId: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface Transaction {
  id: number;
  amount: number;
  type: 'DEPOSIT' | 'WITHDRAWAL' | 'TRANSFER';
  categoryId: number;
  description?: string;
  accountId: number;
  userId: number;
  createdAt: Date;
  updatedAt: Date;
  account: Account;
  category: Category;
}

export interface Category {
  id: number;
  name: string;
  type: 'DEPOSIT' | 'WITHDRAWAL' | 'TRANSFER';
  icon?: string;
}

export interface User {
  id: number;
  email: string;
  username: string;
  firstName?: string;
  lastName?: string;
  accounts: Account[];
  createdAt: Date;
  updatedAt: Date;
} 