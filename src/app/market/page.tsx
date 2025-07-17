'use client'

import { useEffect, useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Header } from '@/components/layout/header'
import { PlayerCard } from '@/components/player/player-card'
import { 
  Search, 
  Filter,
  TrendingUp,
  DollarSign,
  Clock,
  Users,
  ArrowUpDown,
  Eye,
  ShoppingCart
} from 'lucide-react'

interface TransferOffer {
  id: string
  player: {
    id: string
    basePlayer: {
      name: string
      position: string
      birthDate: string
      nationality: string
    }
    currentSpeed: number
    currentTechnique: number
    currentPhysical: number
    currentMental: number
    currentGoalkeeping: number
    salary: string
    gamesPlayed: number
    goals: number
    assists: number
  }
  fromTeam: {
    teamName: string
    realTeam: { name: string }
  }
  toTeam: {
    teamName: string
    realTeam: { name: string }
  }
  offerAmount: string
  offerType: string
  status: string
  expiresAt: string
  createdAt: string
}

export default function MarketPage() {
  const [activeTab, setActiveTab] = useState<'browse' | 'offers' | 'my-offers'>('browse')
  const [availablePlayers, setAvailablePlayers] = useState<any[]>([])
  const [transferOffers, setTransferOffers] = useState<TransferOffer[]>([])
  const [myOffers, setMyOffers] = useState<TransferOffer[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [positionFilter, setPositionFilter] = useState('ALL')
  const [priceRange, setPriceRange] = useState({ min: 0, max: 100000000 })

  useEffect(() => {
    fetchMarketData()
  }, [activeTab])

  const fetchMarketData = async () => {
    try {
      // Mock data for demonstration
      const mockOffers: TransferOffer[] = [
        {
          id: '1',
          player: {
            id: '1',
            basePlayer: {
              name: 'Kylian Mbappé',
              position: 'ATT',
              birthDate: '1998-12-20',
              nationality: 'France'
            },
            currentSpeed: 96,
            currentTechnique: 88,
            currentPhysical: 85,
            currentMental: 82,
            currentGoalkeeping: 15,
            salary: '25000000',
            gamesPlayed: 20,
            goals: 18,
            assists: 7
          },
          fromTeam: {
            teamName: 'PSG Manager',
            realTeam: { name: 'Paris Saint-Germain' }
          },
          toTeam: {
            teamName: 'Real Madrid CF',
            realTeam: { name: 'Real Madrid' }
          },
          offerAmount: '18000000000', // 180M in cents
          offerType: 'transfer',
          status: 'pending',
          expiresAt: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString(),
          createdAt: new Date().toISOString()
        },
        {
          id: '2',
          player: {
            id: '2',
            basePlayer: {
              name: 'Erling Haaland',
              position: 'ATT',
              birthDate: '2000-07-21',
              nationality: 'Norway'
            },
            currentSpeed: 89,
            currentTechnique: 85,
            currentPhysical: 92,
            currentMental: 80,
            currentGoalkeeping: 10,
            salary: '20000000',
            gamesPlayed: 18,
            goals: 22,
            assists: 3
          },
          fromTeam: {
            teamName: 'City Manager',
            realTeam: { name: 'Manchester City' }
          },
          toTeam: {
            teamName: 'Bayern Munich',
            realTeam: { name: 'Bayern Munich' }
          },
          offerAmount: '15000000000', // 150M in cents
          offerType: 'transfer',
          status: 'pending',
          expiresAt: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString(),
          createdAt: new Date().toISOString()
        }
      ]

      setTransferOffers(mockOffers)
      setMyOffers([])
      setAvailablePlayers([])
    } catch (error) {
      console.error('Failed to fetch market data:', error)
    } finally {
      setLoading(false)
    }
  }

  const makeOffer = async (playerId: string, amount: number) => {
    try {
      const response = await fetch('/api/transfers', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({
          playerId,
          toTeamId: 'your-team-id', // This would come from context
          offerAmount: amount,
          offerType: 'transfer'
        })
      })

      if (response.ok) {
        fetchMarketData()
      }
    } catch (error) {
      console.error('Failed to make offer:', error)
    }
  }

  const formatCurrency = (amount: string) => {
    const value = parseInt(amount) / 100 // Convert from cents
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'EUR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value)
  }

  const getTimeRemaining = (expiresAt: string) => {
    const now = new Date()
    const expires = new Date(expiresAt)
    const diff = expires.getTime() - now.getTime()
    const days = Math.floor(diff / (1000 * 60 * 60 * 24))
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))
    
    if (days > 0) return `${days}d ${hours}h`
    if (hours > 0) return `${hours}h`
    return 'Expiring soon'
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="flex items-center justify-center h-96">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading transfer market...</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Transfer Market</h1>
          <p className="text-gray-600 mt-2">
            Buy, sell, and loan players with other managers worldwide
          </p>
        </div>

        {/* Market Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Active Offers</CardTitle>
              <ShoppingCart className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{transferOffers.length}</div>
              <p className="text-xs text-muted-foreground">
                +12% from yesterday
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Avg. Price</CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">€45.2M</div>
              <p className="text-xs text-muted-foreground">
                -2.1% from last week
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Hot Position</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">ATT</div>
              <p className="text-xs text-muted-foreground">
                Most traded position
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Your Budget</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">€125M</div>
              <p className="text-xs text-muted-foreground">
                Available for transfers
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Tabs */}
        <div className="flex space-x-1 mb-6">
          <Button
            variant={activeTab === 'browse' ? 'default' : 'outline'}
            onClick={() => setActiveTab('browse')}
          >
            <Eye className="w-4 h-4 mr-2" />
            Browse Market
          </Button>
          <Button
            variant={activeTab === 'offers' ? 'default' : 'outline'}
            onClick={() => setActiveTab('offers')}
          >
            <Clock className="w-4 h-4 mr-2" />
            Received Offers
          </Button>
          <Button
            variant={activeTab === 'my-offers' ? 'default' : 'outline'}
            onClick={() => setActiveTab('my-offers')}
          >
            <ArrowUpDown className="w-4 h-4 mr-2" />
            My Offers
          </Button>
        </div>

        {/* Browse Market Tab */}
        {activeTab === 'browse' && (
          <div>
            {/* Filters */}
            <div className="flex flex-col sm:flex-row gap-4 mb-6">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    placeholder="Search players by name, team, or nationality..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
              
              <div className="flex gap-2">
                <Button
                  variant={positionFilter === 'ALL' ? 'default' : 'outline'}
                  onClick={() => setPositionFilter('ALL')}
                  size="sm"
                >
                  All
                </Button>
                <Button
                  variant={positionFilter === 'GK' ? 'default' : 'outline'}
                  onClick={() => setPositionFilter('GK')}
                  size="sm"
                >
                  GK
                </Button>
                <Button
                  variant={positionFilter === 'DEF' ? 'default' : 'outline'}
                  onClick={() => setPositionFilter('DEF')}
                  size="sm"
                >
                  DEF
                </Button>
                <Button
                  variant={positionFilter === 'MID' ? 'default' : 'outline'}
                  onClick={() => setPositionFilter('MID')}
                  size="sm"
                >
                  MID
                </Button>
                <Button
                  variant={positionFilter === 'ATT' ? 'default' : 'outline'}
                  onClick={() => setPositionFilter('ATT')}
                  size="sm"
                >
                  ATT
                </Button>
              </div>

              <Button variant="outline">
                <Filter className="w-4 h-4 mr-2" />
                More Filters
              </Button>
            </div>

            {/* Active Transfer Offers */}
            <div className="space-y-4">
              <h2 className="text-xl font-semibold">Active Transfer Offers</h2>
              
              {transferOffers.length > 0 ? (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {transferOffers.map((offer) => (
                    <Card key={offer.id} className="hover:shadow-md transition-shadow">
                      <CardHeader>
                        <div className="flex items-start justify-between">
                          <div>
                            <CardTitle className="text-lg">
                              {offer.player.basePlayer.name}
                            </CardTitle>
                            <CardDescription>
                              {offer.fromTeam.realTeam.name} → {offer.toTeam.realTeam.name}
                            </CardDescription>
                          </div>
                          <div className="text-right">
                            <div className="text-2xl font-bold text-green-600">
                              {formatCurrency(offer.offerAmount)}
                            </div>
                            <Badge variant="outline">
                              <Clock className="w-3 h-3 mr-1" />
                              {getTimeRemaining(offer.expiresAt)}
                            </Badge>
                          </div>
                        </div>
                      </CardHeader>

                      <CardContent>
                        <div className="grid grid-cols-2 gap-4 mb-4">
                          <div>
                            <p className="text-sm text-gray-600">Position</p>
                            <Badge className="mt-1">
                              {offer.player.basePlayer.position}
                            </Badge>
                          </div>
                          <div>
                            <p className="text-sm text-gray-600">Nationality</p>
                            <p className="font-medium">{offer.player.basePlayer.nationality}</p>
                          </div>
                          <div>
                            <p className="text-sm text-gray-600">Games Played</p>
                            <p className="font-medium">{offer.player.gamesPlayed}</p>
                          </div>
                          <div>
                            <p className="text-sm text-gray-600">Goals/Assists</p>
                            <p className="font-medium">{offer.player.goals}/{offer.player.assists}</p>
                          </div>
                        </div>

                        {/* Player Attributes */}
                        <div className="grid grid-cols-4 gap-2 mb-4 text-sm">
                          <div className="text-center">
                            <p className="text-gray-600">SPD</p>
                            <p className="font-bold">{offer.player.currentSpeed}</p>
                          </div>
                          <div className="text-center">
                            <p className="text-gray-600">TEC</p>
                            <p className="font-bold">{offer.player.currentTechnique}</p>
                          </div>
                          <div className="text-center">
                            <p className="text-gray-600">PHY</p>
                            <p className="font-bold">{offer.player.currentPhysical}</p>
                          </div>
                          <div className="text-center">
                            <p className="text-gray-600">MEN</p>
                            <p className="font-bold">{offer.player.currentMental}</p>
                          </div>
                        </div>

                        <div className="flex space-x-2">
                          <Button 
                            variant="outline" 
                            className="flex-1"
                            onClick={() => {/* View player details */}}
                          >
                            View Details
                          </Button>
                          <Button 
                            className="flex-1"
                            onClick={() => makeOffer(offer.player.id, parseInt(offer.offerAmount) / 100)}
                          >
                            Make Counter Offer
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              ) : (
                <Card>
                  <CardContent className="text-center py-12">
                    <ShoppingCart className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">
                      No active offers
                    </h3>
                    <p className="text-gray-600">
                      Check back later for new transfer opportunities
                    </p>
                  </CardContent>
                </Card>
              )}
            </div>
          </div>
        )}

        {/* Received Offers Tab */}
        {activeTab === 'offers' && (
          <Card>
            <CardContent className="text-center py-12">
              <Clock className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                No offers received
              </h3>
              <p className="text-gray-600">
                When other managers make offers for your players, they'll appear here
              </p>
            </CardContent>
          </Card>
        )}

        {/* My Offers Tab */}
        {activeTab === 'my-offers' && (
          <Card>
            <CardContent className="text-center py-12">
              <ArrowUpDown className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                No offers sent
              </h3>
              <p className="text-gray-600">
                Your transfer offers and their status will be displayed here
              </p>
            </CardContent>
          </Card>
        )}
      </main>
    </div>
  )
}