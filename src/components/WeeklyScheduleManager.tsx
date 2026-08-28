import React, { useState, useEffect } from 'react';
import {
  Calendar,
  Clock,
  Plus,
  Trash2,
  Edit2,
  Check,
  X,
  MapPin,
  User,
  BookOpen,
  Sparkles,
  Layers,
  ChevronRight,
} from 'lucide-react';
import { ScheduleLesson, WeekDay } from '../types';
import { loadScheduleLessons, saveScheduleLessons } from '../utils/storage';
import PuffyStarButton from './PuffyStarButton';

const DAYS_OF_WEEK: Array<{ key: WeekDay; short: string; emoji: string }> = [
  { key: 'Pazartesi', short: 'Pzt', emoji: '🌱' },
  { key: 'Salı', short: 'Sal', emoji: '🌿' },
  { key: 'Çarşamba', short: 'Çar', emoji: '☕' },
  { key: 'Perşembe', short: 'Per', emoji: '📖' },
  { key: 'Cuma', short: 'Cum', emoji: '✨' },
  { key: 'Cumartesi', short: 'Cmt', emoji: '🌸' },
  { key: 'Pazar', short: 'Paz', emoji: '☀️' },
];

const COLOR_OPTIONS: Array<{
  id: 'green' | 'orange' | 'pink' | 'navy' | 'yellow' | 'purple';
  label: string;
  bg: string;
  border: string;
  text: string;
  dot: string;
}> = [
  { id: 'green', label: 'Yeşil', bg: 'bg-[#2D6A4F]/10', border: 'border-[#2D6A4F]/30', text: 'text-[#2D6A4F]', dot: 'bg-[#2D6A4F]' },
  { id: 'orange', label: 'Turuncu', bg: 'bg-[#E07A5F]/10', border: 'border-[#E07A5F]/30', text: 'text-[#E07A5F]', dot: 'bg-[#E07A5F]' },
  { id: 'pink', label: 'Pembe', bg: 'bg-[#D4A5A5]/20', border: 'border-[#D4A5A5]', text: 'text-[#4A2020]', dot: 'bg-[#D4A5A5]' },
  { id: 'navy', label: 'Lacivert', bg: 'bg-[#1B263B]/10', border: 'border-[#1B263B]/30', text: 'text-[#1B263B]', dot: 'bg-[#1B263B]' },
  { id: 'yellow', label: 'Sarı', bg: 'bg-[#F4C542]/20', border: 'border-[#F4C542]/50', text: 'text-[#7D5A00]', dot: 'bg-[#F4C542]' },
  { id: 'purple', label: 'Mor', bg: 'bg-[#8F6593]/15', border: 'border-[#8F6593]/40', text: 'text-[#6A3D70]', dot: 'bg-[#8F6593]' },
];

