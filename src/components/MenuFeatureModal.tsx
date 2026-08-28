import React, { useState, useEffect } from 'react';
import {
  X,
  Sparkles,
  Calculator,
  Calendar,
  Clock,
  BookOpen,
  CheckCircle2,
  Bot,
  Globe,
  NotebookPen,
  Coffee,
  Palette,
  Users,
  User,
  Settings,
  Flame,
  Award,
  ChevronRight,
  Send,
  Heart,
  BookMarked,
  ShieldCheck,
  Bell,
  Volume2,
  Compass,
  Plus,
  Trash2,
  RotateCcw,
  Check,
  ExternalLink,
  Target,
  Smile,
  Zap,
} from 'lucide-react';
import PuffyStarButton from './PuffyStarButton';
import { StudentProfile, EducationLevel } from '../types';
import GradeCalculator from './GradeCalculator';
import WeeklyScheduleManager from './WeeklyScheduleManager';
import { calculateLevelInfo, ALL_THEME_OPTIONS } from '../utils/themeLevel';

export interface MenuFeatureItem {
  sectionTitle: string;
  itemTitle: string;
  icon: string;
  symbol?: string;
}

interface MenuFeatureModalProps {
  item: MenuFeatureItem | null;
  onClose: () => void;
  profile: StudentProfile;
  onEditProfile?: () => void;
  onSelectTab?: (tab: 'pins' | 'tasks' | 'agenda') => void;
  onOpenOnboarding?: () => void;
}

// Initial flashcards for foreign language
const INITIAL_VOCAB_CARDS = [
  {
    word: 'Serendipity',
    type: 'noun',
    meaning: 'Mutlu ve şans eseri rastlantı, tatlı tesadüf',
    example: 'Finding this cozy library corner was pure serendipity.',
    level: 'B2 / C1',
  },
  {
    word: 'Procrastination',
    type: 'noun',
    meaning: 'Erteleme huyu, son ana bırakma alışkanlığı',
    example: 'Pomodoro technique helps overcome exam procrastination.',
    level: 'B1 / B2',
  },
  {
    word: 'Resilience',
    type: 'noun',
    meaning: 'Zorluklara karşı dayanıklılık, toparlanma gücü',
    example: 'Academic success requires constant resilience and focus.',
    level: 'B2',
  },
  {
    word: 'Meticulous',
    type: 'adjective',
    meaning: 'Titiz, özenli, en ince ayrıntısına kadar dikkatli',
    example: 'She takes meticulous lecture notes with clean typography.',
    level: 'C1',
  },
  {
    word: 'Ephemeral',
    type: 'adjective',
    meaning: 'Geçici, anlık, kısa ömürlü',
    example: 'Exam stress is ephemeral; knowledge gained lasts forever.',
    level: 'C1',
  },
];

// Study techniques
const STUDY_TECHNIQUES = [
  {
    id: 'feynman',
    title: 'Feynman Tekniği',
    subtitle: 'Bir çocuğa anlatır gibi basitleştir',
    icon: '💡',
    steps: [
      'Konuyu seç ve boş bir kağıda başlığı yaz.',
      'Konuyu hiç bilmeyen 10 yaşındaki birine anlatıyormuş gibi en sade cümlelerle açıkla.',
      'Tıkandığın, karmaşık veya ezbere kaçtığın yerleri belirle.',
      'Kaynaklara dönüp o boşlukları kapat ve benzetmeler (analoji) ekle.',
    ],
  },
  {
    id: 'pomodoro',
    title: 'Pomodoro Metodu',
    subtitle: '25 Dk Odak + 5 Dk Mola',
    icon: '⏱️',
    steps: [
      'Tek bir hedef belirle (ör. 5 problem çöz veya 10 sayfa oku).',
      'Zamanlayıcıyı 25 dakikaya kur ve tüm bildirimleri kapat.',
      'Süre bittiğinde 5 dakika kalk, su iç ve gözlerini dinlendir.',
      '4 Pomodoro tamamlandığında 20-30 dakikalık uzun mola ver.',
    ],
  },
  {
    id: 'active_recall',
    title: 'Aktif Hatırlama (Active Recall)',
    subtitle: 'Okumak yerine zihninden çağır',
    icon: '🧠',
    steps: [
      'Notlarını okuduktan sonra sayfayı tamamen kapat.',
      'Boş bir kağıda aklında kalan tüm ana kavramları yaz veya sesli söyle.',
      'Neleri unuttuğunu kontrol et; unutulan bilgiler zihinde en güçlü bağları kurar.',
      'Soru-cevap flashcard kartları hazırla.',
    ],
  },
  {
    id: 'spaced_rep',
    title: 'Aralıklı Tekrar (Spaced Repetition)',
    subtitle: 'Unutma eğrisini alt et',
    icon: '📈',
    steps: [
      '1. Tekrar: Öğrendikten 1 gün sonra (10 dakika).',
      '2. Tekrar: 3 gün sonra (5 dakika).',
      '3. Tekrar: 1 hafta sonra (5 dakika).',
      '4. Tekrar: Sınavdan önce 1 ay sonra (hızlı tarama).',
    ],
  },
  {
    id: 'cornell',
    title: 'Cornell Not Tutma Sistemi',
    subtitle: 'Sayfayı 3 bölüme ayır',
    icon: '📝',
    steps: [
      'Sağ geniş sütun: Dersteki detaylı notlar ve grafikler.',
      'Sol dar sütun: Anahtar kelimeler, sorular ve ipuçları.',
      'Alt kısım: Dersin 2-3 cümlelik özeti (Ders sonrası yazılır).',
      'Tekrar ederken sağ tarafı kapatıp sadece sol sorulara cevap ver.',
    ],
  },
];

