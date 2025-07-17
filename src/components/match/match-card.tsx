'use client'

import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Match } from '@/types'
import { formatDate } from '@/lib/utils'
import { Clock, Play, CheckCircle } from 'lucide-react'

interface MatchCardProps {
  match: Match
  onViewMatch?: (match: Match) => void
}

export function MatchCard({ match, onViewMatch }: MatchCardProps) {
  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'scheduled':
        return <Clock className="w-4 h-4" />
      case 'live':
        return <Play className="w-4 h-4" />
      case 'finished':
        return <CheckCircle className="w-4 h-4" />
      default:
        return <Clock className="w-4 h-4" />
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'scheduled':
        return 'bg-blue-100 text-blue-800'
      case 'live':
        return 'bg-green-100 text-green-800'
      case 'finished':
        return 'bg-gray-100 text-gray-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const isLive = match.status === 'live'
  const isFinished = match.status === 'finished'

  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <Badge className={getStatusColor(match.status)}>
            {getStatusIcon(match.status)}
            <span className="ml-1 capitalize">{match.status}</span>
          </Badge>
          <span className="text-sm text-gray-600">
            {formatDate(match.scheduledAt)}
          </span>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Teams and Score */}
        <div className="flex items-center justify-between">
          <div className="flex-1">
            <div className="font-semibold text-lg">{match.homeTeam.teamName}</div>
            <div className="text-sm text-gray-600">{match.homeTeam.realTeam.name}</div>
          </div>
          
          <div className="flex items-center space-x-4 mx-4">
            {isFinished || isLive ? (
              <div className="text-2xl font-bold">
                {match.homeScore} - {match.awayScore}
              </div>
            ) : (
              <div className="text-lg text-gray-400">vs</div>
            )}
          </div>
          
          <div className="flex-1 text-right">
            <div className="font-semibold text-lg">{match.awayTeam.teamName}</div>
            <div className="text-sm text-gray-600">{match.awayTeam.realTeam.name}</div>
          </div>
        </div>

        {/* Competition */}
        <div className="text-center">
          <Badge variant="outline" className="capitalize">
            {match.competitionType}
          </Badge>
        </div>

        {/* Live Indicator */}
        {isLive && (
          <div className="flex items-center justify-center space-x-2 text-green-600">
            <div className="w-2 h-2 bg-green-600 rounded-full animate-pulse"></div>
            <span className="text-sm font-medium">LIVE</span>
          </div>
        )}

        {/* Actions */}
        <div className="flex space-x-2">
          {isLive ? (
            <Button 
              className="flex-1" 
              onClick={() => onViewMatch?.(match)}
            >
              Watch Live
            </Button>
          ) : isFinished ? (
            <Button 
              variant="outline" 
              className="flex-1"
              onClick={() => onViewMatch?.(match)}
            >
              View Report
            </Button>
          ) : (
            <Button 
              variant="outline" 
              className="flex-1"
              onClick={() => onViewMatch?.(match)}
            >
              Set Lineup
            </Button>
          )}
        </div>

        {/* Next Match Countdown */}
        {match.status === 'scheduled' && (
          <div className="text-center text-sm text-gray-600">
            {new Date(match.scheduledAt) > new Date() ? (
              <span>
                Starts in {Math.ceil((new Date(match.scheduledAt).getTime() - new Date().getTime()) / (1000 * 60 * 60))} hours
              </span>
            ) : (
              <span>Starting soon...</span>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  )
}