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
    
    if (!body.amount || !body.accountId || !body.description) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    const amount = Number(body.amount);
    const accountId = Number(body.accountId);

    if (isNaN(amount) || amount <= 0) {
      return NextResponse.json(
        { error: 'Invalid amount' },
        { status: 400 }
      );
    }

    if (isNaN(accountId)) {
      return NextResponse.json(
        { error: 'Invalid account ID' },
        { status: 400 }
      );
    }

    // Check if account exists and belongs to user
    const account = await prisma.account.findFirst({
      where: {
        id: accountId,
        userId: user.id
      }
    });

    if (!account) {
      return NextResponse.json(
        { error: 'Account not found' },
        { status: 404 }
      );
    }

    if (account.balance < amount) {
      return NextResponse.json(
        { error: 'Insufficient funds' },
        { status: 400 }
      );
    }

    // Get or create withdrawal category using upsert
    const withdrawalCategory = await prisma.category.upsert({
      where: {
        name_type: {
          name: 'Withdrawal',
          type: 'WITHDRAWAL'
        }
      },
      update: {}, // no updates needed
      create: {
        name: 'Withdrawal',
        type: 'WITHDRAWAL',
        icon: '↑'
      }
    });

    try {
      const result = await prisma.$transaction([
        prisma.transaction.create({
          data: {
            type: 'WITHDRAWAL',
            amount: -amount,
            description: body.description,
            userId: user.id,
            accountId: accountId,
            categoryId: withdrawalCategory.id
          }
        }),
        prisma.account.update({
          where: { id: accountId },
          data: { 
            balance: {
              decrement: amount
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
      { error: 'Failed to process withdrawal' },
      { status: 500 }
    );
  }
} 