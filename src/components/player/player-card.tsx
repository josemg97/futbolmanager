'use client'

import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Player, BasePlayer } from '@/types'
import { calculateAge, getPlayerOverall, formatCurrency } from '@/lib/utils'
import { Heart, TrendingUp, AlertTriangle } from 'lucide-react'

interface PlayerCardProps {
  player: Player & { basePlayer: BasePlayer }
  onSelect?: (player: Player) => void
  showActions?: boolean
}

export function PlayerCard({ player, onSelect, showActions = true }: PlayerCardProps) {
  const age = calculateAge(player.basePlayer.birthDate)
  const overall = getPlayerOverall({
    currentSpeed: player.currentSpeed,
    currentTechnique: player.currentTechnique,
    currentPhysical: player.currentPhysical,
    currentMental: player.currentMental,
    currentGoalkeeping: player.currentGoalkeeping,
    position: player.basePlayer.position
  })

  const getPositionColor = (position: string) => {
    switch (position) {
      case 'GK': return 'bg-yellow-100 text-yellow-800'
      case 'DEF': return 'bg-blue-100 text-blue-800'
      case 'MID': return 'bg-green-100 text-green-800'
      case 'ATT': return 'bg-red-100 text-red-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getOverallColor = (overall: number) => {
    if (overall >= 80) return 'text-green-600'
    if (overall >= 70) return 'text-yellow-600'
    if (overall >= 60) return 'text-orange-600'
    return 'text-red-600'
  }

  return (
    <Card className="hover:shadow-md transition-shadow cursor-pointer" onClick={() => onSelect?.(player)}>
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div>
            <h3 className="font-semibold text-lg">{player.basePlayer.name}</h3>
            <p className="text-sm text-gray-600">{player.basePlayer.nationality}</p>
          </div>
          <div className="text-right">
            <div className={`text-2xl font-bold ${getOverallColor(overall)}`}>
              {overall}
            </div>
            <Badge className={getPositionColor(player.basePlayer.position)}>
              {player.basePlayer.position}
            </Badge>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Player Stats */}
        <div className="grid grid-cols-2 gap-2 text-sm">
          <div className="flex justify-between">
            <span>Age:</span>
            <span className="font-medium">{age}</span>
          </div>
          <div className="flex justify-between">
            <span>Games:</span>
            <span className="font-medium">{player.gamesPlayed}</span>
          </div>
          <div className="flex justify-between">
            <span>Goals:</span>
            <span className="font-medium">{player.goals}</span>
          </div>
          <div className="flex justify-between">
            <span>Assists:</span>
            <span className="font-medium">{player.assists}</span>
          </div>
        </div>

        {/* Attributes */}
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span>Speed:</span>
            <span className="font-medium">{player.currentSpeed}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span>Technique:</span>
            <span className="font-medium">{player.currentTechnique}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span>Physical:</span>
            <span className="font-medium">{player.currentPhysical}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span>Mental:</span>
            <span className="font-medium">{player.currentMental}</span>
          </div>
          {player.basePlayer.position === 'GK' && (
            <div className="flex justify-between text-sm">
              <span>Goalkeeping:</span>
              <span className="font-medium">{player.currentGoalkeeping}</span>
            </div>
          )}
        </div>

        {/* Status Indicators */}
        <div className="flex items-center space-x-2">
          {player.fatigue > 70 && (
            <Badge variant="destructive" className="text-xs">
              <AlertTriangle className="w-3 h-3 mr-1" />
              Tired
            </Badge>
          )}
          {player.injuryDays > 0 && (
            <Badge variant="destructive" className="text-xs">
              <Heart className="w-3 h-3 mr-1" />
              Injured ({player.injuryDays}d)
            </Badge>
          )}
          {player.isYouth && (
            <Badge variant="secondary" className="text-xs">
              <TrendingUp className="w-3 h-3 mr-1" />
              Youth
            </Badge>
          )}
        </div>

        {/* Contract Info */}
        <div className="text-xs text-gray-600 space-y-1">
          <div>Salary: {formatCurrency(Number(player.salary) / 100)}/year</div>
          <div>Contract ends: {new Date(player.contractEnd).toLocaleDateString()}</div>
          {player.releaseClause && (
            <div>Release clause: {formatCurrency(Number(player.releaseClause) / 100)}</div>
          )}
        </div>

        {/* Actions */}
        {showActions && (
          <div className="flex space-x-2 pt-2">
            <Button size="sm" variant="outline" className="flex-1">
              View Details
            </Button>
            <Button size="sm" className="flex-1">
              Make Offer
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  )
}