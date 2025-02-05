import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

const prisma = new PrismaClient();

export async function POST(request: Request) {
  try {
    const { email, password, username, firstName, lastName } = await request.json();

    // Check if user already exists
    const existingUser = await prisma.user.findFirst({
      where: {
        OR: [
          { email },
          { username }
        ]
      }
    });

    if (existingUser) {
      return NextResponse.json(
        { error: 'User already exists' },
        { status: 400 }
      );
    }

    // Create user with accounts in a transaction
    const result = await prisma.$transaction(async (prisma) => {
      // Create the user
      const hashedPassword = await bcrypt.hash(password, 10);
      const user = await prisma.user.create({
        data: {
          email,
          username,
          passwordHash: hashedPassword,
          firstName,
          lastName
        }
      });

      // Create default accounts
      const [checkingAccount, savingsAccount] = await Promise.all([
        prisma.account.create({
          data: {
            accountType: 'CHECKING',
            accountName: 'Main Checking',
            balance: 0,
            userId: user.id
          }
        }),
        prisma.account.create({
          data: {
            accountType: 'SAVINGS',
            accountName: 'Savings Account',
            balance: 0,
            userId: user.id
          }
        })
      ]);

      // Create or get default deposit category
      const depositCategory = await prisma.category.upsert({
        where: {
          name_type: {
            name: 'Deposit',
            type: 'DEPOSIT'
          }
        },
        update: {},
        create: {
          name: 'Deposit',
          type: 'DEPOSIT',
          icon: '↓'
        }
      });

      // Create initial transactions with category
      await Promise.all([
        prisma.transaction.create({
          data: {
            type: 'DEPOSIT',
            amount: 1000.00,
            description: 'Initial deposit',
            accountId: checkingAccount.id,
            userId: user.id,
            categoryId: depositCategory.id
          }
        }),
        prisma.account.update({
          where: { id: checkingAccount.id },
          data: { balance: 1000.00 }
        }),
        prisma.transaction.create({
          data: {
            type: 'DEPOSIT',
            amount: 500.00,
            description: 'Initial savings',
            accountId: savingsAccount.id,
            userId: user.id,
            categoryId: depositCategory.id
          }
        }),
        prisma.account.update({
          where: { id: savingsAccount.id },
          data: { balance: 500.00 }
        })
      ]);

      return { user, accounts: [checkingAccount, savingsAccount] };
    });

    // Generate JWT token
    const token = jwt.sign(
      { userId: result.user.id },
      process.env.JWT_SECRET!,
      { expiresIn: process.env.JWT_EXPIRES_IN }
    );

    // Remove password hash from response
    const { passwordHash, ...userWithoutPassword } = result.user;

    return NextResponse.json({
      user: userWithoutPassword,
      accounts: result.accounts,
      token
    });

  } catch (error) {
    console.error('Registration error:', error);
    return NextResponse.json(
      { error: 'Failed to create user' },
      { status: 500 }
    );
  }
} 