import React, { useState } from 'react';
import { X, Plus, Sparkles } from 'lucide-react';
import { PinItem, PinCategory, AccentColor } from '../types';
import PuffyStarButton from './PuffyStarButton';

interface NewPinModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddPin: (pin: PinItem) => void;
}

const colorOptions: { id: AccentColor; label: string; bgClass: string; variant: 'navy' | 'pink' | 'green' | 'orange' }[] = [
  { id: 'navy', label: 'Lacivert', bgClass: 'bg-[#1B263B]', variant: 'navy' },
  { id: 'pink', label: 'Pudra Pembesi', bgClass: 'bg-[#D4A5A5]', variant: 'pink' },
  { id: 'green', label: 'Koyu Yeşil', bgClass: 'bg-[#2D6A4F]', variant: 'green' },
  { id: 'orange', label: 'Turuncu', bgClass: 'bg-[#E07A5F]', variant: 'orange' },
];

export default function NewPinModal({ isOpen, onClose, onAddPin }: NewPinModalProps) {
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState<PinCategory>('study');
  const [accent, setAccent] = useState<AccentColor>('green');
  const [tag, setTag] = useState('Ders Notu');
  const [description, setDescription] = useState('');
  const [bulletText, setBulletText] = useState('');
  const [imageUrl, setImageUrl] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    const items = bulletText
      .split('\n')
      .map((line) => line.trim())
      .filter((line) => line.length > 0);

    const newPin: PinItem = {
      id: `pin-${Date.now()}`,
      title: title.trim(),
      category,
      accent,
      tag: tag.trim() || 'Öğrenci Pini',
      description: description.trim() || 'Çalışma panonuza eklenen hızlı not.',
      imageUrl: imageUrl.trim() || undefined,
      items: items.length > 0 ? items : undefined,
      date: 'Az önce',
      likes: 1,
      isSaved: true,
      readTime: 'Hızlı Not',
    };

    onAddPin(newPin);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-[#1B263B]/50 backdrop-blur-xs flex items-center justify-center p-4 font-stardew">
      <div className="fixed inset-0" onClick={onClose} aria-hidden="true" />

      <div className="relative bg-[#FAF9F6] rounded-3xl max-w-md w-full overflow-hidden border-2 border-[#E5E3DB] shadow-2xl z-10 animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="p-3.5 bg-white border-b-2 border-[#E5E3DB] flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-[#E07A5F] text-white flex items-center justify-center text-xs font-bold border border-[#C8664C] shadow-xs">
              ★
            </div>
            <span className="font-bold text-[#1B263B] font-stardew">Stardew Panosuna Ekle 𐙚</span>
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

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-5 space-y-3.5 max-h-[80vh] overflow-y-auto font-stardew">
          {/* Title */}
          <div>
            <label className="block text-xs font-bold text-[#1B263B] mb-1 font-stardew">Pin Başlığı *</label>
            <input
              type="text"
              required
              placeholder="Örn. Biyokimya Kartları veya Tasarım İlhamı ⋆˚࿔"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full bg-white text-xs font-stardew text-[#1B263B] px-3.5 py-2.5 rounded-2xl border-2 border-[#E5E3DB] placeholder:text-[#9AA5B5] focus:outline-hidden focus:ring-2 focus:ring-[#F4C542] focus:border-[#E07A5F]"
            />
          </div>

          {/* Category & Tag */}
          <div className="grid grid-cols-2 gap-2.5 font-stardew">
            <div>
              <label className="block text-xs font-bold text-[#1B263B] mb-1">Pano Kategorisi</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as PinCategory)}
                className="w-full bg-white text-xs font-stardew text-[#1B263B] px-3 py-2 rounded-2xl border-2 border-[#E5E3DB] focus:outline-hidden focus:ring-2 focus:ring-[#F4C542]"
              >
                <option value="study">Ders Notları 𐙚</option>
                <option value="deadlines">Teslimler ⚡</option>
                <option value="inspo">Estetik İlham ᡣ𐭩</option>
                <option value="notes">Bilgi Kartları ౨ৎ</option>
                <option value="schedule">Program 🎐</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-[#1B263B] mb-1">Özel Etiket</label>
              <input
                type="text"
                placeholder="Örn. BİL 101"
                value={tag}
                onChange={(e) => setTag(e.target.value)}
                className="w-full bg-white text-xs font-stardew text-[#1B263B] px-3 py-2 rounded-2xl border-2 border-[#E5E3DB] placeholder:text-[#9AA5B5] focus:outline-hidden focus:ring-2 focus:ring-[#F4C542]"
              />
            </div>
          </div>

          {/* Accent Color Picker with Puffy Badges */}
          <div>
            <label className="block text-xs font-bold text-[#1B263B] mb-1.5 font-stardew">
              Estetik Renk Vurgusu ⋆
            </label>
            <div className="grid grid-cols-4 gap-2 font-stardew">
              {colorOptions.map((col) => (
                <button
                  type="button"
                  key={col.id}
                  onClick={() => setAccent(col.id)}
                  className={`flex items-center justify-center gap-1.5 p-2 rounded-2xl border-2 transition-all cursor-pointer transform hover:-translate-y-0.5 ${
                    accent === col.id
                      ? 'bg-white border-[#1B263B] shadow-[0_3px_0_#1B263B] font-bold'
                      : 'bg-white/70 border-[#E5E3DB] hover:bg-white text-[#6C7A89]'
                  }`}
                >
                  <span className={`w-3.5 h-3.5 rounded-full ${col.bgClass}`} />
                  <span className="text-[10px]">{col.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="block text-xs font-bold text-[#1B263B] mb-1 font-stardew">Özet / Not</label>
            <textarea
              rows={2}
              placeholder="Temel kavramlar, kısa özet veya hatırlatma... ⋆˚࿔"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full bg-white text-xs font-stardew text-[#1B263B] p-3 rounded-2xl border-2 border-[#E5E3DB] placeholder:text-[#9AA5B5] focus:outline-hidden focus:ring-2 focus:ring-[#F4C542] resize-none"
            />
          </div>

          {/* Key Bullet points / Checklist items */}
          <div>
            <label className="block text-xs font-bold text-[#1B263B] mb-1 font-stardew">
              Kontrol Listesi / Maddeler (her satıra bir tane)
            </label>
            <textarea
              rows={3}
              placeholder="★ Formül veya anahtar kavram 1&#10;★ Tekrar sorusu 2&#10;★ Teslim tarihi maddesi 3"
              value={bulletText}
              onChange={(e) => setBulletText(e.target.value)}
              className="w-full bg-white text-xs font-stardew text-[#1B263B] p-3 rounded-2xl border-2 border-[#E5E3DB] placeholder:text-[#9AA5B5] focus:outline-hidden focus:ring-2 focus:ring-[#F4C542] resize-none"
            />
          </div>

          {/* Optional Image URL */}
          <div>
            <label className="block text-xs font-bold text-[#1B263B] mb-1 flex items-center justify-between font-stardew">
              <span>Görsel Bağlantısı (İsteğe Bağlı)</span>
              <span className="text-[10px] text-[#6C7A89]">Unsplash veya doğrudan bağlantı</span>
            </label>
            <input
              type="url"
              placeholder="https://images.unsplash.com/..."
              value={imageUrl}
              onChange={(e) => setImageUrl(e.target.value)}
              className="w-full bg-white text-xs font-stardew text-[#1B263B] px-3 py-2 rounded-2xl border-2 border-[#E5E3DB] placeholder:text-[#9AA5B5] focus:outline-hidden focus:ring-2 focus:ring-[#F4C542]"
            />
          </div>

          {/* Submit as Puffy Star Button */}
          <div className="pt-2">
            <PuffyStarButton
              variant="orange"
              size="lg"
              className="w-full justify-center"
              onClick={handleSubmit}
            >
              <Sparkles className="w-4 h-4 mr-1 inline" />
              Nixi Çalışma Alanına Ekle 𐙚
            </PuffyStarButton>
          </div>
        </form>
      </div>
    </div>
  );
}

