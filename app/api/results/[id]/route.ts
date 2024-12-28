// app/api/results/[id]/route.ts
import { prisma } from '@/lib/prisma'
import { NextResponse } from 'next/server'

export async function DELETE(
  request: Request,
  context: {
    params: {
      id: string;
    };
  }
) {
  try {
    const suggestion = await prisma.suggestion.findFirst({
      where: {
        tmdbId: parseInt(context.params.id)
      }
    })

    if (!suggestion) {
      return NextResponse.json(
        { error: 'Suggestion not found' }, 
        { status: 404 }
      )
    }

    await prisma.suggestion.delete({
      where: {
        id: suggestion.id
      }
    })

    return NextResponse.json({ 
      message: 'Suggestion deleted',
      deletedId: parseInt(context.params.id)
    })
  } catch (error) {
    console.error('Delete error:', error)
    return NextResponse.json(
      { error: 'Error deleting suggestion' }, 
      { status: 500 }
    )
  }
}