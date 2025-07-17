import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/database'
import { getUserFromRequest } from '@/lib/auth'
import { MatchEngine, PlayerDevelopment } from '@/lib/game-engine'

export async function POST(request: NextRequest) {
  try {
    const user = await getUserFromRequest(request)
    
    if (!user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const { matchId } = await request.json()

    const match = await prisma.match.findUnique({
      where: { id: matchId },
      include: {
        homeTeam: {
          include: {
            players: {
              include: {
                basePlayer: true
              }
            }
          }
        },
        awayTeam: {
          include: {
            players: {
              include: {
                basePlayer: true
              }
            }
          }
        }
      }
    })

    if (!match) {
      return NextResponse.json(
        { error: 'Match not found' },
        { status: 404 }
      )
    }

    if (match.status !== 'scheduled') {
      return NextResponse.json(
        { error: 'Match already played' },
        { status: 400 }
      )
    }

    // Simulate match
    const matchEngine = new MatchEngine()
    const result = matchEngine.simulateMatch(match.homeTeam, match.awayTeam)

    // Update match with results
    const updatedMatch = await prisma.match.update({
      where: { id: matchId },
      data: {
        status: 'finished',
        homeScore: result.homeScore,
        awayScore: result.awayScore,
        matchData: {
          statistics: result.statistics,
          events: result.events
        }
      }
    })

    // Create match events
    const eventsData = result.events.map(event => ({
      matchId,
      minute: event.minute,
      eventType: event.type,
      playerId: event.playerId,
      teamId: event.teamId,
      description: event.description
    }))

    await prisma.matchEvent.createMany({
      data: eventsData
    })

    // Apply player development
    const playerDevelopment = new PlayerDevelopment()
    const allPlayers = [...match.homeTeam.players, ...match.awayTeam.players]

    for (const player of allPlayers) {
      const matchPerformance = Math.floor(Math.random() * 100) + 1
      const improvements = playerDevelopment.calculateImprovement(player, matchPerformance)

      if (Object.keys(improvements).length > 0) {
        await prisma.player.update({
          where: { id: player.id },
          data: {
            ...improvements,
            gamesPlayed: { increment: 1 },
            fatigue: Math.min(100, player.fatigue + Math.floor(Math.random() * 20) + 10)
          }
        })
      } else {
        await prisma.player.update({
          where: { id: player.id },
          data: {
            gamesPlayed: { increment: 1 },
            fatigue: Math.min(100, player.fatigue + Math.floor(Math.random() * 20) + 10)
          }
        })
      }
    }

    return NextResponse.json({
      match: updatedMatch,
      result
    })

  } catch (error) {
    console.error('Match simulation error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}