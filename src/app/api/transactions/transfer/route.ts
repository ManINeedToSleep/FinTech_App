import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { getUserFromToken } from '@/lib/auth';

const prisma = new PrismaClient();

export async function POST(request: Request) {
  try {
    const user = await getUserFromToken(request);
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    
    if (!body.amount || !body.accountId || !body.toAccountId || !body.description) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    const amount = Number(body.amount);
    const fromAccountId = Number(body.accountId);
    const toAccountId = Number(body.toAccountId);

    if (isNaN(amount) || amount <= 0) {
      return NextResponse.json(
        { error: 'Invalid amount' },
        { status: 400 }
      );
    }

    if (isNaN(fromAccountId) || isNaN(toAccountId)) {
      return NextResponse.json(
        { error: 'Invalid account ID' },
        { status: 400 }
      );
    }

    if (fromAccountId === toAccountId) {
      return NextResponse.json(
        { error: 'Cannot transfer to the same account' },
        { status: 400 }
      );
    }

    // Check if both accounts exist and belong to user
    const [fromAccount, toAccount] = await Promise.all([
      prisma.account.findFirst({
        where: {
          id: fromAccountId,
          userId: user.id
        }
      }),
      prisma.account.findFirst({
        where: {
          id: toAccountId,
          userId: user.id
        }
      })
    ]);

    if (!fromAccount || !toAccount) {
      return NextResponse.json(
        { error: 'One or both accounts not found' },
        { status: 404 }
      );
    }

    if (fromAccount.balance < amount) {
      return NextResponse.json(
        { error: 'Insufficient funds' },
        { status: 400 }
      );
    }

    // Get or create transfer category
    const transferCategory = await prisma.category.upsert({
      where: {
        name_type: {
          name: 'Transfer',
          type: 'TRANSFER'
        }
      },
      update: {}, // no updates needed
      create: {
        name: 'Transfer',
        type: 'TRANSFER',
        icon: '⇄'
      }
    });

    try {
      const result = await prisma.$transaction([
        // Debit from source account
        prisma.transaction.create({
          data: {
            type: 'TRANSFER',
            amount: -amount,
            description: body.description,
            userId: user.id,
            accountId: fromAccountId,
            categoryId: transferCategory.id
          }
        }),
        // Credit to destination account
        prisma.transaction.create({
          data: {
            type: 'TRANSFER',
            amount: amount,
            description: body.description,
            userId: user.id,
            accountId: toAccountId,
            categoryId: transferCategory.id
          }
        }),
        // Update source account balance
        prisma.account.update({
          where: { id: fromAccountId },
          data: {
            balance: {
              decrement: amount
            }
          }
        }),
        // Update destination account balance
        prisma.account.update({
          where: { id: toAccountId },
          data: {
            balance: {
              increment: amount
            }
          }
        })
      ]);

      return NextResponse.json(result[0]);
    } catch (dbError) {
      const errorMessage = dbError instanceof Error ? dbError.message : 'Unknown database error';
      console.error('Database error:', errorMessage);
      
      return NextResponse.json(
        { error: 'Database transaction failed' },
        { status: 500 }
      );
    }
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    console.error('Request error:', errorMessage);
    
    return NextResponse.json(
      { error: 'Failed to process transfer' },
      { status: 500 }
    );
  }
} 