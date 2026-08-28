import React, { useState } from 'react';
import {
  X,
  ChevronDown,
  ChevronRight,
  Sparkles,
  BookOpen,
  Calendar,
  Clock,
  GraduationCap,
  Bot,
  Globe,
  NotebookPen,
  Coffee,
  Palette,
  Users,
  User,
  Settings,
  Flame,
  CheckSquare,
  Award,
  Sparkle,
  Sliders,
  Bell,
  Lock,
  Heart,
  RotateCcw,
  Compass,
  Bookmark,
  Share2,
} from 'lucide-react';
import { StudentProfile, PinCategory, PlannerType } from '../types';
import PuffyStarButton from './PuffyStarButton';
import { calculateLevelInfo } from '../utils/themeLevel';
import MenuFeatureModal, { MenuFeatureItem } from './MenuFeatureModal';

interface MenuDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  profile: StudentProfile;
  activeFilter?: string;
  onSelectCategory: (cat: PinCategory) => void;
  onSelectTab?: (tab: 'pins' | 'tasks' | 'agenda') => void;
  onSelectPlanner?: (type: PlannerType) => void;
  onEditProfile?: () => void;
  onOpenOnboarding?: () => void;
  onResetData?: () => void;
  tasksCount?: { total: number; pending: number; completed: number };
}

interface MenuSectionConfig {
  id: string;
  title: string;
  iconEmoji: string;
  badge?: string;
  isDirectLink?: boolean;
  subItems: Array<{
    title: string;
    iconEmoji: string;
    tag?: string;
    actionType?: 'home' | 'tasks' | 'planner' | 'pins_category' | 'edit_profile' | 'onboarding' | 'feature_modal';
    plannerType?: PlannerType;
    category?: PinCategory;
  }>;
}

