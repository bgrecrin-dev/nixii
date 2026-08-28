import React, { useState } from 'react';
import {
  Sparkles,
  Calendar,
  BookOpen,
  GraduationCap,
  Flame,
  Smile,
  Star,
  Compass,
  Palette,
  Plus,
  Search,
  Filter,
  Trash2,
  Edit3,
  CheckCircle2,
  Circle,
  Quote,
  Clock,
  ChevronDown,
  Sparkle,
  Share2,
  CheckSquare,
  TrendingUp,
  Award,
  AlertCircle,
  Tag,
} from 'lucide-react';
import { PlannerEntry, PlannerType, StudentProfile } from '../types';
import PuffyStarButton from './PuffyStarButton';
import PlannerEntryModal from './PlannerEntryModal';

interface PlannerViewProps {
  entries: PlannerEntry[];
  onAddEntry: (entry: PlannerEntry) => void;
  onUpdateEntry: (entry: PlannerEntry) => void;
  onDeleteEntry: (id: string) => void;
  initialPlannerType?: PlannerType;
  profile?: StudentProfile;
}

const PLANNER_TABS: Array<{
  type: PlannerType;
  title: string;
  shortTitle: string;
  icon: string;
  accent: string;
  tag: string;
}> = [
  {
    type: 'school',
    title: 'Okul Ajandası',
    shortTitle: 'Okul',
    icon: '🎒',
    accent: '#1B263B',
    tag: 'Dersler & Ödevler',
  },
  {
    type: 'yearly',
    title: 'Yıllık Ajanda',
    shortTitle: 'Yıllık',
    icon: '📆',
    accent: '#2D6A4F',
    tag: '2026 Dönem Hedefleri',
  },
  {
    type: 'burn_book',
    title: 'Burn Book',
    shortTitle: 'Burn Book',
    icon: '🔥',
    accent: '#D4A5A5',
    tag: 'Arınma & Deşarj',
  },
  {
    type: 'journal',
    title: 'Günlük',
    shortTitle: 'Günlük',
    icon: '✍️',
    accent: '#E07A5F',
    tag: 'Ruh Hali & Şükran',
  },
  {
    type: 'reading',
    title: 'Reading Planner',
    shortTitle: 'Okuma',
    icon: '📚',
    accent: '#7C3AED',
    tag: 'Kitaplar & Alıntılar',
  },
  {
    type: 'travel',
    title: 'Travel Planner',
    shortTitle: 'Gezi',
    icon: '✈️',
    accent: '#16A34A',
    tag: 'Rotalar & Bavul',
  },
  {
    type: 'themed',
    title: 'Temalı Ajandalar',
    shortTitle: 'Temalı',
    icon: '🎨',
    accent: '#F4C542',
    tag: 'Bütçe & Alışkanlık',
  },
];

