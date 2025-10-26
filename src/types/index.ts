// User types
export interface User {
  id: string;
  email: string;
  fullName: string;
  createdAt: string;
  updatedAt: string;
}

// Authentication types
export interface LoginCredentials {
  email: string;
  password: string;
  rememberMe?: boolean;
}

export interface RegisterData {
  email: string;
  password: string;
  fullName: string;
  confirmPassword: string;
}

export interface AuthResponse {
  user: User;
  token: string;
  refreshToken: string;
}

// Habit types
export interface Habit {
  id: string;
  name: string;
  description?: string;
  category: string;
  frequency: 'daily' | 'weekly' | 'monthly';
  targetValue: number;
  unit: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface HabitCheckIn {
  id: string;
  habitId: string;
  value: number;
  notes?: string;
  date: string;
  createdAt: string;
}

export interface HabitStreak {
  habitId: string;
  currentStreak: number;
  longestStreak: number;
  lastCheckIn?: string;
}

// Mood types
export interface MoodEntry {
  id: string;
  mood: number; // 1-10
  energy: number; // 1-10
  stress: number; // 1-10
  notes?: string;
  date: string;
  createdAt: string;
}

export interface MoodTrends {
  period: string;
  averageMood: number;
  averageEnergy: number;
  averageStress: number;
  entries: MoodEntry[];
}

// Journal types
export interface JournalEntry {
  id: string;
  content: string;
  moodBefore: number;
  moodAfter: number;
  aiResponse?: string;
  createdAt: string;
  updatedAt: string;
}

// Goal types
export interface Goal {
  id: string;
  title: string;
  description?: string;
  category: string;
  priority: 'low' | 'medium' | 'high';
  targetDate: string;
  status: 'in_progress' | 'completed' | 'overdue';
  progress: number; // 0-100
  createdAt: string;
  updatedAt: string;
}

// Analytics types
export interface DashboardStats {
  totalHabits: number;
  currentStreak: number;
  averageMood: number;
  journalEntriesThisWeek: number;
  completedGoals: number;
  totalGoals: number;
}

export interface WeeklyStats {
  week: string;
  habitCompletions: number;
  averageMood: number;
  journalEntries: number;
  goalsCompleted: number;
}

export interface CalendarData {
  date: string;
  habitCompletions: number;
  mood?: number;
  journalEntry?: boolean;
}

// API Response types
export interface ApiResponse<T> {
  data: T;
  message?: string;
  success: boolean;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

// Form validation types
export interface ValidationError {
  field: string;
  message: string;
}

// Component props types
export interface BaseButtonProps {
  variant?: 'primary' | 'secondary' | 'outline' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  disabled?: boolean;
  loading?: boolean;
  type?: 'button' | 'submit' | 'reset';
}

export interface BaseInputProps {
  type?: 'text' | 'email' | 'password' | 'number' | 'tel' | 'url';
  placeholder?: string;
  disabled?: boolean;
  required?: boolean;
  error?: string;
  label?: string;
  helpText?: string;
}

export interface BaseModalProps {
  isOpen: boolean;
  title?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  closable?: boolean;
}
