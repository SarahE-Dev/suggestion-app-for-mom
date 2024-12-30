import { prisma } from '@/lib/prisma'
import { NextRequest, NextResponse } from 'next/server'

export async function DELETE(
  request: NextRequest,
  context: { params: { id: string } }
) {
  try {
    const id = parseInt(context.params.id, 10);

    await prisma.suggestion.delete({
      where: {
        id,
      },
    });

    return NextResponse.json({ message: 'Suggestion deleted' });
  } catch (error) {
    return NextResponse.json({ error: 'Error deleting suggestion' }, { status: 500 });
  }
}

