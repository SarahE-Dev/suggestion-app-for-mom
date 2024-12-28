// app/api/suggestions/[id]/route.ts
import { prisma } from '@/lib/prisma'
import { NextResponse } from 'next/server'

interface RouteSegment {
  params: {
    id: string
  }
}

export async function DELETE(
  _request: Request,
  { params }: RouteSegment
) {
  try {
    // First find the suggestion by tmdbId
    const suggestion = await prisma.suggestion.findFirst({
      where: {
        tmdbId: parseInt(params.id)
      }
    })

    if (!suggestion) {
      return NextResponse.json(
        { error: 'Suggestion not found' }, 
        { status: 404 }
      )
    }

    // Then delete using the Prisma id
    await prisma.suggestion.delete({
      where: {
        id: suggestion.id
      }
    })

    return NextResponse.json({ 
      message: 'Suggestion deleted',
      deletedId: parseInt(params.id)
    })
  } catch (error) {
    console.error('Delete error:', error)
    return NextResponse.json(
      { error: 'Error deleting suggestion' }, 
      { status: 500 }
    )
  }
}