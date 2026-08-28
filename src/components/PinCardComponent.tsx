import React, { useState } from 'react';
import { Bookmark, Heart, Clock } from 'lucide-react';
import { PinItem, AccentColor } from '../types';
import PuffyStarButton from './PuffyStarButton';

interface PinCardProps {
  key?: string;
  pin: PinItem;
  onOpenDetail: (pin: PinItem) => void;
  onToggleSave: (id: string) => void;
}

const accentStyles: Record<
  AccentColor,
  {
    badge: string;
    border: string;
    lightBg: string;
    text: string;
    tagBg: string;
  }
> = {
  navy: {
    badge: 'bg-[#1B263B] text-white',
    border: 'border-2 border-[#1B263B]/20 hover:border-[#1B263B]/50',
    lightBg: 'bg-[#1B263B]/5',
    text: 'text-[#1B263B]',
    tagBg: 'bg-[#1B263B]/10 text-[#1B263B]',
  },
  pink: {
    badge: 'bg-[#D4A5A5] text-[#4A2020]',
    border: 'border-2 border-[#D4A5A5]/40 hover:border-[#D4A5A5]/80',
    lightBg: 'bg-[#D4A5A5]/10',
    text: 'text-[#915050]',
    tagBg: 'bg-[#F9ECEC] text-[#915050]',
  },
  green: {
    badge: 'bg-[#2D6A4F] text-white',
    border: 'border-2 border-[#2D6A4F]/30 hover:border-[#2D6A4F]/70',
    lightBg: 'bg-[#2D6A4F]/8',
    text: 'text-[#2D6A4F]',
    tagBg: 'bg-[#EBF3EF] text-[#1E4D38]',
  },
  orange: {
    badge: 'bg-[#E07A5F] text-white',
    border: 'border-2 border-[#E07A5F]/35 hover:border-[#E07A5F]/70',
    lightBg: 'bg-[#E07A5F]/8',
    text: 'text-[#B8573D]',
    tagBg: 'bg-[#FDF1EE] text-[#B8573D]',
  },
  anime: {
    badge: 'bg-[#F472B6] text-white',
    border: 'border-2 border-[#F472B6]/30 hover:border-[#F472B6]/70',
    lightBg: 'bg-[#FCE7F3]/40',
    text: 'text-[#DB2777]',
    tagBg: 'bg-[#FCE7F3] text-[#BE185D]',
  },
  football: {
    badge: 'bg-[#16A34A] text-white',
    border: 'border-2 border-[#16A34A]/30 hover:border-[#16A34A]/70',
    lightBg: 'bg-[#DCFCE7]/40',
    text: 'text-[#16A34A]',
    tagBg: 'bg-[#DCFCE7] text-[#15803D]',
  },
  gaming: {
    badge: 'bg-[#7C3AED] text-white',
    border: 'border-2 border-[#7C3AED]/30 hover:border-[#7C3AED]/70',
    lightBg: 'bg-[#EDE9FE]/40',
    text: 'text-[#7C3AED]',
    tagBg: 'bg-[#EDE9FE] text-[#6D28D9]',
  },
};

