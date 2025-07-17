'use client'

import { useEffect, useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Header } from '@/components/layout/header'
import { 
  Zap, 
  Target, 
  Dumbbell, 
  Brain,
  Shield,
  Play,
  Pause,
  Users,
  TrendingUp,
  Clock,
  AlertTriangle
} from 'lucide-react'

interface TrainingSession {
  id: string
  trainingType: string
  intensity: number
  durationDays: number
  startedAt: string
  completedAt?: string
  isActive: boolean
  participants: {
    player: {
      id: string
      basePlayer: {
        name: string
        position: string
      }
    }
  }[]
}

const trainingTypes = [
  {
    id: 'speed',
    name: 'Speed Training',
    icon: Zap,
    description: 'Improve player acceleration and sprint speed',
    attribute: 'Speed',
    color: 'text-yellow-600',
    bgColor: 'bg-yellow-100',
    riskLevel: 'Medium',
    benefits: ['+1-3 Speed', 'Better counter-attacks', 'Faster recovery']
  },
  {
    id: 'technique',
    name: 'Technical Training',
    icon: Target,
    description: 'Enhance ball control, passing, and shooting accuracy',
    attribute: 'Technique',
    color: 'text-blue-600',
    bgColor: 'bg-blue-100',
    riskLevel: 'Low',
    benefits: ['+1-3 Technique', 'Better passing', 'Improved shooting']
  },
  {
    id: 'physical',
    name: 'Physical Training',
    icon: Dumbbell,
    description: 'Build strength, stamina, and physical presence',
    attribute: 'Physical',
    color: 'text-red-600',
    bgColor: 'bg-red-100',
    riskLevel: 'High',
    benefits: ['+1-3 Physical', 'Better tackles', 'Injury resistance']
  },
  {
    id: 'mental',
    name: 'Mental Training',
    icon: Brain,
    description: 'Improve decision making and game intelligence',
    attribute: 'Mental',
    color: 'text-purple-600',
    bgColor: 'bg-purple-100',
    riskLevel: 'None',
    benefits: ['+1-3 Mental', 'Better positioning', 'Reduces fatigue']
  },
  {
    id: 'goalkeeping',
    name: 'Goalkeeping Training',
    icon: Shield,
    description: 'Specialized training for goalkeepers only',
    attribute: 'Goalkeeping',
    color: 'text-green-600',
    bgColor: 'bg-green-100',
    riskLevel: 'Low',
    benefits: ['+1-3 Goalkeeping', 'Better saves', 'Command of area']
  }
]

