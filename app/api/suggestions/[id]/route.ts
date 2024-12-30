import { prisma } from '@/lib/prisma'
import { NextResponse } from 'next/server'

export const DELETE = async (
  request: Request,
  { params }: { params: { id: string } } 
) => {
  try {
    const id = parseInt(params.id, 10); 

    await prisma.suggestion.delete({
      where: {
        id, 
      },
    });

    return NextResponse.json({ message: 'Suggestion deleted' });
  } catch (error) {
    return NextResponse.json({ error: 'Error deleting suggestion' }, { status: 500 });
  }
};