import { useState, useMemo, useEffect } from 'react';
import { initialProfile, initialPins, initialTasks, initialPlannerEntries } from './data/initialData';
import { StudentProfile, PinItem, PinCategory, FocusStatus, TaskItem, PlannerEntry, PlannerType } from './types';
import {
  loadProfile,
  saveProfile,
  loadPins,
  savePins,
  loadTasks,
  saveTasks,
  loadPlannerEntries,
  savePlannerEntries,
  loadViewMode,
  saveViewMode,
  hasCompletedOnboarding,
  setOnboardingCompleted,
  resetAllData,
} from './utils/storage';
import HeaderProfile from './components/HeaderProfile';
import AestheticSymbolRibbon from './components/AestheticSymbolRibbon';
import MenuDrawer from './components/MenuDrawer';
import FilterBar from './components/FilterBar';
import PinCardComponent from './components/PinCardComponent';
import PinDetailModal from './components/PinDetailModal';
import NewPinModal from './components/NewPinModal';
import EditProfileModal from './components/EditProfileModal';
import OnboardingModal from './components/OnboardingModal';
import TaskManager from './components/TaskManager';
import NewTaskModal from './components/NewTaskModal';
import PlannerView from './components/PlannerView';
import PlannerEntryModal from './components/PlannerEntryModal';
import BottomNav from './components/BottomNav';
import { Bookmark, Inbox, Sparkles, CheckSquare, LayoutGrid, BookMarked, Calendar } from 'lucide-react';
import PuffyStarButton from './components/PuffyStarButton';

