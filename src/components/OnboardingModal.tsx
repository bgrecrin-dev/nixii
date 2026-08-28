import { useState } from 'react';
import {
  Sparkles,
  Check,
  ChevronRight,
  ChevronLeft,
  Heart,
  BookOpen,
  Target,
  Palette,
  Compass,
  Smile,
  LayoutGrid,
  Zap,
  GraduationCap,
} from 'lucide-react';
import { StudentProfile, ThemeStyle, EducationLevel } from '../types';
import PuffyStarButton from './PuffyStarButton';
import AvatarSelector, { AVATAR_PRESETS } from './AvatarSelector';
import { THEME_CONFIGS } from '../utils/themeLevel';

interface OnboardingModalProps {
  isOpen: boolean;
  initialProfile: StudentProfile;
  onComplete: (profile: StudentProfile) => void;
}

const EDUCATION_LEVELS: { id: EducationLevel; label: string; icon: string }[] = [
  { id: 'ortaokul', label: 'Ortaokul', icon: '🎒' },
  { id: 'lise', label: 'Lise', icon: '📐' },
  { id: 'universite', label: 'Üniversite', icon: '🎓' },
];

const GRADE_OPTIONS: Record<EducationLevel, string[]> = {
  ortaokul: ['5. Sınıf', '6. Sınıf', '7. Sınıf', '8. Sınıf'],
  lise: ['9. Sınıf', '10. Sınıf', '11. Sınıf', '12. Sınıf (YKS/Mezun)'],
  universite: ['1. Sınıf (Hazırlık/Freshman)', '2. Sınıf', '3. Sınıf', '4. Sınıf (Son Sınıf)', 'Yüksek Lisans / Doktora'],
};

const STUDY_GOALS_OPTIONS = [
  '🌿 Vize ve Finalleri Başarıyla Geç',
  '☕ Günlük 25 Dk Pomodoro Odaklanması',
  '📚 Aktif Hatırlama ve Bilgi Kartları',
  '🌸 Estetik ve Sade Ders Notları',
  '💻 Kodlama ve Problem Çözme Becerileri',
  '🌷 Denge, Düzenli Uyku ve İyi Yaşam',
  '🍵 Düzenli Sabah Çalışma Rutini',
  '🎨 Yaratıcı Portfolyo ve Tasarım',
];

const THEME_OPTIONS: {
  id: ThemeStyle;
  name: string;
  sub: string;
  pointInfo: string;
  bgClass: string;
  borderClass: string;
  textClass: string;
  hex: string;
  symbol: string;
}[] = [
  {
    id: 'anime',
    name: 'Anime & Çiçek',
    sub: 'Sakura Çiçekleri & Manga Estetiği',
    pointInfo: '🌸 Sakura Puanı Sistemi',
    bgClass: 'bg-[#FCE7F3]',
    borderClass: 'border-[#F472B6]',
    textClass: 'text-[#DB2777]',
    hex: '#F472B6',
    symbol: '🌸',
  },
  {
    id: 'football',
    name: 'Futbol & Saha',
    sub: 'Taktik Analiz ve Maç Disiplini',
    pointInfo: '⚽ Gol Puanı Sistemi',
    bgClass: 'bg-[#DCFCE7]',
    borderClass: 'border-[#4ADE80]',
    textClass: 'text-[#16A34A]',
    hex: '#16A34A',
    symbol: '⚽',
  },
  {
    id: 'gaming',
    name: 'Gaming & XP',
    sub: 'Seviye Atlama ve Görev Tamamlama',
    pointInfo: '🎮 XP Puanı Sistemi',
    bgClass: 'bg-[#EDE9FE]',
    borderClass: 'border-[#A78BFA]',
    textClass: 'text-[#7C3AED]',
    hex: '#7C3AED',
    symbol: '🎮',
  },
  {
    id: 'orange',
    name: 'Turuncu & Şeftali',
    sub: 'Sonbahar Işıltısı ve Sıcak Motivasyon',
    pointInfo: '🍊 Yıldız Puanı Sistemi',
    bgClass: 'bg-[#E07A5F]',
    borderClass: 'border-[#E07A5F]',
    textClass: 'text-[#B8573D]',
    hex: '#E07A5F',
    symbol: '🍊',
  },
  {
    id: 'green',
    name: 'Doğal Yeşil & Stardew',
    sub: 'Huzurlu Çiftlik ve Zihinsel Berraklık',
    pointInfo: '🌿 Yaprak Puanı Sistemi',
    bgClass: 'bg-[#2D6A4F]',
    borderClass: 'border-[#2D6A4F]',
    textClass: 'text-[#2D6A4F]',
    hex: '#2D6A4F',
    symbol: '🌿',
  },
  {
    id: 'navy',
    name: 'Gece Laciverti',
    sub: 'Derin Mantık ve Gece Kütüphanesi',
    pointInfo: '🌌 Kozmik Puan Sistemi',
    bgClass: 'bg-[#1B263B]',
    borderClass: 'border-[#1B263B]',
    textClass: 'text-[#1B263B]',
    hex: '#1B263B',
    symbol: '🌌',
  },
];