export default function WeeklyScheduleManager() {
  const [lessons, setLessons] = useState<ScheduleLesson[]>(() => loadScheduleLessons());
  const [activeDay, setActiveDay] = useState<WeekDay>('Pazartesi');
  const [viewMode, setViewMode] = useState<'day' | 'week'>('day');

  // Form states for Add / Edit
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  const [formSubject, setFormSubject] = useState('');
  const [formDay, setFormDay] = useState<WeekDay>('Pazartesi');
  const [formTime, setFormTime] = useState('');
  const [formClassroom, setFormClassroom] = useState('');
  const [formTeacher, setFormTeacher] = useState('');
  const [formColor, setFormColor] = useState<'green' | 'orange' | 'pink' | 'navy' | 'yellow' | 'purple'>('navy');
  const [formNotes, setFormNotes] = useState('');

  // Synchronize to localStorage
  useEffect(() => {
    saveScheduleLessons(lessons);
  }, [lessons]);

  // Open form for new lesson
  const handleOpenAddForm = (defaultDay?: WeekDay) => {
    setEditingId(null);
    setFormSubject('');
    setFormDay(defaultDay || activeDay);
    setFormTime('');
    setFormClassroom('');
    setFormTeacher('');
    setFormColor('navy');
    setFormNotes('');
    setIsFormOpen(true);
  };

  // Open form for editing lesson
  const handleOpenEditForm = (lesson: ScheduleLesson) => {
    setEditingId(lesson.id);
    setFormSubject(lesson.subject);
    setFormDay(lesson.day);
    setFormTime(lesson.time || '');
    setFormClassroom(lesson.classroom || '');
    setFormTeacher(lesson.teacher || '');
    setFormColor(lesson.color || 'navy');
    setFormNotes(lesson.notes || '');
    setIsFormOpen(true);
  };

  const handleSaveLesson = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formSubject.trim()) return;

    if (editingId) {
      // Update existing
      setLessons((prev) =>
        prev.map((item) =>
          item.id === editingId
            ? {
                ...item,
                subject: formSubject.trim(),
                day: formDay,
                time: formTime.trim() || undefined,
                classroom: formClassroom.trim() || undefined,
                teacher: formTeacher.trim() || undefined,
                color: formColor,
                notes: formNotes.trim() || undefined,
              }
            : item
        )
      );
    } else {
      // Create new
      const newLesson: ScheduleLesson = {
        id: `sch-${Date.now()}`,
        subject: formSubject.trim(),
        day: formDay,
        time: formTime.trim() || undefined,
        classroom: formClassroom.trim() || undefined,
        teacher: formTeacher.trim() || undefined,
        color: formColor,
        notes: formNotes.trim() || undefined,
      };
      setLessons((prev) => [...prev, newLesson]);
    }

    setIsFormOpen(false);
    setEditingId(null);
  };

  const handleDeleteLesson = (id: string) => {
    setLessons((prev) => prev.filter((l) => l.id !== id));
  };

  // Lessons for the active day
  const dayLessons = lessons.filter((l) => l.day === activeDay);

  const getColorConfig = (colorId?: string) => {
    return COLOR_OPTIONS.find((c) => c.id === colorId) || COLOR_OPTIONS[3]; // default navy
  };

  return (
    <div className="space-y-3.5 font-stardew">
      {/* Top Controls: Day View vs Week View Toggle */}
      <div className="flex items-center justify-between gap-2">
        <div className="bg-[#E5E3DB]/60 p-1 rounded-2xl flex items-center gap-1 border border-[#E5E3DB]">
          <button
            type="button"
            onClick={() => setViewMode('day')}
            className={`px-3 py-1 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              viewMode === 'day'
                ? 'bg-white text-[#1B263B] shadow-xs'
                : 'text-[#6C7A89] hover:text-[#1B263B]'
            }`}
          >
            Günlük Görünüm
          </button>
          <button
            type="button"
            onClick={() => setViewMode('week')}
            className={`px-3 py-1 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1 ${
              viewMode === 'week'
                ? 'bg-white text-[#1B263B] shadow-xs'
                : 'text-[#6C7A89] hover:text-[#1B263B]'
            }`}
          >
            <Layers className="w-3 h-3" />
            <span>Tüm Hafta</span>
          </button>
        </div>

        <PuffyStarButton
          variant="orange"
          size="sm"
          onClick={() => handleOpenAddForm(activeDay)}
          className="text-xs py-1.5! px-3!"
        >
          <Plus className="w-3.5 h-3.5 mr-1 inline" />
          Ders Ekle 𐙚
        </PuffyStarButton>
      </div>

      {/* Days of Week Tab Bar */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar">
        {DAYS_OF_WEEK.map((d) => {
          const count = lessons.filter((l) => l.day === d.key).length;
          const isSelected = activeDay === d.key;
          return (
            <button
              key={d.key}
              type="button"
              onClick={() => {
                setActiveDay(d.key);
                if (viewMode === 'week') setViewMode('day');
              }}
              className={`py-1.5 px-3 rounded-2xl text-xs font-bold transition-all cursor-pointer shrink-0 flex items-center gap-1.5 border ${
                isSelected
                  ? 'bg-[#1B263B] text-white border-[#1B263B] shadow-xs scale-[1.02]'
                  : 'bg-white text-[#6C7A89] border-[#E5E3DB] hover:bg-[#FAF9F6]'
              }`}
            >
              <span>{d.emoji}</span>
              <span>{d.short}</span>
              {count > 0 && (
                <span
                  className={`text-[10px] px-1.5 py-0.2 rounded-full font-bold ${
                    isSelected ? 'bg-white text-[#1B263B]' : 'bg-[#E5E3DB] text-[#6C7A89]'
                  }`}
                >
                  {count}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* View 1: Single Day Timeline / Card View */}
      {viewMode === 'day' && (
        <div className="space-y-2.5">
          <div className="flex items-center justify-between px-1">
            <h4 className="text-xs font-bold text-[#1B263B] flex items-center gap-1.5">
              <span>{activeDay} Günü Dersleri</span>
              <span className="text-[10px] text-[#6C7A89] font-normal">
                ({dayLessons.length} Ders Kayıtlı)
              </span>
            </h4>
            {dayLessons.length > 0 && (
              <button
                type="button"
                onClick={() => handleOpenAddForm(activeDay)}
                className="text-[11px] font-bold text-[#E07A5F] hover:underline cursor-pointer flex items-center gap-0.5"
              >
                + Bu Güne Ekle
              </button>
            )}
          </div>

          {dayLessons.length === 0 ? (
            <div className="p-6 text-center bg-white rounded-2xl border-2 border-dashed border-[#E5E3DB] space-y-2">
              <span className="text-3xl block">🌿</span>
              <h5 className="text-xs font-bold text-[#1B263B]">{activeDay} günü için ders bulunmuyor</h5>
              <p className="text-[11px] text-[#6C7A89] max-w-xs mx-auto">
                Bugüne ait ders, etüt veya çalışma saati ekleyerek haftalık programını planlayabilirsin ⋆˚࿔
              </p>
              <div className="pt-2">
                <PuffyStarButton
                  variant="green"
                  size="sm"
                  onClick={() => handleOpenAddForm(activeDay)}
                >
                  + {activeDay} İçin Ders Ekle 𐙚
                </PuffyStarButton>
              </div>
            </div>
          ) : (
            <div className="space-y-2">
              {dayLessons.map((lesson) => {
                const color = getColorConfig(lesson.color);
                return (
                  <div
                    key={lesson.id}
                    className={`p-3.5 rounded-2xl border-2 transition-all ${color.bg} ${color.border} shadow-2xs`}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="space-y-1 min-w-0">
                        {/* Time and Subject */}
                        <div className="flex items-center gap-2 flex-wrap">
                          {lesson.time && (
                            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-white/90 text-[#1B263B] border border-[#E5E3DB] shadow-2xs flex items-center gap-1 shrink-0 font-mono">
                              <Clock className="w-3 h-3 text-[#E07A5F]" />
                              {lesson.time}
                            </span>
                          )}
                          <h4 className="text-xs font-bold text-[#1B263B]">{lesson.subject}</h4>
                        </div>

                        {/* Room & Teacher metadata */}
                        <div className="flex items-center gap-3 text-[11px] text-[#6C7A89] flex-wrap pt-0.5">
                          {lesson.classroom && (
                            <span className="flex items-center gap-1">
                              <MapPin className="w-3 h-3 text-[#2D6A4F]" />
                              {lesson.classroom}
                            </span>
                          )}
                          {lesson.teacher && (
                            <span className="flex items-center gap-1">
                              <User className="w-3 h-3 text-[#E07A5F]" />
                              {lesson.teacher}
                            </span>
                          )}
                        </div>

                        {/* Notes */}
                        {lesson.notes && (
                          <p className="text-[11px] text-[#1B263B]/80 bg-white/60 p-1.5 rounded-xl border border-black/5 mt-1 leading-snug">
                            {lesson.notes}
                          </p>
                        )}
                      </div>

                      {/* Action buttons */}
                      <div className="flex items-center gap-1 shrink-0">
                        <button
                          type="button"
                          onClick={() => handleOpenEditForm(lesson)}
                          className="p-1.5 rounded-xl bg-white/80 hover:bg-white text-[#1B263B] border border-[#E5E3DB] transition-all cursor-pointer"
                          title="Düzenle"
                        >
                          <Edit2 className="w-3 h-3" />
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDeleteLesson(lesson.id)}
                          className="p-1.5 rounded-xl bg-white/80 hover:bg-white text-[#915050] border border-[#E5E3DB] transition-all cursor-pointer"
                          title="Sil"
                        >
                          <Trash2 className="w-3 h-3" />
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* View 2: Full Week Overview */}
      {viewMode === 'week' && (
        <div className="space-y-2.5 max-h-[55vh] overflow-y-auto pr-1">
          {DAYS_OF_WEEK.map((d) => {
            const currentDayLessons = lessons.filter((l) => l.day === d.key);
            return (
              <div key={d.key} className="bg-white p-3 rounded-2xl border-2 border-[#E5E3DB] shadow-2xs">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-bold text-[#1B263B] flex items-center gap-1.5">
                    <span>{d.emoji}</span>
                    <span>{d.key}</span>
                  </span>
                  <button
                    type="button"
                    onClick={() => handleOpenAddForm(d.key)}
                    className="text-[10px] font-bold text-[#E07A5F] hover:underline cursor-pointer"
                  >
                    + Ders Ekle
                  </button>
                </div>

                {currentDayLessons.length === 0 ? (
                  <p className="text-[11px] text-[#6C7A89] italic py-1">Bu gün için ders bulunmuyor</p>
                ) : (
                  <div className="space-y-1.5">
                    {currentDayLessons.map((l) => {
                      const color = getColorConfig(l.color);
                      return (
                        <div
                          key={l.id}
                          className={`p-2 rounded-xl border flex items-center justify-between text-xs ${color.bg} ${color.border}`}
                        >
                          <div className="min-w-0">
                            <span className="font-bold text-[#1B263B] block truncate">{l.subject}</span>
                            <div className="flex items-center gap-2 text-[10px] text-[#6C7A89]">
                              {l.time && <span>⏰ {l.time}</span>}
                              {l.classroom && <span>📍 {l.classroom}</span>}
                            </div>
                          </div>
                          <div className="flex items-center gap-1 shrink-0">
                            <button
                              type="button"
                              onClick={() => handleOpenEditForm(l)}
                              className="p-1 text-[#6C7A89] hover:text-[#1B263B] cursor-pointer"
                            >
                              <Edit2 className="w-3 h-3" />
                            </button>
                            <button
                              type="button"
                              onClick={() => handleDeleteLesson(l.id)}
                              className="p-1 text-[#6C7A89] hover:text-[#915050] cursor-pointer"
                            >
                              <Trash2 className="w-3 h-3" />
                            </button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* Add / Edit Modal Sheet */}
      {isFormOpen && (
        <div className="fixed inset-0 z-70 bg-black/40 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4">
          <div className="bg-[#FAF9F6] rounded-3xl border-3 border-[#E5E3DB] shadow-2xl max-w-sm w-full overflow-hidden animate-in fade-in zoom-in-95">
            <div className="p-3.5 bg-white border-b-2 border-[#E5E3DB] flex items-center justify-between">
              <h4 className="text-xs font-bold text-[#1B263B] flex items-center gap-1">
                <span>{editingId ? 'Dersi Düzenle' : 'Yeni Ders Ekle'}</span>
                <span className="text-[#E07A5F]">𐙚</span>
              </h4>
              <button
                type="button"
                onClick={() => setIsFormOpen(false)}
                className="p-1 text-[#6C7A89] hover:text-[#1B263B] cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSaveLesson} className="p-4 space-y-3 max-h-[75vh] overflow-y-auto">
              {/* Day Selector */}
              <div>
                <label className="block text-[11px] font-bold text-[#1B263B] mb-1">Ders Günü</label>
                <select
                  value={formDay}
                  onChange={(e) => setFormDay(e.target.value as WeekDay)}
                  className="w-full bg-white border-2 border-[#E5E3DB] rounded-xl px-2.5 py-1.5 text-xs font-bold text-[#1B263B]"
                >
                  {DAYS_OF_WEEK.map((d) => (
                    <option key={d.key} value={d.key}>
                      {d.emoji} {d.key}
                    </option>
                  ))}
                </select>
              </div>

              {/* Subject (Ders Adı) */}
              <div>
                <label className="block text-[11px] font-bold text-[#1B263B] mb-1">
                  Ders Adı <span className="text-[#E07A5F]">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={formSubject}
                  onChange={(e) => setFormSubject(e.target.value)}
                  placeholder="Örn: Matematik, Biyoloji, İngilizce"
                  className="w-full bg-white border-2 border-[#E5E3DB] rounded-xl px-3 py-1.5 text-xs font-bold text-[#1B263B] focus:outline-hidden focus:ring-2 focus:ring-[#F4C542]"
                />
              </div>

              {/* Time (Ders Saati) */}
              <div>
                <label className="block text-[11px] font-bold text-[#1B263B] mb-1">
                  Ders Saati (Opsiyonel)
                </label>
                <input
                  type="text"
                  value={formTime}
                  onChange={(e) => setFormTime(e.target.value)}
                  placeholder="Örn: 09:00 - 09:45 veya 10:30"
                  className="w-full bg-white border-2 border-[#E5E3DB] rounded-xl px-3 py-1.5 text-xs text-[#1B263B]"
                />
              </div>

              {/* Classroom & Teacher in 2 Columns */}
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-[11px] font-bold text-[#1B263B] mb-1">
                    Derslik / Sınıf
                  </label>
                  <input
                    type="text"
                    value={formClassroom}
                    onChange={(e) => setFormClassroom(e.target.value)}
                    placeholder="Örn: A-102, Amfi 1"
                    className="w-full bg-white border-2 border-[#E5E3DB] rounded-xl px-2.5 py-1.5 text-xs text-[#1B263B]"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-[#1B263B] mb-1">
                    Öğretmen
                  </label>
                  <input
                    type="text"
                    value={formTeacher}
                    onChange={(e) => setFormTeacher(e.target.value)}
                    placeholder="Örn: Selin Hoca"
                    className="w-full bg-white border-2 border-[#E5E3DB] rounded-xl px-2.5 py-1.5 text-xs text-[#1B263B]"
                  />
                </div>
              </div>

              {/* Color Tag Selection */}
              <div>
                <label className="block text-[11px] font-bold text-[#1B263B] mb-1.5">
                  Renk Kartı
                </label>
                <div className="flex items-center gap-2">
                  {COLOR_OPTIONS.map((c) => (
                    <button
                      key={c.id}
                      type="button"
                      onClick={() => setFormColor(c.id)}
                      className={`w-6 h-6 rounded-full ${c.dot} transition-transform cursor-pointer flex items-center justify-center ${
                        formColor === c.id ? 'ring-2 ring-[#1B263B] ring-offset-2 scale-110' : 'opacity-70 hover:opacity-100'
                      }`}
                      title={c.label}
                    >
                      {formColor === c.id && <Check className="w-3 h-3 text-white" />}
                    </button>
                  ))}
                </div>
              </div>

              {/* Notes */}
              <div>
                <label className="block text-[11px] font-bold text-[#1B263B] mb-1">
                  Özel Not (Opsiyonel)
                </label>
                <input
                  type="text"
                  value={formNotes}
                  onChange={(e) => setFormNotes(e.target.value)}
                  placeholder="Örn: Defterini ve hesap makinesini unutma"
                  className="w-full bg-white border-2 border-[#E5E3DB] rounded-xl px-3 py-1.5 text-xs text-[#1B263B]"
                />
              </div>

              <div className="pt-2 flex gap-2">
                <button
                  type="button"
                  onClick={() => setIsFormOpen(false)}
                  className="flex-1 py-2 rounded-xl bg-white border-2 border-[#E5E3DB] text-xs font-bold text-[#6C7A89] hover:bg-[#FAF9F6] cursor-pointer"
                >
                  Vazgeç
                </button>
                <PuffyStarButton
                  type="submit"
                  variant="orange"
                  size="sm"
                  className="flex-1 justify-center py-2!"
                >
                  {editingId ? 'Güncelle 𐙚' : 'Kaydet 𐙚'}
                </PuffyStarButton>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
