import { Player, BasePlayer, Match, UserTeam } from '@prisma/client'

export interface MatchSimulationResult {
  homeScore: number
  awayScore: number
  events: MatchEvent[]
  statistics: MatchStatistics
}

export interface MatchEvent {
  minute: number
  type: 'goal' | 'card' | 'substitution' | 'injury'
  playerId?: string
  teamId: string
  description: string
}

export interface MatchStatistics {
  possession: { home: number; away: number }
  shots: { home: number; away: number }
  shotsOnTarget: { home: number; away: number }
  fouls: { home: number; away: number }
  corners: { home: number; away: number }
}

export interface TeamStrength {
  attack: number
  midfield: number
  defense: number
  goalkeeping: number
  overall: number
}

export class MatchEngine {
  calculateTeamStrength(players: (Player & { basePlayer: BasePlayer })[]): TeamStrength {
    const activePlayer = players.filter(p => p.injuryDays === 0 && p.fatigue < 90)
    
    if (activePlayer.length === 0) {
      return { attack: 50, midfield: 50, defense: 50, goalkeeping: 50, overall: 50 }
    }

    const attackers = activePlayer.filter(p => p.basePlayer.position === 'ATT')
    const midfielders = activePlayer.filter(p => p.basePlayer.position === 'MID')
    const defenders = activePlayer.filter(p => p.basePlayer.position === 'DEF')
    const goalkeepers = activePlayer.filter(p => p.basePlayer.position === 'GK')

    const attack = this.calculatePositionStrength(attackers, ['currentSpeed', 'currentTechnique'])
    const midfield = this.calculatePositionStrength(midfielders, ['currentTechnique', 'currentMental'])
    const defense = this.calculatePositionStrength(defenders, ['currentPhysical', 'currentMental'])
    const goalkeeping = this.calculatePositionStrength(goalkeepers, ['currentGoalkeeping'])

    const overall = (attack + midfield + defense + goalkeeping) / 4

    return { attack, midfield, defense, goalkeeping, overall }
  }

  private calculatePositionStrength(players: (Player & { basePlayer: BasePlayer })[], attributes: string[]): number {
    if (players.length === 0) return 50

    const totalStrength = players.reduce((sum, player) => {
      const attributeSum = attributes.reduce((attrSum, attr) => {
        return attrSum + (player[attr as keyof Player] as number)
      }, 0)
      return sum + (attributeSum / attributes.length)
    }, 0)

    return Math.round(totalStrength / players.length)
  }

  simulateMatch(
    homeTeam: UserTeam & { players: (Player & { basePlayer: BasePlayer })[] },
    awayTeam: UserTeam & { players: (Player & { basePlayer: BasePlayer })[] }
  ): MatchSimulationResult {
    const homeStrength = this.calculateTeamStrength(homeTeam.players)
    const awayStrength = this.calculateTeamStrength(awayTeam.players)

    // Home advantage
    const adjustedHomeStrength = { ...homeStrength, overall: homeStrength.overall + 5 }

    const events: MatchEvent[] = []
    let homeScore = 0
    let awayScore = 0

    // Simulate 90 minutes
    for (let minute = 1; minute <= 90; minute++) {
      const eventChance = Math.random()

      if (eventChance < 0.02) { // 2% chance of event per minute
        const event = this.generateEvent(minute, adjustedHomeStrength, awayStrength, homeTeam, awayTeam)
        events.push(event)

        if (event.type === 'goal') {
          if (event.teamId === homeTeam.id) {
            homeScore++
          } else {
            awayScore++
          }
        }
      }
    }

    const statistics = this.generateStatistics(adjustedHomeStrength, awayStrength, events)

    return {
      homeScore,
      awayScore,
      events,
      statistics
    }
  }

