import { NextResponse } from "next/server"
import { PrismaClient } from "@prisma/client"
import { getServerSession } from "next-auth/next"

const prisma = new PrismaClient()

export async function GET() {
  const suggestions = await prisma.suggestion.findMany({
    orderBy: { createdAt: "desc" }
  })
  return NextResponse.json(suggestions)
}

export async function POST(request: Request) {
  const session = await getServerSession()
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const { tmdbId, title, type, overview, posterPath, releaseDate } = await request.json()
  const suggestion = await prisma.suggestion.create({
    data: { tmdbId, title, type, overview, posterPath, releaseDate }
  })
  return NextResponse.json(suggestion)
}

