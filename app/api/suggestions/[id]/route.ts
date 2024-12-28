// app/api/suggestions/[id]/route.ts
import { prisma } from '@/lib/prisma'
import { NextResponse } from 'next/server'

export const DELETE = async ( request: Request,
    context: {
        params: {
          id: string;
        };
      } ) => {
  try {
    await prisma.suggestion.delete({
      where: {
        id: parseInt(context.params.id)
      }
    })
    return NextResponse.json({ message: 'Suggestion deleted' })
  } catch (error) {
    return NextResponse.json({ error: 'Error deleting suggestion' }, { status: 500 })
  }
}