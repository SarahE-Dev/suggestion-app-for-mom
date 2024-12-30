import { prisma } from '@/lib/prisma'
import { NextResponse } from 'next/server'

export const DELETE = async (request: Request, context: { params: { id: string } }) => {
  try {
    const id = parseInt(context.params.id, 10); // Specify radix (base 10) for parsing

    await prisma.suggestion.delete({
      where: {
        id, // Use id directly without conversion
      },
    });

    return NextResponse.json({ message: 'Suggestion deleted' });
  } catch (error) {
    return NextResponse.json({ error: 'Error deleting suggestion' }, { status: 500 });
  }
};