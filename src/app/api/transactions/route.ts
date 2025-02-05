import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { getUserFromToken } from '@/lib/auth';

const prisma = new PrismaClient();

/**
 * Transactions API Routes
 * 
 * Handles all transaction-related operations:
 * GET: Fetches user's transaction history
 * 
 * Security:
 * - Requires valid JWT token
 * - Validates user authentication
 * - Only returns transactions for authenticated user
 * 
 * Response format:
 * - Success: Array of transaction objects
 * - Error: { error: string } with appropriate status code
 */

export async function GET(request: Request) {
  try {
    const user = await getUserFromToken(request);
    
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const transactions = await prisma.transaction.findMany({
      where: { userId: user.id },
      include: {
        category: true,
        account: true
      },
      orderBy: { createdAt: 'desc' },
      take: 10, // Get last 10 transactions
    });

    return NextResponse.json(transactions);
  } catch (error) {
    console.error('Failed to fetch transactions:', error);
    return NextResponse.json(
      { error: 'Failed to fetch transactions' }, 
      { status: 500 }
    );
  }
} 