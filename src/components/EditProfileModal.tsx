import React, { useState } from 'react';
import { X, Check, GraduationCap, Sparkles } from 'lucide-react';
import { StudentProfile, ThemeStyle, EducationLevel } from '../types';
import PuffyStarButton from './PuffyStarButton';
import AvatarSelector from './AvatarSelector';
import { ALL_THEME_OPTIONS, calculateLevelInfo } from '../utils/themeLevel';

interface EditProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  profile: StudentProfile;
  onSaveProfile: (updated: Partial<StudentProfile>) => void;
}

const QUICK_SYMBOLS = ['⋆˚࿔', '𐙚', 'ᡣ𐭩', '౨ৎ', '✮', '❀', '｡𖦹°‧', 'ᶻ 𝗓 𐰁', '𝄞⨾𓍢ִ໋♬', '𓍯', '🎐', 'ᥫ᭡'];

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

export default function EditProfileModal({
  isOpen,
  onClose,
  profile,
  onSaveProfile,
}: EditProfileModalProps) {
  const [name, setName] = useState(profile.name);
  const [handle, setHandle] = useState(profile.handle);
  const [educationLevel, setEducationLevel] = useState<EducationLevel>(
    profile.educationLevel || 'universite'
  );
  const [grade, setGrade] = useState(
    profile.grade || GRADE_OPTIONS[profile.educationLevel || 'universite'][0]
  );
  const [bio, setBio] = useState(profile.bio);
  const [avatarUrl, setAvatarUrl] = useState(profile.avatarUrl);
  const [personalGoal, setPersonalGoal] = useState(profile.personalGoal || '');
  const [favoriteTheme, setFavoriteTheme] = useState<ThemeStyle>(profile.favoriteTheme || 'orange');

  if (!isOpen) return null;

  const currentLevelInfo = calculateLevelInfo(profile.points || 0, favoriteTheme);

  const handleEducationLevelChange = (level: EducationLevel) => {
    setEducationLevel(level);
    setGrade(GRADE_OPTIONS[level][0]);
  };

  const handleAppendSymbolToBio = (sym: string) => {
    setBio((prev) => `${prev} ${sym}`);
  };

  const handleAppendSymbolToGoal = (sym: string) => {
    setPersonalGoal((prev) => `${prev} ${sym}`);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const formattedHandle = handle.trim().startsWith('@')
      ? handle.trim()
      : `@${handle.trim() || 'ogrenci'}`;

    onSaveProfile({
      name: name.trim() || profile.name,
      handle: formattedHandle,
      educationLevel,
      grade,
      year: grade,
      major: '',
      university: '',
      bio: bio.trim() || profile.bio,
      avatarUrl: avatarUrl.trim() || profile.avatarUrl,
      personalGoal: personalGoal.trim(),
      favoriteTheme,
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-[#1B263B]/50 backdrop-blur-xs flex items-center justify-center p-4 font-stardew">
      <div className="fixed inset-0" onClick={onClose} aria-hidden="true" />

      <div className="relative bg-[#FAF9F6] rounded-3xl max-w-lg w-full overflow-hidden border-2 border-[#E5E3DB] shadow-2xl z-10 animate-in fade-in zoom-in-95 duration-200">
        <div className="p-3.5 bg-white border-b-2 border-[#E5E3DB] flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-[#2D6A4F] text-white flex items-center justify-center text-xs font-bold border border-[#1E4D38] shadow-xs">
              ★
            </div>
            <span className="font-bold text-[#1B263B] font-stardew">Profili Düzenle 𐙚</span>
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

        <form onSubmit={handleSubmit} className="p-5 space-y-4 max-h-[85vh] overflow-y-auto font-stardew">
          {/* Avatar Selector with Device Gallery & Presets */}
          <div>
            <label className="block text-xs font-bold text-[#1B263B] mb-2 font-stardew flex items-center gap-1.5">
              <span>Profil Fotoğrafı &amp; Karakter Seçimi ⋆˚࿔</span>
            </label>
            <AvatarSelector
              currentAvatar={avatarUrl}
              onAvatarChange={(newUrl) => setAvatarUrl(newUrl)}
              studentName={name}
              studentHandle={handle}
              subtitle={grade}
              compact={true}
            />
          </div>

          {/* Name & Handle Inputs */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
            <div>
              <label className="block text-xs font-bold text-[#1B263B] mb-1 font-stardew">Görünen İsim</label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Örn. Elena"
                className="w-full bg-white text-xs font-stardew text-[#1B263B] px-3.5 py-2 rounded-2xl border-2 border-[#E5E3DB] focus:outline-hidden focus:ring-2 focus:ring-[#F4C542]"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-[#1B263B] mb-1 font-stardew">Kullanıcı Adı</label>
              <input
                type="text"
                required
                value={handle}
                onChange={(e) => setHandle(e.target.value)}
                placeholder="Örn. @elena.calisiyor"
                className="w-full bg-white text-xs font-stardew text-[#1B263B] px-3.5 py-2 rounded-2xl border-2 border-[#E5E3DB] focus:outline-hidden focus:ring-2 focus:ring-[#F4C542]"
              />
            </div>
          </div>

          {/* Education Level (Ortaokul, Lise, Üniversite) */}
          <div className="space-y-2">
            <label className="block text-xs font-bold text-[#1B263B] font-stardew flex items-center gap-1.5">
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
            <div className="pt-1.5">
              <label className="block text-[11px] font-bold text-[#6C7A89] mb-1.5 font-stardew">
                {educationLevel === 'ortaokul' && 'Ortaokul Sınıf Seçimi:'}
                {educationLevel === 'lise' && 'Lise Sınıf Seçimi:'}
                {educationLevel === 'universite' && 'Üniversite Yılı / Kademesi:'}
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-2 gap-1.5">
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

          {/* Level & Points Summary Banner */}
          <div className="p-3 bg-gradient-to-r from-[#FAF9F6] via-white to-[#FAF9F6] rounded-2xl border-2 border-[#E5E3DB]">
            <div className="flex items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <span className="text-xl">{currentLevelInfo.pointIcon}</span>
                <div>
                  <div className="flex items-center gap-1.5">
                    <span className="text-xs font-bold text-[#1B263B]">
                      Seviye {currentLevelInfo.level}: {currentLevelInfo.rankTitle}
                    </span>
                  </div>
                  <p className="text-[11px] text-[#6C7A89]">
                    {currentLevelInfo.totalPoints} Toplam {currentLevelInfo.pointName}
                  </p>
                </div>
              </div>
              <div className="text-right">
                <span className="text-[10px] font-bold text-[#2D6A4F] bg-[#2D6A4F]/10 px-2 py-0.5 rounded-lg border border-[#2D6A4F]/20 block">
                  {currentLevelInfo.currentLevelPoints} / 100 {currentLevelInfo.pointUnit}
                </span>
                <span className="text-[9px] text-[#6C7A89] mt-0.5 block">
                  +{currentLevelInfo.pointsNeededForNextLevel} ile Sonraki Seviye
                </span>
              </div>
            </div>
          </div>

          {/* Favorite Theme Selection with Theme-Specific Points */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="block text-xs font-bold text-[#1B263B] font-stardew">
                Favori Tema &amp; Puan Türü
              </label>
              <span className="text-[10px] text-[#2D6A4F] font-bold">
                {currentLevelInfo.pointName} {currentLevelInfo.pointIcon}
              </span>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-1.5">
              {ALL_THEME_OPTIONS.map((th) => {
                const isSelected = favoriteTheme === th.id;
                return (
                  <button
                    type="button"
                    key={th.id}
                    onClick={() => setFavoriteTheme(th.id)}
                    className={`p-2 rounded-xl border-2 flex items-center gap-2 text-left transition-all cursor-pointer ${
                      isSelected
                        ? 'bg-white border-[#1B263B] shadow-xs ring-2 ring-[#F4C542]'
                        : 'bg-white border-[#E5E3DB] hover:bg-[#FAF9F6]'
                    }`}
                  >
                    <span className="text-base shrink-0">{th.icon}</span>
                    <div className="min-w-0">
                      <p className={`text-[11px] font-bold truncate ${isSelected ? 'text-[#1B263B]' : 'text-[#6C7A89]'}`}>
                        {th.label}
                      </p>
                      <p className="text-[9px] text-[#A0AEC0] truncate">
                        {th.pointName}
                      </p>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Personal Goal Input */}
          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="block text-xs font-bold text-[#1B263B] font-stardew">Dönemlik Kişisel Hedef ⋆˚࿔</label>
              <span className="text-[10px] text-[#E07A5F] font-bold">Profilde Görünür</span>
            </div>
            <textarea
              rows={2}
              value={personalGoal}
              onChange={(e) => setPersonalGoal(e.target.value)}
              placeholder="Örn. Derslerde başarı sağla, günde 30 dk oku..."
              className="w-full bg-white text-xs font-stardew text-[#1B263B] p-2.5 rounded-2xl border-2 border-[#E5E3DB] focus:outline-hidden focus:ring-2 focus:ring-[#F4C542] resize-none"
            />
          </div>

          {/* Quick Symbol Helpers */}
          <div className="p-2.5 bg-[#FAF9F6] rounded-2xl border border-[#E5E3DB]">
            <div className="flex items-center justify-between mb-1.5 text-[10px] text-[#6C7A89] font-bold">
              <span>Biyografi veya Hedefe Kaomoji Ekle:</span>
            </div>
            <div className="flex flex-wrap gap-1">
              {QUICK_SYMBOLS.map((sym, idx) => (
                <button
                  type="button"
                  key={idx}
                  onClick={() => {
                    handleAppendSymbolToBio(sym);
                    handleAppendSymbolToGoal(sym);
                  }}
                  className="px-2 py-0.5 text-xs bg-white hover:bg-[#F4C542]/30 border border-[#E5E3DB] rounded-lg transition-all transform active:scale-95 text-[#1B263B] cursor-pointer"
                >
                  {sym}
                </button>
              ))}
            </div>
          </div>

          {/* Bio Input */}
          <div>
            <label className="block text-xs font-bold text-[#1B263B] mb-1 font-stardew">Durum / Biyografi Sözü ⋆˚࿔</label>
            <textarea
              rows={2}
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              placeholder="Kendini anlatan kısa bir söz..."
              className="w-full bg-white text-xs font-stardew text-[#1B263B] p-3 rounded-2xl border-2 border-[#E5E3DB] focus:outline-hidden focus:ring-2 focus:ring-[#F4C542] resize-none"
            />
          </div>

          <div className="pt-2">
            <PuffyStarButton
              variant="green"
              size="lg"
              className="w-full justify-center"
              onClick={handleSubmit}
            >
              <Check className="w-4 h-4 mr-1 inline" />
              Profili Kaydet 𐙚
            </PuffyStarButton>
          </div>
        </form>
      </div>
    </div>
  );
}


