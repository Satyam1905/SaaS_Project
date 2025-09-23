import { NextRequest, NextResponse } from 'next/server';
import { getToken } from '@/lib/utils';
import { AuthService } from '@/lib/auth';
import { prisma } from '@/lib/db';

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const token = getToken(request);
    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const payload = AuthService.verifyToken(token);
    
    // Only admins can upgrade tenants
    if (payload.role !== 'ADMIN') {
      return NextResponse.json(
        { success: false, error: 'Admin access required' },
        { status: 403 }
      );
    }

    // Ensure admin can only upgrade their own tenant
    if (payload.tenantId !== params.id) {
      return NextResponse.json(
        { success: false, error: 'Cannot upgrade other tenants' },
        { status: 403 }
      );
    }

    const tenant = await prisma.tenant.update({
      where: { id: params.id },
      data: { plan: 'PRO' },
    });

    return NextResponse.json({
      success: true,
      data: { message: 'Tenant upgraded to PRO plan', tenant },
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'Failed to upgrade tenant' },
      { status: 500 }
    );
  }
}