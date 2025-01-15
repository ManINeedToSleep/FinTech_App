import { PrismaClient } from '@prisma/client';
import jwt from 'jsonwebtoken';

const prisma = new PrismaClient();

/**
 * Authentication Utility Functions
 * 
 * Contains core authentication logic:
 * - getUserFromToken: Validates JWT and returns user data
 * - Requires JWT_SECRET in environment variables
 * - Used by API routes to verify requests
 * 
 * @param request - Incoming HTTP request containing Bearer token
 * @returns User object if token is valid, null otherwise
 */
export async function getUserFromToken(request: Request) {
  try {
    const token = request.headers.get('Authorization')?.replace('Bearer ', '');
    
    if (!token) {
      return null;
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as { userId: number };
    const user = await prisma.user.findUnique({
      where: { id: decoded.userId },
    });

    return user;
  } catch (error) {
    console.error('Auth token verification error:', error);
    return null;
  }
} 