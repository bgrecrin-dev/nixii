import React, { useState, useEffect } from 'react';
import {
  X,
  Calendar,
  Sparkles,
  BookOpen,
  GraduationCap,
  Flame,
  Smile,
  Star,
  Compass,
  Palette,
  Plus,
  Trash2,
  Check,
  AlertCircle,
  Quote,
} from 'lucide-react';
import { PlannerEntry, PlannerType, JournalMood } from '../types';
import PuffyStarButton from './PuffyStarButton';

interface PlannerEntryModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSaveEntry: (entry: PlannerEntry) => void;
  initialType?: PlannerType;
  editingEntry?: PlannerEntry | null;
}

const PLANNER_META: Record<
  PlannerType,
  { title: string; subtitle: string; icon: string; accentColor: string; symbol: string }
> = {
  school: {
    title: 'Okul Ajandası',
    subtitle: 'Ders notları, ödevler, vize ve final hazırlıkları',
    icon: '🎒',
    accentColor: '#1B263B',
    symbol: 'ᝰ.ᐟ',
  },
  yearly: {
    title: 'Yıllık Ajanda',
    subtitle: 'Dönemlik hedefler, akademik kilometre taşları ve vizyon',
    icon: '📆',
    accentColor: '#2D6A4F',
    symbol: '⋆˚࿔',
  },
  burn_book: {
    title: 'Burn Book',
    subtitle: 'Stresini, kaygılarını ve yorgunluğunu dök ve serbest bırak',
    icon: '🔥',
    accentColor: '#D4A5A5',
    symbol: '୨ৎ',
  },
  journal: {
    title: 'Günlük',
    subtitle: 'Günün düşünceleri, şükran notları ve duygu günlüğü',
    icon: '✍️',
    accentColor: '#E07A5F',
    symbol: '𐙚',
  },
  reading: {
    title: 'Reading Planner',
    subtitle: 'Okunan kitaplar, alıntılar, sayfa hedefleri ve puanlar',
    icon: '📚',
    accentColor: '#7C3AED',
    symbol: '✧',
  },
  travel: {
    title: 'Travel Planner',
    subtitle: 'Geziler, seyahat bütçesi, rotalar ve bavul listesi',
    icon: '✈️',
    accentColor: '#16A34A',
    symbol: 'ᡣ𐭩',
  },
  themed: {
    title: 'Temalı Ajanda',
    subtitle: 'Bütçe, alışkanlık, kişisel gelişim ve özel temalar',
    icon: '🎨',
    accentColor: '#F4C542',
    symbol: '𖦹',
  },
};

const THEMED_OPTIONS = [
  { name: 'Finans & Öğrenci Bütçesi', color: '#2D6A4F' },
  { name: 'Alışkanlık & Self-Care', color: '#D4A5A5' },
  { name: 'Fitness & Sağlıklı Yaşam', color: '#E07A5F' },
  { name: 'Yaratıcı Projeler & Portfolyo', color: '#7C3AED' },
  { name: 'Yabancı Dil & Kelime Günlüğü', color: '#16A34A' },
  { name: 'Özel Tema', color: '#1B263B' },
];

