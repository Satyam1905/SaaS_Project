import { NextRequest, NextResponse } from 'next/server';
import { getToken } from '@/lib/utils';
import { AuthService } from '@/lib/auth';
import { prisma } from '@/lib/db';

export async function GET(request: NextRequest) {
  try {
    const token = getToken(request);
    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const payload = AuthService.verifyToken(token);
    
    const notes = await prisma.note.findMany({
      where: { tenantId: payload.tenantId },
      include: { author: { select: { email: true } } },
      orderBy: { createdAt: 'desc' },
    });

    return NextResponse.json({ success: true, data: notes });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'Failed to fetch notes' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const token = getToken(request);
    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const payload = AuthService.verifyToken(token);
    
    // Check note limit for FREE plan
    if (payload.role !== 'ADMIN') {
      const tenant = await prisma.tenant.findUnique({
        where: { id: payload.tenantId },
        include: { _count: { select: { notes: true } } },
      });

      if (tenant?.plan === 'FREE' && tenant._count.notes >= 3) {
        return NextResponse.json(
          { success: false, error: 'Free plan limit reached. Upgrade to PRO.' },
          { status: 403 }
        );
      }
    }

    const { title, content } = await request.json();

    if (!title) {
      return NextResponse.json(
        { success: false, error: 'Title is required' },
        { status: 400 }
      );
    }

    const note = await prisma.note.create({
      data: {
        title,
        content,
        tenantId: payload.tenantId,
        authorId: payload.userId,
      },
    });

    return NextResponse.json({ success: true, data: note }, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'Failed to create note' },
      { status: 500 }
    );
  }
}