  private generateEvent(
    minute: number,
    homeStrength: TeamStrength,
    awayStrength: TeamStrength,
    homeTeam: UserTeam & { players: (Player & { basePlayer: BasePlayer })[] },
    awayTeam: UserTeam & { players: (Player & { basePlayer: BasePlayer })[] }
  ): MatchEvent {
    const totalStrength = homeStrength.overall + awayStrength.overall
    const homeChance = homeStrength.overall / totalStrength

    const isHomeEvent = Math.random() < homeChance
    const team = isHomeEvent ? homeTeam : awayTeam
    const teamStrength = isHomeEvent ? homeStrength : awayStrength

    const eventType = this.determineEventType(teamStrength)
    const player = this.selectRandomPlayer(team.players, eventType)

    return {
      minute,
      type: eventType,
      playerId: player?.id,
      teamId: team.id,
      description: this.generateEventDescription(eventType, player?.basePlayer.name || 'Unknown', team.teamName)
    }
  }

  private determineEventType(strength: TeamStrength): MatchEvent['type'] {
    const rand = Math.random()
    
    if (rand < 0.6) return 'goal'
    if (rand < 0.8) return 'card'
    if (rand < 0.95) return 'substitution'
    return 'injury'
  }

  private selectRandomPlayer(players: (Player & { basePlayer: BasePlayer })[], eventType: string) {
    const availablePlayers = players.filter(p => p.injuryDays === 0)
    if (availablePlayers.length === 0) return null

    if (eventType === 'goal') {
      const attackers = availablePlayers.filter(p => p.basePlayer.position === 'ATT')
      if (attackers.length > 0) {
        return attackers[Math.floor(Math.random() * attackers.length)]
      }
    }

    return availablePlayers[Math.floor(Math.random() * availablePlayers.length)]
  }

  private generateEventDescription(type: string, playerName: string, teamName: string): string {
    switch (type) {
      case 'goal':
        return `⚽ GOAL! ${playerName} scores for ${teamName}!`
      case 'card':
        return `🟨 ${playerName} receives a yellow card`
      case 'substitution':
        return `🔄 ${teamName} makes a substitution`
      case 'injury':
        return `🏥 ${playerName} is injured and needs treatment`
      default:
        return `Event involving ${playerName}`
    }
  }

  private generateStatistics(homeStrength: TeamStrength, awayStrength: TeamStrength, events: MatchEvent[]): MatchStatistics {
    const totalStrength = homeStrength.overall + awayStrength.overall
    const homePossession = Math.round((homeStrength.overall / totalStrength) * 100)
    
    const homeShots = Math.floor(Math.random() * 10) + homeStrength.attack / 10
    const awayShots = Math.floor(Math.random() * 10) + awayStrength.attack / 10

    return {
      possession: { home: homePossession, away: 100 - homePossession },
      shots: { home: Math.round(homeShots), away: Math.round(awayShots) },
      shotsOnTarget: { 
        home: Math.round(homeShots * 0.4), 
        away: Math.round(awayShots * 0.4) 
      },
      fouls: { 
        home: Math.floor(Math.random() * 15) + 5, 
        away: Math.floor(Math.random() * 15) + 5 
      },
      corners: { 
        home: Math.floor(Math.random() * 8) + 2, 
        away: Math.floor(Math.random() * 8) + 2 
      }
    }
  }
}