export default function PlannerView({
  entries,
  onAddEntry,
  onUpdateEntry,
  onDeleteEntry,
  initialPlannerType = 'school',
  profile,
}: PlannerViewProps) {
  const [activeTab, setActiveTab] = useState<PlannerType>(initialPlannerType);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSubFilter, setSelectedSubFilter] = useState<string>('all');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingEntry, setEditingEntry] = useState<PlannerEntry | null>(null);
  const [burningId, setBurningId] = useState<string | null>(null);

  // Sync activeTab when initialPlannerType prop updates
  React.useEffect(() => {
    if (initialPlannerType) {
      setActiveTab(initialPlannerType);
    }
  }, [initialPlannerType]);

  // Filter entries for current planner tab
  const currentTabEntries = entries.filter((e) => e.type === activeTab);

  // Apply search and subfilters
  const filteredEntries = currentTabEntries.filter((entry) => {
    // Search query
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchTitle = entry.title.toLowerCase().includes(q);
      const matchContent = entry.content.toLowerCase().includes(q);
      const matchCourse = entry.courseName?.toLowerCase().includes(q);
      const matchBook = entry.bookTitle?.toLowerCase().includes(q) || entry.bookAuthor?.toLowerCase().includes(q);
      const matchDest = entry.destination?.toLowerCase().includes(q);
      const matchTheme = entry.themeName?.toLowerCase().includes(q);
      if (!matchTitle && !matchContent && !matchCourse && !matchBook && !matchDest && !matchTheme) {
        return false;
      }
    }

    // Sub-filters
    if (selectedSubFilter !== 'all') {
      if (activeTab === 'school' && entry.schoolCategory !== selectedSubFilter) return false;
      if (activeTab === 'reading' && entry.readingStatus !== selectedSubFilter) return false;
      if (activeTab === 'journal' && entry.mood !== selectedSubFilter) return false;
      if (activeTab === 'burn_book') {
        if (selectedSubFilter === 'burned' && !entry.isBurned) return false;
        if (selectedSubFilter === 'active' && entry.isBurned) return false;
      }
      if (activeTab === 'yearly' && entry.targetPeriod !== selectedSubFilter) return false;
      if (activeTab === 'themed' && entry.themeName !== selectedSubFilter) return false;
    }

    return true;
  });

  const currentTabMeta = PLANNER_TABS.find((t) => t.type === activeTab) || PLANNER_TABS[0];

  const handleOpenAdd = () => {
    setEditingEntry(null);
    setIsModalOpen(true);
  };

  const handleOpenEdit = (entry: PlannerEntry) => {
    setEditingEntry(entry);
    setIsModalOpen(true);
  };

  const handleSaveModal = (entry: PlannerEntry) => {
    if (editingEntry) {
      onUpdateEntry(entry);
    } else {
      onAddEntry(entry);
    }
  };

  const handleDeleteWithConfirm = (id: string, title: string) => {
    if (window.confirm(`"${title}" kaydını silmek istediğinize emin misiniz?`)) {
      onDeleteEntry(id);
    }
  };

  const handleBurnBookEntry = (entry: PlannerEntry) => {
    setBurningId(entry.id);
    setTimeout(() => {
      onUpdateEntry({
        ...entry,
        isBurned: true,
        burnedAt: new Date().toISOString(),
      });
      setBurningId(null);
    }, 1200);
  };

  const handleToggleChecklist = (entry: PlannerEntry, index: number) => {
    const currentChecked = entry.checkedChecklist || {};
    const newChecked = {
      ...currentChecked,
      [index]: !currentChecked[index],
    };
    onUpdateEntry({
      ...entry,
      checkedChecklist: newChecked,
    });
  };

  // Stats computation for the active tab
  const getStatsBanner = () => {
    switch (activeTab) {
      case 'school': {
        const total = currentTabEntries.length;
        const exams = currentTabEntries.filter((e) => e.schoolCategory === 'Vize/Final').length;
        const homework = currentTabEntries.filter((e) => e.schoolCategory === 'Ödev/Proje').length;
        return (
          <div className="grid grid-cols-3 gap-2.5">
            <div className="p-3 bg-white rounded-2xl border-2 border-[#E5E3DB] text-center shadow-2xs">
              <span className="text-xs text-[#6C7A89] block font-stardew">Toplam Kayıt</span>
              <span className="text-base sm:text-lg font-bold text-[#1B263B] font-stardew">{total}</span>
            </div>
            <div className="p-3 bg-white rounded-2xl border-2 border-[#E5E3DB] text-center shadow-2xs">
              <span className="text-xs text-[#6C7A89] block font-stardew">Vize &amp; Final</span>
              <span className="text-base sm:text-lg font-bold text-[#E07A5F] font-stardew">{exams}</span>
            </div>
            <div className="p-3 bg-white rounded-2xl border-2 border-[#E5E3DB] text-center shadow-2xs">
              <span className="text-xs text-[#6C7A89] block font-stardew">Ödev &amp; Proje</span>
              <span className="text-base sm:text-lg font-bold text-[#2D6A4F] font-stardew">{homework}</span>
            </div>
          </div>
        );
      }
      case 'reading': {
        const readBooks = currentTabEntries.filter((e) => e.readingStatus === 'Bitti').length;
        const readingNow = currentTabEntries.filter((e) => e.readingStatus === 'Okunuyor').length;
        const totalPages = currentTabEntries.reduce((acc, curr) => acc + (curr.pageCount || 0), 0);
        return (
          <div className="grid grid-cols-3 gap-2.5">
            <div className="p-3 bg-white rounded-2xl border-2 border-[#E5E3DB] text-center shadow-2xs">
              <span className="text-xs text-[#6C7A89] block font-stardew">Biten Kitaplar</span>
              <span className="text-base sm:text-lg font-bold text-[#7C3AED] font-stardew">{readBooks} 📚</span>
            </div>
            <div className="p-3 bg-white rounded-2xl border-2 border-[#E5E3DB] text-center shadow-2xs">
              <span className="text-xs text-[#6C7A89] block font-stardew">Şu An Okunuyor</span>
              <span className="text-base sm:text-lg font-bold text-[#2D6A4F] font-stardew">{readingNow}</span>
            </div>
            <div className="p-3 bg-white rounded-2xl border-2 border-[#E5E3DB] text-center shadow-2xs">
              <span className="text-xs text-[#6C7A89] block font-stardew">Toplam Sayfa</span>
              <span className="text-base sm:text-lg font-bold text-[#1B263B] font-stardew">{totalPages} sf</span>
            </div>
          </div>
        );
      }
      case 'burn_book': {
        const burnedCount = currentTabEntries.filter((e) => e.isBurned).length;
        const activeCount = currentTabEntries.filter((e) => !e.isBurned).length;
        return (
          <div className="p-3.5 bg-white rounded-2xl border-2 border-[#D4A5A5] flex items-center justify-between shadow-2xs">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-[#D4A5A5]/20 flex items-center justify-center text-xl">
                🔥
              </div>
              <div>
                <h4 className="text-xs sm:text-sm font-bold text-[#915050]">Dertlerden Arınma Alanı</h4>
                <p className="text-[11px] text-[#6C7A89]">İçini dök, dilediğin an yak ve geride bırak 𐙚</p>
              </div>
            </div>
            <div className="flex gap-2">
              <span className="px-2.5 py-1 rounded-xl bg-[#915050] text-white text-xs font-bold shadow-2xs">
                {burnedCount} Kül Oldu 🔥
              </span>
              <span className="px-2.5 py-1 rounded-xl bg-[#FAF9F6] text-[#6C7A89] border border-[#E5E3DB] text-xs font-bold">
                {activeCount} Bekliyor
              </span>
            </div>
          </div>
        );
      }
      case 'journal': {
        return (
          <div className="p-3 bg-white rounded-2xl border-2 border-[#E5E3DB] flex items-center justify-between shadow-2xs">
            <div className="flex items-center gap-2.5">
              <span className="text-lg">🌿</span>
              <div>
                <p className="text-xs font-bold text-[#1B263B]">Günün Şükran &amp; Düşünce Notları</p>
                <p className="text-[10px] text-[#6C7A89]">{currentTabEntries.length} Günlük Hatırası Kaydedildi 𐙚</p>
              </div>
            </div>
            <span className="text-xs font-bold text-[#2D6A4F] px-2.5 py-1 rounded-xl bg-[#2D6A4F]/10 border border-[#2D6A4F]/20">
              {profile.name}&apos;nin Günlüğü ⋆
            </span>
          </div>
        );
      }
      case 'travel': {
        const totalTrips = currentTabEntries.length;
        return (
          <div className="p-3 bg-white rounded-2xl border-2 border-[#E5E3DB] flex items-center justify-between shadow-2xs">
            <div className="flex items-center gap-2.5">
              <span className="text-lg">✈️</span>
              <div>
                <p className="text-xs font-bold text-[#1B263B]">Seyahat Rotaları &amp; Bavul Listeleri</p>
                <p className="text-[10px] text-[#6C7A89]">{totalTrips} Planlanan Gezi ᡣ𐭩</p>
              </div>
            </div>
            <span className="text-xs font-bold text-[#16A34A] px-2.5 py-1 rounded-xl bg-[#16A34A]/10 border border-[#16A34A]/20">
              Yeni Maceralar ✧
            </span>
          </div>
        );
      }
      default:
        return null;
    }
  };

  return (
    <div className="space-y-4 font-stardew animate-fadeIn pb-12">
      {/* Top Banner & Header */}
      <div className="p-4 sm:p-5 rounded-3xl bg-white border-2 border-[#E5E3DB] shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-[#FAF9F6] border-2 border-[#E5E3DB] flex items-center justify-center text-2xl shadow-2xs shrink-0">
              {currentTabMeta.icon}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg sm:text-xl font-bold text-[#1B263B] font-stardew">
                  {currentTabMeta.title} 𐙚
                </h2>
                <span className="text-xs px-2 py-0.5 rounded-lg bg-[#FAF9F6] text-[#2D6A4F] font-bold border border-[#E5E3DB]">
                  {currentTabEntries.length} Kayıt
                </span>
              </div>
              <p className="text-xs text-[#6C7A89]">{currentTabMeta.tag} • Stardew Valley Tarzı Düzen ⋆˚࿔</p>
            </div>
          </div>

          {/* New Entry Button */}
          <PuffyStarButton
            id="add-planner-entry-btn"
            variant="orange"
            size="md"
            onClick={handleOpenAdd}
            className="w-full sm:w-auto shadow-md"
          >
            <Plus className="w-4 h-4 mr-1.5 stroke-[3]" />
            <span>Yeni Kayıt Ekle 𐙚</span>
          </PuffyStarButton>
        </div>

        {/* 7 Planners Sub-Navigation Bar */}
        <div className="mt-4 pt-3.5 border-t border-[#E5E3DB] overflow-x-auto scrollbar-none">
          <div className="flex items-center gap-2 min-w-max pb-1">
            {PLANNER_TABS.map((tab) => {
              const isActive = activeTab === tab.type;
              const count = entries.filter((e) => e.type === tab.type).length;
              return (
                <button
                  key={tab.type}
                  id={`planner-tab-${tab.type}`}
                  onClick={() => {
                    setActiveTab(tab.type);
                    setSelectedSubFilter('all');
                  }}
                  className={`flex items-center gap-2 px-3 py-2 rounded-2xl text-xs font-bold transition-all cursor-pointer border-2 ${
                    isActive
                      ? 'bg-[#1B263B] text-white border-[#0F172A] shadow-xs scale-102'
                      : 'bg-[#FAF9F6] text-[#6C7A89] border-[#E5E3DB] hover:bg-white hover:text-[#1B263B]'
                  }`}
                >
                  <span className="text-sm">{tab.icon}</span>
                  <span>{tab.shortTitle}</span>
                  <span
                    className={`text-[10px] px-1.5 py-0.2 rounded-md ${
                      isActive ? 'bg-white/20 text-white' : 'bg-white text-[#A0AEC0] border border-[#E5E3DB]'
                    }`}
                  >
                    {count}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Stats Banner according to current planner */}
      {getStatsBanner()}

      {/* Search & Sub-Filter Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-2.5">
        <div className="relative w-full sm:w-72">
          <Search className="w-4 h-4 text-[#A0AEC0] absolute left-3 top-3" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={`${currentTabMeta.shortTitle} içinde ara...`}
            className="w-full bg-white border-2 border-[#E5E3DB] rounded-2xl pl-9 pr-3 py-2 text-xs text-[#1B263B] focus:outline-hidden focus:ring-2 focus:ring-[#F4C542] shadow-2xs font-stardew"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-3 top-2.5 text-xs text-[#A0AEC0] hover:text-[#1B263B]"
            >
              ✕
            </button>
          )}
        </div>

        {/* Dynamic Category Filter Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto scrollbar-none pb-1">
          <button
            onClick={() => setSelectedSubFilter('all')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold border transition-all cursor-pointer ${
              selectedSubFilter === 'all'
                ? 'bg-[#2D6A4F] text-white border-[#2D6A4F]'
                : 'bg-white text-[#6C7A89] border-[#E5E3DB] hover:bg-[#FAF9F6]'
            }`}
          >
            Tümü ({currentTabEntries.length})
          </button>

          {activeTab === 'school' && (
            <>
              {['Vize/Final', 'Ödev/Proje', 'Ders Notu', 'Sınav Hazırlığı'].map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedSubFilter(cat)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold border transition-all cursor-pointer whitespace-nowrap ${
                    selectedSubFilter === cat
                      ? 'bg-[#2D6A4F] text-white border-[#2D6A4F]'
                      : 'bg-white text-[#6C7A89] border-[#E5E3DB] hover:bg-[#FAF9F6]'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </>
          )}

          {activeTab === 'reading' && (
            <>
              {['Okunuyor', 'Bitti', 'İstek Listesi'].map((st) => (
                <button
                  key={st}
                  onClick={() => setSelectedSubFilter(st)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold border transition-all cursor-pointer whitespace-nowrap ${
                    selectedSubFilter === st
                      ? 'bg-[#7C3AED] text-white border-[#7C3AED]'
                      : 'bg-white text-[#6C7A89] border-[#E5E3DB] hover:bg-[#FAF9F6]'
                  }`}
                >
                  {st}
                </button>
              ))}
            </>
          )}

          {activeTab === 'burn_book' && (
            <>
              <button
                onClick={() => setSelectedSubFilter('active')}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold border transition-all cursor-pointer ${
                  selectedSubFilter === 'active'
                    ? 'bg-[#D4A5A5] text-white border-[#D4A5A5]'
                    : 'bg-white text-[#6C7A89] border-[#E5E3DB] hover:bg-[#FAF9F6]'
                }`}
              >
                Bekleyenler
              </button>
              <button
                onClick={() => setSelectedSubFilter('burned')}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold border transition-all cursor-pointer ${
                  selectedSubFilter === 'burned'
                    ? 'bg-[#915050] text-white border-[#915050]'
                    : 'bg-white text-[#6C7A89] border-[#E5E3DB] hover:bg-[#FAF9F6]'
                }`}
              >
                Kül Olanlar 🔥
              </button>
            </>
          )}
        </div>
      </div>

      {/* Main Entries Grid */}
      {filteredEntries.length === 0 ? (
        <div className="p-8 sm:p-12 text-center bg-white rounded-3xl border-2 border-dashed border-[#E5E3DB]">
          <div className="w-16 h-16 rounded-3xl bg-[#FAF9F6] border-2 border-[#E5E3DB] flex items-center justify-center text-3xl mx-auto mb-3">
            {currentTabMeta.icon}
          </div>
          <h3 className="text-sm sm:text-base font-bold text-[#1B263B] mb-1">
            Henüz bu kategoride kayıt bulunmuyor ⋆˚࿔
          </h3>
          <p className="text-xs text-[#6C7A89] max-w-sm mx-auto mb-4">
            {currentTabMeta.title} için ilk notunu, hedefini veya planını hemen oluşturabilirsin.
          </p>
          <PuffyStarButton
            variant="green"
            size="md"
            onClick={handleOpenAdd}
          >
            <Plus className="w-4 h-4 mr-1.5 stroke-[3]" />
            <span>İlk Kaydı Oluştur 𐙚</span>
          </PuffyStarButton>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
          {filteredEntries.map((entry) => {
            const isBurning = burningId === entry.id;

            return (
              <div
                key={entry.id}
                className={`p-4 sm:p-5 rounded-3xl border-2 transition-all shadow-2xs relative flex flex-col justify-between overflow-hidden ${
                  entry.isBurned
                    ? 'bg-[#FAF9F6] border-[#D4A5A5]/60 opacity-80'
                    : 'bg-white border-[#E5E3DB] hover:border-[#F4C542]'
                } ${isBurning ? 'animate-pulse scale-98 ring-4 ring-[#E07A5F]' : ''}`}
              >
                {/* Burn Effect Banner for Burn Book */}
                {entry.isBurned && (
                  <div className="absolute top-0 right-0 bg-[#915050] text-white text-[9px] font-bold px-3 py-0.5 rounded-bl-xl shadow-xs flex items-center gap-1">
                    <span>🔥 Kül Oldu</span>
                  </div>
                )}

                <div>
                  {/* Top Metadata Header */}
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <div className="flex flex-wrap items-center gap-1.5">
                      {/* Category / Specific Badges */}
                      {entry.schoolCategory && (
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-lg bg-[#FAF9F6] text-[#2D6A4F] border border-[#E5E3DB]">
                          {entry.schoolCategory}
                        </span>
                      )}
                      {entry.courseName && (
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-lg bg-[#1B263B] text-white">
                          {entry.courseName}
                        </span>
                      )}
                      {entry.readingStatus && (
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-lg bg-[#7C3AED]/10 text-[#7C3AED] border border-[#7C3AED]/20">
                          {entry.readingStatus === 'Bitti' ? '✅ Bitti' : entry.readingStatus === 'Okunuyor' ? '📖 Okunuyor' : '🏷️ İstek Listesi'}
                        </span>
                      )}
                      {entry.mood && (
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-lg bg-[#E07A5F]/10 text-[#E07A5F] border border-[#E07A5F]/20">
                          {entry.mood} 𐙚
                        </span>
                      )}
                      {entry.themeName && (
                        <span
                          className="text-[10px] font-bold px-2 py-0.5 rounded-lg text-white"
                          style={{ backgroundColor: entry.themeColor || '#2D6A4F' }}
                        >
                          {entry.themeName}
                        </span>
                      )}
                      {entry.priority && (
                        <span
                          className={`text-[10px] font-bold px-2 py-0.5 rounded-lg ${
                            entry.priority === 'Yüksek'
                              ? 'bg-red-50 text-red-700 border border-red-200'
                              : 'bg-[#FAF9F6] text-[#6C7A89] border border-[#E5E3DB]'
                          }`}
                        >
                          {entry.priority} Öncelik
                        </span>
                      )}
                    </div>

                    <div className="flex items-center gap-1 text-[11px] text-[#A0AEC0] shrink-0">
                      <Calendar className="w-3.5 h-3.5" />
                      <span>{entry.date}</span>
                    </div>
                  </div>

                  {/* Title */}
                  <h3 className={`text-sm sm:text-base font-bold mb-1.5 font-stardew ${entry.isBurned ? 'line-through text-[#6C7A89]' : 'text-[#1B263B]'}`}>
                    {entry.title}
                  </h3>

                  {/* Rating for Reading */}
                  {entry.rating && (
                    <div className="flex items-center gap-1 mb-2">
                      {[1, 2, 3, 4, 5].map((s) => (
                        <Star
                          key={s}
                          className={`w-3.5 h-3.5 ${
                            s <= entry.rating! ? 'fill-[#F4C542] text-[#F4C542]' : 'text-[#E5E3DB]'
                          }`}
                        />
                      ))}
                      {entry.pageCount && (
                        <span className="text-[10px] text-[#6C7A89] ml-1 font-bold">
                          • {entry.pageCount} Sayfa
                        </span>
                      )}
                    </div>
                  )}

                  {/* Quote for Reading */}
                  {entry.favoriteQuote && (
                    <div className="p-2.5 rounded-xl bg-[#FAF9F6] border border-[#E5E3DB] text-xs italic text-[#6C7A89] mb-2 flex items-start gap-2">
                      <Quote className="w-3.5 h-3.5 text-[#A0AEC0] shrink-0 mt-0.5" />
                      <span>{entry.favoriteQuote}</span>
                    </div>
                  )}

                  {/* Highlight & Gratitude for Journal */}
                  {(entry.gratitude || entry.dailyHighlight) && (
                    <div className="space-y-1 mb-2 text-xs">
                      {entry.gratitude && (
                        <p className="text-[#2D6A4F] bg-[#2D6A4F]/5 p-2 rounded-xl border border-[#2D6A4F]/10">
                          <span className="font-bold">Teşekkür:</span> {entry.gratitude}
                        </p>
                      )}
                      {entry.dailyHighlight && (
                        <p className="text-[#E07A5F] bg-[#E07A5F]/5 p-2 rounded-xl border border-[#E07A5F]/10">
                          <span className="font-bold">Günün Yıldızı:</span> {entry.dailyHighlight}
                        </p>
                      )}
                    </div>
                  )}

                  {/* Travel Destination & Checklist */}
                  {entry.destination && (
                    <div className="mb-2">
                      <div className="flex items-center justify-between text-xs text-[#16A34A] font-bold mb-1">
                        <span>📍 {entry.destination}</span>
                        {entry.travelBudget && <span>💰 {entry.travelBudget}</span>}
                      </div>
                      {entry.travelDates && (
                        <p className="text-[11px] text-[#6C7A89] mb-1.5">📅 {entry.travelDates}</p>
                      )}
                      {entry.checklist && entry.checklist.length > 0 && (
                        <div className="p-2.5 bg-[#FAF9F6] rounded-xl border border-[#E5E3DB] space-y-1 mt-1">
                          <p className="text-[10px] font-bold text-[#6C7A89] uppercase tracking-wider">
                            Bavul Listesi ({Object.values(entry.checkedChecklist || {}).filter(Boolean).length}/{entry.checklist.length})
                          </p>
                          {entry.checklist.map((item, idx) => {
                            const isChecked = !!entry.checkedChecklist?.[idx];
                            return (
                              <button
                                key={idx}
                                type="button"
                                onClick={() => handleToggleChecklist(entry, idx)}
                                className="w-full flex items-center gap-2 text-xs text-left cursor-pointer hover:text-[#1B263B]"
                              >
                                {isChecked ? (
                                  <CheckCircle2 className="w-3.5 h-3.5 text-[#2D6A4F] shrink-0" />
                                ) : (
                                  <Circle className="w-3.5 h-3.5 text-[#A0AEC0] shrink-0" />
                                )}
                                <span className={isChecked ? 'line-through text-[#A0AEC0]' : 'text-[#1B263B]'}>
                                  {item}
                                </span>
                              </button>
                            );
                          })}
                        </div>
                      )}
                    </div>
                  )}

                  {/* Yearly Milestone */}
                  {entry.milestone && (
                    <div className="p-2 rounded-xl bg-[#2D6A4F]/10 border border-[#2D6A4F]/20 text-xs font-bold text-[#2D6A4F] mb-2 flex items-center gap-1.5">
                      <Award className="w-3.5 h-3.5 shrink-0" />
                      <span>{entry.targetPeriod}: {entry.milestone}</span>
                    </div>
                  )}

                  {/* Content / Notes text */}
                  {entry.content && (
                    <p className="text-xs text-[#6C7A89] leading-relaxed line-clamp-4 whitespace-pre-line mb-3">
                      {entry.content}
                    </p>
                  )}
                </div>

                {/* Footer Action Buttons */}
                <div className="pt-2 border-t border-[#E5E3DB]/80 flex items-center justify-between gap-2 mt-2">
                  <div className="flex items-center gap-2">
                    {/* Burn button for Burn Book if not burned yet */}
                    {activeTab === 'burn_book' && !entry.isBurned && (
                      <button
                        type="button"
                        onClick={() => handleBurnBookEntry(entry)}
                        disabled={isBurning}
                        className="px-2.5 py-1 rounded-xl bg-[#E07A5F] hover:bg-[#c96248] text-white text-[11px] font-bold shadow-2xs flex items-center gap-1 cursor-pointer transition-all active:scale-95"
                      >
                        <Flame className="w-3.5 h-3.5" />
                        <span>{isBurning ? 'Yakılıyor...' : 'Bu Notu Yak 🔥'}</span>
                      </button>
                    )}
                  </div>

                  <div className="flex items-center gap-1">
                    <button
                      type="button"
                      onClick={() => handleOpenEdit(entry)}
                      className="p-1.5 rounded-xl hover:bg-[#FAF9F6] text-[#6C7A89] hover:text-[#1B263B] transition-colors cursor-pointer"
                      title="Düzenle"
                    >
                      <Edit3 className="w-3.5 h-3.5" />
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDeleteWithConfirm(entry.id, entry.title)}
                      className="p-1.5 rounded-xl hover:bg-red-50 text-[#6C7A89] hover:text-[#915050] transition-colors cursor-pointer"
                      title="Sil"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Create / Edit Entry Modal */}
      <PlannerEntryModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setEditingEntry(null);
        }}
        onSaveEntry={handleSaveModal}
        initialType={activeTab}
        editingEntry={editingEntry}
      />
    </div>
  );
}