export default function PinCardComponent({ pin, onOpenDetail, onToggleSave }: PinCardProps) {
  const [likes, setLikes] = useState(pin.likes);
  const [isLiked, setIsLiked] = useState(false);
  const styles = accentStyles[pin.accent] || accentStyles.navy;

  const handleLike = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (isLiked) {
      setLikes((prev) => prev - 1);
      setIsLiked(false);
    } else {
      setLikes((prev) => prev + 1);
      setIsLiked(true);
    }
  };

  const handleSave = (e: React.MouseEvent) => {
    e.stopPropagation();
    onToggleSave(pin.id);
  };

  return (
    <article
      id={`pin-card-${pin.id}`}
      onClick={() => onOpenDetail(pin)}
      className={`group relative bg-white rounded-2xl overflow-hidden ${styles.border} shadow-xs hover:shadow-md transition-all duration-200 cursor-pointer flex flex-col font-stardew`}
    >
      {/* Visual Image if available (Pinterest style) */}
      {pin.imageUrl && (
        <div className="relative w-full overflow-hidden aspect-4/3 bg-[#F5F3EC]">
          <img
            src={pin.imageUrl}
            alt={pin.title}
            loading="lazy"
            referrerPolicy="no-referrer"
            className="w-full h-full object-cover group-hover:scale-102 transition-transform duration-300"
          />
          {/* Top Tag Overlay */}
          <div className="absolute top-2.5 left-2.5">
            <span
              className={`text-[10px] font-bold px-2 py-0.5 rounded-xl shadow-xs font-stardew ${styles.badge}`}
            >
              ★ {pin.tag}
            </span>
          </div>

          {/* Quick Bookmark Save Button as Puffy Star */}
          <div className="absolute top-2 right-2 z-10">
            <PuffyStarButton
              id={`bookmark-pin-${pin.id}`}
              isStarShape={true}
              variant={pin.isSaved ? "yellow" : "white"}
              size="icon-sm"
              onClick={handleSave}
              aria-label={pin.isSaved ? 'Kaydedilenlerden Çıkar' : 'Panoya Kaydet'}
              title={pin.isSaved ? 'Panoda Kayıtlı' : 'Panoya Kaydet'}
            >
              <Bookmark className={`w-3.5 h-3.5 ${pin.isSaved ? 'fill-current text-[#5A3E00]' : 'text-[#1B263B]'}`} />
            </PuffyStarButton>
          </div>
        </div>
      )}

      {/* Card Body */}
      <div className="p-3.5 flex-1 flex flex-col justify-between">
        <div>
          {/* Header if no image */}
          {!pin.imageUrl && (
            <div className="flex items-center justify-between mb-2">
              <span className={`text-[10px] font-bold px-2 py-0.5 rounded-xl font-stardew ${styles.badge}`}>
                ★ {pin.tag}
              </span>
              <PuffyStarButton
                id={`bookmark-pin-noimg-${pin.id}`}
                isStarShape={true}
                variant={pin.isSaved ? "yellow" : "white"}
                size="icon-sm"
                onClick={handleSave}
                aria-label={pin.isSaved ? 'Kaydedilenlerden Çıkar' : 'Panoya Kaydet'}
                title={pin.isSaved ? 'Panoda Kayıtlı' : 'Panoya Kaydet'}
              >
                <Bookmark className={`w-3.5 h-3.5 ${pin.isSaved ? 'fill-current text-[#5A3E00]' : 'text-[#1B263B]'}`} />
              </PuffyStarButton>
            </div>
          )}

          {/* Card Title */}
          <h3 className="text-sm font-bold text-[#1B263B] leading-snug font-stardew group-hover:text-[#E07A5F] transition-colors">
            {pin.title}
          </h3>

          {/* Description */}
          <p className="mt-1.5 text-xs text-[#566573] leading-relaxed line-clamp-3 font-stardew">
            {pin.description}
          </p>

          {/* Checklist / Cheat sheet items preview */}
          {pin.items && pin.items.length > 0 && (
            <div className="mt-2.5 space-y-1 bg-[#FAF9F6] p-2.5 rounded-xl border border-[#E5E3DB]">
              {pin.items.slice(0, 3).map((item, idx) => (
                <div key={idx} className="flex items-start gap-1.5 text-[11px] text-[#2C3E50] leading-tight font-stardew">
                  <span className="text-[#E07A5F] shrink-0 font-bold">★</span>
                  <span className="truncate">{item}</span>
                </div>
              ))}
              {pin.items.length > 3 && (
                <p className="text-[10px] font-bold text-[#6C7A89] pt-0.5 pl-3 font-stardew">
                  +{pin.items.length - 3} madde daha 𐙚
                </p>
              )}
            </div>
          )}
        </div>

        {/* Card Footer (Date / Read time & Like count) */}
        <div className="mt-3 pt-2.5 border-t border-[#E5E3DB] flex items-center justify-between text-[11px] text-[#6C7A89] font-stardew">
          <div className="flex items-center gap-1.5">
            {pin.readTime && (
              <span className="flex items-center gap-1 text-[#2D6A4F] font-bold">
                <Clock className="w-3 h-3" />
                {pin.readTime}
              </span>
            )}
            {pin.date && !pin.readTime && <span>{pin.date}</span>}
          </div>

          <div className="flex items-center gap-1">
            <button
              onClick={handleLike}
              className={`flex items-center gap-1 px-2 py-0.5 rounded-lg border transition-all ${
                isLiked
                  ? 'bg-[#D4A5A5]/30 text-[#8B3A3A] border-[#D4A5A5] font-bold scale-105'
                  : 'bg-[#FAF9F6] text-[#6C7A89] border-[#E5E3DB] hover:text-[#D4A5A5]'
              }`}
            >
              <Heart className={`w-3.5 h-3.5 ${isLiked ? 'fill-[#D4A5A5] text-[#D4A5A5]' : ''}`} />
              <span>{likes}</span>
              <span className="text-[9px]">𐙚</span>
            </button>
          </div>
        </div>
      </div>
    </article>
  );
}