export class PlayerDevelopment {
  calculateImprovement(player: Player & { basePlayer: BasePlayer }, matchPerformance: number): Partial<Player> {
    const age = this.calculateAge(player.basePlayer.birthDate)
    const improvementChance = this.getImprovementProbability(age)
    
    if (Math.random() > improvementChance) {
      return {} // No improvement
    }

    const improvements: Partial<Player> = {}
    const maxImprovement = Math.min(3, Math.floor(matchPerformance / 20))

    // Speed improvement (higher chance for young players)
    if (Math.random() < 0.3 && player.currentSpeed < player.basePlayer.potential) {
      improvements.currentSpeed = Math.min(
        player.basePlayer.potential,
        player.currentSpeed + Math.floor(Math.random() * maxImprovement) + 1
      )
    }

    // Technique improvement
    if (Math.random() < 0.4 && player.currentTechnique < player.basePlayer.potential) {
      improvements.currentTechnique = Math.min(
        player.basePlayer.potential,
        player.currentTechnique + Math.floor(Math.random() * maxImprovement) + 1
      )
    }

    // Physical improvement (decreases with age)
    if (Math.random() < (age < 25 ? 0.4 : 0.2) && player.currentPhysical < player.basePlayer.potential) {
      improvements.currentPhysical = Math.min(
        player.basePlayer.potential,
        player.currentPhysical + Math.floor(Math.random() * maxImprovement) + 1
      )
    }

    // Mental improvement (increases with age and experience)
    if (Math.random() < (age > 25 ? 0.5 : 0.3) && player.currentMental < player.basePlayer.potential) {
      improvements.currentMental = Math.min(
        player.basePlayer.potential,
        player.currentMental + Math.floor(Math.random() * maxImprovement) + 1
      )
    }

    // Goalkeeping improvement (only for goalkeepers)
    if (player.basePlayer.position === 'GK' && Math.random() < 0.4 && player.currentGoalkeeping < player.basePlayer.potential) {
      improvements.currentGoalkeeping = Math.min(
        player.basePlayer.potential,
        player.currentGoalkeeping + Math.floor(Math.random() * maxImprovement) + 1
      )
    }

    return improvements
  }

  getImprovementProbability(age: number): number {
    if (age < 18) return 0.7  // 70% for youth
    if (age < 25) return 0.5  // 50% for young professionals
    if (age < 30) return 0.4  // 40% for professionals
    if (age < 35) return 0.2  // 20% for experienced
    return 0.1  // 10% for veterans
  }

  private calculateAge(birthDate: Date): number {
    const today = new Date()
    const birth = new Date(birthDate)
    let age = today.getFullYear() - birth.getFullYear()
    const monthDiff = today.getMonth() - birth.getMonth()
    
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
      age--
    }
    
    return age
  }
}

export class TrainingSystem {
  applyTraining(
    player: Player & { basePlayer: BasePlayer },
    trainingType: string,
    intensity: number,
    duration: number
  ): { improvements: Partial<Player>; fatigueIncrease: number; injuryRisk: number } {
    const baseImprovement = intensity * (duration / 7) // Base improvement per week
    const age = this.calculateAge(player.basePlayer.birthDate)
    const ageMultiplier = age < 25 ? 1.2 : age > 30 ? 0.8 : 1.0

    let improvements: Partial<Player> = {}
    let fatigueIncrease = intensity * 5
    let injuryRisk = intensity * 0.02 // 2% per intensity level

    switch (trainingType) {
      case 'speed':
        improvements.currentSpeed = Math.min(
          player.basePlayer.potential,
          player.currentSpeed + Math.floor(baseImprovement * ageMultiplier)
        )
        injuryRisk *= 1.5 // Higher injury risk for speed training
        break

      case 'technique':
        improvements.currentTechnique = Math.min(
          player.basePlayer.potential,
          player.currentTechnique + Math.floor(baseImprovement * ageMultiplier)
        )
        fatigueIncrease *= 0.8 // Less fatigue for technique training
        break

      case 'physical':
        improvements.currentPhysical = Math.min(
          player.basePlayer.potential,
          player.currentPhysical + Math.floor(baseImprovement * ageMultiplier)
        )
        injuryRisk *= 2.0 // Highest injury risk for physical training
        break

      case 'mental':
        improvements.currentMental = Math.min(
          player.basePlayer.potential,
          player.currentMental + Math.floor(baseImprovement * ageMultiplier * 1.2)
        )
        fatigueIncrease *= 0.5 // Mental training reduces fatigue
        break

      case 'goalkeeping':
        if (player.basePlayer.position === 'GK') {
          improvements.currentGoalkeeping = Math.min(
            player.basePlayer.potential,
            player.currentGoalkeeping + Math.floor(baseImprovement * ageMultiplier)
          )
        }
        break
    }

    return { improvements, fatigueIncrease, injuryRisk }
  }

  private calculateAge(birthDate: Date): number {
    const today = new Date()
    const birth = new Date(birthDate)
    let age = today.getFullYear() - birth.getFullYear()
    const monthDiff = today.getMonth() - birth.getMonth()
    
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
      age--
    }
    
    return age
  }
}