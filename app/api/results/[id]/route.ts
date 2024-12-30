import { prisma } from '@/lib/prisma'
import { NextRequest, NextResponse } from 'next/server'

export async function DELETE(request: NextRequest) {
  try {
    const id = request.nextUrl.pathname.split('/').pop();
    
    if (!id) {
      return NextResponse.json({ error: 'Invalid ID' }, { status: 400 });
    }

    const tmdbId = parseInt(id, 10);

    if (isNaN(tmdbId)) {
      return NextResponse.json({ error: 'ID must be a number' }, { status: 400 });
    }

    const suggestion = await prisma.suggestion.findFirst({
      where: {
        tmdbId: tmdbId
      }
    });

    if (!suggestion) {
      return NextResponse.json(
        { error: 'Suggestion not found' }, 
        { status: 404 }
      );
    }

    await prisma.suggestion.delete({
      where: {
        id: suggestion.id
      }
    });

    return NextResponse.json({ 
      message: 'Suggestion deleted',
      deletedId: tmdbId
    });
  } catch (error) {
    console.error('Delete error:', error);
    return NextResponse.json(
      { error: 'Error deleting suggestion' }, 
      { status: 500 }
    );
  }
}

