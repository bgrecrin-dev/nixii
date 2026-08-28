import React, { useState } from 'react';
import { X, Check, Calendar, Tag, Sparkles, AlertCircle } from 'lucide-react';
import { TaskItem, TaskCategory, ThemeStyle } from '../types';
import PuffyStarButton from './PuffyStarButton';
import { THEME_CONFIGS } from '../utils/themeLevel';

interface NewTaskModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddTask: (task: TaskItem) => void;
  userTheme?: ThemeStyle;
}

const TASK_CATEGORIES: { id: TaskCategory; label: string; icon: string }[] = [
  { id: 'Ders & Çalışma', label: 'Ders & Çalışma', icon: '🌿' },
  { id: 'Ödev & Proje', label: 'Ödev & Proje', icon: '📐' },
  { id: 'Sınav & Vize', label: 'Sınav & Vize', icon: '📝' },
  { id: 'Kişisel & Alışkanlık', label: 'Kişisel & Alışkanlık', icon: '☕' },
  { id: 'Kitap & Okuma', label: 'Kitap & Okuma', icon: '📖' },
];

const QUICK_DATE_SHORTCUTS = [
  'Bugün',
  'Yarın',
  'Bu Hafta Sonu',
  'Pazartesi 23:59',
  'Vize Haftası',
];

