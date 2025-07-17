export interface User {
  id: string
  email: string
  username: string
  createdAt: Date
  lastLogin?: Date
  isActive: boolean
}

export interface RealTeam {
  id: number
  name: string
  country: string
  league: string
  division: number
  logoUrl?: string
}

export interface UserTeam {
  id: string
  userId: string
  realTeamId: number
  teamName: string
  budget: bigint
  reputation: number
  createdAt: Date
  realTeam: RealTeam
}

export interface BasePlayer {
  id: number
  name: string
  position: PlayerPosition
  birthDate: Date
  nationality: string
  realTeamId: number
  baseSpeed: number
  baseTechnique: number
  basePhysical: number
  baseMental: number
  baseGoalkeeping: number
  potential: number
}

export interface Player {
  id: string
  basePlayerId: number
  userTeamId: string
  currentSpeed: number
  currentTechnique: number
  currentPhysical: number
  currentMental: number
  currentGoalkeeping: number
  fatigue: number
  injuryDays: number
  injuryType?: InjuryType
  salary: bigint
  contractEnd: Date
  releaseClause?: bigint
  isYouth: boolean
  gamesPlayed: number
  goals: number
  assists: number
  basePlayer: BasePlayer
}

export interface TrainingSession {
  id: string
  userTeamId: string
  trainingType: TrainingType
  intensity: number
  durationDays: number
  startedAt: Date
  completedAt?: Date
  isActive: boolean
}

export interface TransferOffer {
  id: string
  playerId: string
  fromTeamId: string
  toTeamId: string
  offerAmount: bigint
  offerType: 'transfer' | 'loan' | 'release_clause'
  isPublic: boolean
  status: 'pending' | 'accepted' | 'rejected' | 'expired'
  expiresAt: Date
  createdAt: Date
  player: Player
  fromTeam: UserTeam
  toTeam: UserTeam
}

export interface Match {
  id: string
  homeTeamId: string
  awayTeamId: string
  competitionType: string
  scheduledAt: Date
  status: 'scheduled' | 'live' | 'finished'
  homeScore: number
  awayScore: number
  matchData?: any
  homeTeam: UserTeam
  awayTeam: UserTeam
}

export interface MatchEvent {
  id: string
  matchId: string
  minute: number
  eventType: 'goal' | 'card' | 'substitution' | 'injury'
  playerId?: string
  teamId: string
  description?: string
  player?: Player
}

export interface Notification {
  id: string
  userId: string
  type: string
  title: string
  message: string
  isRead: boolean
  createdAt: Date
}

export type PlayerPosition = 'GK' | 'DEF' | 'MID' | 'ATT'
export type TrainingType = 'speed' | 'technique' | 'physical' | 'mental' | 'goalkeeping'
export type InjuryType = 'light' | 'moderate' | 'severe'