export default function MenuFeatureModal({
  item,
  onClose,
  profile,
  onEditProfile,
  onSelectTab,
  onOpenOnboarding,
}: MenuFeatureModalProps) {
  if (!item) return null;

  const levelInfo = calculateLevelInfo(profile.points || 0, profile.favoriteTheme);

  // 1. AI Coach interactive states
  const [aiCoachTopic, setAiCoachTopic] = useState('');
  const [aiCoachLevel, setAiCoachLevel] = useState('Orta');
  const [aiPlanResult, setAiPlanResult] = useState<string | null>(null);
  const [isGeneratingPlan, setIsGeneratingPlan] = useState(false);

  // 2. Foreign Language states
  const [vocabIndex, setVocabIndex] = useState(0);
  const [isVocabFlipped, setIsVocabFlipped] = useState(false);
  const [learnedCards, setLearnedCards] = useState<Record<number, boolean>>({});
  const [quizStep, setQuizStep] = useState(0);
  const [selectedQuizAnswer, setSelectedQuizAnswer] = useState<number | null>(null);
  const [quizScore, setQuizScore] = useState(0);
  const [userWords, setUserWords] = useState<Array<{ id: string; word: string; meaning: string }>>([
    { id: '1', word: 'Ambiguity', meaning: 'Belirsizlik, iki anlamlılık' },
    { id: '2', word: 'Quintessential', meaning: 'Mükemmel bir örnek teşkil eden' },
  ]);
  const [newWord, setNewWord] = useState('');
  const [newMeaning, setNewMeaning] = useState('');

  // 3. Breaks states
  const [activeBreakTab, setActiveBreakTab] = useState<'snacks' | 'activity' | 'short'>('snacks');
  const [randomBreakIdea, setRandomBreakIdea] = useState<string | null>(null);
  const [breathingPhase, setBreathingPhase] = useState<'Nefes Al 𐙚' | 'Tut ⋆' | 'Nefes Ver 🌿'>('Nefes Al 𐙚');

  // 4. Timer states
  const [timerSeconds, setTimerSeconds] = useState(25 * 60);
  const [isTimerRunning, setIsTimerRunning] = useState(false);
  const [timerMode, setTimerMode] = useState<'focus' | 'break'>('focus');
  const [completedSessions, setCompletedSessions] = useState(2);

  // 5. Important dates (Önemli Günler)
  const [importantDates, setImportantDates] = useState<Array<{ id: string; title: string; date: string; tag: string }>>(() => {
    try {
      const saved = localStorage.getItem('nixi_important_dates_v2');
      if (saved) return JSON.parse(saved);
    } catch {}
    return [
      { id: '1', title: 'Vize Sınav Haftası Başlangıcı', date: '2026-10-19', tag: 'Sınav 📌' },
      { id: '2', title: 'Güz Dönemi Proje & Tasarım Teslimi', date: '2026-11-12', tag: 'Teslim 𐙚' },
      { id: '3', title: 'Dönem Sonu Final Sınavları', date: '2026-12-28', tag: 'Finaller 🎓' },
      { id: '4', title: 'Bahar Dönemi Ders Kayıtları', date: '2027-02-08', tag: 'Akademik ⋆' },
    ];
  });
  const [newDateTitle, setNewDateTitle] = useState('');
  const [newDateVal, setNewDateVal] = useState('');

  // 6. Community Posts
  const [communityPosts, setCommunityPosts] = useState<Array<{
    id: string;
    author: string;
    avatar: string;
    tag: string;
    text: string;
    likes: number;
    isLiked?: boolean;
    time: string;
  }>>(() => {
    try {
      const saved = localStorage.getItem('nixi_community_posts_v2');
      if (saved) return JSON.parse(saved);
    } catch {}
    return [
      {
        id: 'post-1',
        author: 'Elena',
        avatar: profile.avatarUrl,
        tag: 'Ders İpucu 𐙚',
        text: 'Vize haftasında Cornell not tutma metodunu denedim, sağ sütundaki özetler tekrar süresini yarıya indiriyor 🌿 Herkese bol odaklanmalı bir gün!',
        likes: 18,
        isLiked: true,
        time: '2 saat önce',
      },
      {
        id: 'post-2',
        author: 'Melis',
        avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=200&q=80',
        tag: 'Masa Düzeni ☕',
        text: 'Sıcak matcha latte + yağmur sesi eşliğinde 4 seans Pomodoro tamamlandı. Nixonun temaları ders çalışırken inanılmaz huzur veriyor ⋆˚࿔',
        likes: 24,
        time: '5 saat önce',
      },
    ];
  });
  const [newPostText, setNewPostText] = useState('');
  const [newPostTag, setNewPostTag] = useState('Ders Notu 𐙚');

  // 7. Study technique active tab
  const [activeTechniqueId, setActiveTechniqueId] = useState('feynman');

  // 8. DIY Theme states
  const [diyPrimaryColor, setDiyPrimaryColor] = useState('#E07A5F');
  const [diyBgColor, setDiyBgColor] = useState('#FAF9F6');
  const [diyThemeName, setDiyThemeName] = useState('Benim Özel Temam');

  // Save important dates
  useEffect(() => {
    try {
      localStorage.setItem('nixi_important_dates_v2', JSON.stringify(importantDates));
    } catch {}
  }, [importantDates]);

  // Save community posts
  useEffect(() => {
    try {
      localStorage.setItem('nixi_community_posts_v2', JSON.stringify(communityPosts));
    } catch {}
  }, [communityPosts]);

  // Timer interval effect
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isTimerRunning && timerSeconds > 0) {
      interval = setInterval(() => {
        setTimerSeconds((prev) => prev - 1);
      }, 1000);
    } else if (timerSeconds === 0 && isTimerRunning) {
      setIsTimerRunning(false);
      if (timerMode === 'focus') {
        setCompletedSessions((c) => c + 1);
        setTimerMode('break');
        setTimerSeconds(5 * 60);
      } else {
        setTimerMode('focus');
        setTimerSeconds(25 * 60);
      }
    }
    return () => clearInterval(interval);
  }, [isTimerRunning, timerSeconds, timerMode]);

  // AI Coach plan generator
  const handleGenerateAiPlan = (e: React.FormEvent) => {
    e.preventDefault();
    if (!aiCoachTopic.trim()) return;
    setIsGeneratingPlan(true);

    setTimeout(() => {
      setIsGeneratingPlan(false);
      setAiPlanResult(
        `🌿 Nixi Koç Çalışma Planı: "${aiCoachTopic}" (${aiCoachLevel} Seviye)\n\n` +
          `• 1. Gün: Kavram haritası çıkar & temel 15 flashcard oluştur (2x 25 Dk Pomodoro)\n` +
          `• 2. Gün: Soru çözümü & Feynman tekniği ile özet anlatım (3x 25 Dk Pomodoro)\n` +
          `• 3. Gün: Çıkmış sorular & 20 dakikalık aralıklı tekrar testi\n\n` +
          `İpucu: Her 2 blok sonrasında 10 dakikalık esneme molası ver 𐙚`
      );
    }, 500);
  };

  // Add important date
  const handleAddImportantDate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newDateTitle.trim() || !newDateVal.trim()) return;
    const newEntry = {
      id: `date-${Date.now()}`,
      title: newDateTitle.trim(),
      date: newDateVal,
      tag: 'Önemli 📌',
    };
    setImportantDates((prev) => [newEntry, ...prev]);
    setNewDateTitle('');
    setNewDateVal('');
  };

  // Add community post
  const handleAddCommunityPost = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPostText.trim()) return;
    const newPost = {
      id: `post-${Date.now()}`,
      author: profile.name,
      avatar: profile.avatarUrl,
      tag: newPostTag,
      text: newPostText.trim(),
      likes: 1,
      isLiked: true,
      time: 'Az önce',
    };
    setCommunityPosts((prev) => [newPost, ...prev]);
    setNewPostText('');
  };

  const handleToggleLikePost = (postId: string) => {
    setCommunityPosts((prev) =>
      prev.map((p) =>
        p.id === postId
          ? {
              ...p,
              isLiked: !p.isLiked,
              likes: p.isLiked ? p.likes - 1 : p.likes + 1,
            }
          : p
      )
    );
  };

  const handleDeletePost = (postId: string) => {
    setCommunityPosts((prev) => prev.filter((p) => p.id !== postId));
  };

  const QUIZ_QUESTIONS = [
    {
      q: '"Serendipity" kelimesinin en yakın Türkçe karşılığı nedir?',
      options: ['Zorunlu ders çalışma süresi', 'Mutlu ve şans eseri tatlı tesadüf', 'Kararsızlık ve erteleme'],
      correct: 1,
      explanation: 'Serendipity: Beklenmedik bir anda güzel bir şeye rastlama şansıdır 𐙚',
    },
    {
      q: '"Meticulous" sıfatı hangi öğrenci davranışını en iyi tanımlar?',
      options: ['Dersleri sürekli erteleyen', 'Özenli, detaylara dikkat eden', 'Hızlı ama dikkatsiz çalışan'],
      correct: 1,
      explanation: 'Meticulous: Titiz, ayrıntılara büyük özen gösteren demektir ✧',
    },
    {
      q: '"Active recall" yöntemi nasıl uygulanır?',
      options: ['Kitabı arka arkaya 5 kez okuyarak', 'Notlara bakmadan zihinden hatırlayarak', 'Sadece renkli kalemlerle çizerek'],
      correct: 1,
      explanation: 'Active recall: Bilgiyi hafızadan aktif olarak çağırma tekniğidir 🧠',
    },
  ];

  const renderContent = () => {
    switch (item.itemTitle) {
      // 1. NOT HESAPLAMA
      case 'Not Hesaplama':
        return <GradeCalculator profile={profile} />;

      // 2. DERS PROGRAMI
      case 'Ders Programı':
        return <WeeklyScheduleManager />;

      // 3. DERS ÇALIŞMA ZAMANLAYICISI
      case 'Ders Çalışma Zamanlayıcısı': {
        const minutes = Math.floor(timerSeconds / 60);
        const seconds = timerSeconds % 60;
        return (
          <div className="space-y-4 text-center font-stardew">
            <p className="text-xs text-[#6C7A89]">
              Stardew Valley temalı Pomodoro derin odaklanma ve mola zamanlayıcısı 𐙚
            </p>

            {/* Mode Switcher */}
            <div className="inline-flex bg-[#E5E3DB]/60 p-1 rounded-2xl border border-[#E5E3DB] gap-1">
              <button
                type="button"
                onClick={() => {
                  setIsTimerRunning(false);
                  setTimerMode('focus');
                  setTimerSeconds(25 * 60);
                }}
                className={`px-3 py-1 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  timerMode === 'focus' ? 'bg-[#2D6A4F] text-white shadow-xs' : 'text-[#6C7A89]'
                }`}
              >
                🌿 25 Dk Odak
              </button>
              <button
                type="button"
                onClick={() => {
                  setIsTimerRunning(false);
                  setTimerMode('break');
                  setTimerSeconds(5 * 60);
                }}
                className={`px-3 py-1 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  timerMode === 'break' ? 'bg-[#E07A5F] text-white shadow-xs' : 'text-[#6C7A89]'
                }`}
              >
                ☕ 5 Dk Mola
              </button>
            </div>

            {/* Main Clock Card */}
            <div className="p-6 bg-white rounded-3xl border-3 border-[#E5E3DB] shadow-xs">
              <div className="text-5xl font-mono font-extrabold text-[#1B263B] tracking-wider">
                {String(minutes).padStart(2, '0')}:{String(seconds).padStart(2, '0')}
              </div>
              <p className="text-xs font-bold mt-2 text-[#2D6A4F] flex items-center justify-center gap-1.5">
                <span>{isTimerRunning ? '🔥 Seans Devam Ediyor' : '☕ Başlamaya Hazır'}</span>
                <span className="text-[11px] text-[#6C7A89]">({completedSessions} Seans Tamamlandı)</span>
              </p>

              <div className="flex justify-center gap-2 mt-4">
                <PuffyStarButton
                  variant={isTimerRunning ? 'orange' : 'green'}
                  size="md"
                  onClick={() => setIsTimerRunning(!isTimerRunning)}
                >
                  {isTimerRunning ? 'Duraklat ⏸' : 'Başlat ▶ 𐙚'}
                </PuffyStarButton>
                <PuffyStarButton
                  variant="white"
                  size="md"
                  onClick={() => {
                    setIsTimerRunning(false);
                    setTimerSeconds(timerMode === 'focus' ? 25 * 60 : 5 * 60);
                  }}
                >
                  Sıfırla ↺
                </PuffyStarButton>
              </div>
            </div>
          </div>
        );
      }

      // 4. VERİMLİ DERS ÇALIŞMA
      case 'Verimli Ders Çalışma': {
        const currentTech = STUDY_TECHNIQUES.find((t) => t.id === activeTechniqueId) || STUDY_TECHNIQUES[0];
        return (
          <div className="space-y-3 font-stardew">
            <p className="text-xs text-[#6C7A89]">
              Bilimsel olarak kanıtlanmış 5 güçlü öğrenme tekniği ve adım adım uygulama rehberi 💡⋆
            </p>

            {/* Technique Selector */}
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar">
              {STUDY_TECHNIQUES.map((t) => (
                <button
                  key={t.id}
                  type="button"
                  onClick={() => setActiveTechniqueId(t.id)}
                  className={`py-1 px-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer shrink-0 flex items-center gap-1 border ${
                    activeTechniqueId === t.id
                      ? 'bg-[#1B263B] text-white border-[#1B263B]'
                      : 'bg-white text-[#6C7A89] border-[#E5E3DB]'
                  }`}
                >
                  <span>{t.icon}</span>
                  <span>{t.title.split(' ')[0]}</span>
                </button>
              ))}
            </div>

            {/* Technique Detail Card */}
            <div className="p-4 bg-white rounded-2xl border-2 border-[#E5E3DB] space-y-2.5 shadow-2xs">
              <div className="flex items-center gap-2">
                <span className="text-2xl">{currentTech.icon}</span>
                <div>
                  <h4 className="text-xs font-bold text-[#1B263B]">{currentTech.title}</h4>
                  <p className="text-[11px] text-[#E07A5F] font-bold">{currentTech.subtitle}</p>
                </div>
              </div>

              <div className="space-y-1.5 pt-1">
                {currentTech.steps.map((step, idx) => (
                  <div key={idx} className="flex items-start gap-2 text-xs text-[#1B263B] leading-snug">
                    <span className="w-5 h-5 rounded-full bg-[#FAF9F6] border border-[#E5E3DB] flex items-center justify-center font-bold text-[10px] text-[#2D6A4F] shrink-0">
                      {idx + 1}
                    </span>
                    <span>{step}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        );
      }

      // 5. ÖNEMLİ GÜNLER
      case 'Önemli Günler':
        return (
          <div className="space-y-3 font-stardew">
            <p className="text-xs text-[#6C7A89]">
              Dönem sınavları, vize-final takvimi, proje teslimleri ve resmi tatiller 📌𐙚
            </p>

            {/* Add Date Form */}
            <form onSubmit={handleAddImportantDate} className="bg-white p-3 rounded-2xl border-2 border-[#E5E3DB] space-y-2">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                <input
                  type="text"
                  required
                  value={newDateTitle}
                  onChange={(e) => setNewDateTitle(e.target.value)}
                  placeholder="Etkinlik / Sınav Adı"
                  className="bg-[#FAF9F6] border border-[#E5E3DB] rounded-xl px-2.5 py-1.5 text-xs text-[#1B263B]"
                />
                <input
                  type="date"
                  required
                  value={newDateVal}
                  onChange={(e) => setNewDateVal(e.target.value)}
                  className="bg-[#FAF9F6] border border-[#E5E3DB] rounded-xl px-2.5 py-1.5 text-xs text-[#1B263B]"
                />
              </div>
              <PuffyStarButton
                type="submit"
                variant="orange"
                size="sm"
                className="w-full justify-center py-1.5!"
              >
                + Önemli Gün Ekle 𐙚
              </PuffyStarButton>
            </form>

            {/* List of dates */}
            <div className="space-y-2 max-h-52 overflow-y-auto pr-1">
              {importantDates.map((item) => (
                <div
                  key={item.id}
                  className="p-2.5 bg-white rounded-xl border border-[#E5E3DB] flex items-center justify-between gap-2 shadow-2xs"
                >
                  <div className="min-w-0">
                    <span className="text-xs font-bold text-[#1B263B] block truncate">{item.title}</span>
                    <span className="text-[10px] text-[#6C7A89] flex items-center gap-1 mt-0.5">
                      <Calendar className="w-3 h-3 text-[#E07A5F]" />
                      {item.date}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#FAF9F6] text-[#2D6A4F] border border-[#E5E3DB]">
                      {item.tag}
                    </span>
                    <button
                      type="button"
                      onClick={() => setImportantDates((prev) => prev.filter((d) => d.id !== item.id))}
                      className="p-1 text-[#6C7A89] hover:text-[#915050] cursor-pointer"
                    >
                      <Trash2 className="w-3 h-3" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        );

      // 6. YAPAY ZEKA KOÇU
      case 'Ders çalışma planı':
      case 'Hedef oluşturma':
      case 'Derslerle ilgili yardım':
        return (
          <div className="space-y-3 font-stardew">
            <p className="text-xs text-[#6C7A89]">
              Nixi Çevrimdışı Çalışma Asistanı ile ders hedefleri belirle ve hazır planlar üret 🤖✧
            </p>

            <form onSubmit={handleGenerateAiPlan} className="space-y-2.5 bg-white p-3.5 rounded-2xl border-2 border-[#E5E3DB]">
              <div>
                <label className="block text-[11px] font-bold text-[#1B263B] mb-1">
                  Çalışmak İstediğin Ders veya Konu:
                </label>
                <input
                  type="text"
                  required
                  value={aiCoachTopic}
                  onChange={(e) => setAiCoachTopic(e.target.value)}
                  placeholder="Örn: Biyokimya fotosentez, Diferansiyel Denklemler, Edebiyat Tanzimat"
                  className="w-full bg-[#FAF9F6] border border-[#E5E3DB] rounded-xl px-3 py-1.5 text-xs text-[#1B263B] focus:outline-hidden focus:ring-2 focus:ring-[#F4C542]"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-[#1B263B] mb-1">
                  Hedef Yoğunluğu:
                </label>
                <div className="grid grid-cols-3 gap-1.5">
                  {['Hafif (1-2 Gün)', 'Orta (3-5 Gün)', 'Yoğun Vize Kampı'].map((lvl) => (
                    <button
                      key={lvl}
                      type="button"
                      onClick={() => setAiCoachLevel(lvl)}
                      className={`py-1 text-[11px] font-bold rounded-xl border transition-all cursor-pointer ${
                        aiCoachLevel === lvl
                          ? 'bg-[#E07A5F] text-white border-[#E07A5F]'
                          : 'bg-[#FAF9F6] text-[#6C7A89] border-[#E5E3DB]'
                      }`}
                    >
                      {lvl}
                    </button>
                  ))}
                </div>
              </div>

              <PuffyStarButton
                type="submit"
                variant="orange"
                size="sm"
                className="w-full justify-center py-2!"
              >
                <Zap className="w-3.5 h-3.5 mr-1 inline" />
                {isGeneratingPlan ? 'Plan Hazırlanıyor...' : 'Akıllı Çalışma Planı Oluştur 𐙚'}
              </PuffyStarButton>
            </form>

            {aiPlanResult && (
              <div className="p-3.5 rounded-2xl bg-[#FAF9F6] border-2 border-[#E5E3DB] text-xs leading-relaxed text-[#1B263B] whitespace-pre-line animate-fadeIn">
                {aiPlanResult}
              </div>
            )}
          </div>
        );

      // 7. YABANCI DİL: KELİME ÇALIŞMASI, QUİZ, DİL ÇALIŞMA ALANI
      case 'Kelime çalışması':
      case 'Mini quiz':
      case 'Dil çalışma alanı': {
        const currentCard = INITIAL_VOCAB_CARDS[vocabIndex];
        const isLearned = learnedCards[vocabIndex];
        return (
          <div className="space-y-3 font-stardew">
            {/* Flashcard Header & Level */}
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-[#1B263B] flex items-center gap-1">
                <span>Kelime Kartı {vocabIndex + 1}/{INITIAL_VOCAB_CARDS.length}</span>
                <span className="text-[#E07A5F]">🌍</span>
              </span>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#FAF9F6] text-[#2D6A4F] border border-[#E5E3DB]">
                {currentCard.level}
              </span>
            </div>

            {/* Flip Flashcard */}
            <div
              onClick={() => setIsVocabFlipped(!isVocabFlipped)}
              className="p-6 bg-white rounded-3xl border-3 border-[#E5E3DB] text-center shadow-xs cursor-pointer min-h-[140px] flex flex-col justify-center transition-all hover:scale-[1.01]"
            >
              {!isVocabFlipped ? (
                <div>
                  <span className="text-[10px] text-[#6C7A89] font-bold uppercase block mb-1">İngilizce ({currentCard.type})</span>
                  <h3 className="text-2xl font-extrabold text-[#1B263B]">{currentCard.word}</h3>
                  <span className="text-[10px] text-[#E07A5F] mt-2 block font-bold">Kartı çevirmek için tıkla 𐙚</span>
                </div>
              ) : (
                <div className="animate-fadeIn">
                  <span className="text-[10px] text-[#2D6A4F] font-bold uppercase block mb-1">Türkçe Anlamı</span>
                  <h4 className="text-base font-bold text-[#1B263B]">{currentCard.meaning}</h4>
                  <p className="text-[11px] text-[#6C7A89] italic mt-2">"{currentCard.example}"</p>
                </div>
              )}
            </div>

            {/* Flashcard Controls */}
            <div className="flex items-center justify-between gap-2">
              <button
                type="button"
                onClick={() => {
                  setIsVocabFlipped(false);
                  setVocabIndex((prev) => (prev > 0 ? prev - 1 : INITIAL_VOCAB_CARDS.length - 1));
                }}
                className="py-1.5 px-3 rounded-xl bg-white border-2 border-[#E5E3DB] text-xs font-bold text-[#1B263B] cursor-pointer"
              >
                ← Önceki
              </button>

              <button
                type="button"
                onClick={() => {
                  setLearnedCards((prev) => ({ ...prev, [vocabIndex]: !prev[vocabIndex] }));
                }}
                className={`py-1.5 px-3 rounded-xl text-xs font-bold border-2 transition-all cursor-pointer ${
                  isLearned
                    ? 'bg-[#2D6A4F] text-white border-[#2D6A4F]'
                    : 'bg-white text-[#2D6A4F] border-[#2D6A4F]'
                }`}
              >
                {isLearned ? '✓ Öğrenildi' : 'Öğrendim Olarak İşaretle'}
              </button>

              <button
                type="button"
                onClick={() => {
                  setIsVocabFlipped(false);
                  setVocabIndex((prev) => (prev < INITIAL_VOCAB_CARDS.length - 1 ? prev + 1 : 0));
                }}
                className="py-1.5 px-3 rounded-xl bg-white border-2 border-[#E5E3DB] text-xs font-bold text-[#1B263B] cursor-pointer"
              >
                Sonraki →
              </button>
            </div>

            {/* Mini Quiz Section */}
            <div className="p-3.5 bg-white rounded-2xl border-2 border-[#E5E3DB] space-y-2">
              <span className="text-[10px] font-bold text-[#E07A5F] uppercase">Günün Mini Kelime Testi</span>
              <h4 className="text-xs font-bold text-[#1B263B]">
                {QUIZ_QUESTIONS[quizStep].q}
              </h4>

              <div className="space-y-1.5">
                {QUIZ_QUESTIONS[quizStep].options.map((opt, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => {
                      setSelectedQuizAnswer(idx);
                      if (idx === QUIZ_QUESTIONS[quizStep].correct) {
                        setQuizScore((s) => s + 1);
                      }
                    }}
                    className={`w-full text-left px-3 py-2 rounded-xl text-xs font-medium border transition-all cursor-pointer ${
                      selectedQuizAnswer === idx
                        ? idx === QUIZ_QUESTIONS[quizStep].correct
                          ? 'bg-[#2D6A4F] text-white border-[#2D6A4F]'
                          : 'bg-[#D4A5A5] text-[#4A2020] border-[#D4A5A5]'
                        : 'bg-[#FAF9F6] text-[#1B263B] border-[#E5E3DB] hover:bg-white'
                    }`}
                  >
                    {opt}
                  </button>
                ))}
              </div>

              {selectedQuizAnswer !== null && (
                <div className="text-[11px] font-bold text-[#2D6A4F] pt-1">
                  {QUIZ_QUESTIONS[quizStep].explanation}
                </div>
              )}
            </div>
          </div>
        );
      }

      // 8. MOLALAR: TARİFLER & AKTİVİTELER
      case 'Mini atıştırmalık tarifleri':
      case 'Mola aktiviteleri':
      case 'Kısa mola önerileri':
        return (
          <div className="space-y-3 font-stardew">
            <p className="text-xs text-[#6C7A89]">
              Ders aralarında enerjini ve odaklanmanı tazeleyecek pratik mola fikirleri 🍪☕
            </p>

            <div className="grid grid-cols-3 gap-1.5 bg-[#E5E3DB]/60 p-1 rounded-2xl border border-[#E5E3DB]">
              <button
                type="button"
                onClick={() => setActiveBreakTab('snacks')}
                className={`py-1 text-xs font-bold rounded-xl transition-all cursor-pointer ${
                  activeBreakTab === 'snacks' ? 'bg-white text-[#1B263B] shadow-xs' : 'text-[#6C7A89]'
                }`}
              >
                🍵 Tarifler
              </button>
              <button
                type="button"
                onClick={() => setActiveBreakTab('activity')}
                className={`py-1 text-xs font-bold rounded-xl transition-all cursor-pointer ${
                  activeBreakTab === 'activity' ? 'bg-white text-[#1B263B] shadow-xs' : 'text-[#6C7A89]'
                }`}
              >
                🧘‍♀️ Egzersiz
              </button>
              <button
                type="button"
                onClick={() => setActiveBreakTab('short')}
                className={`py-1 text-xs font-bold rounded-xl transition-all cursor-pointer ${
                  activeBreakTab === 'short' ? 'bg-white text-[#1B263B] shadow-xs' : 'text-[#6C7A89]'
                }`}
              >
                ☕ 5 Dk Mola
              </button>
            </div>

            {activeBreakTab === 'snacks' && (
              <div className="space-y-2">
                <div className="p-3 bg-white rounded-2xl border-2 border-[#E5E3DB]">
                  <div className="flex items-center gap-2">
                    <span className="text-lg">🍵</span>
                    <div>
                      <h4 className="text-xs font-bold text-[#1B263B]">Buzlu Yulaf Sütü Matcha Latte</h4>
                      <p className="text-[11px] text-[#6C7A89]">1 çay kaşığı matcha + 150ml yulaf sütü + 1 tatlı kaşığı bal</p>
                    </div>
                  </div>
                </div>
                <div className="p-3 bg-white rounded-2xl border-2 border-[#E5E3DB]">
                  <div className="flex items-center gap-2">
                    <span className="text-lg">🥑</span>
                    <div>
                      <h4 className="text-xs font-bold text-[#1B263B]">Muzlu &amp; Fıstık Ezmeli Enerji Tostu</h4>
                      <p className="text-[11px] text-[#6C7A89]">Tam buğday ekmeği üzerine chia tohumu serpiştirilmiş dilimler</p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeBreakTab === 'activity' && (
              <div className="p-4 bg-white rounded-2xl border-2 border-[#E5E3DB] text-center space-y-2">
                <h4 className="text-xs font-bold text-[#1B263B]">2 Dakikalık Nefes ve Göz Dinlendirme</h4>
                <div className="w-20 h-20 mx-auto rounded-full bg-[#FAF9F6] border-2 border-[#2D6A4F] flex items-center justify-center text-xs font-bold text-[#2D6A4F] animate-pulse">
                  {breathingPhase}
                </div>
                <p className="text-[11px] text-[#6C7A89]">
                  Her 20 dakikada bir, 6 metre uzağa 20 saniye boyunca bakarak göz kaslarını gevşet ⋆˚࿔
                </p>
              </div>
            )}

            {activeBreakTab === 'short' && (
              <div className="p-4 bg-white rounded-2xl border-2 border-[#E5E3DB] text-center space-y-3">
                <PuffyStarButton
                  variant="orange"
                  size="sm"
                  onClick={() => {
                    const ideas = [
                      '1 bardak ılık su iç ve omuzlarını 10 kez geriye doğru çevir 💧',
                      'Pencereyi aç ve 1 dakika boyunca dışarıdaki gökyüzünü izle 🌤️',
                      'En sevdiğin 1 şarkıyı aç ve gözlerini kapatıp sadece dinle 🎧',
                      'Bileklerini ve parmaklarını esnetip 5 kez derin nefes al 𐙚',
                    ];
                    setRandomBreakIdea(ideas[Math.floor(Math.random() * ideas.length)]);
                  }}
                  className="w-full justify-center"
                >
                  🎲 Rastgele 5 Dk Mola Fikri Üret
                </PuffyStarButton>
                {randomBreakIdea && (
                  <div className="p-3 bg-[#FAF9F6] rounded-xl border border-[#E5E3DB] text-xs font-bold text-[#1B263B]">
                    {randomBreakIdea}
                  </div>
                )}
              </div>
            )}
          </div>
        );

      // 9. TEMALAR
      case 'Tema Koleksiyonum':
      case 'Kilidi Açılan Temalar':
      case 'Kendin Yap Teması':
        return (
          <div className="space-y-3 font-stardew">
            <p className="text-xs text-[#6C7A89]">
              Stardew Valley temaları, kilidi açılan paletler ve kişiselleştirilmiş kendin yap teması 🎨𐙚
            </p>

            <div className="p-4 bg-white rounded-2xl border-2 border-[#E5E3DB] space-y-3">
              <h4 className="text-xs font-bold text-[#1B263B] flex items-center justify-between">
                <span>Kişisel Kendin Yap Teması</span>
                <span className="text-[10px] text-[#E07A5F] font-bold">Özelleştirilebilir ✧</span>
              </h4>

              <div className="grid grid-cols-2 gap-2 text-xs">
                <div>
                  <label className="block text-[11px] font-bold text-[#1B263B] mb-1">Vurgu Rengi</label>
                  <input
                    type="color"
                    value={diyPrimaryColor}
                    onChange={(e) => setDiyPrimaryColor(e.target.value)}
                    className="w-full h-8 rounded-lg cursor-pointer"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-[#1B263B] mb-1">Arka Plan Rengi</label>
                  <input
                    type="color"
                    value={diyBgColor}
                    onChange={(e) => setDiyBgColor(e.target.value)}
                    className="w-full h-8 rounded-lg cursor-pointer"
                  />
                </div>
              </div>

              {/* Preview Box */}
              <div
                style={{ backgroundColor: diyBgColor }}
                className="p-3 rounded-xl border-2 border-[#E5E3DB] text-center"
              >
                <span style={{ color: diyPrimaryColor }} className="text-xs font-extrabold block">
                  ★ Önizleme: Nixi Stardew Teması 𐙚
                </span>
                <p className="text-[10px] text-[#6C7A89] mt-0.5">Seviye ilerledikçe yeni temaların kilidi açılır.</p>
              </div>
            </div>

            {onOpenOnboarding && (
              <PuffyStarButton
                variant="orange"
                size="sm"
                className="w-full justify-center py-2!"
                onClick={() => {
                  onClose();
                  onOpenOnboarding();
                }}
              >
                Tüm Temaları Keşfet 𐙚
              </PuffyStarButton>
            )}
          </div>
        );

      // 10. TOPLULUK: ŞİPŞAK, YAZILAR, KEŞFET
      case 'Şipşak':
      case 'Yazılar':
      case 'Keşfet':
        return (
          <div className="space-y-3 font-stardew">
            <p className="text-xs text-[#6C7A89]">
              Öğrencilerin paylaştığı ders notları, çalışma anları ve ipuçları 👥𐙚
            </p>

            {/* Create Post Form */}
            <form onSubmit={handleAddCommunityPost} className="bg-white p-3 rounded-2xl border-2 border-[#E5E3DB] space-y-2">
              <textarea
                rows={2}
                required
                value={newPostText}
                onChange={(e) => setNewPostText(e.target.value)}
                placeholder="Bugünkü ders notunu veya çalışma ipucunu paylaş 𐙚"
                className="w-full bg-[#FAF9F6] border border-[#E5E3DB] rounded-xl p-2 text-xs text-[#1B263B] resize-none"
              />
              <div className="flex items-center justify-between gap-2">
                <select
                  value={newPostTag}
                  onChange={(e) => setNewPostTag(e.target.value)}
                  className="bg-[#FAF9F6] border border-[#E5E3DB] rounded-xl px-2 py-1 text-[11px] text-[#1B263B]"
                >
                  <option value="Ders Notu 𐙚">Ders Notu 𐙚</option>
                  <option value="Sınav İpucu 📌">Sınav İpucu 📌</option>
                  <option value="Masa Düzeni ☕">Masa Düzeni ☕</option>
                </select>
                <PuffyStarButton type="submit" variant="orange" size="sm" className="text-xs py-1! px-3!">
                  Paylaş ᝰ.ᐟ
                </PuffyStarButton>
              </div>
            </form>

            {/* Posts Feed */}
            <div className="space-y-2.5 max-h-56 overflow-y-auto pr-1">
              {communityPosts.map((post) => (
                <div key={post.id} className="p-3 bg-white rounded-2xl border-2 border-[#E5E3DB] space-y-1.5 shadow-2xs">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <img
                        src={post.avatar}
                        alt={post.author}
                        referrerPolicy="no-referrer"
                        className="w-6 h-6 rounded-full object-cover border border-[#E5E3DB]"
                      />
                      <span className="text-xs font-bold text-[#1B263B]">{post.author}</span>
                      <span className="text-[10px] text-[#E07A5F] font-bold bg-[#E07A5F]/10 px-1.5 py-0.2 rounded-md">
                        {post.tag}
                      </span>
                    </div>
                    <button
                      type="button"
                      onClick={() => handleDeletePost(post.id)}
                      className="p-1 text-[#6C7A89] hover:text-[#915050] cursor-pointer"
                    >
                      <Trash2 className="w-3 h-3" />
                    </button>
                  </div>
                  <p className="text-xs text-[#1B263B] leading-relaxed">{post.text}</p>
                  <div className="flex items-center justify-between text-[10px] text-[#6C7A89] pt-1 border-t border-[#E5E3DB]">
                    <span>{post.time}</span>
                    <button
                      type="button"
                      onClick={() => handleToggleLikePost(post.id)}
                      className={`flex items-center gap-1 font-bold cursor-pointer ${
                        post.isLiked ? 'text-[#D4A5A5]' : 'hover:text-[#D4A5A5]'
                      }`}
                    >
                      <Heart className={`w-3 h-3 ${post.isLiked ? 'fill-[#D4A5A5]' : ''}`} />
                      <span>{post.likes} Beğeni</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        );

      // 11. PROFİL & BAŞARIMLAR
      case 'Profili Görüntüle':
      case 'Başarımlar':
      case 'Koleksiyon':
        return (
          <div className="space-y-3 text-center font-stardew">
            <p className="text-xs text-[#6C7A89]">
              Profil özetin, kazanılan seviye puanları ve açılan Stardew rozetleri 👤🏆
            </p>

            <div className="p-4 bg-white rounded-2xl border-2 border-[#E5E3DB] flex items-center justify-center gap-3">
              <img
                src={profile.avatarUrl}
                alt={profile.name}
                referrerPolicy="no-referrer"
                className="w-14 h-14 rounded-2xl object-cover ring-2 ring-[#F4C542]"
              />
              <div className="text-left">
                <h4 className="text-xs font-bold text-[#1B263B]">{profile.name}</h4>
                <p className="text-[11px] text-[#6C7A89]">{profile.handle}</p>
                <p className="text-[10px] text-[#2D6A4F] font-bold">
                  {levelInfo.pointIcon} Seviye {levelInfo.level} ({levelInfo.totalPoints} {levelInfo.pointName})
                </p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2 text-left text-xs">
              <div className="p-2.5 bg-white rounded-xl border border-[#E5E3DB]">
                <span className="text-base block mb-0.5">🌟 İlk Adım</span>
                <span className="font-bold text-[#1B263B]">Nixi Başlangıcı</span>
                <p className="text-[10px] text-[#2D6A4F] mt-0.5">✓ Tamamlandı</p>
              </div>
              <div className="p-2.5 bg-white rounded-xl border border-[#E5E3DB]">
                <span className="text-base block mb-0.5">⏱️ Odak Ustası</span>
                <span className="font-bold text-[#1B263B]">10+ Pomodoro</span>
                <p className="text-[10px] text-[#E07A5F] mt-0.5">Kazanıldı 𐙚</p>
              </div>
            </div>

            {onEditProfile && (
              <PuffyStarButton
                variant="pink"
                size="md"
                className="w-full justify-center py-2!"
                onClick={() => {
                  onClose();
                  onEditProfile();
                }}
              >
                Profili Düzenle 𐙚
              </PuffyStarButton>
            )}
          </div>
        );

      // 12. AYARLAR: HESAP, GİZLİLİK, BİLDİRİMLER, DİL
      case 'Hesap':
      case 'Gizlilik':
      case 'Bildirimler':
      case 'Dil':
        return (
          <div className="space-y-3 font-stardew">
            <p className="text-xs text-[#6C7A89]">
              Uygulama tercihleri, cihaz içi veri saklama ve bildirim yönetimi ⚙️✧
            </p>

            <div className="bg-white rounded-2xl border-2 border-[#E5E3DB] divide-y divide-[#E5E3DB]">
              <div className="p-3 flex items-center justify-between text-xs">
                <div>
                  <span className="font-bold text-[#1B263B] block">Yerel Veri Saklama</span>
                  <span className="text-[10px] text-[#6C7A89]">Verilerin sadece bu cihazda saklanır</span>
                </div>
                <span className="text-[10px] font-bold text-[#2D6A4F] bg-[#2D6A4F]/10 px-2 py-0.5 rounded-full">
                  Aktif ✓
                </span>
              </div>
              <div className="p-3 flex items-center justify-between text-xs">
                <div>
                  <span className="font-bold text-[#1B263B] block">Uygulama Dili</span>
                  <span className="text-[10px] text-[#6C7A89]">Türkçe (Varsayılan)</span>
                </div>
                <span className="text-xs font-bold text-[#1B263B]">🇹🇷 TR</span>
              </div>
              <div className="p-3 flex items-center justify-between text-xs">
                <div>
                  <span className="font-bold text-[#1B263B] block">Ses Efektleri &amp; Titreşim</span>
                  <span className="text-[10px] text-[#6C7A89]">Pomodoro ve görev tamamlama sesleri</span>
                </div>
                <span className="text-[10px] font-bold text-[#2D6A4F] bg-[#2D6A4F]/10 px-2 py-0.5 rounded-full">
                  Açık ✓
                </span>
              </div>
            </div>
          </div>
        );

      // DEFAULT FALLBACK
      default:
        return (
          <div className="space-y-3 font-stardew">
            <div className="p-4 bg-white rounded-2xl border-2 border-[#E5E3DB]">
              <div className="flex items-center gap-2 mb-2">
                <span className="text-lg">{item.icon}</span>
                <div>
                  <h4 className="text-xs font-bold text-[#1B263B]">{item.itemTitle}</h4>
                  <span className="text-[10px] text-[#E07A5F] font-bold">{item.sectionTitle}</span>
                </div>
              </div>
              <p className="text-xs text-[#6C7A89] leading-relaxed">
                Bu bölüm Nixi çalışma ortamında öğrencinin günlük akışını desteklemek için hazırlandı. Tüm verilerin cihazında güvenle saklanır ⋆˚࿔
              </p>
            </div>
          </div>
        );
    }
  };

  return (
    <div className="fixed inset-0 z-60 flex items-center justify-center p-3 sm:p-4 bg-black/40 backdrop-blur-xs font-stardew animate-fadeIn">
      <div className="bg-[#FAF9F6] rounded-3xl border-3 border-[#E5E3DB] shadow-2xl w-full max-w-md overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="p-3.5 sm:p-4 bg-white border-b-2 border-[#E5E3DB] flex items-center justify-between">
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="w-8 h-8 rounded-2xl bg-[#FAF9F6] border border-[#E5E3DB] flex items-center justify-center text-sm font-bold shrink-0">
              {item.icon}
            </div>
            <div className="min-w-0">
              <h3 className="text-xs sm:text-sm font-bold text-[#1B263B] truncate flex items-center gap-1">
                <span>{item.itemTitle}</span>
                <span className="text-[#E07A5F] text-xs">𐙚</span>
              </h3>
              <span className="text-[10px] text-[#6C7A89] block">{item.sectionTitle}</span>
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

        {/* Modal Body */}
        <div className="p-4 sm:p-5 overflow-y-auto max-h-[75vh]">{renderContent()}</div>

        {/* Footer */}
        <div className="p-3 bg-white border-t border-[#E5E3DB] flex items-center justify-between text-[11px] text-[#6C7A89]">
          <span>Nixi Öğrenci Asistanı ⋆˚࿔</span>
          <button
            type="button"
            onClick={onClose}
            className="px-3 py-1 rounded-xl text-xs font-bold text-[#1B263B] hover:bg-[#FAF9F6] transition-colors cursor-pointer"
          >
            Tamam 𐙚
          </button>
        </div>
      </div>
    </div>
  );
}
