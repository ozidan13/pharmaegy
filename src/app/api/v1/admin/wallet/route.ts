import { NextRequest, NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

interface JwtPayload {
  userId: string;
  email: string;
  role: string;
}

// GET - Get wallet configurations
export async function GET(request: NextRequest) {
  try {
    // Verify admin authentication
    const authHeader = request.headers.get('authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json(
        { error: 'Authorization token required' },
        { status: 401 }
      );
    }

    const token = authHeader.substring(7);
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as JwtPayload;
    
    if (decoded.role !== 'ADMIN') {
      return NextResponse.json(
        { error: 'Admin access required' },
        { status: 403 }
      );
    }

    const wallets = await prisma.walletConfig.findMany({
      orderBy: {
        createdAt: 'desc'
      }
    });

    return NextResponse.json({
      wallets
    });

  } catch (error) {
    console.error('Get wallets error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}

// POST - Create new wallet configuration
export async function POST(request: NextRequest) {
  try {
    // Verify admin authentication
    const authHeader = request.headers.get('authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json(
        { error: 'Authorization token required' },
        { status: 401 }
      );
    }

    const token = authHeader.substring(7);
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as JwtPayload;
    
    if (decoded.role !== 'ADMIN') {
      return NextResponse.json(
        { error: 'Admin access required' },
        { status: 403 }
      );
    }

    const { walletAddress, currency, description, isActive } = await request.json();

    if (!walletAddress) {
      return NextResponse.json(
        { error: 'Wallet address is required' },
        { status: 400 }
      );
    }

    // If setting as active, deactivate other wallets
    if (isActive) {
      await prisma.walletConfig.updateMany({
        where: { isActive: true },
        data: { isActive: false }
      });
    }

    const wallet = await prisma.walletConfig.create({
      data: {
        walletAddress,
        currency: currency || 'EGP',
        description,
        isActive: isActive || false
      }
    });

    return NextResponse.json({
      message: 'Wallet configuration created successfully',
      wallet
    });

  } catch (error) {
    console.error('Create wallet error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}

// PUT - Update wallet configuration
export async function PUT(request: NextRequest) {
  try {
    // Verify admin authentication
    const authHeader = request.headers.get('authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json(
        { error: 'Authorization token required' },
        { status: 401 }
      );
    }

    const token = authHeader.substring(7);
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as JwtPayload;
    
    if (decoded.role !== 'ADMIN') {
      return NextResponse.json(
        { error: 'Admin access required' },
        { status: 403 }
      );
    }

    const { walletId, walletAddress, currency, description, isActive } = await request.json();

    if (!walletId) {
      return NextResponse.json(
        { error: 'Wallet ID is required' },
        { status: 400 }
      );
    }

    // If setting as active, deactivate other wallets
    if (isActive) {
      await prisma.walletConfig.updateMany({
        where: { 
          isActive: true,
          id: { not: walletId }
        },
        data: { isActive: false }
      });
    }

    const wallet = await prisma.walletConfig.update({
      where: { id: walletId },
      data: {
        ...(walletAddress && { walletAddress }),
        ...(currency && { currency }),
        ...(description !== undefined && { description }),
        ...(isActive !== undefined && { isActive })
      }
    });

    return NextResponse.json({
      message: 'Wallet configuration updated successfully',
      wallet
    });

  } catch (error) {
    console.error('Update wallet error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}