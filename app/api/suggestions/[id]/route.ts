import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const id = parseInt(params.id, 10)

    if (isNaN(id)) {
      return NextResponse.json({ error: 'Invalid ID' }, { status: 400 })
    }

    const suggestion = await prisma.suggestion.findUnique({
      where: { id }
    })

    if (!suggestion) {
      return NextResponse.json({ error: 'Suggestion not found' }, { status: 404 })
    }

    await prisma.suggestion.delete({
      where: { id }
    })

    return NextResponse.json({ message: 'Suggestion deleted successfully' })
  } catch (error) {
    console.error('Error deleting suggestion:', error)
    return NextResponse.json({ error: 'Error deleting suggestion' }, { status: 500 })
  }
}

