import { useState } from 'react';
import { Sparkles, Menu, Edit3, Share2, Flame, Clock, BookOpen, Bookmark, Trophy } from 'lucide-react';
import { StudentProfile, FocusStatus } from '../types';
import PuffyStarButton from './PuffyStarButton';
import { calculateLevelInfo } from '../utils/themeLevel';

interface HeaderProfileProps {
  profile: StudentProfile;
  onOpenMenu: () => void;
  onEditProfile: () => void;
  onFocusStatusChange: (status: FocusStatus) => void;
}

const focusStatusOptions: { status: FocusStatus; color: string; label: string }[] = [
  { status: 'Ders Çalışıyor', color: 'bg-[#2D6A4F]', label: '🌿 Ders Çalışıyor 𐙚' },
  { status: 'Derste', color: 'bg-[#1B263B]', label: '📚 Derste ౨ৎ' },
  { status: 'Kahve Molası', color: 'bg-[#E07A5F]', label: '☕ Kahve Molası ᡣ𐭩' },
  { status: 'Final Maratonu', color: 'bg-[#D4A5A5]', label: '⚡ Final Maratonu 𐰁' },
  { status: 'Birlikte Çalışmaya Açık', color: 'bg-[#2D6A4F]', label: '💬 Birlikte Çalışmaya Açık ✧' },
];

