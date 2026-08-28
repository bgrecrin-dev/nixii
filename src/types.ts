export type ThemeStyle =
  | 'anime'
  | 'football'
  | 'gaming'
  | 'stardew'
  | 'navy'
  | 'pink'
  | 'green'
  | 'orange';

export type AccentColor = 'navy' | 'pink' | 'green' | 'orange' | 'anime' | 'football' | 'gaming';

export type PinCategory = 'all' | 'study' | 'deadlines' | 'inspo' | 'notes' | 'schedule';

export type FocusStatus =
  | 'Ders Çalışıyor'
  | 'Derste'
  | 'Kahve Molası'
  | 'Final Maratonu'
  | 'Birlikte Çalışmaya Açık'
  | 'In Study Zone'
  | 'In Lecture'
  | 'Coffee Break'
  | 'Finals Grind'
  | 'Open to Collab';

export type EducationLevel = 'ortaokul' | 'lise' | 'universite';

export type TaskCategory =
  | 'Ders & Çalışma'
  | 'Ödev & Proje'
  | 'Sınav & Vize'
  | 'Kişisel & Alışkanlık'
  | 'Kitap & Okuma';

export interface TaskItem {
  id: string;
  title: string;
  description?: string;
  date?: string;
  category: TaskCategory | string;
  completed: boolean;
  completedAt?: string;
  pointsEarned: number;
  createdAt: string;
}

export interface StudentProfile {
  name: string;
  handle: string;
  avatarUrl: string;
  educationLevel?: EducationLevel;
  grade?: string;
  major?: string;
  year?: string;
  university?: string;
  bio: string;
  personalGoal?: string;
  favoriteTheme?: ThemeStyle;
  points?: number;
  selectedGoals?: string[];
  focusStatus: FocusStatus;
  stats: {
    boards: number;
    pins: number;
    streak: number;
    focusHours: number;
  };
  tags: string[];
}

export interface PinItem {
  id: string;
  title: string;
  category: PinCategory;
  accent: AccentColor;
  tag: string;
  description: string;
  imageUrl?: string;
  items?: string[];
  checkedItems?: Record<number, boolean>;
  date?: string;
  priority?: 'High' | 'Medium' | 'Low' | 'Yüksek' | 'Orta' | 'Düşük';
  likes: number;
  isLiked?: boolean;
  isSaved?: boolean;
  author?: string;
  readTime?: string;
}

export type PlannerType =
  | 'school'
  | 'yearly'
  | 'burn_book'
  | 'journal'
  | 'reading'
  | 'travel'
  | 'themed';

export type JournalMood = 'Harika' | 'Mutlu' | 'Sakin' | 'Yorgun' | 'Stresli';

export interface PlannerEntry {
  id: string;
  type: PlannerType;
  title: string;
  content: string;
  date: string; // YYYY-MM-DD or readable string
  createdAt: string;
  updatedAt?: string;

  // School Planner specific
  courseName?: string;
  schoolCategory?: 'Ders Notu' | 'Vize/Final' | 'Ödev/Proje' | 'Sınav Hazırlığı' | 'Ders Programı';
  priority?: 'Yüksek' | 'Orta' | 'Düşük';

  // Year Planner specific
  targetPeriod?: 'Güz Dönemi' | 'Bahar Dönemi' | 'Yaz Tatili' | 'Tüm Yıl';
  milestone?: string;

  // Burn Book specific
  isBurned?: boolean;
  burnedAt?: string;
  moodBefore?: string;

  // Daily Journal specific
  mood?: JournalMood;
  gratitude?: string;
  dailyHighlight?: string;

  // Reading Planner specific
  bookTitle?: string;
  bookAuthor?: string;
  rating?: number; // 1 to 5
  pageCount?: number;
  readingStatus?: 'Okunuyor' | 'Bitti' | 'İstek Listesi';
  favoriteQuote?: string;

  // Travel Planner specific
  destination?: string;
  travelBudget?: string;
  travelDates?: string;
  checklist?: string[];
  checkedChecklist?: Record<number, boolean>;

  // Themed Planner specific
  themeName?: string; // e.g. "Finans & Bütçe", "Alışkanlık & Self-Care", "Fitness & Sağlık", "Yaratıcı Proje"
  themeColor?: string;
}

export type WeekDay = 'Pazartesi' | 'Salı' | 'Çarşamba' | 'Perşembe' | 'Cuma' | 'Cumartesi' | 'Pazar';

export interface ScheduleLesson {
  id: string;
  day: WeekDay;
  subject: string;
  time?: string;
  classroom?: string;
  teacher?: string;
  color?: 'green' | 'orange' | 'pink' | 'navy' | 'yellow' | 'purple';
  notes?: string;
}

export interface SavedCourseGrade {
  id: string;
  courseName: string;
  level: EducationLevel;
  score: number;
  letter: string;
  details: string;
  date: string;
}


