import { useState } from 'react';
import { X, Bookmark, Heart, Copy, Check, Calendar, Clock, Sparkles } from 'lucide-react';
import { PinItem, AccentColor } from '../types';
import PuffyStarButton from './PuffyStarButton';

interface PinDetailModalProps {
  pin: PinItem | null;
  onClose: () => void;
  onToggleSave: (id: string) => void;
}

const accentBadges: Record<AccentColor, { bg: string; text: string }> = {
  navy: { bg: 'bg-[#1B263B]', text: 'text-white' },
  pink: { bg: 'bg-[#D4A5A5]', text: 'text-[#4A2020]' },
  green: { bg: 'bg-[#2D6A4F]', text: 'text-white' },
  orange: { bg: 'bg-[#E07A5F]', text: 'text-white' },
  anime: { bg: 'bg-[#F472B6]', text: 'text-white' },
  football: { bg: 'bg-[#16A34A]', text: 'text-white' },
  gaming: { bg: 'bg-[#7C3AED]', text: 'text-white' },
};

export default function PinDetailModal({ pin, onClose, onToggleSave }: PinDetailModalProps) {
  const [copied, setCopied] = useState(false);
  const [checkedItems, setCheckedItems] = useState<Record<number, boolean>>({});

  if (!pin) return null;

  const toggleCheck = (idx: number) => {
    setCheckedItems((prev) => ({ ...prev, [idx]: !prev[idx] }));
  };

  const handleCopy = () => {
    const textToCopy = `${pin.title}\n\n${pin.description}\n\n${
      pin.items ? pin.items.map((it) => `★ ${it}`).join('\n') : ''
    }`;
    if (navigator.clipboard) {
      navigator.clipboard.writeText(textToCopy);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const badgeStyle = accentBadges[pin.accent] || accentBadges.navy;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-[#1B263B]/50 backdrop-blur-xs flex items-center justify-center p-4 font-stardew">
      <div
        className="fixed inset-0"
        onClick={onClose}
        aria-hidden="true"
      />

      <div className="relative bg-[#FAF9F6] rounded-3xl max-w-lg w-full overflow-hidden border-2 border-[#E5E3DB] shadow-2xl z-10 animate-in fade-in zoom-in-95 duration-200">
        {/* Modal Top Bar */}
        <div className="p-3.5 bg-white border-b-2 border-[#E5E3DB] flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className={`text-xs font-bold px-3 py-1 rounded-xl shadow-2xs font-stardew ${badgeStyle.bg} ${badgeStyle.text}`}>
              ★ {pin.tag}
            </span>
            {pin.readTime && (
              <span className="text-xs text-[#2D6A4F] font-bold flex items-center gap-1 bg-[#2D6A4F]/10 px-2 py-0.5 rounded-lg border border-[#2D6A4F]/20 font-stardew">
                <Clock className="w-3 h-3" />
                {pin.readTime}
              </span>
            )}
          </div>

          <div className="flex items-center gap-2">
            {/* Copy Button */}
            <PuffyStarButton
              id="detail-copy-btn"
              isStarShape={true}
              variant="white"
              size="icon-sm"
              onClick={handleCopy}
              title="Not Metnini Kopyala"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-[#2D6A4F]" /> : <Copy className="w-3.5 h-3.5 text-[#1B263B]" />}
            </PuffyStarButton>

            {/* Save Button */}
            <PuffyStarButton
              id="detail-save-btn"
              isStarShape={true}
              variant={pin.isSaved ? "yellow" : "white"}
              size="icon-sm"
              onClick={() => onToggleSave(pin.id)}
              title={pin.isSaved ? 'Panoda Kayıtlı' : 'Panoya Kaydet'}
            >
              <Bookmark className={`w-3.5 h-3.5 ${pin.isSaved ? 'fill-current text-[#5A3E00]' : 'text-[#1B263B]'}`} />
            </PuffyStarButton>

            {/* Close Button */}
            <PuffyStarButton
              id="detail-close-btn"
              isStarShape={true}
              variant="navy"
              size="icon-sm"
              onClick={onClose}
              title="Pencereyi Kapat"
            >
              <X className="w-3.5 h-3.5 text-white" />
            </PuffyStarButton>
          </div>
        </div>

        {/* Modal Content */}
        <div className="max-h-[75vh] overflow-y-auto p-5 space-y-4 font-stardew">
          {/* Visual Image if any */}
          {pin.imageUrl && (
            <div className="rounded-2xl overflow-hidden aspect-video bg-[#F5F3EC] border-2 border-[#E5E3DB] shadow-xs">
              <img
                src={pin.imageUrl}
                alt={pin.title}
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover"
              />
            </div>
          )}

          {/* Title */}
          <h2 className="text-lg sm:text-xl font-bold text-[#1B263B] font-stardew leading-tight">
            {pin.title} 𐙚
          </h2>

          {/* Description */}
          <p className="text-xs sm:text-sm text-[#566573] leading-relaxed font-stardew">
            {pin.description}
          </p>

          {/* Checklist / Key takeaways */}
          {pin.items && pin.items.length > 0 && (
            <div className="bg-white p-4 rounded-2xl border-2 border-[#E5E3DB] shadow-xs space-y-2.5">
              <div className="flex items-center justify-between pb-1.5 border-b border-[#E5E3DB]">
                <span className="text-xs font-bold text-[#1B263B] font-stardew flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-[#F4C542]" />
                  Önemli Notlar ve Kontrol Listesi ⋆˚࿔
                </span>
                <span className="text-[11px] text-[#6C7A89] font-stardew">İşaretlemek için dokun</span>
              </div>

              <div className="space-y-2 pt-1">
                {pin.items.map((item, idx) => {
                  const isDone = !!checkedItems[idx];
                  return (
                    <button
                      key={idx}
                      onClick={() => toggleCheck(idx)}
                      className={`w-full text-left flex items-start gap-2.5 p-2 rounded-xl transition-all cursor-pointer border ${
                        isDone ? 'bg-[#FAF9F6] border-[#E5E3DB] opacity-60' : 'bg-white border-[#E5E3DB] hover:bg-[#FAF9F6]'
                      }`}
                    >
                      <span
                        className={`w-5 h-5 mt-0.5 rounded-lg flex items-center justify-center border font-bold text-xs shrink-0 transition-colors ${
                          isDone
                            ? 'bg-[#2D6A4F] border-[#2D6A4F] text-white shadow-xs'
                            : 'border-[#CAD2DD] bg-[#FAF9F6] text-[#6C7A89]'
                        }`}
                      >
                        {isDone ? '★' : '☆'}
                      </span>
                      <span
                        className={`text-xs leading-relaxed font-stardew text-[#1B263B] ${
                          isDone ? 'line-through text-[#6C7A89]' : ''
                        }`}
                      >
                        {item}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Metadata pill bar */}
          <div className="flex items-center justify-between text-xs text-[#6C7A89] pt-2 font-stardew">
            <span className="flex items-center gap-1">
              <Calendar className="w-3.5 h-3.5 text-[#E07A5F]" />
              {pin.date || 'Dönemlik Çalışma Notu'}
            </span>
            <span className="font-bold text-[#1B263B]">⋆ Nixi Görsel Alanı 𐙚</span>
          </div>
        </div>

        {/* Modal Action Footer */}
        <div className="p-4 bg-white border-t-2 border-[#E5E3DB] flex items-center justify-between font-stardew">
          <div className="flex items-center gap-1.5 text-xs text-[#6C7A89]">
            <Heart className="w-4 h-4 text-[#D4A5A5] fill-[#D4A5A5]" />
            <span>{pin.likes} öğrenci kaydetti</span>
          </div>

          <PuffyStarButton
            variant={pin.isSaved ? "navy" : "orange"}
            size="md"
            onClick={() => onToggleSave(pin.id)}
          >
            <Bookmark className="w-3.5 h-3.5 fill-current mr-1 inline" />
            <span>{pin.isSaved ? 'Panonda Kayıtlı 𐙚' : 'Çalışma Alanına Kaydet ★'}</span>
          </PuffyStarButton>
        </div>
      </div>
    </div>
  );
}