export default function HeaderProfile({
  profile,
  onOpenMenu,
  onEditProfile,
  onFocusStatusChange,
}: HeaderProfileProps) {
  const [showStatusPicker, setShowStatusPicker] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);

  const levelInfo = calculateLevelInfo(profile.points || 0, profile.favoriteTheme || 'orange');

  const handleShare = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(window.location.href);
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2000);
    }
  };

  return (
    <header className="w-full bg-[#FAF9F6] border-b-2 border-[#E5E3DB] pt-3 pb-3 px-4 sm:px-6 font-stardew">
      {/* Top Bar with Brand Logo and Puffy Star Action Buttons */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          {/* Puffy Star Logo Mark */}
          <div className="w-9 h-9 rounded-2xl bg-[#1B263B] border-2 border-[#E07A5F] flex items-center justify-center text-[#F4C542] font-bold text-lg tracking-wider shadow-xs animate-star-pulse">
            ★
          </div>
          <div className="flex flex-col">
            <div className="flex items-baseline gap-1.5">
              <span className="text-xl font-bold tracking-tight text-[#1B263B] font-stardew">
                nixi
              </span>
              <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-[#F4C542]/30 text-[#684E0B] border border-[#DEAB2B]/50 font-stardew">
                ⋆˚࿔ Stardew Alanı 𐙚
              </span>
            </div>
          </div>
        </div>

        {/* Puffy Star Action Buttons */}
        <div className="flex items-center gap-2.5">
          {/* Puffy Star Share Button */}
          <div className="relative">
            <PuffyStarButton
              id="share-profile-btn"
              isStarShape={true}
              variant="white"
              size="icon-sm"
              onClick={handleShare}
              title="Profili Paylaş"
              aria-label="Öğrenci profilini paylaş"
            >
              <Share2 className="w-4 h-4 text-[#1B263B]" />
            </PuffyStarButton>
            {copiedLink && (
              <span className="absolute -bottom-8 right-0 text-[10px] bg-[#1B263B] text-white px-2 py-0.5 rounded-lg border border-[#F4C542] shadow-md whitespace-nowrap z-30 font-stardew animate-bounce">
                ⋆ Bağlantı kopyalandı! 𐙚
              </span>
            )}
          </div>

          {/* Puffy Star Hamburger Menu Button */}
          <PuffyStarButton
            id="hamburger-menu-btn"
            isStarShape={true}
            variant="orange"
            size="icon-sm"
            onClick={onOpenMenu}
            title="Menüyü Aç"
            aria-label="Menü çekmecesini aç"
          >
            <Menu className="w-4 h-4 text-white" />
          </PuffyStarButton>
        </div>
      </div>

      {/* Horizontal Social Media Profile Layout Area */}
      <div className="bg-white/95 rounded-2xl p-4 border-2 border-[#E5E3DB] shadow-xs relative overflow-hidden">
        {/* Subtle Stardew Valley pixel sparkle accents */}
        <div className="absolute top-2 right-2 text-xs opacity-35 select-none font-stardew">
          ✧˚.༘⋆ 𐙚
        </div>

        {/* Top Profile Horizontal Row */}
        <div className="flex items-start gap-3.5">
          {/* Avatar with Puffy Star Status Ring */}
          <div
            className="relative shrink-0 group cursor-pointer"
            onClick={onEditProfile}
            title="Profil fotoğrafını düzenle"
          >
            <img
              src={profile.avatarUrl}
              alt={profile.name}
              referrerPolicy="no-referrer"
              className="w-16 h-16 sm:w-18 sm:h-18 rounded-full object-cover ring-4 ring-[#F4C542]/70 p-0.5 bg-white shadow-xs transition-transform group-hover:scale-105"
            />
            {/* Status indicator puffy mini star button */}
            <div
              className="absolute -bottom-1 -right-1"
              onClick={(e) => {
                e.stopPropagation();
              }}
            >
              <PuffyStarButton
                id="status-indicator-dot"
                isStarShape={true}
                variant="green"
                size="sm"
                className="w-7 h-7!"
                onClick={() => setShowStatusPicker(!showStatusPicker)}
                title="Durumu Değiştir"
              >
                <span className="text-[10px] text-white font-bold">★</span>
              </PuffyStarButton>
            </div>
          </div>

          {/* Profile Details & Metadata */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between gap-1">
              <div className="min-w-0">
                <h1 className="text-base sm:text-lg font-bold text-[#1B263B] leading-tight truncate font-stardew flex items-center gap-1">
                  <span>{profile.name}</span>
                  <span className="text-[#E07A5F] text-xs">𐙚</span>
                </h1>
                <p className="text-xs font-semibold text-[#6C7A89] truncate font-stardew">
                  {profile.handle}
                </p>
              </div>

              {/* Puffy Edit Profile Button */}
              <PuffyStarButton
                id="edit-profile-top-btn"
                variant="pink"
                size="sm"
                onClick={onEditProfile}
                className="shrink-0 text-[11px] py-1! px-2.5!"
              >
                <Edit3 className="w-3 h-3 mr-1 inline" />
                Düzenle
              </PuffyStarButton>
            </div>

            <div className="mt-2 flex flex-wrap items-center gap-1.5">
              <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-xl bg-[#FAF9F6] text-[#2D6A4F] border border-[#E5E3DB] font-stardew flex items-center gap-1">
                <span>
                  {profile.educationLevel === 'ortaokul' ? '🎒 Ortaokul' : profile.educationLevel === 'lise' ? '📐 Lise' : '🎓 Üniversite'}
                </span>
              </span>
              {(profile.grade || profile.year) && (
                <span className="text-[11px] font-semibold px-2.5 py-0.5 rounded-xl bg-[#FAF9F6] text-[#1B263B] border border-[#E5E3DB] font-stardew">
                  {profile.grade || profile.year}
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Status bar toggle */}
        <div className="mt-3 relative">
          <div className="flex items-center justify-between bg-[#FAF9F6] px-3 py-1.5 rounded-xl border border-[#E5E3DB]">
            <div className="flex items-center gap-2 text-xs font-bold text-[#1B263B] truncate font-stardew">
              <span className="text-[#F4C542]">★</span>
              <span className="text-[11px] text-[#6C7A89]">Durum:</span>
              <span className="font-bold text-[#1B263B]">{profile.focusStatus}</span>
            </div>

            <button
              id="toggle-status-btn"
              onClick={() => setShowStatusPicker(!showStatusPicker)}
              className="text-[11px] font-bold text-[#E07A5F] hover:underline cursor-pointer font-stardew"
            >
              {showStatusPicker ? 'Kapat ✕' : 'Değiştir 𐙚'}
            </button>
          </div>

          {/* Status selection popover */}
          {showStatusPicker && (
            <div className="absolute top-full left-0 right-0 mt-1.5 p-2 bg-white rounded-2xl border-2 border-[#E5E3DB] shadow-lg z-20 flex flex-wrap gap-1.5 animate-in fade-in zoom-in-95 duration-150 font-stardew">
              {focusStatusOptions.map((opt) => (
                <button
                  key={opt.status}
                  onClick={() => {
                    onFocusStatusChange(opt.status);
                    setShowStatusPicker(false);
                  }}
                  className={`text-xs font-bold px-2.5 py-1.5 rounded-xl border transition-all ${
                    profile.focusStatus === opt.status
                      ? 'bg-[#1B263B] text-white border-[#1B263B] shadow-xs'
                      : 'bg-[#FAF9F6] text-[#1B263B] border-[#E5E3DB] hover:bg-[#F2EFE8]'
                  }`}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Bio Quote */}
        <p className="mt-2.5 text-xs text-[#566573] italic leading-relaxed font-stardew">
          "{profile.bio}"
        </p>

        {/* Theme Level & Points Progress Banner */}
        <div className="mt-3 p-2.5 rounded-2xl bg-gradient-to-r from-[#FAF9F6] via-white to-[#FAF9F6] border-2 border-[#E5E3DB] shadow-2xs font-stardew">
          <div className="flex items-center justify-between gap-2 mb-1.5">
            <div className="flex items-center gap-1.5 min-w-0">
              <span className="text-sm shrink-0">{levelInfo.pointIcon}</span>
              <span className="text-xs font-bold text-[#1B263B] truncate">
                Seviye {levelInfo.level}: <span className="text-[#E07A5F]">{levelInfo.rankTitle}</span>
              </span>
            </div>
            <div className="text-[11px] font-bold text-[#2D6A4F] shrink-0 bg-[#2D6A4F]/10 px-2 py-0.5 rounded-lg border border-[#2D6A4F]/20">
              {levelInfo.totalPoints} {levelInfo.pointName}
            </div>
          </div>

          {/* Micro progress bar */}
          <div className="w-full h-2 rounded-full bg-[#E5E3DB]/70 overflow-hidden p-0.5 border border-[#E5E3DB]">
            <div
              className="h-full rounded-full transition-all duration-500 bg-gradient-to-r from-[#F4C542] via-[#E07A5F] to-[#2D6A4F]"
              style={{ width: `${Math.max(6, levelInfo.progressPercent)}%` }}
            />
          </div>
          <div className="flex items-center justify-between text-[10px] text-[#6C7A89] mt-1">
            <span>{levelInfo.currentLevelPoints} / 100 {levelInfo.pointUnit}</span>
            <span>Sonraki seviyeye {levelInfo.pointsNeededForNextLevel} {levelInfo.pointUnit} 𐙚</span>
          </div>
        </div>

        {/* Personal Semester Goal Box */}
        {profile.personalGoal && (
          <div className="mt-2.5 p-2.5 rounded-2xl bg-[#FAF9F6] border-2 border-[#E5E3DB] flex items-start gap-2.5 shadow-2xs font-stardew">
            <div className="w-5 h-5 rounded-lg bg-[#E07A5F] text-white flex items-center justify-center text-[10px] font-bold shrink-0 mt-0.5 shadow-xs">
              ★
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#E07A5F]">
                  Dönemlik Kişisel Hedef ⋆˚࿔
                </span>
                <button
                  onClick={onEditProfile}
                  className="text-[10px] font-bold text-[#6C7A89] hover:text-[#1B263B] hover:underline cursor-pointer"
                >
                  Düzenle 𐙚
                </button>
              </div>
              <p className="text-xs font-bold text-[#1B263B] leading-snug mt-0.5">
                {profile.personalGoal}
              </p>
            </div>
          </div>
        )}

        {/* Horizontal Student Stats Bar (Social Profile Style) */}
        <div className="mt-3 pt-3 border-t-2 border-[#E5E3DB] grid grid-cols-4 gap-1.5 text-center font-stardew">
          <div className="p-1.5 rounded-xl bg-[#FAF9F6] border border-[#E5E3DB] hover:bg-white transition-colors">
            <div className="flex items-center justify-center gap-1 text-xs font-bold text-[#1B263B]">
              <BookOpen className="w-3.5 h-3.5 text-[#2D6A4F]" />
              {profile.stats.boards}
            </div>
            <div className="text-[10px] text-[#6C7A89] font-bold mt-0.5">
              Panolar
            </div>
          </div>

          <div className="p-1.5 rounded-xl bg-[#FAF9F6] border border-[#E5E3DB] hover:bg-white transition-colors">
            <div className="flex items-center justify-center gap-1 text-xs font-bold text-[#1B263B]">
              <Bookmark className="w-3.5 h-3.5 text-[#D4A5A5]" />
              {profile.stats.pins}
            </div>
            <div className="text-[10px] text-[#6C7A89] font-bold mt-0.5">
              Pinler
            </div>
          </div>

          <div className="p-1.5 rounded-xl bg-[#FAF9F6] border border-[#E5E3DB] hover:bg-white transition-colors">
            <div className="flex items-center justify-center gap-1 text-xs font-bold text-[#E07A5F]">
              <Flame className="w-3.5 h-3.5 text-[#E07A5F]" />
              {profile.stats.streak} gün
            </div>
            <div className="text-[10px] text-[#6C7A89] font-bold mt-0.5">
              Seri
            </div>
          </div>

          <div className="p-1.5 rounded-xl bg-[#FAF9F6] border border-[#E5E3DB] hover:bg-white transition-colors">
            <div className="flex items-center justify-center gap-1 text-xs font-bold text-[#2D6A4F]">
              <Clock className="w-3.5 h-3.5 text-[#2D6A4F]" />
              {profile.stats.focusHours} sa
            </div>
            <div className="text-[10px] text-[#6C7A89] font-bold mt-0.5">
              Odak
            </div>
          </div>
        </div>

        {/* Selected Goals & Tag Pills */}
        <div className="mt-3 flex items-center gap-1.5 overflow-x-auto pb-0.5 no-scrollbar font-stardew">
          <Sparkles className="w-3.5 h-3.5 text-[#F4C542] shrink-0" />
          {profile.selectedGoals && profile.selectedGoals.length > 0
            ? profile.selectedGoals.map((g) => (
                <span
                  key={g}
                  className="shrink-0 text-[10px] font-bold px-2.5 py-0.5 rounded-xl bg-[#2D6A4F]/10 text-[#2D6A4F] border border-[#2D6A4F]/30"
                >
                  ★ {g}
                </span>
              ))
            : profile.tags.map((tag) => (
                <span
                  key={tag}
                  className="shrink-0 text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-[#FAF9F6] text-[#566573] border border-[#E5E3DB]"
                >
                  #{tag}
                </span>
              ))}
        </div>
      </div>
    </header>
  );
}

