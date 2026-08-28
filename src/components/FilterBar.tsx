import { Search, Sparkles, BookOpen, Calendar, Coffee, FileText, Clock, Plus, LayoutGrid, Columns } from 'lucide-react';
import { PinCategory } from '../types';
import PuffyStarButton from './PuffyStarButton';

interface FilterBarProps {
  activeCategory: PinCategory;
  onSelectCategory: (category: PinCategory) => void;
  searchQuery: string;
  onSearchChange: (query: string) => void;
  onOpenNewPin: () => void;
  viewMode: 'masonry' | 'compact';
  onToggleViewMode: () => void;
  totalPinsCount: number;
}

const categories: { id: PinCategory; label: string; icon: any; charm: string }[] = [
  { id: 'all', label: 'Tüm Pinler', icon: Sparkles, charm: '★' },
  { id: 'study', label: 'Ders Panoları', icon: BookOpen, charm: '𐙚' },
  { id: 'deadlines', label: 'Teslimler', icon: Calendar, charm: '⚡' },
  { id: 'inspo', label: 'Estetik İlham', icon: Coffee, charm: 'ᡣ𐭩' },
  { id: 'notes', label: 'Bilgi Kartları', icon: FileText, charm: '౨ৎ' },
  { id: 'schedule', label: 'Program & Mekanlar', icon: Clock, charm: '🎐' },
];

export default function FilterBar({
  activeCategory,
  onSelectCategory,
  searchQuery,
  onSearchChange,
  onOpenNewPin,
  viewMode,
  onToggleViewMode,
  totalPinsCount,
}: FilterBarProps) {
  return (
    <div className="w-full px-4 sm:px-6 pt-3 pb-2 space-y-2.5 font-stardew">
      {/* Search Input & Puffy Star Actions */}
      <div className="flex items-center gap-2">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-[#6C7A89] absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            id="search-pins-input"
            type="text"
            placeholder="Notlarda, derslerde, teslimlerde ara... ⋆˚࿔"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className="w-full bg-white text-xs font-stardew text-[#1B263B] pl-9 pr-8 py-2 rounded-2xl border-2 border-[#E5E3DB] placeholder:text-[#9AA5B5] focus:outline-hidden focus:ring-2 focus:ring-[#F4C542] focus:border-[#E07A5F] transition-all shadow-xs"
          />
          {searchQuery && (
            <button
              onClick={() => onSearchChange('')}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-xs text-[#6C7A89] hover:text-[#1B263B] w-5 h-5 rounded-full bg-[#FAF9F6] flex items-center justify-center font-bold"
            >
              ×
            </button>
          )}
        </div>

        {/* View Toggle as Puffy Star Button */}
        <PuffyStarButton
          id="toggle-layout-mode-btn"
          isStarShape={true}
          variant="white"
          size="icon-sm"
          onClick={onToggleViewMode}
          title={viewMode === 'masonry' ? 'Kompakt Izgara Görünümüne Geç' : 'Pinterest Düzenine Geç'}
          aria-label="Düzen görünümünü değiştir"
        >
          {viewMode === 'masonry' ? (
            <LayoutGrid className="w-3.5 h-3.5 text-[#1B263B]" />
          ) : (
            <Columns className="w-3.5 h-3.5 text-[#1B263B]" />
          )}
        </PuffyStarButton>

        {/* Puffy Star Create Pin Button */}
        <PuffyStarButton
          id="create-pin-top-btn"
          variant="orange"
          size="sm"
          onClick={onOpenNewPin}
          className="shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span className="hidden sm:inline">Not Ekle</span>
          <span className="sm:hidden">Ekle</span>
        </PuffyStarButton>
      </div>

      {/* Pinterest-style Horizontal Scrollable Filter Pills */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 pt-0.5 no-scrollbar">
        {categories.map((cat) => {
          const Icon = cat.icon;
          const isActive = activeCategory === cat.id;

          let activeStyle = 'bg-[#1B263B] text-white border-[#1B263B] shadow-[0_3px_0_#0D1420]';
          if (cat.id === 'study') activeStyle = 'bg-[#2D6A4F] text-white border-[#2D6A4F] shadow-[0_3px_0_#1A3D2D]';
          if (cat.id === 'inspo') activeStyle = 'bg-[#D4A5A5] text-[#4A2020] border-[#C28C8C] shadow-[0_3px_0_#A86E6E]';
          if (cat.id === 'notes') activeStyle = 'bg-[#E07A5F] text-white border-[#C8664C] shadow-[0_3px_0_#A44930]';
          if (cat.id === 'schedule') activeStyle = 'bg-[#2D6A4F] text-white border-[#2D6A4F] shadow-[0_3px_0_#1A3D2D]';

          return (
            <button
              key={cat.id}
              id={`filter-tab-${cat.id}`}
              onClick={() => onSelectCategory(cat.id)}
              className={`shrink-0 flex items-center gap-1.5 px-3 py-1.5 rounded-2xl text-xs font-bold font-stardew border-2 transition-all cursor-pointer transform hover:-translate-y-0.5 active:translate-y-0.5 ${
                isActive
                  ? activeStyle
                  : 'bg-white text-[#566573] border-[#E5E3DB] hover:bg-[#FAF9F6] shadow-2xs'
              }`}
            >
              <span className="text-[11px]">{cat.charm}</span>
              <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-white' : 'text-[#6C7A89]'}`} />
              <span>{cat.label}</span>
            </button>
          );
        })}
      </div>

      {/* Result Indicator Header */}
      <div className="flex items-center justify-between text-[11px] text-[#6C7A89] pt-1 px-1 font-stardew">
        <span>
          Gösterilen: <strong className="text-[#1B263B]">{totalPinsCount}</strong> öğrenci pini ⋆˚࿔
        </span>
        <span className="flex items-center gap-1 font-bold text-[#2D6A4F]">
          <span>★</span>
          Görsel Çalışma Panosu
        </span>
      </div>
    </div>
  );
}

