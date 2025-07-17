'use client'

import { useEffect, useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Header } from '@/components/layout/header'
import { PlayerCard } from '@/components/player/player-card'
import { MatchCard } from '@/components/match/match-card'
import { 
  Trophy, 
  Users, 
  TrendingUp, 
  Calendar,
  DollarSign,
  Bell,
  Play,
  Settings
} from 'lucide-react'

interface DashboardData {
  user: {
    username: string
    email: string
  }
  teams: any[]
  upcomingMatches: any[]
  recentMatches: any[]
  notifications: any[]
  marketHighlights: any[]
}

export default function DashboardPage() {
  const [data, setData] = useState<DashboardData | null>(null)
  const [loading, setLoading] = useState(true)
  const [selectedTeam, setSelectedTeam] = useState<any>(null)

  useEffect(() => {
    fetchDashboardData()
  }, [])

  const fetchDashboardData = async () => {
    try {
      // In a real app, this would be multiple API calls
      // For demo, we'll simulate the data
      const mockData: DashboardData = {
        user: {
          username: 'Manager123',
          email: 'manager@example.com'
        },
        teams: [
          {
            id: '1',
            teamName: 'My Barcelona',
            realTeam: { name: 'FC Barcelona', country: 'Spain', league: 'La Liga' },
            budget: 50000000n,
            reputation: 75,
            players: []
          }
        ],
        upcomingMatches: [
          {
            id: '1',
            homeTeam: { teamName: 'My Barcelona', realTeam: { name: 'FC Barcelona' } },
            awayTeam: { teamName: 'Real Madrid CF', realTeam: { name: 'Real Madrid' } },
            scheduledAt: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000),
            status: 'scheduled',
            competitionType: 'league'
          }
        ],
        recentMatches: [],
        notifications: [
          {
            id: '1',
            title: 'Training Complete',
            message: 'Speed training session has been completed',
            type: 'training',
            isRead: false,
            createdAt: new Date()
          }
        ],
        marketHighlights: []
      }

      setData(mockData)
      if (mockData.teams.length > 0) {
        setSelectedTeam(mockData.teams[0])
      }
    } catch (error) {
      console.error('Failed to fetch dashboard data:', error)
    } finally {
      setLoading(false)
    }
  }

  const simulateMatch = async (matchId: string) => {
    try {
      const response = await fetch('/api/matches/simulate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({ matchId })
      })

      if (response.ok) {
        const result = await response.json()
        console.log('Match simulated:', result)
        fetchDashboardData() // Refresh data
      }
    } catch (error) {
      console.error('Failed to simulate match:', error)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header user={data?.user} />
        <div className="flex items-center justify-center h-96">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading your dashboard...</p>
          </div>
        </div>
      </div>
    )
  }

  if (!data) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="flex items-center justify-center h-96">
          <div className="text-center">
            <p className="text-gray-600">Failed to load dashboard data</p>
            <Button onClick={fetchDashboardData} className="mt-4">
              Try Again
            </Button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header user={data.user} />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">
            Welcome back, {data.user.username}!
          </h1>
          <p className="text-gray-600 mt-2">
            Manage your teams, train players, and compete in matches
          </p>
        </div>

        {/* Team Selection */}
        {data.teams.length > 0 && (
          <div className="mb-8">
            <h2 className="text-xl font-semibold mb-4">Your Teams</h2>
            <div className="flex space-x-4">
              {data.teams.map((team) => (
                <Card 
                  key={team.id} 
                  className={`cursor-pointer transition-all ${
                    selectedTeam?.id === team.id ? 'ring-2 ring-green-500' : ''
                  }`}
                  onClick={() => setSelectedTeam(team)}
                >
                  <CardHeader className="pb-3">
                    <CardTitle className="text-lg">{team.teamName}</CardTitle>
                    <CardDescription>
                      {team.realTeam.name} • {team.realTeam.league}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center justify-between text-sm">
                      <div className="flex items-center">
                        <DollarSign className="w-4 h-4 mr-1" />
                        €{(Number(team.budget) / 100).toLocaleString()}
                      </div>
                      <Badge variant="secondary">
                        Rep: {team.reputation}
                      </Badge>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Team Value</CardTitle>
              <Trophy className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">€45.2M</div>
              <p className="text-xs text-muted-foreground">
                +2.1% from last month
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Squad Size</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">25</div>
              <p className="text-xs text-muted-foreground">
                3 youth players
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">League Position</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">3rd</div>
              <p className="text-xs text-muted-foreground">
                +1 from last week
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Next Match</CardTitle>
              <Calendar className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">2 days</div>
              <p className="text-xs text-muted-foreground">
                vs Real Madrid
              </p>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Upcoming Matches */}
            <div>
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-semibold">Upcoming Matches</h2>
                <Button variant="outline" size="sm">
                  View All
                </Button>
              </div>
              
              {data.upcomingMatches.length > 0 ? (
                <div className="space-y-4">
                  {data.upcomingMatches.map((match) => (
                    <MatchCard 
                      key={match.id} 
                      match={match}
                      onViewMatch={() => simulateMatch(match.id)}
                    />
                  ))}
                </div>
              ) : (
                <Card>
                  <CardContent className="text-center py-8">
                    <Calendar className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-600">No upcoming matches</p>
                    <p className="text-sm text-gray-500 mt-2">
                      Matches are scheduled every 48 hours
                    </p>
                  </CardContent>
                </Card>
              )}
            </div>

            {/* Recent Activity */}
            <div>
              <h2 className="text-xl font-semibold mb-4">Recent Activity</h2>
              <Card>
                <CardContent className="p-6">
                  <div className="space-y-4">
                    <div className="flex items-center space-x-3">
                      <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                      <span className="text-sm">Training session completed - Speed training</span>
                      <span className="text-xs text-gray-500">2 hours ago</span>
                    </div>
                    <div className="flex items-center space-x-3">
                      <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                      <span className="text-sm">New transfer offer received for Pedri</span>
                      <span className="text-xs text-gray-500">5 hours ago</span>
                    </div>
                    <div className="flex items-center space-x-3">
                      <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                      <span className="text-sm">Player development: Gavi +2 Technique</span>
                      <span className="text-xs text-gray-500">1 day ago</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Notifications */}
            <div>
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold">Notifications</h3>
                <Bell className="w-5 h-5 text-gray-400" />
              </div>
              
              <Card>
                <CardContent className="p-4">
                  {data.notifications.length > 0 ? (
                    <div className="space-y-3">
                      {data.notifications.slice(0, 3).map((notification) => (
                        <div key={notification.id} className="flex items-start space-x-3">
                          <div className={`w-2 h-2 rounded-full mt-2 ${
                            notification.isRead ? 'bg-gray-300' : 'bg-blue-500'
                          }`}></div>
                          <div className="flex-1">
                            <p className="text-sm font-medium">{notification.title}</p>
                            <p className="text-xs text-gray-600">{notification.message}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-sm text-gray-600 text-center py-4">
                      No new notifications
                    </p>
                  )}
                </CardContent>
              </Card>
            </div>

            {/* Quick Actions */}
            <div>
              <h3 className="text-lg font-semibold mb-4">Quick Actions</h3>
              <div className="space-y-3">
                <Button className="w-full justify-start" variant="outline">
                  <Users className="w-4 h-4 mr-2" />
                  Manage Squad
                </Button>
                <Button className="w-full justify-start" variant="outline">
                  <TrendingUp className="w-4 h-4 mr-2" />
                  Start Training
                </Button>
                <Button className="w-full justify-start" variant="outline">
                  <DollarSign className="w-4 h-4 mr-2" />
                  Transfer Market
                </Button>
                <Button className="w-full justify-start" variant="outline">
                  <Settings className="w-4 h-4 mr-2" />
                  Team Settings
                </Button>
              </div>
            </div>

            {/* Market Highlights */}
            <div>
              <h3 className="text-lg font-semibold mb-4">Market Highlights</h3>
              <Card>
                <CardContent className="p-4">
                  <div className="text-center py-8">
                    <DollarSign className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-sm text-gray-600">No active transfers</p>
                    <Button size="sm" className="mt-3">
                      Browse Market
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}