import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/database'
import { getUserFromRequest } from '@/lib/auth'
import { z } from 'zod'

const transferOfferSchema = z.object({
  playerId: z.string(),
  toTeamId: z.string(),
  offerAmount: z.number().positive(),
  offerType: z.enum(['transfer', 'loan', 'release_clause']).default('transfer')
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
    const { playerId, toTeamId, offerAmount, offerType } = transferOfferSchema.parse(body)

    // Get player and verify ownership
    const player = await prisma.player.findUnique({
      where: { id: playerId },
      include: {
        userTeam: true,
        basePlayer: true
      }
    })

    if (!player) {
      return NextResponse.json(
        { error: 'Player not found' },
        { status: 404 }
      )
    }

    // Verify the buyer team exists and user has access
    const toTeam = await prisma.userTeam.findFirst({
      where: {
        id: toTeamId,
        userId: user.id
      }
    })

    if (!toTeam) {
      return NextResponse.json(
        { error: 'Target team not found' },
        { status: 404 }
      )
    }

    // Check if buyer has enough budget
    if (toTeam.budget < BigInt(offerAmount * 100)) { // Convert to cents
      return NextResponse.json(
        { error: 'Insufficient budget' },
        { status: 400 }
      )
    }

    // Check for existing active offers
    const existingOffer = await prisma.transferOffer.findFirst({
      where: {
        playerId,
        fromTeamId: toTeamId,
        status: 'pending'
      }
    })

    if (existingOffer) {
      return NextResponse.json(
        { error: 'You already have a pending offer for this player' },
        { status: 409 }
      )
    }

    // Create transfer offer
    const transferOffer = await prisma.transferOffer.create({
      data: {
        playerId,
        fromTeamId: player.userTeamId,
        toTeamId,
        offerAmount: BigInt(offerAmount * 100), // Store in cents
        offerType,
        expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days
        isPublic: true
      },
      include: {
        player: {
          include: {
            basePlayer: true
          }
        },
        fromTeam: {
          include: {
            realTeam: true
          }
        },
        toTeam: {
          include: {
            realTeam: true
          }
        }
      }
    })

    // Create notification for the seller
    await prisma.notification.create({
      data: {
        userId: player.userTeam.userId,
        type: 'transfer_offer',
        title: 'New Transfer Offer',
        message: `${toTeam.teamName} has made an offer of €${offerAmount.toLocaleString()} for ${player.basePlayer.name}`
      }
    })

    return NextResponse.json(transferOffer)

  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Invalid input', details: error.errors },
        { status: 400 }
      )
    }

    console.error('Transfer offer error:', error)
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
    const type = searchParams.get('type') // 'received' or 'sent'
    const teamId = searchParams.get('teamId')

    if (!teamId) {
      return NextResponse.json(
        { error: 'Team ID required' },
        { status: 400 }
      )
    }

    let whereClause: any = {
      status: 'pending',
      expiresAt: {
        gt: new Date()
      }
    }

    if (type === 'received') {
      whereClause.fromTeamId = teamId
    } else if (type === 'sent') {
      whereClause.toTeamId = teamId
    } else {
      // Return both
      whereClause.OR = [
        { fromTeamId: teamId },
        { toTeamId: teamId }
      ]
    }

    const offers = await prisma.transferOffer.findMany({
      where: whereClause,
      include: {
        player: {
          include: {
            basePlayer: true
          }
        },
        fromTeam: {
          include: {
            realTeam: true
          }
        },
        toTeam: {
          include: {
            realTeam: true
          }
        }
      },
      orderBy: { createdAt: 'desc' }
    })

    return NextResponse.json(offers)

  } catch (error) {
    console.error('Transfer offers fetch error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}