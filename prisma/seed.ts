import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Starting database seed...')

  // Create Real Teams
  const realTeams = [
    // La Liga
    { name: 'FC Barcelona', country: 'Spain', league: 'La Liga', division: 1 },
    { name: 'Real Madrid', country: 'Spain', league: 'La Liga', division: 1 },
    { name: 'Atlético Madrid', country: 'Spain', league: 'La Liga', division: 1 },
    { name: 'Sevilla FC', country: 'Spain', league: 'La Liga', division: 1 },
    
    // Premier League
    { name: 'Manchester City', country: 'England', league: 'Premier League', division: 1 },
    { name: 'Manchester United', country: 'England', league: 'Premier League', division: 1 },
    { name: 'Liverpool', country: 'England', league: 'Premier League', division: 1 },
    { name: 'Chelsea', country: 'England', league: 'Premier League', division: 1 },
    { name: 'Arsenal', country: 'England', league: 'Premier League', division: 1 },
    
    // Serie A
    { name: 'Juventus', country: 'Italy', league: 'Serie A', division: 1 },
    { name: 'AC Milan', country: 'Italy', league: 'Serie A', division: 1 },
    { name: 'Inter Milan', country: 'Italy', league: 'Serie A', division: 1 },
    { name: 'AS Roma', country: 'Italy', league: 'Serie A', division: 1 },
    
    // Bundesliga
    { name: 'Bayern Munich', country: 'Germany', league: 'Bundesliga', division: 1 },
    { name: 'Borussia Dortmund', country: 'Germany', league: 'Bundesliga', division: 1 },
    { name: 'RB Leipzig', country: 'Germany', league: 'Bundesliga', division: 1 },
    
    // Ligue 1
    { name: 'Paris Saint-Germain', country: 'France', league: 'Ligue 1', division: 1 },
    { name: 'Olympique Marseille', country: 'France', league: 'Ligue 1', division: 1 },
    { name: 'AS Monaco', country: 'France', league: 'Ligue 1', division: 1 },
  ]

  console.log('Creating real teams...')
  for (const team of realTeams) {
    await prisma.realTeam.upsert({
      where: { name: team.name },
      update: {},
      create: team
    })
  }

  // Get created teams
  const createdTeams = await prisma.realTeam.findMany()

  // Create Base Players for each team
  console.log('Creating base players...')
  
  const playerTemplates = [
    // Goalkeepers
    { position: 'GK', baseSpeed: 45, baseTechnique: 75, basePhysical: 80, baseMental: 85, baseGoalkeeping: 88 },
    { position: 'GK', baseSpeed: 40, baseTechnique: 70, basePhysical: 78, baseMental: 82, baseGoalkeeping: 85 },
    
    // Defenders
    { position: 'DEF', baseSpeed: 70, baseTechnique: 75, basePhysical: 85, baseMental: 80, baseGoalkeeping: 20 },
    { position: 'DEF', baseSpeed: 75, baseTechnique: 78, basePhysical: 82, baseMental: 85, baseGoalkeeping: 15 },
    { position: 'DEF', baseSpeed: 68, baseTechnique: 72, basePhysical: 88, baseMental: 78, baseGoalkeeping: 25 },
    { position: 'DEF', baseSpeed: 72, baseTechnique: 80, basePhysical: 80, baseMental: 82, baseGoalkeeping: 18 },
    { position: 'DEF', baseSpeed: 74, baseTechnique: 76, basePhysical: 84, baseMental: 79, baseGoalkeeping: 22 },
    
    // Midfielders
    { position: 'MID', baseSpeed: 78, baseTechnique: 85, basePhysical: 75, baseMental: 88, baseGoalkeeping: 15 },
    { position: 'MID', baseSpeed: 80, baseTechnique: 88, basePhysical: 72, baseMental: 85, baseGoalkeeping: 12 },
    { position: 'MID', baseSpeed: 75, baseTechnique: 82, basePhysical: 78, baseMental: 86, baseGoalkeeping: 18 },
    { position: 'MID', baseSpeed: 82, baseTechnique: 80, basePhysical: 80, baseMental: 82, baseGoalkeeping: 10 },
    { position: 'MID', baseSpeed: 76, baseTechnique: 84, basePhysical: 74, baseMental: 87, baseGoalkeeping: 16 },
    { position: 'MID', baseSpeed: 79, baseTechnique: 86, basePhysical: 76, baseMental: 84, baseGoalkeeping: 14 },
    
    // Attackers
    { position: 'ATT', baseSpeed: 88, baseTechnique: 85, basePhysical: 78, baseMental: 82, baseGoalkeeping: 10 },
    { position: 'ATT', baseSpeed: 85, baseTechnique: 88, basePhysical: 75, baseMental: 85, baseGoalkeeping: 8 },
    { position: 'ATT', baseSpeed: 90, baseTechnique: 82, basePhysical: 80, baseMental: 80, baseGoalkeeping: 12 },
    { position: 'ATT', baseSpeed: 86, baseTechnique: 86, basePhysical: 76, baseMental: 83, baseGoalkeeping: 9 },
  ]

  const firstNames = [
    'Lionel', 'Cristiano', 'Neymar', 'Kylian', 'Erling', 'Kevin', 'Luka', 'Virgil', 'Sadio', 'Mohamed',
    'Robert', 'Karim', 'Sergio', 'Toni', 'Joshua', 'Harry', 'Raheem', 'Jadon', 'Phil', 'Mason',
    'Pedri', 'Gavi', 'Ansu', 'Ferran', 'Ronald', 'Frenkie', 'Sergio', 'Gerard', 'Jordi', 'Marc',
    'Vinicius', 'Rodrygo', 'Eduardo', 'Thibaut', 'Dani', 'Luka', 'Toni', 'Federico', 'Marco', 'Nicolo'
  ]

  const lastNames = [
    'Messi', 'Ronaldo', 'Junior', 'Mbappé', 'Haaland', 'De Bruyne', 'Modric', 'van Dijk', 'Mané', 'Salah',
    'Lewandowski', 'Benzema', 'Ramos', 'Kroos', 'Kimmich', 'Kane', 'Sterling', 'Sancho', 'Foden', 'Mount',
    'González', 'Páez', 'Fati', 'Torres', 'Araújo', 'de Jong', 'Busquets', 'Piqué', 'Alba', 'ter Stegen',
    'Júnior', 'Goes', 'Camavinga', 'Courtois', 'Carvajal', 'Modrić', 'Kroos', 'Valverde', 'Asensio', 'Barella'
  ]

  const nationalities = [
    'Spain', 'France', 'Germany', 'Italy', 'England', 'Portugal', 'Netherlands', 'Belgium', 'Brazil', 'Argentina',
    'Croatia', 'Poland', 'Norway', 'Denmark', 'Sweden', 'Austria', 'Switzerland', 'Czech Republic', 'Uruguay', 'Colombia'
  ]

  for (const team of createdTeams) {
    console.log(`Creating players for ${team.name}...`)
    
    for (const template of playerTemplates) {
      const firstName = firstNames[Math.floor(Math.random() * firstNames.length)]
      const lastName = lastNames[Math.floor(Math.random() * lastNames.length)]
      const nationality = nationalities[Math.floor(Math.random() * nationalities.length)]
      
      // Generate random birth date (18-35 years old)
      const age = Math.floor(Math.random() * 17) + 18 // 18-35 years
      const birthDate = new Date()
      birthDate.setFullYear(birthDate.getFullYear() - age)
      birthDate.setMonth(Math.floor(Math.random() * 12))
      birthDate.setDate(Math.floor(Math.random() * 28) + 1)

      // Add some randomness to attributes (±5)
      const randomVariation = () => Math.floor(Math.random() * 11) - 5 // -5 to +5

      await prisma.basePlayer.create({
        data: {
          name: `${firstName} ${lastName}`,
          position: template.position,
          birthDate,
          nationality,
          realTeamId: team.id,
          baseSpeed: Math.max(30, Math.min(95, template.baseSpeed + randomVariation())),
          baseTechnique: Math.max(30, Math.min(95, template.baseTechnique + randomVariation())),
          basePhysical: Math.max(30, Math.min(95, template.basePhysical + randomVariation())),
          baseMental: Math.max(30, Math.min(95, template.baseMental + randomVariation())),
          baseGoalkeeping: Math.max(10, Math.min(95, template.baseGoalkeeping + randomVariation())),
          potential: Math.floor(Math.random() * 25) + 70, // 70-95 potential
        }
      })
    }
  }

  console.log('✅ Database seeded successfully!')
}

main()
  .catch((e) => {
    console.error('❌ Error seeding database:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })