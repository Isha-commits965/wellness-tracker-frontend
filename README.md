# 🌟 Wellness Tracker Frontend

A modern, responsive Vue.js 3 frontend application for tracking wellness habits, moods, and personal growth. Built with TypeScript, Tailwind CSS, and designed for seamless integration with a wellness tracking backend API.

## ✨ Features

### 🔐 Authentication
- User registration and login
- JWT token-based authentication
- Protected routes and navigation guards
- Remember me functionality

### 📊 Dashboard
- Personalized welcome screen
- Quick stats overview (habits, streaks, mood, journal entries)
- Quick action buttons for common tasks
- Recent activity feed
- Weekly mood trend visualization
- Interactive calendar widget

### 🎯 Habits Management
- Create, edit, and delete habits
- Track daily habit completion
- Streak tracking and statistics
- Habit categorization (health, fitness, mindfulness, etc.)
- Quick check-in functionality
- Progress visualization

### 😊 Mood Tracking
- Interactive mood sliders (mood, energy, stress)
- Visual mood indicators with emojis
- Mood history and trends
- Quick mood logging
- Mood analytics and insights

### 📝 AI Journal
- Rich text journal entries
- Mood before/after tracking
- AI-powered responses (backend integration)
- Draft saving functionality
- Journal entry search and filtering
- Entry history management

### 📈 Analytics (Coming Soon)
- Comprehensive wellness analytics
- Habit completion trends
- Mood correlation analysis
- Goal progress tracking
- Export functionality

### 🎯 Goals Management (Coming Soon)
- Set and track wellness goals
- Goal categorization and prioritization
- Progress tracking and milestones
- Goal completion analytics

## 🛠️ Tech Stack

- **Framework**: Vue.js 3 with Composition API
- **Build Tool**: Vite
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **State Management**: Pinia
- **Routing**: Vue Router
- **HTTP Client**: Axios
- **Icons**: Heroicons
- **Date Handling**: Day.js
- **Charts**: Chart.js (ready for implementation)

## 🚀 Getting Started

### Prerequisites

- Node.js (v18 or higher)
- npm or yarn
- Backend API running on `http://0.0.0.0:8001`

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd wellness-tracker-frontend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Environment Setup**
   Create a `.env` file in the root directory:
   ```env
   VITE_API_BASE_URL=http://0.0.0.0:8001
   VITE_APP_NAME=Wellness Tracker
   VITE_APP_VERSION=1.0.0
   ```

4. **Start the development server**
   ```bash
   npm run dev
   ```

5. **Open your browser**
   Navigate to `http://localhost:5173` (or the port shown in terminal)

### Build for Production

```bash
npm run build
```

The built files will be in the `dist` directory, ready for deployment.

## 📁 Project Structure

```
src/
├── components/
│   ├── ui/                    # Reusable UI components
│   │   ├── BaseButton.vue     # Button component with variants
│   │   ├── BaseInput.vue      # Form input component
│   │   ├── BaseCard.vue       # Card container component
│   │   ├── BaseModal.vue      # Modal dialog component
│   │   ├── BaseLoading.vue    # Loading states component
│   │   ├── MoodSlider.vue     # Interactive mood sliders
│   │   ├── StatsCard.vue      # Statistics display card
│   │   └── CalendarWidget.vue # Calendar with indicators
│   └── layout/
│       └── AppLayout.vue      # Main application layout
├── views/
│   ├── auth/                  # Authentication pages
│   │   ├── LoginView.vue      # User login
│   │   └── RegisterView.vue   # User registration
│   ├── dashboard/             # Dashboard pages
│   │   └── DashboardView.vue  # Main dashboard
│   ├── habits/                # Habit management
│   │   ├── HabitsView.vue     # Habits list and management
│   │   └── HabitDetailView.vue # Individual habit details
│   ├── moods/                 # Mood tracking
│   │   └── MoodsView.vue      # Mood logging and history
│   ├── journal/               # AI Journal
│   │   ├── JournalView.vue    # Journal entries list
│   │   └── JournalEntryView.vue # Individual journal entry
│   ├── analytics/             # Analytics dashboard
│   │   └── AnalyticsView.vue  # Analytics and insights
│   ├── goals/                 # Goals management
│   │   ├── GoalsView.vue      # Goals list and management
│   │   └── GoalDetailView.vue # Individual goal details
│   ├── ProfileView.vue        # User profile
│   ├── SettingsView.vue       # Application settings
│   └── NotFoundView.vue       # 404 error page
├── stores/                    # Pinia state management
│   ├── auth.ts               # Authentication state
│   ├── habits.ts             # Habits state management
│   ├── moods.ts              # Mood tracking state
│   ├── journal.ts            # Journal entries state
│   ├── analytics.ts          # Analytics data state
│   └── goals.ts              # Goals state management
├── services/                  # API service layer
│   ├── api.ts                # Base API configuration
│   ├── auth.ts               # Authentication API calls
│   ├── habits.ts             # Habits API calls
│   ├── moods.ts              # Mood tracking API calls
│   ├── journal.ts            # Journal API calls
│   ├── analytics.ts          # Analytics API calls
│   └── goals.ts              # Goals API calls
├── types/                     # TypeScript type definitions
│   └── index.ts              # All type definitions
├── router/                    # Vue Router configuration
│   └── index.ts              # Route definitions and guards
├── assets/                    # Static assets
│   └── main.css              # Global styles and Tailwind
├── App.vue                    # Root component
└── main.ts                    # Application entry point
```

## 🎨 Design System

### Color Palette
- **Primary**: Wellness Green (#10B981)
- **Secondary**: Calm Blue (#3B82F6)
- **Accent**: Warm Orange (#F59E0B)
- **Success**: Green (#059669)
- **Warning**: Yellow (#D97706)
- **Error**: Red (#DC2626)

### Typography
- **Font Family**: Inter (Google Fonts)
- **Weights**: 300, 400, 500, 600, 700

### Components
All components follow a consistent design system with:
- Rounded corners (lg: 8px, xl: 12px)
- Consistent spacing (4px base unit)
- Smooth transitions (200ms duration)
- Focus states for accessibility
- Responsive design patterns

## 🔌 API Integration

The frontend is configured to work with a wellness tracking backend API. All API calls are centralized in the `services/` directory:

### Base Configuration
- **Base URL**: `http://0.0.0.0:8001`
- **Authentication**: JWT Bearer tokens
- **Content Type**: `application/json`
- **Timeout**: 10 seconds

### API Endpoints Used
- `POST /auth/login` - User login
- `POST /auth/register` - User registration
- `GET /auth/me` - Get current user
- `GET /habits/` - Get all habits
- `POST /habits/` - Create habit
- `POST /habits/check-ins/` - Create check-in
- `POST /moods/` - Create mood entry
- `GET /moods/trends/` - Get mood trends
- `POST /journal/` - Create journal entry
- `GET /analytics/dashboard` - Get dashboard stats

## 🧪 Development

### Available Scripts

```bash
# Development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Lint code
npm run lint

# Format code
npm run format

# Type checking
npm run type-check
```

### Code Style
- ESLint for code linting
- Prettier for code formatting
- TypeScript for type safety
- Vue 3 Composition API patterns

## 🚀 Deployment

### Build Process
1. Run `npm run build`
2. Deploy the `dist` folder to your hosting service
3. Configure environment variables for production

### Environment Variables
- `VITE_API_BASE_URL` - Backend API URL
- `VITE_APP_NAME` - Application name
- `VITE_APP_VERSION` - Application version

### Recommended Hosting
- Vercel
- Netlify
- AWS S3 + CloudFront
- Firebase Hosting

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Vue.js team for the amazing framework
- Tailwind CSS for the utility-first CSS framework
- Heroicons for the beautiful icon set
- All contributors and the open-source community

## 📞 Support

For support, email support@wellnesstracker.com or create an issue in the repository.

---

**Built with ❤️ for better wellness tracking**