export default function MenuDrawer({
  isOpen,
  onClose,
  profile,
  activeFilter,
  onSelectCategory,
  onSelectTab,
  onSelectPlanner,
  onEditProfile,
  onOpenOnboarding,
  onResetData,
  tasksCount,
}: MenuDrawerProps) {
  // Track open/collapsed state of accordion categories
  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({
    'school-courses': true, // Open by default for immediate usefulness
  });

  // Feature modal state for sub-items
  const [selectedFeature, setSelectedFeature] = useState<MenuFeatureItem | null>(null);

  if (!isOpen) return null;

  const levelInfo = calculateLevelInfo(profile.points || 0, profile.favoriteTheme || 'orange');

  const toggleSection = (sectionId: string) => {
    setExpandedSections((prev) => ({
      ...prev,
      [sectionId]: !prev[sectionId],
    }));
  };

  // 10 Exact Menu Sections requested in exact order
  const menuSections: MenuSectionConfig[] = [
    // 1. 🏠 Ana Sayfa
    {
      id: 'home',
      title: '🏠 Ana Sayfa',
      iconEmoji: '🏠',
      isDirectLink: true,
      subItems: [],
    },
    // 2. 📚 Okul & Ders: Not Hesaplama, Ders Programı, Önemli Günler, Ödevler, Ders Çalışma Zamanlayıcısı, Verimli Ders Çalışma
    {
      id: 'school-courses',
      title: '📚 Okul & Ders',
      iconEmoji: '📚',
      badge: '6 Araç',
      subItems: [
        { title: 'Not Hesaplama', iconEmoji: '🧮', tag: 'Hesapla ✧', actionType: 'feature_modal' },
        { title: 'Ders Programı', iconEmoji: '🗓️', tag: 'Haftalık', actionType: 'feature_modal' },
        { title: 'Önemli Günler', iconEmoji: '📌', tag: 'Dönemlik', actionType: 'feature_modal' },
        { title: 'Ödevler', iconEmoji: '📝', tag: tasksCount?.pending ? `${tasksCount.pending} Bekleyen` : 'Takip 𐙚', actionType: 'tasks' },
        { title: 'Ders Çalışma Zamanlayıcısı', iconEmoji: '⏱️', tag: '25 Dk Odak', actionType: 'feature_modal' },
        { title: 'Verimli Ders Çalışma', iconEmoji: '💡', tag: 'Teknikler ⋆', actionType: 'feature_modal' },
      ],
    },
    // 3. 🤖 Yapay Zeka Koçu: Ders çalışma planı, Hedef oluşturma, Derslerle ilgili yardım
    {
      id: 'ai-coach',
      title: '🤖 Yapay Zeka Koçu',
      iconEmoji: '🤖',
      badge: 'Akıllı Asistan',
      subItems: [
        { title: 'Ders çalışma planı', iconEmoji: '📋', tag: 'Otomatik', actionType: 'feature_modal' },
        { title: 'Hedef oluşturma', iconEmoji: '🎯', tag: 'Dönemlik 𐙚', actionType: 'feature_modal' },
        { title: 'Derslerle ilgili yardım', iconEmoji: '✨', tag: 'Soru-Cevap ✧', actionType: 'feature_modal' },
      ],
    },
    // 4. 🌍 Yabancı Dil: Kelime çalışması, Mini quiz, Dil çalışma alanı
    {
      id: 'foreign-language',
      title: '🌍 Yabancı Dil',
      iconEmoji: '🌍',
      badge: 'Kelime & Quiz',
      subItems: [
        { title: 'Kelime çalışması', iconEmoji: '🗂️', tag: 'Kartlar ᝰ.ᐟ', actionType: 'feature_modal' },
        { title: 'Mini quiz', iconEmoji: '✍️', tag: 'Hızlı Test', actionType: 'feature_modal' },
        { title: 'Dil çalışma alanı', iconEmoji: '📖', tag: 'Pratik ୨ৎ', actionType: 'feature_modal' },
      ],
    },
    // 5. 📔 Ajanda: Okul Ajandası, Yıllık Ajanda, Burn Book, Günlük, Reading Planner, Travel Planner, Diğer temalı ajandalar
    {
      id: 'planner',
      title: '📔 Ajanda',
      iconEmoji: '📔',
      badge: '7 Ajanda',
      subItems: [
        { title: 'Okul Ajandası', iconEmoji: '🎒', tag: 'Dersler ᝰ.ᐟ', actionType: 'planner', plannerType: 'school' },
        { title: 'Yıllık Ajanda', iconEmoji: '📆', tag: '2026 ⋆', actionType: 'planner', plannerType: 'yearly' },
        { title: 'Burn Book', iconEmoji: '🔥', tag: 'Deşarj 𐙚', actionType: 'planner', plannerType: 'burn_book' },
        { title: 'Günlük', iconEmoji: '✍️', tag: 'Kişisel ୨ৎ', actionType: 'planner', plannerType: 'journal' },
        { title: 'Reading Planner', iconEmoji: '📚', tag: 'Kitaplık ✧', actionType: 'planner', plannerType: 'reading' },
        { title: 'Travel Planner', iconEmoji: '✈️', tag: 'Geziler ᡣ𐭩', actionType: 'planner', plannerType: 'travel' },
        { title: 'Diğer temalı ajandalar', iconEmoji: '🏷️', tag: 'Şablonlar 𖦹', actionType: 'planner', plannerType: 'themed' },
      ],
    },
    // 6. 🍪 Molalar: Mini atıştırmalık tarifleri, Mola aktiviteleri, Kısa mola önerileri
    {
      id: 'breaks',
      title: '🍪 Molalar',
      iconEmoji: '🍪',
      badge: 'Dinlenme',
      subItems: [
        { title: 'Mini atıştırmalık tarifleri', iconEmoji: '🍵', tag: 'Tarifler 𐙚', actionType: 'feature_modal' },
        { title: 'Mola aktiviteleri', iconEmoji: '🧘‍♀️', tag: 'Egzersiz', actionType: 'feature_modal' },
        { title: 'Kısa mola önerileri', iconEmoji: '☕', tag: '5 Dk ⋆˚࿔', actionType: 'feature_modal' },
      ],
    },
    // 7. 🎨 Temalar: Hazır Temalar, Tema Koleksiyonum, Kilidi Açılan Temalar, Kendin Yap Teması
    {
      id: 'themes',
      title: '🎨 Temalar',
      iconEmoji: '🎨',
      badge: 'Stardew',
      subItems: [
        { title: 'Hazır Temalar', iconEmoji: '🌸', tag: 'Paletler', actionType: 'onboarding' },
        { title: 'Tema Koleksiyonum', iconEmoji: '🖼️', tag: 'Kaydedilenler', actionType: 'feature_modal' },
        { title: 'Kilidi Açılan Temalar', iconEmoji: '🔓', tag: 'Seviye 𐙚', actionType: 'feature_modal' },
        { title: 'Kendin Yap Teması', iconEmoji: '🖌️', tag: 'Özelleştir ✧', actionType: 'feature_modal' },
      ],
    },
    // 8. 👥 Topluluk: Şipşak, Yazılar, Keşfet
    {
      id: 'community',
      title: '👥 Topluluk',
      iconEmoji: '👥',
      badge: 'Öğrenci Ağı',
      subItems: [
        { title: 'Şipşak', iconEmoji: '📸', tag: 'Anlık ᝰ.ᐟ', actionType: 'feature_modal' },
        { title: 'Yazılar', iconEmoji: '📝', tag: 'Blog & Not', actionType: 'feature_modal' },
        { title: 'Keşfet', iconEmoji: '🧭', tag: 'Trendler 𐙚', actionType: 'feature_modal' },
      ],
    },
    // 9. 👤 Profil: Profili Görüntüle, Profil Düzenle, Başarımlar, Koleksiyon
    {
      id: 'profile-section',
      title: '👤 Profil',
      iconEmoji: '👤',
      badge: `${levelInfo.pointIcon} Seviye ${levelInfo.level}`,
      subItems: [
        { title: 'Profili Görüntüle', iconEmoji: '👀', tag: 'Özet ⋆', actionType: 'feature_modal' },
        { title: 'Profil Düzenle', iconEmoji: '✏️', tag: 'Düzenle 𐙚', actionType: 'edit_profile' },
        { title: 'Başarımlar', iconEmoji: '🏆', tag: `${levelInfo.totalPoints} ${levelInfo.pointName}`, actionType: 'feature_modal' },
        { title: 'Koleksiyon', iconEmoji: '💎', tag: 'Rozetler ✧', actionType: 'feature_modal' },
      ],
    },
    // 10. ⚙️ Ayarlar: Hesap, Gizlilik, Bildirimler, Dil, Tema ayarları
    {
      id: 'settings',
      title: '⚙️ Ayarlar',
      iconEmoji: '⚙️',
      badge: 'Ayarlar',
      subItems: [
        { title: 'Hesap', iconEmoji: '🔐', tag: 'Güvenlik', actionType: 'feature_modal' },
        { title: 'Gizlilik', iconEmoji: '🛡️', tag: 'Cihaz İçi', actionType: 'feature_modal' },
        { title: 'Bildirimler', iconEmoji: '🔔', tag: 'Hatırlatıcı', actionType: 'feature_modal' },
        { title: 'Dil', iconEmoji: '🇹🇷', tag: 'Türkçe', actionType: 'feature_modal' },
        { title: 'Tema ayarları', iconEmoji: '🎨', tag: 'Stil 𐙚', actionType: 'onboarding' },
      ],
    },
  ];

  const handleSubItemClick = (
    sectionTitle: string,
    item: MenuSectionConfig['subItems'][0]
  ) => {
    switch (item.actionType) {
      case 'home':
        if (onSelectTab) onSelectTab('pins');
        onSelectCategory('all');
        onClose();
        break;

      case 'tasks':
        if (onSelectTab) onSelectTab('tasks');
        onClose();
        break;

      case 'planner':
        if (onSelectTab) onSelectTab('agenda');
        if (item.plannerType && onSelectPlanner) {
          onSelectPlanner(item.plannerType);
        }
        onClose();
        break;

      case 'pins_category':
        if (onSelectTab) onSelectTab('pins');
        if (item.category) onSelectCategory(item.category);
        onClose();
        break;

      case 'edit_profile':
        onClose();
        if (onEditProfile) onEditProfile();
        break;

      case 'onboarding':
        onClose();
        if (onOpenOnboarding) onOpenOnboarding();
        break;

      case 'feature_modal':
      default:
        setSelectedFeature({
          sectionTitle,
          itemTitle: item.title,
          icon: item.iconEmoji,
          symbol: '𐙚',
        });
        break;
    }
  };

  const handleDirectLink = (section: MenuSectionConfig) => {
    if (section.id === 'home') {
      if (onSelectTab) onSelectTab('pins');
      onSelectCategory('all');
      onClose();
    }
  };

  return (
    <>
      <div className="fixed inset-0 z-50 overflow-hidden font-stardew">
        {/* Backdrop with soft blur */}
        <div
          className="fixed inset-0 bg-[#1B263B]/50 backdrop-blur-xs transition-opacity animate-in fade-in duration-200"
          onClick={onClose}
          aria-hidden="true"
        />

        <div className="fixed inset-y-0 right-0 max-w-full flex pl-8 sm:pl-10">
          <div className="w-screen max-w-xs sm:max-w-sm bg-[#FAF9F6] border-l-2 border-[#E5E3DB] shadow-2xl flex flex-col justify-between overflow-y-auto animate-in slide-in-from-right duration-250 font-stardew">
            
            {/* Top Navigation Content Area */}
            <div className="p-4 sm:p-5">
              {/* Header Title with Puffy Star Close */}
              <div className="flex items-center justify-between pb-3.5 border-b-2 border-[#E5E3DB]">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-xl bg-[#1B263B] text-white flex items-center justify-center text-sm font-bold border border-[#0F172A] shadow-xs">
                    ★
                  </div>
                  <div className="min-w-0">
                    <span className="font-bold text-[#1B263B] tracking-tight font-stardew text-base sm:text-lg block">
                      Nixi Menü 𐙚
                    </span>
                  </div>
                </div>
                <PuffyStarButton
                  id="close-drawer-btn"
                  isStarShape={true}
                  variant="white"
                  size="icon-sm"
                  onClick={onClose}
                  aria-label="Menüyü kapat"
                  title="Kapat"
                >
                  <X className="w-3.5 h-3.5 text-[#1B263B]" />
                </PuffyStarButton>
              </div>

              {/* Minimal Profile Header Card (Without school/uni name) */}
              <div className="mt-3.5 p-3 rounded-2xl bg-white border-2 border-[#E5E3DB] flex items-center gap-3">
                <img
                  src={profile.avatarUrl}
                  alt={profile.name}
                  referrerPolicy="no-referrer"
                  className="w-11 h-11 rounded-2xl object-cover ring-2 ring-[#F4C542] shadow-2xs shrink-0"
                />
                <div className="min-w-0 flex-1">
                  <div className="flex items-center justify-between">
                    <p className="text-xs font-bold text-[#1B263B] truncate font-stardew">{profile.name}</p>
                    <span className="text-[10px] font-bold text-[#2D6A4F] px-2 py-0.5 rounded-lg bg-[#2D6A4F]/10 border border-[#2D6A4F]/20">
                      {levelInfo.pointIcon} Seviye {levelInfo.level}
                    </span>
                  </div>
                  <p className="text-[11px] text-[#6C7A89] truncate font-stardew">
                    {profile.handle} • {profile.grade || profile.year || 'Öğrenci'}
                  </p>
                </div>
              </div>

              {/* Expandable Menu Section Groups */}
              <div className="mt-4">
                <div className="flex items-center justify-between mb-2 px-1">
                  <p className="text-[10px] font-bold text-[#6C7A89] uppercase tracking-wider font-stardew">
                    Kategoriler ⋆˚࿔
                  </p>
                  <span className="text-[10px] text-[#A0AEC0] font-stardew">
                    {menuSections.length} Bölüm
                  </span>
                </div>

                <nav className="space-y-2 font-stardew">
                  {menuSections.map((section) => {
                    const isExpanded = !!expandedSections[section.id];
                    const isHome = section.isDirectLink;

                    return (
                      <div
                        key={section.id}
                        className="rounded-2xl border-2 border-[#E5E3DB] bg-white overflow-hidden shadow-2xs transition-all"
                      >
                        {/* Section Header Button */}
                        {isHome ? (
                          <button
                            type="button"
                            onClick={() => handleDirectLink(section)}
                            className="w-full flex items-center justify-between px-3.5 py-2.5 text-xs font-bold text-[#1B263B] hover:bg-[#FAF9F6] transition-colors cursor-pointer text-left"
                          >
                            <div className="flex items-center gap-2.5">
                              <span className="text-sm">{section.iconEmoji}</span>
                              <span className="font-stardew">{section.title}</span>
                            </div>
                            <span className="text-[10px] font-bold px-2 py-0.5 rounded-lg bg-[#1B263B] text-white">
                              Ana Ekran 𐙚
                            </span>
                          </button>
                        ) : (
                          <button
                            type="button"
                            onClick={() => toggleSection(section.id)}
                            className="w-full flex items-center justify-between px-3.5 py-2.5 text-xs font-bold text-[#1B263B] hover:bg-[#FAF9F6] transition-colors cursor-pointer text-left"
                          >
                            <div className="flex items-center gap-2.5 min-w-0">
                              <span className="text-sm shrink-0">{section.iconEmoji}</span>
                              <span className="truncate font-stardew">{section.title}</span>
                            </div>
                            <div className="flex items-center gap-1.5 shrink-0">
                              {section.badge && (
                                <span className="text-[10px] font-bold px-1.5 py-0.2 rounded-md bg-[#FAF9F6] text-[#6C7A89] border border-[#E5E3DB]">
                                  {section.badge}
                                </span>
                              )}
                              {isExpanded ? (
                                <ChevronDown className="w-4 h-4 text-[#6C7A89]" />
                              ) : (
                                <ChevronRight className="w-4 h-4 text-[#A0AEC0]" />
                              )}
                            </div>
                          </button>
                        )}

                        {/* Collapsible Sub-Items Accordion */}
                        {!isHome && isExpanded && section.subItems.length > 0 && (
                          <div className="p-1.5 pt-0 bg-[#FAF9F6]/60 border-t border-[#E5E3DB]/70 space-y-1">
                            {section.subItems.map((subItem, idx) => (
                              <button
                                key={idx}
                                type="button"
                                onClick={() => handleSubItemClick(section.title, subItem)}
                                className="w-full flex items-center justify-between px-3 py-2 rounded-xl text-[11px] font-semibold text-[#1B263B] bg-white/90 hover:bg-white hover:border-[#F4C542] border border-transparent transition-all cursor-pointer text-left shadow-2xs group"
                              >
                                <div className="flex items-center gap-2 min-w-0">
                                  <span className="text-xs group-hover:scale-110 transition-transform">
                                    {subItem.iconEmoji}
                                  </span>
                                  <span className="truncate">{subItem.title}</span>
                                </div>
                                {subItem.tag && (
                                  <span className="text-[9px] font-bold px-1.5 py-0.5 rounded-md bg-[#FAF9F6] text-[#2D6A4F] border border-[#E5E3DB] shrink-0 ml-1">
                                    {subItem.tag}
                                  </span>
                                )}
                              </button>
                            ))}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </nav>
              </div>

              {/* Reset Data & Setup Utility */}
              <div className="mt-5 pt-3 border-t border-[#E5E3DB] space-y-2">
                {onOpenOnboarding && (
                  <button
                    type="button"
                    onClick={() => {
                      onClose();
                      onOpenOnboarding();
                    }}
                    className="w-full flex items-center justify-between px-3 py-2 rounded-xl bg-white border border-[#E5E3DB] hover:bg-[#FAF9F6] text-xs font-bold text-[#1B263B] transition-colors cursor-pointer"
                  >
                    <div className="flex items-center gap-2">
                      <Sparkle className="w-3.5 h-3.5 text-[#E07A5F]" />
                      <span>Kurulumu Yeniden Başlat 𐙚</span>
                    </div>
                    <span className="text-[10px] text-[#2D6A4F] font-bold">6 Adım ✧</span>
                  </button>
                )}

                {onResetData && (
                  <button
                    type="button"
                    onClick={() => {
                      if (window.confirm('Tüm veriler sıfırlansın ve başlangıç kurulumu tekrar açılsın mı?')) {
                        onClose();
                        onResetData();
                      }
                    }}
                    className="w-full flex items-center justify-between px-3 py-2 rounded-xl bg-white border border-[#E5E3DB] hover:bg-red-50 text-xs font-bold text-[#915050] transition-colors cursor-pointer"
                  >
                    <div className="flex items-center gap-2">
                      <RotateCcw className="w-3.5 h-3.5 text-[#915050]" />
                      <span>Verileri Sıfırla</span>
                    </div>
                    <span className="text-[10px] text-[#915050]">Sıfırla</span>
                  </button>
                )}
              </div>
            </div>

            {/* Footer Status */}
            <div className="p-4 border-t-2 border-[#E5E3DB] bg-white/90 font-stardew">
              <div className="flex items-center justify-between text-xs text-[#6C7A89]">
                <span className="font-bold text-[#1B263B]">Nixi Öğrenci Alanı 𐙚</span>
                <span className="font-bold text-[#E07A5F]">v1.3.0</span>
              </div>
              <p className="text-[10px] text-[#6C7A89] mt-0.5">
                Stardew Valley Estetiği • Sade ve Mobil Uyumlu ⋆˚࿔
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Feature Viewer Modal for interactive sub-items */}
      <MenuFeatureModal
        item={selectedFeature}
        onClose={() => setSelectedFeature(null)}
        profile={profile}
        onEditProfile={onEditProfile}
        onSelectTab={onSelectTab}
        onOpenOnboarding={onOpenOnboarding}
      />
    </>
  );
}
