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

    // Create transaction and update balance in a transaction
    const result = await prisma.$transaction([
      prisma.transaction.create({
        data: {
          type: 'deposit',
          amount,
          description,
          userId: user.id,
        },
      }),
      prisma.user.update({
        where: { id: user.id },
        data: { balance: { increment: amount } },
      }),
    ]);

    return NextResponse.json(result[0]);
  } catch (error) {
    console.error('Deposit error:', error);
    return NextResponse.json({ error: 'Transaction failed' }, { status: 500 });
  }
} 