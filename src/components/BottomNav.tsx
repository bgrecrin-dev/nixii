import { Sparkles, Bookmark, Plus, Menu, LayoutGrid, CheckSquare, BookMarked, Calendar } from 'lucide-react';
import { PinCategory } from '../types';
import PuffyStarButton from './PuffyStarButton';

interface BottomNavProps {
  activeTab: 'pins' | 'tasks' | 'agenda';
  onSelectTab: (tab: 'pins' | 'tasks' | 'agenda') => void;
  activeCategory: PinCategory;
  onSelectCategory: (cat: PinCategory) => void;
  onOpenNewAction: () => void;
  onOpenMenu: () => void;
  showingSavedOnly: boolean;
  onToggleSavedOnly: () => void;
  pendingTasksCount?: number;
  totalPlannerCount?: number;
}

export default function BottomNav({
  activeTab,
  onSelectTab,
  activeCategory,
  onSelectCategory,
  onOpenNewAction,
  onOpenMenu,
  showingSavedOnly,
  onToggleSavedOnly,
  pendingTasksCount = 0,
  totalPlannerCount = 0,
}: BottomNavProps) {
  return (
    <nav className="fixed bottom-0 inset-x-0 bg-white/95 backdrop-blur-md border-t-2 border-[#E5E3DB] py-2 px-4 sm:px-6 flex items-center justify-around z-40 max-w-lg mx-auto sm:rounded-t-2xl shadow-xl font-stardew">
      {/* Board Home */}
      <button
        id="nav-home-btn"
        onClick={() => {
          if (showingSavedOnly) onToggleSavedOnly();
          onSelectTab('pins');
          onSelectCategory('all');
        }}
        className={`flex flex-col items-center gap-0.5 transition-all transform active:scale-90 cursor-pointer ${
          activeTab === 'pins' && !showingSavedOnly && activeCategory === 'all'
            ? 'text-[#1B263B] font-bold scale-105'
            : 'text-[#6C7A89] hover:text-[#1B263B]'
        }`}
      >
        <LayoutGrid className="w-5 h-5" />
        <span className="text-[10px] font-stardew font-bold">Panolar</span>
      </button>

      {/* Task System Tab with pending badge */}
      <button
        id="nav-tasks-btn"
        onClick={() => {
          if (showingSavedOnly) onToggleSavedOnly();
          onSelectTab('tasks');
        }}
        className={`flex flex-col items-center gap-0.5 transition-all transform active:scale-90 cursor-pointer relative ${
          activeTab === 'tasks'
            ? 'text-[#2D6A4F] font-bold scale-105'
            : 'text-[#6C7A89] hover:text-[#2D6A4F]'
        }`}
      >
        <div className="relative">
          <CheckSquare className="w-5 h-5" />
          {pendingTasksCount > 0 && (
            <span className="absolute -top-1.5 -right-2.5 w-4 h-4 rounded-full bg-[#E07A5F] text-white text-[9px] font-bold flex items-center justify-center border border-white">
              {pendingTasksCount}
            </span>
          )}
        </div>
        <span className="text-[10px] font-stardew font-bold">Görevler</span>
      </button>

      {/* Center + Action Button as Puffy 3D Star */}
      <div className="-mt-7">
        <PuffyStarButton
          id="nav-add-pin-btn"
          isStarShape={true}
          variant="orange"
          size="lg"
          onClick={onOpenNewAction}
          aria-label="Yeni ekle"
          title={
            activeTab === 'agenda'
              ? 'Yeni Ajanda Kaydı Ekle'
              : activeTab === 'tasks'
              ? 'Yeni Görev Ekle'
              : 'Yeni Pin Ekle'
          }
          className="shadow-lg animate-star-pulse"
        >
          <Plus className="w-6 h-6 stroke-[3] text-white" />
        </PuffyStarButton>
      </div>

      {/* Agenda (Ajanda) Tab */}
      <button
        id="nav-agenda-btn"
        onClick={() => {
          if (showingSavedOnly) onToggleSavedOnly();
          onSelectTab('agenda');
        }}
        className={`flex flex-col items-center gap-0.5 transition-all transform active:scale-90 cursor-pointer relative ${
          activeTab === 'agenda'
            ? 'text-[#E07A5F] font-bold scale-105'
            : 'text-[#6C7A89] hover:text-[#E07A5F]'
        }`}
      >
        <BookMarked className="w-5 h-5" />
        <span className="text-[10px] font-stardew font-bold">Ajanda</span>
      </button>

      {/* Menu / Drawer */}
      <button
        id="nav-menu-btn"
        onClick={onOpenMenu}
        className="flex flex-col items-center gap-0.5 text-[#6C7A89] hover:text-[#1B263B] transition-all transform active:scale-90 cursor-pointer"
      >
        <Menu className="w-5 h-5" />
        <span className="text-[10px] font-stardew font-bold">Menü</span>
      </button>
    </nav>
  );
}
