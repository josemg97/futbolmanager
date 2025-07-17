import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/database'
import { getUserFromRequest } from '@/lib/auth'

export async function GET(
  request: NextRequest,
  { params }: { params: { teamId: string } }
) {
  try {
    const user = await getUserFromRequest(request)
    
    if (!user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    // Verify user owns this team
    const userTeam = await prisma.userTeam.findFirst({
      where: {
        id: params.teamId,
        userId: user.id
      }
    })

    if (!userTeam) {
      return NextResponse.json(
        { error: 'Team not found' },
        { status: 404 }
      )
    }

    const players = await prisma.player.findMany({
      where: { userTeamId: params.teamId },
      include: {
        basePlayer: true
      },
      orderBy: [
        { basePlayer: { position: 'asc' } },
        { currentSpeed: 'desc' }
      ]
    })

    return NextResponse.json(players)

  } catch (error) {
    console.error('Players fetch error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}