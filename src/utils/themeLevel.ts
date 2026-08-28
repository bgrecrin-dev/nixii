import { ThemeStyle } from '../types';

export interface ThemeConfig {
  id: ThemeStyle;
  name: string;
  categoryName: string;
  pointName: string;
  pointUnit: string;
  pointIcon: string;
  colorClass: string;
  borderClass: string;
  bgLightClass: string;
  badgeBg: string;
  ranks: string[];
}

export const THEME_CONFIGS: Record<ThemeStyle, ThemeConfig> = {
  anime: {
    id: 'anime',
    name: 'Anime & Sakura',
    categoryName: 'Anime',
    pointName: 'Sakura Puanı',
    pointUnit: 'Sakura',
    pointIcon: '🌸',
    colorClass: 'text-[#E07A5F]',
    borderClass: 'border-[#E07A5F]',
    bgLightClass: 'bg-[#FFEDED]',
    badgeBg: 'bg-[#E07A5F]',
    ranks: [
      'Çaylak Öğrenci',
      'Kulüp Temsilcisi',
      'Akademi Yıldızı',
      'Usta Sensei',
      'Efsanevi Kahraman',
    ],
  },
  football: {
    id: 'football',
    name: 'Futbol & Spor',
    categoryName: 'Futbol',
    pointName: 'Gol Puanı',
    pointUnit: 'Gol',
    pointIcon: '⚽',
    colorClass: 'text-[#2D6A4F]',
    borderClass: 'border-[#2D6A4F]',
    bgLightClass: 'bg-[#EBF5EE]',
    badgeBg: 'bg-[#2D6A4F]',
    ranks: [
      'Altyapı Yeteneği',
      'İlk 11 Yıldızı',
      'Gol Krallığı Adayı',
      'Takım Kaptanı',
      'Kupa Şampiyonu',
    ],
  },
  gaming: {
    id: 'gaming',
    name: 'Gaming & Retro',
    categoryName: 'Gaming',
    pointName: 'XP',
    pointUnit: 'XP',
    pointIcon: '🎮',
    colorClass: 'text-[#1B263B]',
    borderClass: 'border-[#1B263B]',
    bgLightClass: 'bg-[#EEF2F6]',
    badgeBg: 'bg-[#1B263B]',
    ranks: [
      'Başlangıç Oyuncusu',
      'Görev Gezgini',
      'Bölüm Sonu Ustası',
      'Pro Oyuncu',
      'Efsanevi Şampiyon',
    ],
  },
  stardew: {
    id: 'stardew',
    name: 'Stardew & Doğa',
    categoryName: 'Stardew',
    pointName: 'Hasat Puanı',
    pointUnit: 'Hasat',
    pointIcon: '🌾',
    colorClass: 'text-[#2D6A4F]',
    borderClass: 'border-[#2D6A4F]',
    bgLightClass: 'bg-[#EBF5EE]',
    badgeBg: 'bg-[#2D6A4F]',
    ranks: [
      'Acemi Çiftçi',
      'Bereketli Hasatçı',
      'Vadi Ustası',
      'Altın Çiftlik Sahibi',
      'Yıldız Vadisi Efsanesi',
    ],
  },
  orange: {
    id: 'orange',
    name: 'Sıcak Şeftali',
    categoryName: 'Cozy',
    pointName: 'Yıldız Puanı',
    pointUnit: 'Yıldız',
    pointIcon: '★',
    colorClass: 'text-[#E07A5F]',
    borderClass: 'border-[#E07A5F]',
    bgLightClass: 'bg-[#FDF3EE]',
    badgeBg: 'bg-[#E07A5F]',
    ranks: [
      'Işık Çırağı',
      'Kahve Sever',
      'Gece Yıldızı',
      'Parlayan Işık',
      'Kutup Yıldızı',
    ],
  },
  pink: {
    id: 'pink',
    name: 'Pudra Pembesi',
    categoryName: 'Sevimli',
    pointName: 'Fiyonk Puanı',
    pointUnit: 'Fiyonk',
    pointIcon: '𐙚',
    colorClass: 'text-[#D4A5A5]',
    borderClass: 'border-[#D4A5A5]',
    bgLightClass: 'bg-[#FAF0F0]',
    badgeBg: 'bg-[#D4A5A5]',
    ranks: [
      'Pembe Düşler',
      'Zarafet Yıldızı',
      'Estetik Ustası',
      'Tılsımlı Kalp',
      'Masalsı Zarafet',
    ],
  },
  navy: {
    id: 'navy',
    name: 'Lacivert Klasik',
    categoryName: 'Akademi',
    pointName: 'Bilgelik Puanı',
    pointUnit: 'Bilgi',
    pointIcon: '📘',
    colorClass: 'text-[#1B263B]',
    borderClass: 'border-[#1B263B]',
    bgLightClass: 'bg-[#EEF2F6]',
    badgeBg: 'bg-[#1B263B]',
    ranks: [
      'Kitap Kurdu',
      'Araştırmacı Zihin',
      'Bilge Akademisyen',
      'Baş Araştırmacı',
      'Kütüphane Üstadı',
    ],
  },
  green: {
    id: 'green',
    name: 'Koyu Yeşil',
    categoryName: 'Doğa',
    pointName: 'Yaprak Puanı',
    pointUnit: 'Yaprak',
    pointIcon: '🍃',
    colorClass: 'text-[#2D6A4F]',
    borderClass: 'border-[#2D6A4F]',
    bgLightClass: 'bg-[#EBF5EE]',
    badgeBg: 'bg-[#2D6A4F]',
    ranks: [
      'Tohum Eken',
      'Orman Gezgini',
      'Doğa Bilgesi',
      'Usta Koruyucu',
      'Kadim Ağaç',
    ],
  },
};

