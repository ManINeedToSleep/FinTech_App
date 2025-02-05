import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

const defaultCategories = [
  // Income categories
  { name: 'Salary', type: 'DEPOSIT', icon: '💰' },
  { name: 'Freelance', type: 'DEPOSIT', icon: '💻' },
  { name: 'Investments', type: 'DEPOSIT', icon: '📈' },
  { name: 'Gifts', type: 'DEPOSIT', icon: '🎁' },

  // Expense categories
  { name: 'Groceries', type: 'WITHDRAWAL', icon: '🛒' },
  { name: 'Rent', type: 'WITHDRAWAL', icon: '🏠' },
  { name: 'Utilities', type: 'WITHDRAWAL', icon: '💡' },
  { name: 'Transportation', type: 'WITHDRAWAL', icon: '🚗' },
  { name: 'Entertainment', type: 'WITHDRAWAL', icon: '🎬' },
  { name: 'Healthcare', type: 'WITHDRAWAL', icon: '🏥' },
  { name: 'Shopping', type: 'WITHDRAWAL', icon: '🛍️' },
  { name: 'Dining', type: 'WITHDRAWAL', icon: '🍽️' },
  
  // Transfer categories
  { name: 'Account Transfer', type: 'TRANSFER', icon: '🔄' },
];

async function main() {
  try {
    console.log('Starting seed...');

    // Create categories
    console.log('Creating categories...');
    const createdCategories = await Promise.all(
      defaultCategories.map(category =>
        prisma.category.upsert({
          where: {
            name_type: {
              name: category.name,
              type: category.type
            }
          },
          update: {},
          create: category,
        })
      )
    );

    // Create a test user
    console.log('Creating test user...');
    const testUser = await prisma.user.upsert({
      where: { email: 'test@example.com' },
      update: {},
      create: {
        email: 'test@example.com',
        username: 'testuser',
        passwordHash: await bcrypt.hash('password123', 10),
        firstName: 'Test',
        lastName: 'User',
      },
    });

    // Create default accounts for test user
    console.log('Creating test accounts...');
    const accountTypes = ['CHECKING', 'SAVINGS', 'INVESTMENT'];
    
    for (const type of accountTypes) {
      await prisma.account.create({
        data: {
          accountType: type,
          accountName: `My ${type.toLowerCase()} account`,
          balance: 1000.00,
          userId: testUser.id,
        },
      });
    }

    // Create some sample transactions
    console.log('Creating sample transactions...');
    const accounts = await prisma.account.findMany({
      where: { userId: testUser.id },
    });
    
    // Find specific categories
    const salaryCategory = createdCategories.find(c => c.name === 'Salary');
    const rentCategory = createdCategories.find(c => c.name === 'Rent');
    const groceriesCategory = createdCategories.find(c => c.name === 'Groceries');

    // Sample transactions for the checking account
    const checkingAccount = accounts.find(acc => acc.accountType === 'CHECKING');
    if (checkingAccount && salaryCategory && rentCategory && groceriesCategory) {
      await prisma.transaction.createMany({
        data: [
          {
            amount: 2500.00,
            type: 'DEPOSIT',
            categoryId: salaryCategory.id,
            description: 'Monthly salary',
            accountId: checkingAccount.id,
            userId: testUser.id,
          },
          {
            amount: 800.00,
            type: 'WITHDRAWAL',
            categoryId: rentCategory.id,
            description: 'Monthly rent',
            accountId: checkingAccount.id,
            userId: testUser.id,
          },
          {
            amount: 100.00,
            type: 'WITHDRAWAL',
            categoryId: groceriesCategory.id,
            description: 'Weekly groceries',
            accountId: checkingAccount.id,
            userId: testUser.id,
          },
        ],
      });
    }

    console.log('Seed completed successfully!');
  } catch (error) {
    console.error('Detailed error:', error);
    throw error;
  }
}

main()
  .catch((e) => {
    console.error('Error during seeding:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  }); 