export default function TrainingPage() {
  const [activeSessions, setActiveSessions] = useState<TrainingSession[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedTraining, setSelectedTraining] = useState<string | null>(null)
  const [intensity, setIntensity] = useState(3)

  useEffect(() => {
    fetchTrainingSessions()
  }, [])

  const fetchTrainingSessions = async () => {
    try {
      // Mock data for demonstration
      const mockSessions: TrainingSession[] = [
        {
          id: '1',
          trainingType: 'speed',
          intensity: 4,
          durationDays: 7,
          startedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
          isActive: true,
          participants: [
            {
              player: {
                id: '1',
                basePlayer: { name: 'Pedri', position: 'MID' }
              }
            },
            {
              player: {
                id: '2',
                basePlayer: { name: 'Gavi', position: 'MID' }
              }
            }
          ]
        }
      ]

      setActiveSessions(mockSessions)
    } catch (error) {
      console.error('Failed to fetch training sessions:', error)
    } finally {
      setLoading(false)
    }
  }

  const startTraining = async (trainingType: string) => {
    try {
      const response = await fetch('/api/training', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({
          userTeamId: 'team-id', // This would come from context
          trainingType,
          intensity,
          playerIds: [] // Selected players
        })
      })

      if (response.ok) {
        fetchTrainingSessions()
        setSelectedTraining(null)
      }
    } catch (error) {
      console.error('Failed to start training:', error)
    }
  }

  const getRiskColor = (risk: string) => {
    switch (risk) {
      case 'High': return 'text-red-600 bg-red-100'
      case 'Medium': return 'text-yellow-600 bg-yellow-100'
      case 'Low': return 'text-blue-600 bg-blue-100'
      default: return 'text-green-600 bg-green-100'
    }
  }

  const calculateProgress = (session: TrainingSession) => {
    const startDate = new Date(session.startedAt)
    const now = new Date()
    const totalDuration = session.durationDays * 24 * 60 * 60 * 1000
    const elapsed = now.getTime() - startDate.getTime()
    return Math.min(100, (elapsed / totalDuration) * 100)
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="flex items-center justify-center h-96">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading training center...</p>
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
          <h1 className="text-3xl font-bold text-gray-900">Training Center</h1>
          <p className="text-gray-600 mt-2">
            Develop your players through specialized training programs
          </p>
        </div>

        {/* Active Sessions */}
        {activeSessions.length > 0 && (
          <div className="mb-8">
            <h2 className="text-xl font-semibold mb-4">Active Training Sessions</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {activeSessions.map((session) => {
                const trainingType = trainingTypes.find(t => t.id === session.trainingType)
                const progress = calculateProgress(session)
                const Icon = trainingType?.icon || Zap

                return (
                  <Card key={session.id} className="relative overflow-hidden">
                    <CardHeader className="pb-3">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <div className={`p-2 rounded-lg ${trainingType?.bgColor}`}>
                            <Icon className={`w-5 h-5 ${trainingType?.color}`} />
                          </div>
                          <div>
                            <CardTitle className="text-lg">{trainingType?.name}</CardTitle>
                            <CardDescription>
                              Intensity: {session.intensity}/5
                            </CardDescription>
                          </div>
                        </div>
                        <Badge variant="secondary">
                          <Clock className="w-3 h-3 mr-1" />
                          {Math.ceil((7 - (progress / 100) * 7))}d left
                        </Badge>
                      </div>
                    </CardHeader>

                    <CardContent>
                      {/* Progress Bar */}
                      <div className="mb-4">
                        <div className="flex justify-between text-sm text-gray-600 mb-1">
                          <span>Progress</span>
                          <span>{Math.round(progress)}%</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div 
                            className="bg-green-600 h-2 rounded-full transition-all duration-300"
                            style={{ width: `${progress}%` }}
                          ></div>
                        </div>
                      </div>

                      {/* Participants */}
                      <div className="mb-4">
                        <p className="text-sm font-medium text-gray-700 mb-2">
                          Participants ({session.participants.length})
                        </p>
                        <div className="flex flex-wrap gap-1">
                          {session.participants.slice(0, 3).map((participant, index) => (
                            <Badge key={index} variant="outline" className="text-xs">
                              {participant.player.basePlayer.name}
                            </Badge>
                          ))}
                          {session.participants.length > 3 && (
                            <Badge variant="outline" className="text-xs">
                              +{session.participants.length - 3} more
                            </Badge>
                          )}
                        </div>
                      </div>

                      {/* Actions */}
                      <div className="flex space-x-2">
                        <Button size="sm" variant="outline" className="flex-1">
                          <Pause className="w-4 h-4 mr-1" />
                          Pause
                        </Button>
                        <Button size="sm" variant="outline" className="flex-1">
                          <Users className="w-4 h-4 mr-1" />
                          Manage
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                )
              })}
            </div>
          </div>
        )}

        {/* Training Types */}
        <div className="mb-8">
          <h2 className="text-xl font-semibold mb-4">Available Training Programs</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {trainingTypes.map((training) => {
              const Icon = training.icon
              const isSelected = selectedTraining === training.id

              return (
                <Card 
                  key={training.id} 
                  className={`cursor-pointer transition-all hover:shadow-md ${
                    isSelected ? 'ring-2 ring-green-500' : ''
                  }`}
                  onClick={() => setSelectedTraining(isSelected ? null : training.id)}
                >
                  <CardHeader>
                    <div className="flex items-center space-x-3">
                      <div className={`p-3 rounded-lg ${training.bgColor}`}>
                        <Icon className={`w-6 h-6 ${training.color}`} />
                      </div>
                      <div>
                        <CardTitle className="text-lg">{training.name}</CardTitle>
                        <CardDescription>{training.description}</CardDescription>
                      </div>
                    </div>
                  </CardHeader>

                  <CardContent>
                    <div className="space-y-3">
                      {/* Attribute Focus */}
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium">Focus:</span>
                        <Badge className={training.color.replace('text-', 'bg-').replace('-600', '-100')}>
                          {training.attribute}
                        </Badge>
                      </div>

                      {/* Risk Level */}
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium">Injury Risk:</span>
                        <Badge className={getRiskColor(training.riskLevel)}>
                          {training.riskLevel}
                        </Badge>
                      </div>

                      {/* Benefits */}
                      <div>
                        <p className="text-sm font-medium mb-2">Benefits:</p>
                        <div className="flex flex-wrap gap-1">
                          {training.benefits.map((benefit, index) => (
                            <Badge key={index} variant="outline" className="text-xs">
                              {benefit}
                            </Badge>
                          ))}
                        </div>
                      </div>

                      {/* Action Button */}
                      {isSelected && (
                        <div className="pt-3 border-t">
                          <div className="mb-3">
                            <label className="text-sm font-medium">Intensity: {intensity}/5</label>
                            <input
                              type="range"
                              min="1"
                              max="5"
                              value={intensity}
                              onChange={(e) => setIntensity(parseInt(e.target.value))}
                              className="w-full mt-1"
                            />
                            <div className="flex justify-between text-xs text-gray-500 mt-1">
                              <span>Light</span>
                              <span>Intense</span>
                            </div>
                          </div>
                          
                          <Button 
                            className="w-full"
                            onClick={() => startTraining(training.id)}
                          >
                            <Play className="w-4 h-4 mr-2" />
                            Start Training
                          </Button>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        </div>

        {/* Training Tips */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <TrendingUp className="w-5 h-5 mr-2" />
              Training Tips
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-semibold mb-2">Maximize Development</h4>
                <ul className="text-sm text-gray-600 space-y-1">
                  <li>• Young players (under 25) develop faster</li>
                  <li>• Higher intensity = better results but more injury risk</li>
                  <li>• Mental training reduces player fatigue</li>
                  <li>• Don't train injured or very tired players</li>
                </ul>
              </div>
              <div>
                <h4 className="font-semibold mb-2">Injury Prevention</h4>
                <ul className="text-sm text-gray-600 space-y-1">
                  <li>• Monitor player fatigue levels closely</li>
                  <li>• Physical training has highest injury risk</li>
                  <li>• Rotate players in training sessions</li>
                  <li>• Consider player age and fitness</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  )
}