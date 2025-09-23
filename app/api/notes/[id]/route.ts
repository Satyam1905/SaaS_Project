import { NextRequest, NextResponse } from 'next/server';
import { getToken } from '@/lib/utils';
import { AuthService } from '@/lib/auth';
import { prisma } from '@/lib/db';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const token = getToken(request);
    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const payload = AuthService.verifyToken(token);
    
    const note = await prisma.note.findFirst({
      where: {
        id: params.id,
        tenantId: payload.tenantId,
      },
      include: { author: { select: { email: true } } },
    });

    if (!note) {
      return NextResponse.json(
        { success: false, error: 'Note not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, data: note });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'Failed to fetch note' },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const token = getToken(request);
    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const payload = AuthService.verifyToken(token);
    const { title, content } = await request.json();

    const note = await prisma.note.findFirst({
      where: {
        id: params.id,
        tenantId: payload.tenantId,
      },
    });

    if (!note) {
      return NextResponse.json(
        { success: false, error: 'Note not found' },
        { status: 404 }
      );
    }

    const updatedNote = await prisma.note.update({
      where: { id: params.id },
      data: { title, content },
    });

    return NextResponse.json({ success: true, data: updatedNote });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'Failed to update note' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const token = getToken(request);
    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const payload = AuthService.verifyToken(token);
    
    const note = await prisma.note.findFirst({
      where: {
        id: params.id,
        tenantId: payload.tenantId,
      },
    });

    if (!note) {
      return NextResponse.json(
        { success: false, error: 'Note not found' },
        { status: 404 }
      );
    }

    await prisma.note.delete({
      where: { id: params.id },
    });

    return NextResponse.json({ success: true, message: 'Note deleted' });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'Failed to delete note' },
      { status: 500 }
    );
  }
}