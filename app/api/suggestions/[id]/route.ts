// app/api/suggestions/[id]/route.ts
import { prisma } from '@/lib/prisma'
import { NextResponse } from 'next/server'

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    await prisma.suggestion.delete({
      where: {
        id: parseInt(params.id)
      }
    })
    return NextResponse.json({ message: 'Suggestion deleted' })
  } catch (error) {
    return NextResponse.json({ error: 'Error deleting suggestion' }, { status: 500 })
  }
}