export default function NewTaskModal({
  isOpen,
  onClose,
  onAddTask,
  userTheme = 'orange',
}: NewTaskModalProps) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [date, setDate] = useState('Bugün');
  const [category, setCategory] = useState<TaskCategory>('Ders & Çalışma');
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const currentTheme = THEME_CONFIGS[userTheme] || THEME_CONFIGS.orange;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) {
      setError('Lütfen görev başlığı girin.');
      return;
    }

    const newTask: TaskItem = {
      id: `task-${Date.now()}`,
      title: title.trim(),
      description: description.trim() || undefined,
      date: date.trim() || 'Belirtilmedi',
      category,
      completed: false,
      pointsEarned: 20,
      createdAt: new Date().toISOString(),
    };

    onAddTask(newTask);
    setTitle('');
    setDescription('');
    setDate('Bugün');
    setCategory('Ders & Çalışma');
    setError('');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/40 backdrop-blur-xs font-stardew animate-fadeIn">
      <div className="bg-[#FAF9F6] rounded-3xl border-3 border-[#E5E3DB] shadow-2xl w-full max-w-lg overflow-hidden flex flex-col max-h-[92vh]">
        {/* Header */}
        <div className="p-4 sm:p-5 bg-white border-b-2 border-[#E5E3DB] flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-2xl bg-[#F4C542]/30 text-[#1B263B] flex items-center justify-center text-sm font-bold border border-[#E5E3DB]">
              {currentTheme.pointIcon}
            </div>
            <div>
              <h2 className="text-sm sm:text-base font-bold text-[#1B263B] font-stardew flex items-center gap-1">
                <span>Yeni Görev Oluştur</span>
                <span className="text-[#E07A5F] text-xs">𐙚</span>
              </h2>
              <p className="text-[11px] text-[#6C7A89] font-stardew">
                Tamamlandığında <span className="font-bold text-[#2D6A4F]">+20 {currentTheme.pointName}</span> kazandırır!
              </p>
            </div>
          </div>
          <PuffyStarButton
            isStarShape={true}
            variant="orange"
            size="sm"
            onClick={onClose}
            title="Kapat"
          >
            ✕
          </PuffyStarButton>
        </div>

        {/* Form Content */}
        <form onSubmit={handleSubmit} className="p-4 sm:p-5 overflow-y-auto space-y-4">
          {error && (
            <div className="p-2.5 rounded-2xl bg-[#D4A5A5]/20 border border-[#D4A5A5] text-[#915050] text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* Title Input */}
          <div>
            <label className="block text-xs font-bold text-[#1B263B] mb-1 font-stardew flex items-center justify-between">
              <span>Görev Başlığı *</span>
              <span className="text-[10px] text-[#6C7A89] font-normal">Gereklidir</span>
            </label>
            <input
              type="text"
              required
              autoFocus
              value={title}
              onChange={(e) => {
                setTitle(e.target.value);
                if (error) setError('');
              }}
              placeholder="Örn. 3 Seans Pomodoro ile Biyokimya tekrarı yap 𐙚"
              className="w-full bg-white text-xs sm:text-sm font-stardew text-[#1B263B] px-3.5 py-2.5 rounded-2xl border-2 border-[#E5E3DB] focus:outline-hidden focus:ring-2 focus:ring-[#F4C542] placeholder-[#A0AEC0]"
            />
          </div>

          {/* Optional Description */}
          <div>
            <label className="block text-xs font-bold text-[#1B263B] mb-1 font-stardew flex items-center justify-between">
              <span>Açıklama &amp; Not (İsteğe Bağlı)</span>
              <span className="text-[10px] text-[#6C7A89] font-normal">Opsiyonel</span>
            </label>
            <textarea
              rows={2}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Örn. Sayfa 45-60 arası soruları çöz ve yanlışları işaretle..."
              className="w-full bg-white text-xs font-stardew text-[#1B263B] p-3 rounded-2xl border-2 border-[#E5E3DB] focus:outline-hidden focus:ring-2 focus:ring-[#F4C542] resize-none placeholder-[#A0AEC0]"
            />
          </div>

          {/* Category Selector */}
          <div>
            <label className="block text-xs font-bold text-[#1B263B] mb-1.5 font-stardew flex items-center gap-1.5">
              <Tag className="w-3.5 h-3.5 text-[#2D6A4F]" />
              <span>Kategori Seçimi</span>
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-1.5">
              {TASK_CATEGORIES.map((cat) => {
                const isSelected = category === cat.id;
                return (
                  <button
                    key={cat.id}
                    type="button"
                    onClick={() => setCategory(cat.id)}
                    className={`px-2.5 py-2 rounded-xl text-xs font-bold border transition-all cursor-pointer flex items-center gap-1.5 ${
                      isSelected
                        ? 'bg-[#2D6A4F] text-white border-[#1E4D38] shadow-xs'
                        : 'bg-white text-[#1B263B] border-[#E5E3DB] hover:bg-[#FAF9F6]'
                    }`}
                  >
                    <span>{cat.icon}</span>
                    <span className="truncate text-[11px]">{cat.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Date Selector */}
          <div>
            <label className="block text-xs font-bold text-[#1B263B] mb-1 font-stardew flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5 text-[#E07A5F]" />
              <span>Tarih / Zaman</span>
            </label>
            <input
              type="text"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              placeholder="Örn. Bugün, Yarın, 28 Ekim..."
              className="w-full bg-white text-xs font-stardew text-[#1B263B] px-3.5 py-2 rounded-2xl border-2 border-[#E5E3DB] focus:outline-hidden focus:ring-2 focus:ring-[#F4C542]"
            />
            {/* Quick date chips */}
            <div className="flex flex-wrap gap-1 mt-1.5">
              {QUICK_DATE_SHORTCUTS.map((chip) => (
                <button
                  key={chip}
                  type="button"
                  onClick={() => setDate(chip)}
                  className={`text-[10px] font-stardew px-2 py-0.5 rounded-lg border transition-all cursor-pointer ${
                    date === chip
                      ? 'bg-[#E07A5F] text-white border-[#C9684F]'
                      : 'bg-white text-[#6C7A89] border-[#E5E3DB] hover:bg-[#FAF9F6]'
                  }`}
                >
                  {chip}
                </button>
              ))}
            </div>
          </div>

          {/* Footer Submit */}
          <div className="pt-3 border-t border-[#E5E3DB] flex items-center justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-3.5 py-2 rounded-2xl text-xs font-bold text-[#6C7A89] hover:bg-[#E5E3DB]/40 transition-colors cursor-pointer"
            >
              Vazgeç
            </button>
            <PuffyStarButton
              type="submit"
              variant="green"
              size="md"
              onClick={handleSubmit}
            >
              <Check className="w-4 h-4 mr-1 inline" />
              Görevi Ekle 𐙚
            </PuffyStarButton>
          </div>
        </form>
      </div>
    </div>
  );
}