export default function PlannerEntryModal({
  isOpen,
  onClose,
  onSaveEntry,
  initialType = 'school',
  editingEntry = null,
}: PlannerEntryModalProps) {
  const [plannerType, setPlannerType] = useState<PlannerType>(initialType);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [date, setDate] = useState(() => new Date().toISOString().split('T')[0]);

  // School fields
  const [courseName, setCourseName] = useState('');
  const [schoolCategory, setSchoolCategory] = useState<
    'Ders Notu' | 'Vize/Final' | 'Ödev/Proje' | 'Sınav Hazırlığı' | 'Ders Programı'
  >('Ders Notu');
  const [priority, setPriority] = useState<'Yüksek' | 'Orta' | 'Düşük'>('Orta');

  // Yearly fields
  const [targetPeriod, setTargetPeriod] = useState<
    'Güz Dönemi' | 'Bahar Dönemi' | 'Yaz Tatili' | 'Tüm Yıl'
  >('Güz Dönemi');
  const [milestone, setMilestone] = useState('');

  // Burn Book fields
  const [moodBefore, setMoodBefore] = useState('Kaygılı & Yorgun');
  const [burnImmediately, setBurnImmediately] = useState(false);

  // Journal fields
  const [mood, setMood] = useState<JournalMood>('Sakin');
  const [gratitude, setGratitude] = useState('');
  const [dailyHighlight, setDailyHighlight] = useState('');

  // Reading fields
  const [bookTitle, setBookTitle] = useState('');
  const [bookAuthor, setBookAuthor] = useState('');
  const [pageCount, setPageCount] = useState<number | ''>('');
  const [readingStatus, setReadingStatus] = useState<'Okunuyor' | 'Bitti' | 'İstek Listesi'>('Okunuyor');
  const [rating, setRating] = useState<number>(5);
  const [favoriteQuote, setFavoriteQuote] = useState('');

  // Travel fields
  const [destination, setDestination] = useState('');
  const [travelDates, setTravelDates] = useState('');
  const [travelBudget, setTravelBudget] = useState('');
  const [checklistInput, setChecklistInput] = useState('');
  const [checklist, setChecklist] = useState<string[]>([]);

  // Themed fields
  const [themeName, setThemeName] = useState(THEMED_OPTIONS[0].name);
  const [themeColor, setThemeColor] = useState(THEMED_OPTIONS[0].color);

  // Validation error
  const [error, setError] = useState<string | null>(null);

  // Reset or populate on open
  useEffect(() => {
    if (editingEntry) {
      setPlannerType(editingEntry.type);
      setTitle(editingEntry.title || '');
      setContent(editingEntry.content || '');
      setDate(editingEntry.date || new Date().toISOString().split('T')[0]);

      // School
      setCourseName(editingEntry.courseName || '');
      setSchoolCategory(editingEntry.schoolCategory || 'Ders Notu');
      setPriority(editingEntry.priority || 'Orta');

      // Yearly
      setTargetPeriod(editingEntry.targetPeriod || 'Güz Dönemi');
      setMilestone(editingEntry.milestone || '');

      // Burn Book
      setMoodBefore(editingEntry.moodBefore || 'Kaygılı & Yorgun');
      setBurnImmediately(!!editingEntry.isBurned);

      // Journal
      setMood(editingEntry.mood || 'Sakin');
      setGratitude(editingEntry.gratitude || '');
      setDailyHighlight(editingEntry.dailyHighlight || '');

      // Reading
      setBookTitle(editingEntry.bookTitle || editingEntry.title || '');
      setBookAuthor(editingEntry.bookAuthor || '');
      setPageCount(editingEntry.pageCount || '');
      setReadingStatus(editingEntry.readingStatus || 'Okunuyor');
      setRating(editingEntry.rating || 5);
      setFavoriteQuote(editingEntry.favoriteQuote || '');

      // Travel
      setDestination(editingEntry.destination || '');
      setTravelDates(editingEntry.travelDates || '');
      setTravelBudget(editingEntry.travelBudget || '');
      setChecklist(editingEntry.checklist || []);

      // Themed
      setThemeName(editingEntry.themeName || THEMED_OPTIONS[0].name);
      setThemeColor(editingEntry.themeColor || THEMED_OPTIONS[0].color);
    } else {
      setPlannerType(initialType);
      setTitle('');
      setContent('');
      setDate(new Date().toISOString().split('T')[0]);
      setCourseName('');
      setSchoolCategory('Ders Notu');
      setPriority('Orta');
      setTargetPeriod('Güz Dönemi');
      setMilestone('');
      setMoodBefore('Kaygılı & Yorgun');
      setBurnImmediately(false);
      setMood('Sakin');
      setGratitude('');
      setDailyHighlight('');
      setBookTitle('');
      setBookAuthor('');
      setPageCount('');
      setReadingStatus('Okunuyor');
      setRating(5);
      setFavoriteQuote('');
      setDestination('');
      setTravelDates('');
      setTravelBudget('');
      setChecklist(['Yürüyüş ayakkabıları & termos', 'Eskiz defteri & kalemler']);
      setThemeName(THEMED_OPTIONS[0].name);
      setThemeColor(THEMED_OPTIONS[0].color);
    }
    setError(null);
  }, [editingEntry, initialType, isOpen]);

  if (!isOpen) return null;

  const currentMeta = PLANNER_META[plannerType];

  const handleAddChecklistItem = () => {
    if (!checklistInput.trim()) return;
    setChecklist((prev) => [...prev, checklistInput.trim()]);
    setChecklistInput('');
  };

  const handleRemoveChecklistItem = (idx: number) => {
    setChecklist((prev) => prev.filter((_, i) => i !== idx));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Use book title for reading if title is empty
    let finalTitle = title.trim();
    if (plannerType === 'reading' && !finalTitle && bookTitle.trim()) {
      finalTitle = bookTitle.trim();
    }
    if (plannerType === 'travel' && !finalTitle && destination.trim()) {
      finalTitle = `${destination.trim()} Gezi Planı`;
    }

    if (!finalTitle) {
      setError('Lütfen bir başlık girin 𐙚');
      return;
    }

    const now = new Date().toISOString();
    const newEntry: PlannerEntry = {
      id: editingEntry ? editingEntry.id : `planner-${plannerType}-${Date.now()}`,
      type: plannerType,
      title: finalTitle,
      content: content.trim(),
      date: date || now.split('T')[0],
      createdAt: editingEntry ? editingEntry.createdAt : now,
      updatedAt: now,

      // School
      ...(plannerType === 'school' && {
        courseName: courseName.trim() || 'Genel Ders',
        schoolCategory,
        priority,
      }),

      // Yearly
      ...(plannerType === 'yearly' && {
        targetPeriod,
        milestone: milestone.trim(),
      }),

      // Burn Book
      ...(plannerType === 'burn_book' && {
        moodBefore: moodBefore.trim(),
        isBurned: burnImmediately || (editingEntry ? editingEntry.isBurned : false),
        burnedAt: burnImmediately ? now : editingEntry?.burnedAt,
      }),

      // Journal
      ...(plannerType === 'journal' && {
        mood,
        gratitude: gratitude.trim(),
        dailyHighlight: dailyHighlight.trim(),
      }),

      // Reading
      ...(plannerType === 'reading' && {
        bookTitle: bookTitle.trim() || finalTitle,
        bookAuthor: bookAuthor.trim(),
        pageCount: typeof pageCount === 'number' ? pageCount : undefined,
        readingStatus,
        rating,
        favoriteQuote: favoriteQuote.trim(),
      }),

      // Travel
      ...(plannerType === 'travel' && {
        destination: destination.trim(),
        travelDates: travelDates.trim(),
        travelBudget: travelBudget.trim(),
        checklist,
        checkedChecklist: editingEntry?.checkedChecklist || {},
      }),

      // Themed
      ...(plannerType === 'themed' && {
        themeName,
        themeColor,
      }),
    };

    onSaveEntry(newEntry);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-60 flex items-center justify-center p-3 sm:p-4 bg-black/40 backdrop-blur-xs font-stardew animate-fadeIn">
      <div className="bg-[#FAF9F6] rounded-3xl border-3 border-[#E5E3DB] shadow-2xl w-full max-w-lg overflow-hidden flex flex-col max-h-[92vh]">
        {/* Header */}
        <div className="p-4 sm:p-5 bg-white border-b-2 border-[#E5E3DB] flex items-center justify-between">
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-10 h-10 rounded-2xl bg-[#FAF9F6] border-2 border-[#E5E3DB] flex items-center justify-center text-lg shadow-2xs shrink-0">
              {currentMeta.icon}
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-1.5">
                <h3 className="text-sm sm:text-base font-bold text-[#1B263B] truncate font-stardew">
                  {editingEntry ? 'Kaydı Düzenle' : 'Yeni Ajanda Kaydı'}
                </h3>
                <span className="text-xs text-[#E07A5F]">{currentMeta.symbol}</span>
              </div>
              <p className="text-[11px] text-[#6C7A89] truncate">{currentMeta.title} • {currentMeta.subtitle}</p>
            </div>
          </div>
          <PuffyStarButton
            isStarShape={true}
            variant="white"
            size="icon-sm"
            onClick={onClose}
            title="Kapat"
          >
            <X className="w-3.5 h-3.5 text-[#1B263B]" />
          </PuffyStarButton>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-4 sm:p-5 overflow-y-auto space-y-4 flex-1">
          {error && (
            <div className="p-3 rounded-2xl bg-red-50 border border-red-200 text-red-700 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* Planner Type Selector (if creating new) */}
          {!editingEntry && (
            <div>
              <label className="block text-[11px] font-bold text-[#6C7A89] uppercase tracking-wider mb-1.5">
                Ajanda Türünü Seç ⋆˚࿔
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-1.5">
                {(Object.keys(PLANNER_META) as PlannerType[]).map((typeKey) => {
                  const meta = PLANNER_META[typeKey];
                  const isSelected = plannerType === typeKey;
                  return (
                    <button
                      key={typeKey}
                      type="button"
                      onClick={() => setPlannerType(typeKey)}
                      className={`p-2 rounded-xl text-left border-2 transition-all cursor-pointer flex items-center gap-1.5 ${
                        isSelected
                          ? 'bg-white border-[#2D6A4F] text-[#1B263B] shadow-2xs font-bold'
                          : 'bg-[#FAF9F6] border-[#E5E3DB] text-[#6C7A89] hover:bg-white hover:text-[#1B263B]'
                      }`}
                    >
                      <span className="text-sm">{meta.icon}</span>
                      <span className="text-[11px] truncate">{meta.title}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Date and Core Title Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="sm:col-span-2">
              <label className="block text-[11px] font-bold text-[#1B263B] mb-1">
                Kayıt Başlığı * 𐙚
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder={
                  plannerType === 'reading'
                    ? 'Örn: Atomik Alışkanlıklar'
                    : plannerType === 'school'
                    ? 'Örn: Bilişsel Psikoloji Vize Hazırlığı'
                    : plannerType === 'burn_book'
                    ? 'Örn: Gece gelen kaygılar...'
                    : 'Kayıt için bir başlık yazın...'
                }
                className="w-full bg-white border-2 border-[#E5E3DB] rounded-2xl px-3 py-2 text-xs font-bold text-[#1B263B] focus:outline-hidden focus:ring-2 focus:ring-[#F4C542]"
              />
            </div>
            <div>
              <label className="block text-[11px] font-bold text-[#1B263B] mb-1">
                Tarih 📅
              </label>
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full bg-white border-2 border-[#E5E3DB] rounded-2xl px-3 py-2 text-xs font-medium text-[#1B263B] focus:outline-hidden focus:ring-2 focus:ring-[#F4C542]"
              />
            </div>
          </div>

          {/* Dynamic Inputs according to Planner Type */}
          {/* 1. SCHOOL PLANNER INPUTS */}
          {plannerType === 'school' && (
            <div className="p-3.5 bg-white rounded-2xl border-2 border-[#E5E3DB] space-y-3">
              <div className="text-[11px] font-bold text-[#1B263B] flex items-center gap-1.5">
                <GraduationCap className="w-4 h-4 text-[#2D6A4F]" />
                <span>Ders &amp; Akademik Detayları</span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                <div>
                  <label className="block text-[10px] font-bold text-[#6C7A89] mb-1">Ders Adı</label>
                  <input
                    type="text"
                    value={courseName}
                    onChange={(e) => setCourseName(e.target.value)}
                    placeholder="Örn: Psikoloji, Mimari..."
                    className="w-full bg-[#FAF9F6] border border-[#E5E3DB] rounded-xl px-2.5 py-1.5 text-xs text-[#1B263B]"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-[#6C7A89] mb-1">Kategori</label>
                  <select
                    value={schoolCategory}
                    onChange={(e) => setSchoolCategory(e.target.value as any)}
                    className="w-full bg-[#FAF9F6] border border-[#E5E3DB] rounded-xl px-2.5 py-1.5 text-xs text-[#1B263B]"
                  >
                    <option value="Ders Notu">Ders Notu 📝</option>
                    <option value="Vize/Final">Vize / Final 📌</option>
                    <option value="Ödev/Proje">Ödev / Proje 📐</option>
                    <option value="Sınav Hazırlığı">Sınav Hazırlığı ⚡</option>
                    <option value="Ders Programı">Ders Programı 🗓️</option>
                  </select>
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-[#6C7A89] mb-1">Öncelik</label>
                  <select
                    value={priority}
                    onChange={(e) => setPriority(e.target.value as any)}
                    className="w-full bg-[#FAF9F6] border border-[#E5E3DB] rounded-xl px-2.5 py-1.5 text-xs text-[#1B263B]"
                  >
                    <option value="Yüksek">🔴 Yüksek</option>
                    <option value="Orta">🟡 Orta</option>
                    <option value="Düşük">🟢 Düşük</option>
                  </select>
                </div>
              </div>
            </div>
          )}

          {/* 2. YEARLY PLANNER INPUTS */}
          {plannerType === 'yearly' && (
            <div className="p-3.5 bg-white rounded-2xl border-2 border-[#E5E3DB] space-y-3">
              <div className="text-[11px] font-bold text-[#1B263B] flex items-center gap-1.5">
                <Calendar className="w-4 h-4 text-[#2D6A4F]" />
                <span>Yıllık Dönem &amp; Kilometre Taşı</span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                <div>
                  <label className="block text-[10px] font-bold text-[#6C7A89] mb-1">Hedef Dönemi</label>
                  <select
                    value={targetPeriod}
                    onChange={(e) => setTargetPeriod(e.target.value as any)}
                    className="w-full bg-[#FAF9F6] border border-[#E5E3DB] rounded-xl px-2.5 py-1.5 text-xs text-[#1B263B]"
                  >
                    <option value="Güz Dönemi">Güz Dönemi 🍂</option>
                    <option value="Bahar Dönemi">Bahar Dönemi 🌸</option>
                    <option value="Yaz Tatili">Yaz Tatili ☀️</option>
                    <option value="Tüm Yıl">Tüm Yıl ⋆˚࿔</option>
                  </select>
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-[#6C7A89] mb-1">Büyük Kilometre Taşı</label>
                  <input
                    type="text"
                    value={milestone}
                    onChange={(e) => setMilestone(e.target.value)}
                    placeholder="Örn: 3.50+ Ortalama veya Staj"
                    className="w-full bg-[#FAF9F6] border border-[#E5E3DB] rounded-xl px-2.5 py-1.5 text-xs text-[#1B263B]"
                  />
                </div>
              </div>
            </div>
          )}

          {/* 3. BURN BOOK INPUTS */}
          {plannerType === 'burn_book' && (
            <div className="p-3.5 bg-[#FAF9F6] rounded-2xl border-2 border-[#D4A5A5] space-y-3">
              <div className="text-[11px] font-bold text-[#915050] flex items-center gap-1.5">
                <Flame className="w-4 h-4 text-[#E07A5F]" />
                <span>Arınma &amp; Deşarj Alanı 𐙚</span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                <div>
                  <label className="block text-[10px] font-bold text-[#915050] mb-1">Yazarkenki Ruh Halin</label>
                  <input
                    type="text"
                    value={moodBefore}
                    onChange={(e) => setMoodBefore(e.target.value)}
                    placeholder="Örn: Bunaltıcı sınav stresi..."
                    className="w-full bg-white border border-[#D4A5A5] rounded-xl px-2.5 py-1.5 text-xs text-[#1B263B]"
                  />
                </div>
                <div className="flex items-center gap-2 pt-4">
                  <label className="flex items-center gap-2 text-xs font-bold text-[#915050] cursor-pointer">
                    <input
                      type="checkbox"
                      checked={burnImmediately}
                      onChange={(e) => setBurnImmediately(e.target.checked)}
                      className="rounded-md accent-[#E07A5F] w-4 h-4"
                    />
                    <span>Kaydederken Sayfayı Yak 🔥</span>
                  </label>
                </div>
              </div>
            </div>
          )}

          {/* 4. DAILY JOURNAL INPUTS */}
          {plannerType === 'journal' && (
            <div className="p-3.5 bg-white rounded-2xl border-2 border-[#E5E3DB] space-y-3">
              <div className="text-[11px] font-bold text-[#1B263B] flex items-center gap-1.5">
                <Smile className="w-4 h-4 text-[#E07A5F]" />
                <span>Günün Ruh Hali &amp; Şükranı 𐙚</span>
              </div>
              <div>
                <label className="block text-[10px] font-bold text-[#6C7A89] mb-1.5">Ruh Hali</label>
                <div className="flex flex-wrap gap-1.5">
                  {(['Harika', 'Mutlu', 'Sakin', 'Yorgun', 'Stresli'] as JournalMood[]).map((m) => (
                    <button
                      key={m}
                      type="button"
                      onClick={() => setMood(m)}
                      className={`px-3 py-1.5 rounded-xl text-xs font-bold border transition-all cursor-pointer ${
                        mood === m
                          ? 'bg-[#2D6A4F] text-white border-[#2D6A4F] shadow-xs'
                          : 'bg-[#FAF9F6] text-[#6C7A89] border-[#E5E3DB] hover:bg-white hover:text-[#1B263B]'
                      }`}
                    >
                      {m === 'Harika' ? '✨ Harika' : m === 'Mutlu' ? '😊 Mutlu' : m === 'Sakin' ? '🌿 Sakin' : m === 'Yorgun' ? '☕ Yorgun' : '🌧️ Stresli'}
                    </button>
                  ))}
                </div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                <div>
                  <label className="block text-[10px] font-bold text-[#6C7A89] mb-1">Bugün Ne İçin Teşekkür Ediyorsun?</label>
                  <input
                    type="text"
                    value={gratitude}
                    onChange={(e) => setGratitude(e.target.value)}
                    placeholder="Örn: Sıcak bir kahve, temiz çalışma masam..."
                    className="w-full bg-[#FAF9F6] border border-[#E5E3DB] rounded-xl px-2.5 py-1.5 text-xs text-[#1B263B]"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-[#6C7A89] mb-1">Günün Yıldızı / Başarısı</label>
                  <input
                    type="text"
                    value={dailyHighlight}
                    onChange={(e) => setDailyHighlight(e.target.value)}
                    placeholder="Örn: 2 saat kesintisiz odaklandım!"
                    className="w-full bg-[#FAF9F6] border border-[#E5E3DB] rounded-xl px-2.5 py-1.5 text-xs text-[#1B263B]"
                  />
                </div>
              </div>
            </div>
          )}

          {/* 5. READING PLANNER INPUTS */}
          {plannerType === 'reading' && (
            <div className="p-3.5 bg-white rounded-2xl border-2 border-[#E5E3DB] space-y-3">
              <div className="text-[11px] font-bold text-[#1B263B] flex items-center gap-1.5">
                <BookOpen className="w-4 h-4 text-[#7C3AED]" />
                <span>Kitap &amp; İlerleme Bilgileri 📚</span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                <div>
                  <label className="block text-[10px] font-bold text-[#6C7A89] mb-1">Kitap Başlığı</label>
                  <input
                    type="text"
                    value={bookTitle}
                    onChange={(e) => setBookTitle(e.target.value)}
                    placeholder="Örn: Atomik Alışkanlıklar"
                    className="w-full bg-[#FAF9F6] border border-[#E5E3DB] rounded-xl px-2.5 py-1.5 text-xs text-[#1B263B]"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-[#6C7A89] mb-1">Yazar</label>
                  <input
                    type="text"
                    value={bookAuthor}
                    onChange={(e) => setBookAuthor(e.target.value)}
                    placeholder="Örn: James Clear"
                    className="w-full bg-[#FAF9F6] border border-[#E5E3DB] rounded-xl px-2.5 py-1.5 text-xs text-[#1B263B]"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-[#6C7A89] mb-1">Okuma Durumu</label>
                  <select
                    value={readingStatus}
                    onChange={(e) => setReadingStatus(e.target.value as any)}
                    className="w-full bg-[#FAF9F6] border border-[#E5E3DB] rounded-xl px-2.5 py-1.5 text-xs text-[#1B263B]"
                  >
                    <option value="Okunuyor">📖 Okunuyor</option>
                    <option value="Bitti">✅ Bitti</option>
                    <option value="İstek Listesi">🏷️ İstek Listesi</option>
                  </select>
                </div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                <div>
                  <label className="block text-[10px] font-bold text-[#6C7A89] mb-1">Değerlendirme Puanı (1-5)</label>
                  <div className="flex items-center gap-1 pt-1">
                    {[1, 2, 3, 4, 5].map((starVal) => (
                      <button
                        key={starVal}
                        type="button"
                        onClick={() => setRating(starVal)}
                        className="p-1 cursor-pointer transition-transform hover:scale-110"
                      >
                        <Star
                          className={`w-5 h-5 ${
                            starVal <= rating
                              ? 'fill-[#F4C542] text-[#F4C542]'
                              : 'text-[#E5E3DB]'
                          }`}
                        />
                      </button>
                    ))}
                  </div>
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-[#6C7A89] mb-1">Toplam Sayfa Sayısı</label>
                  <input
                    type="number"
                    value={pageCount}
                    onChange={(e) => setPageCount(e.target.value ? Number(e.target.value) : '')}
                    placeholder="Örn: 320"
                    className="w-full bg-[#FAF9F6] border border-[#E5E3DB] rounded-xl px-2.5 py-1.5 text-xs text-[#1B263B]"
                  />
                </div>
              </div>
              <div>
                <label className="block text-[10px] font-bold text-[#6C7A89] mb-1">Favori Alıntı</label>
                <div className="relative">
                  <Quote className="w-3.5 h-3.5 text-[#A0AEC0] absolute left-2.5 top-2.5" />
                  <input
                    type="text"
                    value={favoriteQuote}
                    onChange={(e) => setFavoriteQuote(e.target.value)}
                    placeholder='Örn: "Her eylem, gelecekte olmak istediğiniz kişiye verdiğiniz bir oydur."'
                    className="w-full bg-[#FAF9F6] border border-[#E5E3DB] rounded-xl pl-8 pr-2.5 py-1.5 text-xs italic text-[#1B263B]"
                  />
                </div>
              </div>
            </div>
          )}

          {/* 6. TRAVEL PLANNER INPUTS */}
          {plannerType === 'travel' && (
            <div className="p-3.5 bg-white rounded-2xl border-2 border-[#E5E3DB] space-y-3">
              <div className="text-[11px] font-bold text-[#1B263B] flex items-center gap-1.5">
                <Compass className="w-4 h-4 text-[#16A34A]" />
                <span>Gezi, Seyahat &amp; Bavul Listesi ✈️</span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                <div>
                  <label className="block text-[10px] font-bold text-[#6C7A89] mb-1">Hedef Şehir / Rota</label>
                  <input
                    type="text"
                    value={destination}
                    onChange={(e) => setDestination(e.target.value)}
                    placeholder="Örn: Kaş &amp; Likya Yolu"
                    className="w-full bg-[#FAF9F6] border border-[#E5E3DB] rounded-xl px-2.5 py-1.5 text-xs text-[#1B263B]"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-[#6C7A89] mb-1">Seyahat Tarihleri</label>
                  <input
                    type="text"
                    value={travelDates}
                    onChange={(e) => setTravelDates(e.target.value)}
                    placeholder="Örn: 12 - 16 Ekim"
                    className="w-full bg-[#FAF9F6] border border-[#E5E3DB] rounded-xl px-2.5 py-1.5 text-xs text-[#1B263B]"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-[#6C7A89] mb-1">Bütçe Hedefi</label>
                  <input
                    type="text"
                    value={travelBudget}
                    onChange={(e) => setTravelBudget(e.target.value)}
                    placeholder="Örn: 4.500 ₺"
                    className="w-full bg-[#FAF9F6] border border-[#E5E3DB] rounded-xl px-2.5 py-1.5 text-xs text-[#1B263B]"
                  />
                </div>
              </div>
              {/* Checklist builder */}
              <div>
                <label className="block text-[10px] font-bold text-[#6C7A89] mb-1">Bavul &amp; Yapılacaklar Listesi</label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={checklistInput}
                    onChange={(e) => setChecklistInput(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        handleAddChecklistItem();
                      }
                    }}
                    placeholder="Öğe ekle (örn: Müze kartı al)..."
                    className="flex-1 bg-[#FAF9F6] border border-[#E5E3DB] rounded-xl px-2.5 py-1.5 text-xs text-[#1B263B]"
                  />
                  <button
                    type="button"
                    onClick={handleAddChecklistItem}
                    className="px-3 py-1.5 rounded-xl bg-[#2D6A4F] text-white text-xs font-bold hover:bg-[#245740] cursor-pointer"
                  >
                    + Ekle
                  </button>
                </div>
                {checklist.length > 0 && (
                  <div className="mt-2 space-y-1 max-h-28 overflow-y-auto">
                    {checklist.map((item, idx) => (
                      <div
                        key={idx}
                        className="flex items-center justify-between px-2.5 py-1 bg-[#FAF9F6] rounded-lg border border-[#E5E3DB] text-xs text-[#1B263B]"
                      >
                        <span>• {item}</span>
                        <button
                          type="button"
                          onClick={() => handleRemoveChecklistItem(idx)}
                          className="text-[#915050] hover:text-red-700 p-0.5 cursor-pointer"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* 7. THEMED PLANNER INPUTS */}
          {plannerType === 'themed' && (
            <div className="p-3.5 bg-white rounded-2xl border-2 border-[#E5E3DB] space-y-3">
              <div className="text-[11px] font-bold text-[#1B263B] flex items-center gap-1.5">
                <Palette className="w-4 h-4 text-[#F4C542]" />
                <span>Özel Tema Seçimi 🎨</span>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {THEMED_OPTIONS.map((themeOpt) => {
                  const isSelected = themeName === themeOpt.name;
                  return (
                    <button
                      key={themeOpt.name}
                      type="button"
                      onClick={() => {
                        setThemeName(themeOpt.name);
                        setThemeColor(themeOpt.color);
                      }}
                      className={`p-2 rounded-xl text-left border text-xs font-bold transition-all cursor-pointer ${
                        isSelected
                          ? 'bg-[#FAF9F6] border-[#2D6A4F] text-[#1B263B] shadow-2xs'
                          : 'bg-white border-[#E5E3DB] text-[#6C7A89] hover:bg-[#FAF9F6]'
                      }`}
                    >
                      <div className="flex items-center gap-1.5 mb-1">
                        <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: themeOpt.color }} />
                        <span className="text-[10px] truncate">{themeOpt.name}</span>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Core Content / Notes Textarea */}
          <div>
            <label className="block text-[11px] font-bold text-[#1B263B] mb-1">
              Notlar &amp; Detaylar ✍️
            </label>
            <textarea
              rows={4}
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Düşüncelerini, yapılacak adımları veya ders özetini buraya yaz..."
              className="w-full bg-white border-2 border-[#E5E3DB] rounded-2xl p-3 text-xs text-[#1B263B] focus:outline-hidden focus:ring-2 focus:ring-[#F4C542] resize-none"
            />
          </div>

          {/* Footer Action Buttons */}
          <div className="pt-2 flex items-center justify-end gap-2.5">
            <PuffyStarButton
              type="button"
              variant="white"
              size="md"
              onClick={onClose}
            >
              Vazgeç
            </PuffyStarButton>
            <PuffyStarButton
              type="submit"
              variant="green"
              size="md"
            >
              <Check className="w-4 h-4 mr-1 inline" />
              {editingEntry ? 'Değişiklikleri Kaydet 𐙚' : 'Ajandaya Kaydet 𐙚'}
            </PuffyStarButton>
          </div>
        </form>
      </div>
    </div>
  );
}
