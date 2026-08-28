import React, { useState } from 'react';
import {
  CheckCircle2,
  Circle,
  Plus,
  Trash2,
  Calendar,
  Sparkles,
  ChevronDown,
  ChevronUp,
  Tag,
  ListTodo,
  Check,
} from 'lucide-react';
import { TaskItem, TaskCategory, ThemeStyle } from '../types';
import PuffyStarButton from './PuffyStarButton';
import { calculateLevelInfo, THEME_CONFIGS } from '../utils/themeLevel';

interface TaskManagerProps {
  tasks: TaskItem[];
  userPoints: number;
  userTheme?: ThemeStyle;
  onToggleTask: (taskId: string) => void;
  onDeleteTask: (taskId: string) => void;
  onOpenNewTaskModal: () => void;
}

export default function TaskManager({
  tasks,
  userPoints,
  userTheme = 'orange',
  onToggleTask,
  onDeleteTask,
  onOpenNewTaskModal,
}: TaskManagerProps) {
  const [activeTab, setActiveTab] = useState<'all' | 'pending' | 'completed'>('all');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [expandedDescriptions, setExpandedDescriptions] = useState<Record<string, boolean>>({});
  const [justCompletedId, setJustCompletedId] = useState<string | null>(null);

  const levelInfo = calculateLevelInfo(userPoints, userTheme);
  const themeConfig = THEME_CONFIGS[userTheme] || THEME_CONFIGS.orange;

  const totalTasks = tasks.length;
  const completedTasks = tasks.filter((t) => t.completed).length;
  const pendingTasks = totalTasks - completedTasks;

  // Filter tasks
  const filteredTasks = tasks.filter((task) => {
    if (activeTab === 'pending' && task.completed) return false;
    if (activeTab === 'completed' && !task.completed) return false;
    if (selectedCategory !== 'all' && task.category !== selectedCategory) return false;
    return true;
  });

  const categories = Array.from(new Set(tasks.map((t) => t.category))).filter(Boolean);

  const handleTaskCheck = (taskId: string, isCurrentlyCompleted: boolean) => {
    if (!isCurrentlyCompleted) {
      setJustCompletedId(taskId);
      setTimeout(() => setJustCompletedId(null), 1800);
    }
    onToggleTask(taskId);
  };

  const toggleExpand = (id: string) => {
    setExpandedDescriptions((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  return (
    <div className="mx-4 sm:mx-6 mb-5 bg-white rounded-3xl border-3 border-[#E5E3DB] shadow-xs overflow-hidden font-stardew transition-all">
      {/* Header Level & Progress Banner */}
      <div className="p-4 sm:p-5 bg-gradient-to-br from-[#FAF9F6] via-white to-[#FAF9F6] border-b-2 border-[#E5E3DB]">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-3">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-white border-2 border-[#E5E3DB] flex items-center justify-center text-xl shadow-xs shrink-0">
              {levelInfo.pointIcon}
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-xs font-bold px-2.5 py-0.5 rounded-xl bg-[#1B263B] text-white tracking-wide">
                  Seviye {levelInfo.level}
                </span>
                <span className="text-xs font-bold text-[#1B263B]">
                  {levelInfo.rankTitle}
                </span>
                <span className="text-xs text-[#E07A5F]">𐙚</span>
              </div>
              <p className="text-[11px] font-semibold text-[#6C7A89] mt-0.5">
                Toplam <span className="font-bold text-[#1B263B]">{levelInfo.totalPoints} {levelInfo.pointName}</span> • Tamamlanan her görev <span className="text-[#2D6A4F] font-bold">+20 {levelInfo.pointUnit}</span>
              </p>
            </div>
          </div>

          <PuffyStarButton
            variant="orange"
            size="sm"
            onClick={onOpenNewTaskModal}
            className="self-start sm:self-auto text-xs py-1.5! px-3!"
          >
            <Plus className="w-3.5 h-3.5 mr-1 inline" />
            Yeni Görev 𐙚
          </PuffyStarButton>
        </div>

        {/* Progress bar towards next level */}
        <div className="space-y-1.5 pt-1">
          <div className="flex items-center justify-between text-[11px] font-bold text-[#1B263B]">
            <span className="flex items-center gap-1 text-[#6C7A89]">
              <Sparkles className="w-3 h-3 text-[#F4C542]" />
              <span>Seviye {levelInfo.level + 1} İlerlemesi:</span>
            </span>
            <span className="text-[#2D6A4F]">
              {levelInfo.currentLevelPoints} / 100 {levelInfo.pointUnit} ({levelInfo.progressPercent}%)
            </span>
          </div>

          <div className="w-full h-3 rounded-full bg-[#E5E3DB]/60 overflow-hidden p-0.5 border border-[#E5E3DB]">
            <div
              className="h-full rounded-full transition-all duration-500 bg-gradient-to-r from-[#F4C542] via-[#E07A5F] to-[#2D6A4F]"
              style={{ width: `${Math.max(6, levelInfo.progressPercent)}%` }}
            />
          </div>

          <div className="flex items-center justify-between text-[10px] text-[#6C7A89]">
            <span>Sonraki seviyeye <strong className="text-[#1B263B]">{levelInfo.pointsNeededForNextLevel} {levelInfo.pointUnit}</strong> kaldı</span>
            <span>{completedTasks} / {totalTasks} Görev Tamamlandı</span>
          </div>
        </div>
      </div>

      {/* Filter Tabs & Quick Action Bar */}
      <div className="px-4 sm:px-5 py-3 bg-[#FAF9F6] border-b border-[#E5E3DB] flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-1.5">
          <button
            type="button"
            onClick={() => setActiveTab('all')}
            className={`px-3 py-1 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              activeTab === 'all'
                ? 'bg-[#1B263B] text-white shadow-xs'
                : 'bg-white text-[#6C7A89] border border-[#E5E3DB] hover:bg-[#FAF9F6]'
            }`}
          >
            Tümü ({totalTasks})
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('pending')}
            className={`px-3 py-1 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              activeTab === 'pending'
                ? 'bg-[#E07A5F] text-white shadow-xs'
                : 'bg-white text-[#6C7A89] border border-[#E5E3DB] hover:bg-[#FAF9F6]'
            }`}
          >
            Yapılacaklar ({pendingTasks})
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('completed')}
            className={`px-3 py-1 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              activeTab === 'completed'
                ? 'bg-[#2D6A4F] text-white shadow-xs'
                : 'bg-white text-[#6C7A89] border border-[#E5E3DB] hover:bg-[#FAF9F6]'
            }`}
          >
            Tamamlanan ({completedTasks})
          </button>
        </div>

        {/* Category Pills if more than 1 category */}
        {categories.length > 0 && (
          <div className="flex items-center gap-1 overflow-x-auto max-w-full pb-0.5">
            <button
              type="button"
              onClick={() => setSelectedCategory('all')}
              className={`px-2 py-0.5 rounded-lg text-[10px] font-bold border transition-colors cursor-pointer whitespace-nowrap ${
                selectedCategory === 'all'
                  ? 'bg-[#E5E3DB] text-[#1B263B] border-[#D1CFCA]'
                  : 'bg-white text-[#6C7A89] border-[#E5E3DB]'
              }`}
            >
              Tüm Kategoriler
            </button>
            {categories.map((cat) => (
              <button
                key={cat}
                type="button"
                onClick={() => setSelectedCategory(cat)}
                className={`px-2 py-0.5 rounded-lg text-[10px] font-bold border transition-colors cursor-pointer whitespace-nowrap ${
                  selectedCategory === cat
                    ? 'bg-[#E5E3DB] text-[#1B263B] border-[#D1CFCA]'
                    : 'bg-white text-[#6C7A89] border-[#E5E3DB]'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Task List Content */}
      <div className="p-3 sm:p-4 space-y-2">
        {filteredTasks.length === 0 ? (
          <div className="py-8 text-center bg-[#FAF9F6] rounded-2xl border border-dashed border-[#E5E3DB] p-4">
            <ListTodo className="w-8 h-8 text-[#A0AEC0] mx-auto mb-2" />
            <p className="text-xs font-bold text-[#1B263B]">
              {activeTab === 'completed'
                ? 'Henüz tamamlanan görev yok ⋆˚࿔'
                : activeTab === 'pending'
                ? 'Harika! Yapılacak tüm görevleri bitirdin 𐙚'
                : 'Bu filtrede görev bulunamadı.'}
            </p>
            <p className="text-[11px] text-[#6C7A89] mt-0.5">
              Yeni bir görev ekleyerek seviye ilerlemesi kazanabilirsin!
            </p>
            <button
              type="button"
              onClick={onOpenNewTaskModal}
              className="mt-3 text-xs font-bold text-[#E07A5F] hover:underline cursor-pointer inline-flex items-center gap-1"
            >
              <Plus className="w-3 h-3" />
              Yeni Görev Ekle
            </button>
          </div>
        ) : (
          filteredTasks.map((task) => {
            const isCompleted = task.completed;
            const isJustDone = justCompletedId === task.id;
            const isExpanded = !!expandedDescriptions[task.id];

            return (
              <div
                key={task.id}
                className={`p-3 rounded-2xl border-2 transition-all relative ${
                  isCompleted
                    ? 'bg-[#FAF9F6]/80 border-[#E5E3DB] opacity-75'
                    : 'bg-white border-[#E5E3DB] hover:border-[#F4C542]/60 hover:shadow-xs'
                }`}
              >
                {/* Floating Confetti / Award effect on completion */}
                {isJustDone && (
                  <div className="absolute top-2 right-12 z-10 px-2.5 py-1 rounded-full bg-[#2D6A4F] text-white text-[11px] font-bold shadow-md animate-bounce flex items-center gap-1">
                    <span>+{task.pointsEarned || 20} {levelInfo.pointName}</span>
                    <span>{levelInfo.pointIcon}</span>
                  </div>
                )}

                <div className="flex items-start gap-2.5">
                  {/* Puffy Checkbox Button */}
                  <button
                    type="button"
                    onClick={() => handleTaskCheck(task.id, isCompleted)}
                    className={`shrink-0 w-6 h-6 rounded-xl border-2 flex items-center justify-center transition-all cursor-pointer mt-0.5 ${
                      isCompleted
                        ? 'bg-[#2D6A4F] border-[#1E4D38] text-white shadow-xs'
                        : 'bg-white border-[#C9C7BE] hover:border-[#2D6A4F] text-transparent hover:text-[#2D6A4F]/40'
                    }`}
                    title={isCompleted ? 'Tamamlanmadı olarak işaretle' : 'Tamamlandı olarak işaretle'}
                  >
                    <Check className="w-3.5 h-3.5 stroke-[3]" />
                  </button>

                  {/* Task Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <p
                        onClick={() => handleTaskCheck(task.id, isCompleted)}
                        className={`text-xs sm:text-sm font-bold cursor-pointer transition-colors leading-snug font-stardew ${
                          isCompleted
                            ? 'line-through text-[#6C7A89]'
                            : 'text-[#1B263B] hover:text-[#E07A5F]'
                        }`}
                      >
                        {task.title}
                      </p>

                      {/* Delete Task Button */}
                      <button
                        type="button"
                        onClick={() => onDeleteTask(task.id)}
                        className="text-[#A0AEC0] hover:text-[#E07A5F] p-1 rounded-lg hover:bg-[#FAF9F6] transition-colors cursor-pointer shrink-0"
                        title="Görevi Sil"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    {/* Description preview if exists */}
                    {task.description && (
                      <div className="mt-1">
                        <p
                          className={`text-[11px] text-[#6C7A89] leading-relaxed font-stardew ${
                            isExpanded ? '' : 'line-clamp-1'
                          }`}
                        >
                          {task.description}
                        </p>
                        {task.description.length > 50 && (
                          <button
                            type="button"
                            onClick={() => toggleExpand(task.id)}
                            className="text-[10px] text-[#E07A5F] font-bold hover:underline cursor-pointer flex items-center gap-0.5 mt-0.5"
                          >
                            {isExpanded ? (
                              <>
                                <span>Kısalt</span>
                                <ChevronUp className="w-3 h-3" />
                              </>
                            ) : (
                              <>
                                <span>Devamını Gör</span>
                                <ChevronDown className="w-3 h-3" />
                              </>
                            )}
                          </button>
                        )}
                      </div>
                    )}

                    {/* Metadata Badges: Category & Date */}
                    <div className="mt-2 flex flex-wrap items-center gap-1.5">
                      {task.category && (
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-lg bg-[#FAF9F6] text-[#2D6A4F] border border-[#E5E3DB] flex items-center gap-1">
                          <Tag className="w-2.5 h-2.5 text-[#2D6A4F]" />
                          <span>{task.category}</span>
                        </span>
                      )}

                      {task.date && (
                        <span className="text-[10px] font-semibold px-2 py-0.5 rounded-lg bg-[#FAF9F6] text-[#6C7A89] border border-[#E5E3DB] flex items-center gap-1">
                          <Calendar className="w-2.5 h-2.5 text-[#E07A5F]" />
                          <span>{task.date}</span>
                        </span>
                      )}

                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-lg bg-[#F4C542]/20 text-[#8F6A00] border border-[#F4C542]/40 ml-auto">
                        +{task.pointsEarned || 20} {levelInfo.pointUnit}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
