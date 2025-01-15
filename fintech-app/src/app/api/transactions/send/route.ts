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

    const { amount, description } = await request.json();

    // Check if user has enough balance
    if (user.balance < amount) {
      return NextResponse.json({ error: 'Insufficient funds' }, { status: 400 });
    }

    // Create transaction and update balance in a transaction
    const result = await prisma.$transaction([
      prisma.transaction.create({
        data: {
          type: 'withdrawal',
          amount: -amount,
          description,
          userId: user.id,
        },
      }),
      prisma.user.update({
        where: { id: user.id },
        data: { balance: { decrement: amount } },
      }),
    ]);

    return NextResponse.json(result[0]);
  } catch (error) {
    console.error('Send transaction failed:', error);
    return NextResponse.json({ error: 'Transaction failed' }, { status: 500 });
  }
} 