const PERSONAL_GOAL_SUGGESTIONS = [
  'Kullanıcı arayüzü prensiplerinde ustalaş, günde 30 dk kitap oku ve bu dönem 3.8 ortalama yap! ⋆˚࿔ 𐙚',
  '🌿 Tüm biyokimya laboratuvar raporlarını teslimden 24 saat önce bitir ve her sabah 3 saat çalış.',
  '🌸 Öne çıkan bir tasarım portfolyosu hazırla ve her gece uyku düzenini koru ౨ৎ',
  '☕ Bu dönem 100 Pomodoro seansını tamamla ve çalışma aralarında su içmeyi unutma ★',
];

const QUICK_SYMBOLS = ['⋆˚࿔', '𐙚', 'ᡣ𐭩', '౨ৎ', '✮', '❀', '｡𖦹°‧', 'ᶻ 𝗓 𐰁', '𝄞⨾𓍢ִ໋♬', '𓍯', '🎐', 'ᥫ᭡'];

export default function OnboardingModal({
  isOpen,
  initialProfile: initialData,
  onComplete,
}: OnboardingModalProps) {
  const [step, setStep] = useState<number>(1);

  // Form State
  const [name, setName] = useState(initialData.name || 'Elena');
  const [handle, setHandle] = useState(initialData.handle || '@elena.calisiyor');
  const [educationLevel, setEducationLevel] = useState<EducationLevel>(
    initialData.educationLevel || 'universite'
  );
  const [grade, setGrade] = useState(
    initialData.grade || GRADE_OPTIONS[initialData.educationLevel || 'universite'][0]
  );
  const [bio, setBio] = useState(
    initialData.bio || 'Minimalist ders çalışma, lo-fi ve huzurlu hedefler ⋆˚࿔'
  );
  const [avatarUrl, setAvatarUrl] = useState(initialData.avatarUrl || AVATAR_PRESETS[0].url);
  const [selectedGoals, setSelectedGoals] = useState<string[]>(
    initialData.selectedGoals && initialData.selectedGoals.length > 0
      ? initialData.selectedGoals
      : ['🌿 Vize ve Finalleri Başarıyla Geç', '☕ Günlük 25 Dk Pomodoro Odaklanması', '🌸 Estetik ve Sade Ders Notları']
  );
  const [favoriteTheme, setFavoriteTheme] = useState<ThemeStyle>(
    initialData.favoriteTheme || 'orange'
  );
  const [personalGoal, setPersonalGoal] = useState(
    initialData.personalGoal ||
      'Günde 30 dk kitap oku, Pomodoro seanslarını tamamla ve hedeflerine ulaş! ⋆˚࿔ 𐙚'
  );

  if (!isOpen) return null;

  const handleEducationLevelChange = (level: EducationLevel) => {
    setEducationLevel(level);
    setGrade(GRADE_OPTIONS[level][0]);
  };

  const toggleGoal = (goal: string) => {
    if (selectedGoals.includes(goal)) {
      setSelectedGoals(selectedGoals.filter((g) => g !== goal));
    } else {
      setSelectedGoals([...selectedGoals, goal]);
    }
  };

  const handleInsertKaomoji = (symbol: string) => {
    setPersonalGoal((prev) => `${prev} ${symbol}`.trim());
  };

  const handleInsertKaomojiToBio = (symbol: string) => {
    setBio((prev) => `${prev} ${symbol}`.trim());
  };

  const handleFinish = () => {
    const formattedHandle = handle.trim().startsWith('@')
      ? handle.trim()
      : `@${handle.trim() || 'ogrenci'}`;

    const updatedProfile: StudentProfile = {
      ...initialData,
      name: name.trim() || 'Elena',
      handle: formattedHandle,
      educationLevel,
      grade,
      year: grade,
      major: '',
      university: '',
      bio: bio.trim() || 'Minimalist ders çalışma, lo-fi ve huzurlu hedefler ⋆˚࿔',
      avatarUrl: avatarUrl || AVATAR_PRESETS[0].url,
      selectedGoals: selectedGoals.length > 0 ? selectedGoals : ['🌿 Günlük Ders Odağı'],
      favoriteTheme,
      personalGoal: personalGoal.trim() || 'Dönem karmaşasında huzur yarat ve hedeflerine ulaş ⋆˚࿔',
    };
    onComplete(updatedProfile);
  };

  const totalSteps = 6;

  const currentThemeObj = THEME_OPTIONS.find((t) => t.id === favoriteTheme) || THEME_OPTIONS[3];

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-[#1B263B]/65 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 font-stardew">
      <div className="relative bg-[#FAF9F6] rounded-3xl max-w-lg w-full overflow-hidden border-3 border-[#E5E3DB] shadow-2xl z-10 animate-in fade-in zoom-in-95 duration-200">
        
        {/* Top Header Banner */}
        <div className="bg-gradient-to-r from-[#1B263B] via-[#24334d] to-[#1B263B] p-4 text-white text-center relative border-b-2 border-[#E07A5F]/40">
          <div className="flex items-center justify-center gap-1.5 text-xs text-[#F4C542] font-bold uppercase tracking-wider mb-1">
            <span>⋆˚࿔</span>
            <span>Nixi Öğrenci Kurulumu</span>
            <span>𐙚</span>
          </div>
          <h2 className="text-lg sm:text-xl font-bold tracking-tight text-white font-stardew flex items-center justify-center gap-1.5">
            {step === 1 && 'Nixi Dünyasına Hoş Geldin ★'}
            {step === 2 && 'Öğrenci Profili ve Fotoğrafı 𐙚'}
            {step === 3 && 'Dönemlik Çalışma Hedeflerin 🌿'}
            {step === 4 && 'Favori Estetik Renk Teman 🎨'}
            {step === 5 && 'Kişisel Motivasyon Hedefin ⋆˚࿔'}
            {step === 6 && 'Kurulum Tamamlandı! 🎉'}
          </h2>
          <p className="text-[11px] text-[#D8E2DC] mt-0.5 max-w-xs mx-auto">
            {step === 1 && 'Sade, huzurlu ve Stardew Valley estetiğinde öğrenci çalışma alanı'}
            {step === 2 && 'Cihaz galerinden fotoğraf yükle veya karakter seç'}
            {step === 3 && 'Bu dönem odaklanmak istediğin alışkanlıkları belirle'}
            {step === 4 && 'Çalışma alanın için imza doğal renk paletini seç'}
            {step === 5 && 'Profilinde görünecek dönemlik hedefini belirle'}
            {step === 6 && 'Her şey hazır, hemen ders panona adım atabilirsin'}
          </p>

          {/* 6-Step Progress Indicators */}
          <div className="flex items-center justify-center gap-1.5 sm:gap-2 mt-3">
            {[1, 2, 3, 4, 5, 6].map((s) => (
              <button
                key={s}
                onClick={() => setStep(s)}
                className={`w-6 h-6 sm:w-7 sm:h-7 rounded-xl flex items-center justify-center text-[10px] sm:text-xs font-bold transition-all border ${
                  step === s
                    ? 'bg-[#F4C542] text-[#1B263B] border-[#DEAB2B] scale-110 shadow-xs ring-2 ring-white/40'
                    : step > s
                    ? 'bg-[#2D6A4F] text-white border-[#1E4D38]'
                    : 'bg-white/10 text-white/60 border-white/20'
                }`}
                title={`Adım ${s}`}
              >
                {step > s ? '✓' : `★${s}`}
              </button>
            ))}
          </div>
        </div>

        {/* Step Body Container */}
        <div className="p-4 sm:p-5 max-h-[66vh] overflow-y-auto space-y-4">
          
          {/* SCREEN 1: Welcome Screen */}
          {step === 1 && (
            <div className="space-y-4 animate-in fade-in duration-200 text-center py-2">
              <div className="w-16 h-16 rounded-3xl bg-[#FAF9F6] border-2 border-[#E5E3DB] shadow-xs flex items-center justify-center mx-auto text-2xl relative">
                <span className="animate-star-pulse">🌾</span>
                <span className="absolute -bottom-1 -right-1 text-sm">𐙚</span>
              </div>

              <div>
                <span className="text-[10px] font-bold uppercase tracking-widest text-[#E07A5F] block mb-1">
                  Öğrenci Görsel Çalışma Alanı ⋆˚࿔
                </span>
                <h3 className="text-base sm:text-lg font-bold text-[#1B263B]">
                  Ders Notların, Hedeflerin ve Estetik İlhamın Bir Arada
                </h3>
                <p className="text-xs text-[#6C7A89] mt-1.5 max-w-sm mx-auto leading-relaxed">
                  Nixi; Pinterest düzeni ve Stardew Valley atmosferiyle ders çalışmayı keyifli hale getiren kişiselleştirilebilir öğrenci alanındır.
                </p>
              </div>

              {/* 3 Key Highlights */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-left pt-2">
                <div className="p-3 rounded-2xl bg-white border border-[#E5E3DB] shadow-2xs">
                  <div className="w-7 h-7 rounded-xl bg-[#2D6A4F]/10 text-[#2D6A4F] flex items-center justify-center text-xs font-bold mb-1.5">
                    <LayoutGrid className="w-3.5 h-3.5" />
                  </div>
                  <h4 className="text-xs font-bold text-[#1B263B]">Görsel Pano</h4>
                  <p className="text-[10px] text-[#6C7A89] mt-0.5 leading-snug">
                    Notlar, teslimler ve ilham kartları.
                  </p>
                </div>

                <div className="p-3 rounded-2xl bg-white border border-[#E5E3DB] shadow-2xs">
                  <div className="w-7 h-7 rounded-xl bg-[#E07A5F]/10 text-[#E07A5F] flex items-center justify-center text-xs font-bold mb-1.5">
                    <Zap className="w-3.5 h-3.5" />
                  </div>
                  <h4 className="text-xs font-bold text-[#1B263B]">Odak Durumu</h4>
                  <p className="text-[10px] text-[#6C7A89] mt-0.5 leading-snug">
                    Derin odak, Pomodoro ve Lo-Fi modu.
                  </p>
                </div>

                <div className="p-3 rounded-2xl bg-white border border-[#E5E3DB] shadow-2xs">
                  <div className="w-7 h-7 rounded-xl bg-[#D4A5A5]/20 text-[#915050] flex items-center justify-center text-xs font-bold mb-1.5">
                    <Sparkles className="w-3.5 h-3.5" />
                  </div>
                  <h4 className="text-xs font-bold text-[#1B263B]">Kişisel Estetik</h4>
                  <p className="text-[10px] text-[#6C7A89] mt-0.5 leading-snug">
                    Galeriden fotoğraf ve özel renkler.
                  </p>
                </div>
              </div>

              <div className="p-2.5 rounded-2xl bg-[#FAF9F6] border border-[#E5E3DB] text-[11px] text-[#566573] flex items-center justify-center gap-2">
                <span className="text-[#F4C542]">★</span>
                <span>Birkaç kolay adımda profilini oluşturalım.</span>
                <span className="text-[#F4C542]">★</span>
              </div>
            </div>
          )}

          {/* SCREEN 2: Username, Profile Picture (Device Gallery or Avatar), and Bio */}
          {step === 2 && (
            <div className="space-y-4 animate-in fade-in duration-200">
              <div className="flex items-center gap-2 pb-2 border-b border-[#E5E3DB]">
                <div className="w-8 h-8 rounded-xl bg-[#1B263B] text-white flex items-center justify-center text-sm font-bold border border-[#0F172A]">
                  ★2
                </div>
                <div>
                  <h3 className="text-sm sm:text-base font-bold text-[#1B263B]">
                    Kullanıcı Adı, Fotoğraf ve Biyografi 𐙚
                  </h3>
                  <p className="text-[11px] text-[#6C7A89]">
                    Cihazından fotoğraf seç veya hazır avatar kullan
                  </p>
                </div>
              </div>

              {/* Avatar Selector with Device Gallery & Presets */}
              <AvatarSelector
                currentAvatar={avatarUrl}
                onAvatarChange={(newUrl) => setAvatarUrl(newUrl)}
                studentName={name}
                studentHandle={handle}
                subtitle={grade}
                compact={true}
              />

              {/* Name & Handle Inputs */}
              <div className="space-y-2.5 pt-1">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  <div>
                    <label className="block text-xs font-bold text-[#1B263B] mb-1">
                      Görünen İsim <span className="text-[#E07A5F]">*</span>
                    </label>
                    <input
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="Örn. Elena"
                      className="w-full px-3 py-2 rounded-2xl bg-white border-2 border-[#E5E3DB] text-xs font-bold text-[#1B263B] focus:border-[#E07A5F] focus:outline-hidden transition-colors"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-[#1B263B] mb-1">
                      Kullanıcı Adı <span className="text-[#E07A5F]">*</span>
                    </label>
                    <input
                      type="text"
                      value={handle}
                      onChange={(e) => setHandle(e.target.value)}
                      placeholder="Örn. @elena.calisiyor"
                      className="w-full px-3 py-2 rounded-2xl bg-white border-2 border-[#E5E3DB] text-xs font-bold text-[#1B263B] focus:border-[#E07A5F] focus:outline-hidden transition-colors"
                    />
                  </div>
                </div>

                {/* Education Level (Ortaokul, Lise, Üniversite) & Grade Selection */}
                <div className="space-y-2 pt-1">
                  <label className="block text-xs font-bold text-[#1B263B] flex items-center gap-1.5">
                    <GraduationCap className="w-3.5 h-3.5 text-[#2D6A4F]" />
                    <span>Eğitim Kademesi</span>
                  </label>

                  <div className="grid grid-cols-3 gap-2">
                    {EDUCATION_LEVELS.map((lvl) => {
                      const isSelected = educationLevel === lvl.id;
                      return (
                        <button
                          key={lvl.id}
                          type="button"
                          onClick={() => handleEducationLevelChange(lvl.id)}
                          className={`p-2.5 rounded-2xl border-2 flex flex-col items-center justify-center gap-1 transition-all cursor-pointer ${
                            isSelected
                              ? 'bg-white border-[#2D6A4F] shadow-xs ring-2 ring-[#2D6A4F]/30 scale-102'
                              : 'bg-white border-[#E5E3DB] hover:bg-[#FAF9F6]'
                          }`}
                        >
                          <span className="text-base">{lvl.icon}</span>
                          <span className={`text-xs font-bold ${isSelected ? 'text-[#2D6A4F]' : 'text-[#1B263B]'}`}>
                            {lvl.label}
                          </span>
                        </button>
                      );
                    })}
                  </div>

                  {/* Dynamic Grade Options */}
                  <div className="pt-1">
                    <label className="block text-[11px] font-bold text-[#6C7A89] mb-1.5">
                      {educationLevel === 'ortaokul' && 'Ortaokul Sınıf Seçimi:'}
                      {educationLevel === 'lise' && 'Lise Sınıf Seçimi:'}
                      {educationLevel === 'universite' && 'Üniversite Yılı / Kademesi:'}
                    </label>
                    <div className="grid grid-cols-2 gap-1.5">
                      {GRADE_OPTIONS[educationLevel].map((grd) => {
                        const isSelected = grade === grd;
                        return (
                          <button
                            key={grd}
                            type="button"
                            onClick={() => setGrade(grd)}
                            className={`p-2 rounded-xl border text-left text-xs font-bold transition-all cursor-pointer flex items-center justify-between ${
                              isSelected
                                ? 'bg-[#2D6A4F] text-white border-[#1E4D38] shadow-xs'
                                : 'bg-white text-[#1B263B] border-[#E5E3DB] hover:bg-[#FAF9F6]'
                            }`}
                          >
                            <span className="truncate">{grd}</span>
                            {isSelected && <Check className="w-3.5 h-3.5 shrink-0 ml-1" />}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                </div>

                {/* Bio & Quote Input */}
                <div className="pt-1">
                  <div className="flex items-center justify-between mb-1">
                    <label className="block text-xs font-bold text-[#1B263B]">
                      Kısa Biyografi / Durum Sözü ⋆˚࿔
                    </label>
                    <span className="text-[10px] text-[#6C7A89]">Profilde görünür</span>
                  </div>
                  <textarea
                    rows={2}
                    value={bio}
                    onChange={(e) => setBio(e.target.value)}
                    placeholder="Kendini veya ders çalışma tarzını anlatan kısa bir söz..."
                    className="w-full p-2.5 rounded-2xl bg-white border-2 border-[#E5E3DB] text-xs font-semibold text-[#1B263B] focus:border-[#E07A5F] focus:outline-hidden resize-none"
                  />
                  <div className="flex flex-wrap gap-1 mt-1">
                    {QUICK_SYMBOLS.slice(0, 6).map((sym) => (
                      <button
                        key={sym}
                        type="button"
                        onClick={() => handleInsertKaomojiToBio(sym)}
                        className="px-2 py-0.5 bg-white border border-[#E5E3DB] rounded-lg text-[10px] font-bold text-[#1B263B] hover:bg-[#FAF9F6] cursor-pointer"
                      >
                        {sym}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* SCREEN 3: Selectable Personal Goals */}
          {step === 3 && (
            <div className="space-y-3.5 animate-in fade-in duration-200">
              <div className="flex items-center gap-2 pb-2 border-b border-[#E5E3DB]">
                <div className="w-8 h-8 rounded-xl bg-[#2D6A4F] text-white flex items-center justify-center text-sm font-bold border border-[#1E4D38]">
                  ★3
                </div>
                <div>
                  <h3 className="text-sm sm:text-base font-bold text-[#1B263B]">
                    Dönemlik Çalışma Hedeflerin ᡣ𐭩
                  </h3>
                  <p className="text-[11px] text-[#6C7A89]">
                    Odaklanmak istediğin çalışma hedeflerini seç (birden fazla seçebilirsin)
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {STUDY_GOALS_OPTIONS.map((goal) => {
                  const isChecked = selectedGoals.includes(goal);
                  return (
                    <button
                      key={goal}
                      type="button"
                      onClick={() => toggleGoal(goal)}
                      className={`p-2.5 rounded-2xl border-2 text-left flex items-center justify-between transition-all cursor-pointer ${
                        isChecked
                          ? 'bg-[#2D6A4F] text-white border-[#2D6A4F] shadow-xs'
                          : 'bg-white text-[#1B263B] border-[#E5E3DB] hover:bg-[#FAF9F6]'
                      }`}
                    >
                      <span className="text-xs font-bold leading-snug">{goal}</span>
                      <span
                        className={`w-5 h-5 rounded-lg flex items-center justify-center text-xs font-bold shrink-0 ml-2 border ${
                          isChecked
                            ? 'bg-[#F4C542] text-[#1B263B] border-[#DEAB2B]'
                            : 'bg-[#FAF9F6] text-[#6C7A89] border-[#E5E3DB]'
                        }`}
                      >
                        {isChecked ? '✓' : '+'}
                      </span>
                    </button>
                  );
                })}
              </div>

              <div className="p-2.5 rounded-xl bg-[#FAF9F6] border border-[#E5E3DB] text-center">
                <p className="text-[11px] text-[#2D6A4F] font-bold">
                  ★ {selectedGoals.length} adet çalışma hedefi seçildi.
                </p>
              </div>
            </div>
          )}

          {/* SCREEN 4: Favorite Theme Selection */}
          {step === 4 && (
            <div className="space-y-3.5 animate-in fade-in duration-200">
              <div className="flex items-center gap-2 pb-2 border-b border-[#E5E3DB]">
                <div className="w-8 h-8 rounded-xl bg-[#D4A5A5] text-[#4A2020] flex items-center justify-center text-sm font-bold border border-[#915050]">
                  ★4
                </div>
                <div>
                  <h3 className="text-sm sm:text-base font-bold text-[#1B263B]">
                    Favori Estetik Renk Teman 🎨
                  </h3>
                  <p className="text-[11px] text-[#6C7A89]">
                    Nixi için imza doğal ton rengini seç
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {THEME_OPTIONS.map((theme) => {
                  const isSelected = favoriteTheme === theme.id;
                  return (
                    <button
                      key={theme.id}
                      type="button"
                      onClick={() => setFavoriteTheme(theme.id)}
                      className={`p-3 rounded-2xl border-2 text-left transition-all cursor-pointer relative overflow-hidden ${
                        isSelected
                          ? 'bg-white border-[#1B263B] shadow-md ring-2 ring-[#F4C542]'
                          : 'bg-white border-[#E5E3DB] hover:bg-[#FAF9F6]'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <span
                            className="w-4 h-4 rounded-full shadow-2xs"
                            style={{ backgroundColor: theme.hex }}
                          />
                          <span className="text-xs font-bold text-[#1B263B]">
                            {theme.name}
                          </span>
                        </div>
                        <span className="text-sm">{theme.symbol}</span>
                      </div>
                      <p className="text-[11px] text-[#6C7A89] leading-tight mb-1">
                        {theme.sub}
                      </p>
                      <p className="text-[10px] font-bold text-[#2D6A4F] mb-2">
                        {theme.pointInfo}
                      </p>
                      <div className="h-1.5 w-full rounded-full" style={{ backgroundColor: theme.hex }} />
                      {isSelected && (
                        <div className="mt-2 flex items-center justify-end gap-1 text-[10px] font-bold text-[#2D6A4F]">
                          <Check className="w-3 h-3" /> Seçilen Tema &amp; Puan Sistemi
                        </div>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* SCREEN 5: Personal Goal Text Input */}
          {step === 5 && (
            <div className="space-y-3.5 animate-in fade-in duration-200">
              <div className="flex items-center gap-2 pb-2 border-b border-[#E5E3DB]">
                <div className="w-8 h-8 rounded-xl bg-[#E07A5F] text-white flex items-center justify-center text-sm font-bold border border-[#C8664C]">
                  ★5
                </div>
                <div>
                  <h3 className="text-sm sm:text-base font-bold text-[#1B263B]">
                    Dönemlik Kişisel Hedefini Yaz ⋆˚࿔
                  </h3>
                  <p className="text-[11px] text-[#6C7A89]">
                    Profilinde öne çıkacak ana hedefini veya motivasyon sözünü belirle
                  </p>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-[#1B263B] mb-1.5">
                  Dönemlik Motivasyonum ve Hedefim:
                </label>
                <textarea
                  rows={3}
                  value={personalGoal}
                  onChange={(e) => setPersonalGoal(e.target.value)}
                  placeholder="Dönemlik kişisel hedefini buraya yaz..."
                  className="w-full p-3 rounded-2xl bg-white border-2 border-[#E5E3DB] text-xs font-semibold text-[#1B263B] focus:border-[#E07A5F] focus:outline-hidden leading-relaxed"
                />
              </div>

              {/* Kaomoji shortcuts to tap and insert */}
              <div>
                <span className="text-[10px] font-bold text-[#6C7A89] uppercase tracking-wider block mb-1">
                  Kaomoji &amp; Stardew Sembolleri Ekle:
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {QUICK_SYMBOLS.map((sym) => (
                    <button
                      key={sym}
                      type="button"
                      onClick={() => handleInsertKaomoji(sym)}
                      className="px-2.5 py-1 rounded-xl bg-white border border-[#E5E3DB] hover:bg-[#F4F2EB] text-xs font-bold text-[#1B263B] transition-colors cursor-pointer"
                    >
                      {sym}
                    </button>
                  ))}
                </div>
              </div>

              {/* Suggestions */}
              <div>
                <span className="text-[10px] font-bold text-[#6C7A89] uppercase tracking-wider block mb-1">
                  Veya hazır hedeflerden birini tıkla:
                </span>
                <div className="space-y-1.5">
                  {PERSONAL_GOAL_SUGGESTIONS.map((sug, i) => (
                    <button
                      key={i}
                      type="button"
                      onClick={() => setPersonalGoal(sug)}
                      className="w-full text-left p-2 rounded-xl bg-white border border-[#E5E3DB] hover:bg-[#FAF9F6] text-[11px] text-[#566573] leading-snug cursor-pointer transition-colors"
                    >
                      "{sug}"
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* SCREEN 6: Completion Screen */}
          {step === 6 && (
            <div className="space-y-4 animate-in fade-in duration-200">
              <div className="text-center py-1">
                <div className="w-14 h-14 rounded-full bg-[#2D6A4F] text-white flex items-center justify-center mx-auto text-2xl mb-2 shadow-xs ring-4 ring-[#2D6A4F]/20">
                  ✓
                </div>
                <h3 className="text-base sm:text-lg font-bold text-[#1B263B]">
                  Harika! Kurulum Başarıyla Tamamlandı 𐙚
                </h3>
                <p className="text-xs text-[#6C7A89] mt-0.5">
                  Tüm ayarların ve hedeflerin kaydedildi. İşte oluşturulan profilin:
                </p>
              </div>

              {/* Profile Summary Card Preview */}
              <div className="p-3.5 rounded-3xl bg-white border-2 border-[#E5E3DB] shadow-xs space-y-3">
                <div className="flex items-center gap-3">
                  <img
                    src={avatarUrl}
                    alt={name}
                    referrerPolicy="no-referrer"
                    className="w-14 h-14 rounded-2xl object-cover ring-3 ring-[#F4C542] shadow-2xs shrink-0"
                  />
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-1.5 flex-wrap">
                      <span className="text-sm font-bold text-[#1B263B] truncate">{name}</span>
                      <span className="text-xs text-[#6C7A89]">{handle}</span>
                    </div>
                    <p className="text-[11px] text-[#2D6A4F] font-bold truncate">
                      {educationLevel === 'ortaokul' ? '🎒 Ortaokul' : educationLevel === 'lise' ? '📐 Lise' : '🎓 Üniversite'} • {grade}
                    </p>
                    <div className="flex items-center gap-1.5 mt-1">
                      <span
                        className="text-[9px] font-bold px-2 py-0.5 rounded-full text-white"
                        style={{ backgroundColor: currentThemeObj.hex }}
                      >
                        {currentThemeObj.name} Paleti {currentThemeObj.symbol}
                      </span>
                    </div>
                  </div>
                </div>

                {bio && (
                  <p className="text-[11px] text-[#566573] italic bg-[#FAF9F6] p-2 rounded-xl border border-[#E5E3DB]">
                    "{bio}"
                  </p>
                )}

                {personalGoal && (
                  <div className="p-2.5 rounded-2xl bg-[#2D6A4F]/10 border border-[#2D6A4F]/20 text-xs">
                    <span className="text-[9px] font-bold uppercase tracking-wider text-[#2D6A4F] block mb-0.5">
                      Dönemlik Hedefin ⋆˚࿔
                    </span>
                    <p className="font-semibold text-[#1B263B] text-[11px] leading-snug">
                      {personalGoal}
                    </p>
                  </div>
                )}

                {selectedGoals.length > 0 && (
                  <div>
                    <span className="text-[9px] font-bold text-[#6C7A89] uppercase tracking-wider block mb-1">
                      Seçilen Odak Alanları ({selectedGoals.length}):
                    </span>
                    <div className="flex flex-wrap gap-1">
                      {selectedGoals.slice(0, 3).map((g, idx) => (
                        <span
                          key={idx}
                          className="text-[10px] font-bold px-2 py-0.5 rounded-lg bg-[#FAF9F6] text-[#1B263B] border border-[#E5E3DB]"
                        >
                          {g}
                        </span>
                      ))}
                      {selectedGoals.length > 3 && (
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-lg bg-[#FAF9F6] text-[#6C7A89] border border-[#E5E3DB]">
                          +{selectedGoals.length - 3} daha
                        </span>
                      )}
                    </div>
                  </div>
                )}
              </div>

              <div className="p-2.5 rounded-2xl bg-[#F4C542]/15 border border-[#F4C542]/40 text-center text-xs text-[#1B263B] font-semibold">
                ✨ İstediğin zaman sol menüden profilini düzenleyebilir veya kurulumu tekrarlayabilirsin.
              </div>
            </div>
          )}

        </div>

        {/* Footer Navigation Buttons */}
        <div className="p-4 bg-white border-t-2 border-[#E5E3DB] flex items-center justify-between">
          {step > 1 ? (
            <PuffyStarButton
              variant="white"
              size="md"
              onClick={() => setStep(step - 1)}
            >
              <ChevronLeft className="w-4 h-4 mr-1 inline" />
              <span>Geri</span>
            </PuffyStarButton>
          ) : (
            <span className="text-xs text-[#6C7A89] font-bold">
              Adım 1 / {totalSteps}
            </span>
          )}

          {step === 1 && (
            <PuffyStarButton
              variant="orange"
              size="md"
              onClick={() => setStep(2)}
              className="px-5!"
            >
              <span>Kuruluma Başla 𐙚</span>
              <ChevronRight className="w-4 h-4 ml-1 inline" />
            </PuffyStarButton>
          )}

          {step === 2 && (
            <PuffyStarButton
              variant="orange"
              size="md"
              onClick={() => setStep(3)}
            >
              <span>Hedeflere Geç</span>
              <ChevronRight className="w-4 h-4 ml-1 inline" />
            </PuffyStarButton>
          )}

          {step === 3 && (
            <PuffyStarButton
              variant="orange"
              size="md"
              onClick={() => setStep(4)}
            >
              <span>Temayı Seç</span>
              <ChevronRight className="w-4 h-4 ml-1 inline" />
            </PuffyStarButton>
          )}

          {step === 4 && (
            <PuffyStarButton
              variant="orange"
              size="md"
              onClick={() => setStep(5)}
            >
              <span>Hedefi Yaz</span>
              <ChevronRight className="w-4 h-4 ml-1 inline" />
            </PuffyStarButton>
          )}

          {step === 5 && (
            <PuffyStarButton
              variant="orange"
              size="md"
              onClick={() => setStep(6)}
            >
              <span>Özeti Gör</span>
              <ChevronRight className="w-4 h-4 ml-1 inline" />
            </PuffyStarButton>
          )}

          {step === 6 && (
            <PuffyStarButton
              variant="green"
              size="lg"
              onClick={handleFinish}
              className="py-2.5! px-6! text-sm font-bold shadow-md animate-star-pulse"
            >
              <Check className="w-4 h-4 mr-1.5 inline" />
              <span>Nixi'ye Başla 𐙚</span>
            </PuffyStarButton>
          )}
        </div>

      </div>
    </div>
  );
}

