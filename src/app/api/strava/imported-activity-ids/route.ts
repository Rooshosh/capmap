import { NextResponse } from 'next/server';
import { prisma } from '@/prisma';

export async function GET() {
  try {
    const activities = await prisma.detailedActivity.findMany({ select: { id: true } });
    const ids = activities.map(a => a.id.toString());
    return NextResponse.json(ids);
  } catch (error: unknown) {
    return NextResponse.json({ error: error instanceof Error ? error.message : 'Unknown error' }, { status: 500 });
  }
} 