export const ALL_THEME_OPTIONS: { id: ThemeStyle; label: string; pointName: string; icon: string; hex: string }[] = [
  { id: 'anime', label: 'Anime', pointName: 'Sakura Puanı', icon: '🌸', hex: '#FFB7B2' },
  { id: 'football', label: 'Futbol', pointName: 'Gol Puanı', icon: '⚽', hex: '#2D6A4F' },
  { id: 'gaming', label: 'Gaming', pointName: 'XP', icon: '🎮', hex: '#3D5A80' },
  { id: 'orange', label: 'Sıcak Turuncu', pointName: 'Yıldız Puanı', icon: '★', hex: '#E07A5F' },
  { id: 'pink', label: 'Pudra Pembesi', pointName: 'Fiyonk Puanı', icon: '𐙚', hex: '#D4A5A5' },
  { id: 'green', label: 'Koyu Yeşil', pointName: 'Yaprak Puanı', icon: '🍃', hex: '#2D6A4F' },
  { id: 'navy', label: 'Lacivert', pointName: 'Bilgelik Puanı', icon: '📘', hex: '#1B263B' },
];

export interface LevelInfo {
  level: number;
  currentLevelPoints: number;
  pointsNeededForNextLevel: number;
  totalPoints: number;
  progressPercent: number;
  rankTitle: string;
  pointName: string;
  pointUnit: string;
  pointIcon: string;
  themeConfig: ThemeConfig;
}

export const POINTS_PER_LEVEL = 100;

export function calculateLevelInfo(
  totalPoints: number = 0,
  theme: ThemeStyle = 'orange'
): LevelInfo {
  const safePoints = Math.max(0, totalPoints);
  const themeConfig = THEME_CONFIGS[theme] || THEME_CONFIGS['orange'];
  
  const level = Math.floor(safePoints / POINTS_PER_LEVEL) + 1;
  const currentLevelPoints = safePoints % POINTS_PER_LEVEL;
  const pointsNeededForNextLevel = POINTS_PER_LEVEL - currentLevelPoints;
  const progressPercent = Math.min(100, Math.round((currentLevelPoints / POINTS_PER_LEVEL) * 100));

  // Determine rank title based on level
  const rankIndex = Math.min(level - 1, themeConfig.ranks.length - 1);
  const rankTitle = themeConfig.ranks[rankIndex];

  return {
    level,
    currentLevelPoints,
    pointsNeededForNextLevel,
    totalPoints: safePoints,
    progressPercent,
    rankTitle,
    pointName: themeConfig.pointName,
    pointUnit: themeConfig.pointUnit,
    pointIcon: themeConfig.pointIcon,
    themeConfig,
  };
}
