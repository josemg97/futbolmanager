# Football Manager Web Game

A comprehensive online football management game built with Next.js, TypeScript, and PostgreSQL. Manage real teams, develop players, make transfers, and compete against other managers worldwide.

## 🚀 Features

### Core Gameplay
- **Real Teams & Players**: Manage authentic teams from 20+ major leagues
- **Player Development**: Train and develop players with realistic progression
- **Transfer Market**: Buy, sell, and loan players with other managers
- **Live Matches**: Real-time match simulation every 48 hours
- **Training System**: 5 specialized training types affecting different attributes
- **Youth Academy**: Automatic generation of young talents

### Technical Features
- **Real-time Updates**: WebSocket integration for live matches and chat
- **Responsive Design**: Mobile-first approach with Tailwind CSS
- **Type Safety**: Full TypeScript implementation
- **Database**: PostgreSQL with Prisma ORM
- **Authentication**: JWT-based auth system
- **API**: RESTful API design

## 🛠️ Tech Stack

- **Frontend**: Next.js 14, React 18, TypeScript
- **Styling**: Tailwind CSS, Shadcn/ui components
- **Backend**: Next.js API routes, Node.js
- **Database**: PostgreSQL with Prisma ORM
- **Authentication**: JWT tokens
- **Real-time**: Socket.io (planned)
- **Deployment**: Vercel/Netlify ready

## 📦 Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd football-manager-web
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env.local
   ```
   
   Edit `.env.local` with your database credentials and JWT secret.

4. **Set up the database**
   ```bash
   # Generate Prisma client
   npm run db:generate
   
   # Push database schema
   npm run db:push
   
   # Seed with initial data
   npm run db:seed
   ```

5. **Start the development server**
   ```bash
   npm run dev
   ```

   Open [http://localhost:3000](http://localhost:3000) in your browser.

## 🗄️ Database Schema

The game uses a comprehensive database schema with the following main entities:

- **Users**: Player accounts and authentication
- **RealTeams**: Authentic football teams from major leagues
- **BasePlayer**: Template players with base attributes
- **Player**: User-owned player instances with current attributes
- **UserTeam**: User's team management data
- **Match**: Match scheduling and results
- **TrainingSession**: Player development sessions
- **TransferOffer**: Player trading system
- **Notification**: In-game notifications

## 🎮 Game Mechanics

### Player Development
- **Age-based progression**: Young players (70% chance), professionals (40%), veterans (10%)
- **Training effects**: 5 training types affecting different attributes
- **Match performance**: Post-match development based on performance
- **Potential system**: Each player has a maximum potential (50-95)

### Training System
1. **Speed Training**: Improves acceleration and sprint speed
2. **Technical Training**: Enhances ball control and passing
3. **Physical Training**: Builds strength and stamina
4. **Mental Training**: Improves decision making and reduces fatigue
5. **Goalkeeping Training**: Specialized training for goalkeepers

### Transfer Market
- **Public offers**: Visible to all managers
- **Private negotiations**: Direct offers between managers
- **Release clauses**: Automatic transfer triggers
- **Loan system**: Temporary player transfers

### Match System
- **48-hour cycle**: Matches scheduled every 2 days
- **Live simulation**: Real-time match events and commentary
- **Formation system**: Tactical setup and player positioning
- **Statistics tracking**: Comprehensive match and player stats

## 🚀 Development Roadmap

### Phase 1: MVP (Months 1-4)
- [x] Basic team management
- [x] Player development system
- [x] Training mechanics
- [x] Transfer system foundation
- [ ] Match simulation engine
- [ ] User authentication

### Phase 2: Advanced Features (Months 5-8)
- [ ] Real-time match viewing
- [ ] Chat system
- [ ] Advanced statistics
- [ ] Mobile optimization
- [ ] Performance optimization

### Phase 3: Launch (Month 8+)
- [ ] Beta testing
- [ ] Load testing
- [ ] Production deployment
- [ ] Marketing and user acquisition

## 🧪 Testing

```bash
# Run tests
npm test

# Run tests in watch mode
npm run test:watch

# Type checking
npm run type-check
```

## 📝 API Documentation

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `GET /api/auth/profile` - Get user profile

### Teams
- `GET /api/teams` - Get user teams
- `POST /api/teams` - Create new team
- `GET /api/players/[teamId]` - Get team players

### Training
- `POST /api/training` - Start training session
- `GET /api/training?teamId=` - Get active training sessions

### Transfers
- `POST /api/transfers` - Make transfer offer
- `GET /api/transfers?type=received` - Get received offers

### Matches
- `POST /api/matches/simulate` - Simulate match
- `GET /api/matches/upcoming` - Get upcoming matches

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Inspired by classic football management games
- Built with modern web technologies
- Community-driven development approach

## 📞 Support

For support, email support@footballmanager.com or join our Discord community.

---

**Happy Managing! ⚽**