export default function App() {
  // Persistent States
  const [profile, setProfile] = useState<StudentProfile>(() => loadProfile());
  const [pins, setPins] = useState<PinItem[]>(() => loadPins());
  const [tasks, setTasks] = useState<TaskItem[]>(() => loadTasks());
  const [plannerEntries, setPlannerEntries] = useState<PlannerEntry[]>(() => loadPlannerEntries());
  const [viewMode, setViewMode] = useState<'masonry' | 'compact'>(() => loadViewMode());

  // Onboarding state: open if user has not completed onboarding yet
  const [isOnboardingOpen, setIsOnboardingOpen] = useState<boolean>(() => !hasCompletedOnboarding());

  // Primary active home view tab: 'pins' | 'tasks' | 'agenda'
  const [activeTab, setActiveTab] = useState<'pins' | 'tasks' | 'agenda'>('pins');
  const [activePlannerType, setActivePlannerType] = useState<PlannerType>('school');

  // Ephemeral UI states
  const [activeCategory, setActiveCategory] = useState<PinCategory>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [showingSavedOnly, setShowingSavedOnly] = useState(false);

  // Modals
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isNewPinOpen, setIsNewPinOpen] = useState(false);
  const [isNewTaskOpen, setIsNewTaskOpen] = useState(false);
  const [isNewPlannerOpen, setIsNewPlannerOpen] = useState(false);
  const [isEditProfileOpen, setIsEditProfileOpen] = useState(false);
  const [selectedPin, setSelectedPin] = useState<PinItem | null>(null);

  // Synchronize profile changes to localStorage
  useEffect(() => {
    saveProfile(profile);
  }, [profile]);

  // Synchronize pins changes to localStorage
  useEffect(() => {
    savePins(pins);
  }, [pins]);

  // Synchronize tasks changes to localStorage
  useEffect(() => {
    saveTasks(tasks);
  }, [tasks]);

  // Synchronize planner entries to localStorage
  useEffect(() => {
    savePlannerEntries(plannerEntries);
  }, [plannerEntries]);

  // Synchronize viewMode changes to localStorage
  useEffect(() => {
    saveViewMode(viewMode);
  }, [viewMode]);

  // Filtered Pins computation
  const filteredPins = useMemo(() => {
    return pins.filter((pin) => {
      // Saved filter
      if (showingSavedOnly && !pin.isSaved) return false;

      // Category filter
      if (activeCategory !== 'all' && pin.category !== activeCategory) {
        return false;
      }

      // Search filter
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase();
        const matchesTitle = pin.title.toLowerCase().includes(query);
        const matchesDesc = pin.description.toLowerCase().includes(query);
        const matchesTag = pin.tag.toLowerCase().includes(query);
        const matchesItems = pin.items?.some((it) => it.toLowerCase().includes(query));
        return matchesTitle || matchesDesc || matchesTag || matchesItems;
      }

      return true;
    });
  }, [pins, activeCategory, searchQuery, showingSavedOnly]);

  // Task Stats
  const pendingTasksCount = useMemo(() => {
    return tasks.filter((t) => !t.completed).length;
  }, [tasks]);

  // Handlers - Tasks
  const handleToggleTask = (taskId: string) => {
    setTasks((prev) =>
      prev.map((t) => {
        if (t.id === taskId) {
          const willBeCompleted = !t.completed;
          const pointsDelta = willBeCompleted ? 20 : -20;

          // Award or remove points
          setProfile((prof) => ({
            ...prof,
            points: Math.max(0, (prof.points || 0) + pointsDelta),
          }));

          return {
            ...t,
            completed: willBeCompleted,
            completedAt: willBeCompleted ? new Date().toISOString() : undefined,
            pointsEarned: 20,
          };
        }
        return t;
      })
    );
  };

  const handleAddTask = (newTask: TaskItem) => {
    setTasks((prev) => [newTask, ...prev]);
  };

  const handleDeleteTask = (taskId: string) => {
    setTasks((prev) => prev.filter((t) => t.id !== taskId));
  };

  // Handlers - Planner
  const handleAddPlannerEntry = (entry: PlannerEntry) => {
    setPlannerEntries((prev) => [entry, ...prev]);
    // Award small theme activity bonus points
    setProfile((prof) => ({
      ...prof,
      points: (prof.points || 0) + 15,
    }));
  };

  const handleUpdatePlannerEntry = (updatedEntry: PlannerEntry) => {
    setPlannerEntries((prev) =>
      prev.map((e) => (e.id === updatedEntry.id ? updatedEntry : e))
    );
  };

  const handleDeletePlannerEntry = (entryId: string) => {
    setPlannerEntries((prev) => prev.filter((e) => e.id !== entryId));
  };

  // Handlers - Pins
  const handleToggleSave = (id: string) => {
    setPins((prev) =>
      prev.map((pin) => {
        if (pin.id === id) {
          const updatedSave = !pin.isSaved;
          return { ...pin, isSaved: updatedSave };
        }
        return pin;
      })
    );

    if (selectedPin && selectedPin.id === id) {
      setSelectedPin((prev) => (prev ? { ...prev, isSaved: !prev.isSaved } : null));
    }
  };

  const handleAddPin = (newPin: PinItem) => {
    setPins((prev) => [newPin, ...prev]);
    setProfile((prev) => ({
      ...prev,
      stats: {
        ...prev.stats,
        pins: prev.stats.pins + 1,
      },
    }));
  };

  const handleSaveProfile = (updated: Partial<StudentProfile>) => {
    setProfile((prev) => ({ ...prev, ...updated }));
  };

  const handleFocusStatusChange = (status: FocusStatus) => {
    setProfile((prev) => ({ ...prev, focusStatus: status }));
  };

  const handleCompleteOnboarding = (updatedProfile: StudentProfile) => {
    setProfile(updatedProfile);
    saveProfile(updatedProfile);
    setOnboardingCompleted(true);
    setIsOnboardingOpen(false);
  };

  const handleResetData = () => {
    const { profile: defProfile, pins: defPins, tasks: defTasks, plannerEntries: defPlanner } = resetAllData();
    setProfile(defProfile);
    setPins(defPins);
    setTasks(defTasks);
    setPlannerEntries(defPlanner);
    setViewMode('masonry');
    setIsOnboardingOpen(true);
  };

  const handleCenterAction = () => {
    if (activeTab === 'agenda') {
      setIsNewPlannerOpen(true);
    } else if (activeTab === 'tasks') {
      setIsNewTaskOpen(true);
    } else {
      setIsNewPinOpen(true);
    }
  };

  return (
    <div className="min-h-screen bg-[#FAF9F6] text-[#1B263B] flex flex-col items-center font-stardew">
      {/* Mobile-first centered shell with subtle container limit for clean reading on all screens */}
      <div className="w-full max-w-xl md:max-w-2xl lg:max-w-3xl min-h-screen bg-[#FAF9F6] flex flex-col pb-24 relative shadow-xs">
        
        {/* Horizontal Profile Area at the Top with Hamburger Menu & Level Progress */}
        <HeaderProfile
          profile={profile}
          onOpenMenu={() => setIsMenuOpen(true)}
          onEditProfile={() => setIsEditProfileOpen(true)}
          onFocusStatusChange={handleFocusStatusChange}
        />

        {/* Aesthetic Stardew Valley Symbol & Kaomoji Ribbon */}
        <AestheticSymbolRibbon />

        {/* 3-Way Primary View Switcher: Panolar vs Görevler vs Ajanda */}
        <div className="px-3 sm:px-6 mt-3 mb-2 flex items-center justify-between gap-2 overflow-x-auto no-scrollbar">
          <div className="bg-[#E5E3DB]/60 p-1 rounded-2xl flex items-center gap-1 border border-[#E5E3DB] shrink-0">
            {/* 1. Panolar */}
            <button
              type="button"
              id="view-tab-pins"
              onClick={() => setActiveTab('pins')}
              className={`px-2.5 sm:px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                activeTab === 'pins'
                  ? 'bg-white text-[#1B263B] shadow-xs'
                  : 'text-[#6C7A89] hover:text-[#1B263B]'
              }`}
            >
              <LayoutGrid className="w-3.5 h-3.5" />
              <span>Panolar</span>
            </button>

            {/* 2. Görevler */}
            <button
              type="button"
              id="view-tab-tasks"
              onClick={() => setActiveTab('tasks')}
              className={`px-2.5 sm:px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                activeTab === 'tasks'
                  ? 'bg-[#2D6A4F] text-white shadow-xs'
                  : 'text-[#6C7A89] hover:text-[#1B263B]'
              }`}
            >
              <CheckSquare className="w-3.5 h-3.5" />
              <span>Görevler</span>
              {pendingTasksCount > 0 && (
                <span className={`text-[10px] px-1.5 py-0.2 rounded-full font-bold ${
                  activeTab === 'tasks' ? 'bg-white text-[#2D6A4F]' : 'bg-[#E07A5F] text-white'
                }`}>
                  {pendingTasksCount}
                </span>
              )}
            </button>

            {/* 3. Ajanda */}
            <button
              type="button"
              id="view-tab-agenda"
              onClick={() => setActiveTab('agenda')}
              className={`px-2.5 sm:px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                activeTab === 'agenda'
                  ? 'bg-[#E07A5F] text-white shadow-xs'
                  : 'text-[#6C7A89] hover:text-[#1B263B]'
              }`}
            >
              <BookMarked className="w-3.5 h-3.5" />
              <span>Ajanda</span>
              <span className={`text-[10px] px-1.5 py-0.2 rounded-full font-bold ${
                activeTab === 'agenda' ? 'bg-white text-[#E07A5F]' : 'bg-[#D4A5A5] text-[#4A3B32]'
              }`}>
                {plannerEntries.length}
              </span>
            </button>
          </div>

          {/* Quick Action Button based on active view */}
          <div className="shrink-0">
            {activeTab === 'agenda' ? (
              <PuffyStarButton
                variant="orange"
                size="sm"
                onClick={() => setIsNewPlannerOpen(true)}
                className="text-xs py-1.5! px-3!"
              >
                + Ajanda Kaydı 𐙚
              </PuffyStarButton>
            ) : activeTab === 'tasks' ? (
              <PuffyStarButton
                variant="green"
                size="sm"
                onClick={() => setIsNewTaskOpen(true)}
                className="text-xs py-1.5! px-3!"
              >
                + Görev Ekle 𐙚
              </PuffyStarButton>
            ) : (
              <PuffyStarButton
                variant="orange"
                size="sm"
                onClick={() => setIsNewPinOpen(true)}
                className="text-xs py-1.5! px-3!"
              >
                + Pin Ekle 𐙚
              </PuffyStarButton>
            )}
          </div>
        </div>

        {/* Dynamic Main View Content: Agenda, Tasks, or Pins Feed */}
        {activeTab === 'agenda' ? (
          <div className="flex-1 pt-1">
            <PlannerView
              entries={plannerEntries}
              onAddEntry={handleAddPlannerEntry}
              onUpdateEntry={handleUpdatePlannerEntry}
              onDeleteEntry={handleDeletePlannerEntry}
              initialPlannerType={activePlannerType}
              profile={profile}
            />
          </div>
        ) : activeTab === 'tasks' ? (
          <div className="flex-1 pt-1">
            <TaskManager
              tasks={tasks}
              userPoints={profile.points || 0}
              userTheme={profile.favoriteTheme || 'orange'}
              onToggleTask={handleToggleTask}
              onDeleteTask={handleDeleteTask}
              onOpenNewTaskModal={() => setIsNewTaskOpen(true)}
            />
          </div>
        ) : (
          <>
            {/* Filter bar & Quick Pin Search */}
            <FilterBar
              activeCategory={activeCategory}
              onSelectCategory={(cat) => {
                setShowingSavedOnly(false);
                setActiveCategory(cat);
              }}
              searchQuery={searchQuery}
              onSearchChange={setSearchQuery}
              onOpenNewPin={() => setIsNewPinOpen(true)}
              viewMode={viewMode}
              onToggleViewMode={() => setViewMode(viewMode === 'masonry' ? 'compact' : 'masonry')}
              totalPinsCount={filteredPins.length}
            />

            {/* Saved Pins Banner if active */}
            {showingSavedOnly && (
              <div className="mx-4 sm:mx-6 my-2 p-2.5 rounded-2xl bg-[#D4A5A5]/20 border-2 border-[#D4A5A5]/50 flex items-center justify-between font-stardew">
                <div className="flex items-center gap-2 text-xs font-bold text-[#915050]">
                  <Bookmark className="w-4 h-4 fill-current" />
                  <span>Kaydedilen Öğrenci Pinleri Görüntüleniyor 𐙚</span>
                </div>
                <button
                  onClick={() => setShowingSavedOnly(false)}
                  className="text-xs text-[#915050] font-bold hover:underline cursor-pointer"
                >
                  Filtreyi Temizle ★
                </button>
              </div>
            )}

            {/* Pinterest-Inspired Pinboard Feed */}
            <main className="flex-1 px-4 sm:px-6 pt-2">
              {filteredPins.length === 0 ? (
                <div className="py-16 text-center bg-white rounded-3xl border-2 border-[#E5E3DB] p-6 shadow-xs my-4 font-stardew">
                  <div className="w-12 h-12 rounded-2xl bg-[#FAF9F6] border border-[#E5E3DB] text-[#6C7A89] flex items-center justify-center mx-auto mb-3">
                    <Inbox className="w-6 h-6" />
                  </div>
                  <h3 className="text-sm font-bold text-[#1B263B] font-stardew">Öğrenci pini bulunamadı ⋆˚࿔</h3>
                  <p className="text-xs text-[#6C7A89] mt-1 max-w-xs mx-auto font-stardew">
                    Farklı bir arama terimi deneyin veya çalışma panonuz için yeni bir pin oluşturun.
                  </p>
                  <div className="mt-4 flex justify-center">
                    <PuffyStarButton
                      variant="orange"
                      size="md"
                      onClick={() => setIsNewPinOpen(true)}
                    >
                      + İlk Pini Ekle 𐙚
                    </PuffyStarButton>
                  </div>
                </div>
              ) : (
                <div
                  className={`grid gap-3.5 sm:gap-4 ${
                    viewMode === 'masonry'
                      ? 'grid-cols-1 sm:grid-cols-2'
                      : 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3'
                  }`}
                >
                  {filteredPins.map((pin) => (
                    <PinCardComponent
                      key={pin.id}
                      pin={pin}
                      onOpenDetail={(p) => setSelectedPin(p)}
                      onToggleSave={handleToggleSave}
                    />
                  ))}
                </div>
              )}
            </main>
          </>
        )}

        {/* Mobile-First Bottom Nav Bar */}
        <BottomNav
          activeTab={activeTab}
          onSelectTab={setActiveTab}
          activeCategory={activeCategory}
          onSelectCategory={(cat) => {
            setShowingSavedOnly(false);
            setActiveCategory(cat);
          }}
          onOpenNewAction={handleCenterAction}
          onOpenMenu={() => setIsMenuOpen(true)}
          showingSavedOnly={showingSavedOnly}
          onToggleSavedOnly={() => setShowingSavedOnly(!showingSavedOnly)}
          pendingTasksCount={pendingTasksCount}
          totalPlannerCount={plannerEntries.length}
        />
      </div>

      {/* Slide-out Menu Drawer */}
      <MenuDrawer
        isOpen={isMenuOpen}
        onClose={() => setIsMenuOpen(false)}
        profile={profile}
        activeFilter={activeCategory}
        onSelectCategory={(cat) => {
          setShowingSavedOnly(false);
          setActiveCategory(cat);
        }}
        onSelectTab={setActiveTab}
        onSelectPlanner={(type) => {
          setActivePlannerType(type);
          setActiveTab('agenda');
        }}
        onEditProfile={() => setIsEditProfileOpen(true)}
        onOpenOnboarding={() => setIsOnboardingOpen(true)}
        onResetData={handleResetData}
        tasksCount={{
          total: tasks.length,
          pending: pendingTasksCount,
          completed: tasks.filter((t) => t.completed).length,
        }}
      />

      {/* Pin Detail Modal */}
      <PinDetailModal
        pin={selectedPin}
        onClose={() => setSelectedPin(null)}
        onToggleSave={handleToggleSave}
      />

      {/* Create New Pin Modal */}
      <NewPinModal
        isOpen={isNewPinOpen}
        onClose={() => setIsNewPinOpen(false)}
        onAddPin={handleAddPin}
      />

      {/* Create New Task Modal */}
      <NewTaskModal
        isOpen={isNewTaskOpen}
        onClose={() => setIsNewTaskOpen(false)}
        onAddTask={handleAddTask}
        userTheme={profile.favoriteTheme || 'orange'}
      />

      {/* Quick Add Planner Entry Modal from Main Star Button */}
      <PlannerEntryModal
        isOpen={isNewPlannerOpen}
        onClose={() => setIsNewPlannerOpen(false)}
        onSaveEntry={handleAddPlannerEntry}
        initialType={activePlannerType}
      />

      {/* Edit Profile Modal */}
      <EditProfileModal
        isOpen={isEditProfileOpen}
        onClose={() => setIsEditProfileOpen(false)}
        profile={profile}
        onSaveProfile={handleSaveProfile}
      />

      {/* First-Time User Onboarding Flow Modal */}
      <OnboardingModal
        isOpen={isOnboardingOpen}
        initialProfile={profile}
        onComplete={handleCompleteOnboarding}
      />
    </div>
  );
}



