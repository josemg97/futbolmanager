'use client'

import { useEffect, useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Header } from '@/components/layout/header'
import { PlayerCard } from '@/components/player/player-card'
import { 
  Users, 
  Search, 
  Filter,
  Plus,
  TrendingUp,
  DollarSign,
  Calendar
} from 'lucide-react'

interface Player {
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
  fatigue: number
  injuryDays: number
  salary: string
  contractEnd: string
  gamesPlayed: number
  goals: number
  assists: number
}

export default function TeamPage() {
  const [players, setPlayers] = useState<Player[]>([])
  const [filteredPlayers, setFilteredPlayers] = useState<Player[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [positionFilter, setPositionFilter] = useState('ALL')
  const [selectedPlayer, setSelectedPlayer] = useState<Player | null>(null)

  useEffect(() => {
    fetchPlayers()
  }, [])

  useEffect(() => {
    filterPlayers()
  }, [players, searchTerm, positionFilter])

  const fetchPlayers = async () => {
    try {
      // Mock data for demonstration
      const mockPlayers: Player[] = [
        {
          id: '1',
          basePlayer: {
            name: 'Lionel Messi',
            position: 'ATT',
            birthDate: '1987-06-24',
            nationality: 'Argentina'
          },
          currentSpeed: 85,
          currentTechnique: 96,
          currentPhysical: 78,
          currentMental: 94,
          currentGoalkeeping: 15,
          fatigue: 25,
          injuryDays: 0,
          salary: '50000000',
          contractEnd: '2025-06-30',
          gamesPlayed: 15,
          goals: 12,
          assists: 8
        },
        {
          id: '2',
          basePlayer: {
            name: 'Pedri',
            position: 'MID',
            birthDate: '2002-11-25',
            nationality: 'Spain'
          },
          currentSpeed: 78,
          currentTechnique: 88,
          currentPhysical: 72,
          currentMental: 85,
          currentGoalkeeping: 20,
          fatigue: 15,
          injuryDays: 0,
          salary: '15000000',
          contractEnd: '2026-06-30',
          gamesPlayed: 18,
          goals: 3,
          assists: 7
        },
        {
          id: '3',
          basePlayer: {
            name: 'Ronald Araujo',
            position: 'DEF',
            birthDate: '1999-03-07',
            nationality: 'Uruguay'
          },
          currentSpeed: 82,
          currentTechnique: 75,
          currentPhysical: 89,
          currentMental: 83,
          currentGoalkeeping: 25,
          fatigue: 30,
          injuryDays: 5,
          salary: '12000000',
          contractEnd: '2025-06-30',
          gamesPlayed: 12,
          goals: 2,
          assists: 1
        },
        {
          id: '4',
          basePlayer: {
            name: 'Marc-André ter Stegen',
            position: 'GK',
            birthDate: '1992-04-30',
            nationality: 'Germany'
          },
          currentSpeed: 45,
          currentTechnique: 78,
          currentPhysical: 85,
          currentMental: 92,
          currentGoalkeeping: 91,
          fatigue: 20,
          injuryDays: 0,
          salary: '18000000',
          contractEnd: '2025-06-30',
          gamesPlayed: 16,
          goals: 0,
          assists: 0
        }
      ]

      setPlayers(mockPlayers)
    } catch (error) {
      console.error('Failed to fetch players:', error)
    } finally {
      setLoading(false)
    }
  }

  const filterPlayers = () => {
    let filtered = players

    if (searchTerm) {
      filtered = filtered.filter(player =>
        player.basePlayer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        player.basePlayer.nationality.toLowerCase().includes(searchTerm.toLowerCase())
      )
    }

    if (positionFilter !== 'ALL') {
      filtered = filtered.filter(player => player.basePlayer.position === positionFilter)
    }

    setFilteredPlayers(filtered)
  }

  const getPositionCounts = () => {
    const counts = { GK: 0, DEF: 0, MID: 0, ATT: 0 }
    players.forEach(player => {
      counts[player.basePlayer.position as keyof typeof counts]++
    })
    return counts
  }

  const startTraining = async () => {
    // Implementation for starting training
    console.log('Starting training...')
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="flex items-center justify-center h-96">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading your team...</p>
          </div>
        </div>
      </div>
    )
  }

  const positionCounts = getPositionCounts()

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">My Team</h1>
          <p className="text-gray-600 mt-2">
            Manage your squad, train players, and prepare for matches
          </p>
        </div>

        {/* Team Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Players</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{players.length}</div>
              <p className="text-xs text-muted-foreground">
                Squad limit: 25
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Average Age</CardTitle>
              <Calendar className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">26.5</div>
              <p className="text-xs text-muted-foreground">
                Optimal range: 24-28
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Team Value</CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">€245M</div>
              <p className="text-xs text-muted-foreground">
                +5.2% this month
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Injured</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {players.filter(p => p.injuryDays > 0).length}
              </div>
              <p className="text-xs text-muted-foreground">
                Players unavailable
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Position Overview */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Squad Composition</CardTitle>
            <CardDescription>
              Distribution of players by position
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-4 gap-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-yellow-600">{positionCounts.GK}</div>
                <p className="text-sm text-gray-600">Goalkeepers</p>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600">{positionCounts.DEF}</div>
                <p className="text-sm text-gray-600">Defenders</p>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">{positionCounts.MID}</div>
                <p className="text-sm text-gray-600">Midfielders</p>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-red-600">{positionCounts.ATT}</div>
                <p className="text-sm text-gray-600">Attackers</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Filters and Search */}
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search players by name or nationality..."
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

          <Button onClick={startTraining}>
            <TrendingUp className="w-4 h-4 mr-2" />
            Start Training
          </Button>
        </div>

        {/* Players Grid */}
        {filteredPlayers.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredPlayers.map((player) => (
              <PlayerCard
                key={player.id}
                player={player}
                onSelect={setSelectedPlayer}
                showActions={true}
              />
            ))}
          </div>
        ) : (
          <Card>
            <CardContent className="text-center py-12">
              <Users className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                No players found
              </h3>
              <p className="text-gray-600 mb-4">
                {searchTerm || positionFilter !== 'ALL' 
                  ? 'Try adjusting your search or filters'
                  : 'Your squad is empty'
                }
              </p>
              {!searchTerm && positionFilter === 'ALL' && (
                <Button>
                  <Plus className="w-4 h-4 mr-2" />
                  Sign Players
                </Button>
              )}
            </CardContent>
          </Card>
        )}

        {/* Quick Actions */}
        <div className="fixed bottom-6 right-6 flex flex-col gap-3">
          <Button size="lg" className="rounded-full shadow-lg">
            <Plus className="w-5 h-5 mr-2" />
            Sign Player
          </Button>
        </div>
      </main>
    </div>
  )
}