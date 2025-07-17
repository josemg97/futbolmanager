import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/database'
import { getUserFromRequest } from '@/lib/auth'

export async function GET(request: NextRequest) {
  try {
    const user = await getUserFromRequest(request)
    
    if (!user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const userTeams = await prisma.userTeam.findMany({
      where: { userId: user.id },
      include: {
        realTeam: true,
        players: {
          include: {
            basePlayer: true
          }
        }
      }
    })

    return NextResponse.json(userTeams)

  } catch (error) {
    console.error('Teams fetch error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const user = await getUserFromRequest(request)
    
    if (!user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const { realTeamId, teamName } = await request.json()

    // Check if user already has this team
    const existingTeam = await prisma.userTeam.findUnique({
      where: {
        userId_realTeamId: {
          userId: user.id,
          realTeamId: parseInt(realTeamId)
        }
      }
    })

    if (existingTeam) {
      return NextResponse.json(
        { error: 'You already manage this team' },
        { status: 409 }
      )
    }

    // Create user team
    const userTeam = await prisma.userTeam.create({
      data: {
        userId: user.id,
        realTeamId: parseInt(realTeamId),
        teamName: teamName || 'My Team'
      },
      include: {
        realTeam: true
      }
    })

    // Create initial squad from base players
    const basePlayers = await prisma.basePlayer.findMany({
      where: { realTeamId: parseInt(realTeamId) }
    })

    const playersData = basePlayers.map(basePlayer => ({
      basePlayerId: basePlayer.id,
      userTeamId: userTeam.id,
      currentSpeed: basePlayer.baseSpeed,
      currentTechnique: basePlayer.baseTechnique,
      currentPhysical: basePlayer.basePhysical,
      currentMental: basePlayer.baseMental,
      currentGoalkeeping: basePlayer.baseGoalkeeping,
      salary: BigInt(Math.floor(Math.random() * 5000000) + 1000000), // Random salary
      contractEnd: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000 * 2) // 2 years
    }))

    await prisma.player.createMany({
      data: playersData
    })

    return NextResponse.json(userTeam)

  } catch (error) {
    console.error('Team creation error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}