import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'EUR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount)
}

export function formatDate(date: Date): string {
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  }).format(date)
}

export function calculateAge(birthDate: Date): number {
  const today = new Date()
  const birth = new Date(birthDate)
  let age = today.getFullYear() - birth.getFullYear()
  const monthDiff = today.getMonth() - birth.getMonth()
  
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
    age--
  }
  
  return age
}

export function getPlayerOverall(player: {
  currentSpeed: number
  currentTechnique: number
  currentPhysical: number
  currentMental: number
  currentGoalkeeping: number
  position: string
}): number {
  const { currentSpeed, currentTechnique, currentPhysical, currentMental, currentGoalkeeping } = player
  
  if (player.position === 'GK') {
    return Math.round((currentGoalkeeping * 0.4 + currentMental * 0.3 + currentPhysical * 0.2 + currentTechnique * 0.1))
  }
  
  return Math.round((currentSpeed + currentTechnique + currentPhysical + currentMental) / 4)
}