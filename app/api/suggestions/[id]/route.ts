import { prisma } from '@/lib/prisma'
import { NextRequest, NextResponse } from 'next/server'

export async function DELETE(request: NextRequest) {
  try {
    const id = request.nextUrl.pathname.split('/').pop();
    
    if (!id) {
      return NextResponse.json({ error: 'Invalid ID' }, { status: 400 });
    }

    const numericId = parseInt(id, 10);

    if (isNaN(numericId)) {
      return NextResponse.json({ error: 'ID must be a number' }, { status: 400 });
    }

    await prisma.suggestion.delete({
      where: {
        id: numericId,
      },
    });

    return NextResponse.json({ message: 'Suggestion deleted' });
  } catch (error) {
    console.error('Error deleting suggestion:', error);
    return NextResponse.json({ error: 'Error deleting suggestion' }, { status: 500 });
  }
}

