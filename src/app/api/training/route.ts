import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/database'
import { getUserFromRequest } from '@/lib/auth'
import { z } from 'zod'

const trainingSchema = z.object({
  userTeamId: z.string(),
  trainingType: z.enum(['speed', 'technique', 'physical', 'mental', 'goalkeeping']),
  intensity: z.number().min(1).max(5),
  playerIds: z.array(z.string())
})

export async function POST(request: NextRequest) {
  try {
    const user = await getUserFromRequest(request)
    
    if (!user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const body = await request.json()
    const { userTeamId, trainingType, intensity, playerIds } = trainingSchema.parse(body)

    // Verify user owns this team
    const userTeam = await prisma.userTeam.findFirst({
      where: {
        id: userTeamId,
        userId: user.id
      }
    })

    if (!userTeam) {
      return NextResponse.json(
        { error: 'Team not found' },
        { status: 404 }
      )
    }

    // Create training session
    const trainingSession = await prisma.trainingSession.create({
      data: {
        userTeamId,
        trainingType,
        intensity,
        durationDays: 7
      }
    })

    // Add participants
    const participantsData = playerIds.map(playerId => ({
      trainingSessionId: trainingSession.id,
      playerId
    }))

    await prisma.trainingParticipant.createMany({
      data: participantsData
    })

    const fullTrainingSession = await prisma.trainingSession.findUnique({
      where: { id: trainingSession.id },
      include: {
        participants: {
          include: {
            player: {
              include: {
                basePlayer: true
              }
            }
          }
        }
      }
    })

    return NextResponse.json(fullTrainingSession)

  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Invalid input', details: error.errors },
        { status: 400 }
      )
    }

    console.error('Training creation error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function GET(request: NextRequest) {
  try {
    const user = await getUserFromRequest(request)
    
    if (!user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const { searchParams } = new URL(request.url)
    const teamId = searchParams.get('teamId')

    if (!teamId) {
      return NextResponse.json(
        { error: 'Team ID required' },
        { status: 400 }
      )
    }

    const trainingSessions = await prisma.trainingSession.findMany({
      where: {
        userTeamId: teamId,
        isActive: true
      },
      include: {
        participants: {
          include: {
            player: {
              include: {
                basePlayer: true
              }
            }
          }
        }
      },
      orderBy: { startedAt: 'desc' }
    })

    return NextResponse.json(trainingSessions)

  } catch (error) {
    console.error('Training sessions fetch error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}