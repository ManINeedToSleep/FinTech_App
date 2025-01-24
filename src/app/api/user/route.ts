import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { getUserFromToken } from '../../../lib/auth';

const prisma = new PrismaClient();

export async function GET(request: Request) {
  try {
    const user = await getUserFromToken(request);
    
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const userData = await prisma.user.findUnique({
      where: { id: user.id },
      select: {
        id: true,
        email: true,
        username: true,
        balance: true,
      },
    });

    return NextResponse.json(userData);
  } catch (error) {
    console.error('Failed to fetch user data:', error);
    return NextResponse.json({ error: 'Failed to fetch user data' }, { status: 500 });
  }
} 