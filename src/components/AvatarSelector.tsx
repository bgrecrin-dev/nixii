import React, { useRef, useState } from 'react';
import { Camera, Upload, Check, RefreshCw, Trash2, Link, Sparkles, Image as ImageIcon } from 'lucide-react';
import { processImageFile } from '../utils/imageUtils';

export interface AvatarPreset {
  id: string;
  name: string;
  url: string;
  tag: string;
}

export const AVATAR_PRESETS: AvatarPreset[] = [
  {
    id: 'elena',
    name: 'Matcha Öğrencisi',
    url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80',
    tag: 'Tasarım & İBH',
  },
  {
    id: 'maya',
    name: 'Bitki ve Doğa Aşığı',
    url: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=400&q=80',
    tag: 'Biyoloji & Botanik',
  },
  {
    id: 'kai',
    name: 'Gece Kodlayıcısı',
    url: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=400&q=80',
    tag: 'Yazılım & Matematik',
  },
  {
    id: 'julian',
    name: 'Arşiv Okuyucusu',
    url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80',
    tag: 'Edebiyat & Tarih',
  },
  {
    id: 'aria',
    name: 'Lo-Fi Sanatçısı',
    url: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=400&q=80',
    tag: 'Görsel Sanatlar',
  },
  {
    id: 'clara',
    name: 'Stardew Yıldızı',
    url: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=400&q=80',
    tag: 'Psikoloji',
  },
];

interface AvatarSelectorProps {
  currentAvatar: string;
  onAvatarChange: (newAvatarUrl: string) => void;
  studentName?: string;
  studentHandle?: string;
  subtitle?: string;
  compact?: boolean;
}

export default function AvatarSelector({
  currentAvatar,
  onAvatarChange,
  studentName = 'Elena Vance',
  studentHandle = '@elena.calisiyor',
  subtitle = 'Tasarım ve İBH',
  compact = false,
}: AvatarSelectorProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isDragOver, setIsDragOver] = useState(false);
  const [showUrlInput, setShowUrlInput] = useState(false);
  const [customUrl, setCustomUrl] = useState('');
  const [isCustomUpload, setIsCustomUpload] = useState(() => {
    return currentAvatar.startsWith('data:image');
  });

  const handleFileSelect = async (file: File) => {
    try {
      setIsProcessing(true);
      setErrorMessage(null);
      const dataUrl = await processImageFile(file);
      onAvatarChange(dataUrl);
      setIsCustomUpload(true);
    } catch (err: unknown) {
      if (err instanceof Error) {
        setErrorMessage(err.message);
      } else {
        setErrorMessage('Görsel yüklenirken bir hata oluştu.');
      }
    } finally {
      setIsProcessing(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files[0]) {
      handleFileSelect(files[0]);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    const files = e.dataTransfer.files;
    if (files && files[0]) {
      handleFileSelect(files[0]);
    }
  };

  const handleSelectPreset = (presetUrl: string) => {
    setErrorMessage(null);
    setIsCustomUpload(false);
    onAvatarChange(presetUrl);
  };

  const handleApplyUrl = (e: React.FormEvent) => {
    e.preventDefault();
    if (customUrl.trim()) {
      onAvatarChange(customUrl.trim());
      setIsCustomUpload(false);
      setErrorMessage(null);
    }
  };

  const handleResetToDefault = () => {
    handleSelectPreset(AVATAR_PRESETS[0].url);
  };

  return (
    <div className="space-y-3 font-stardew">
      {/* Hidden File Input for Device Gallery & File Browser */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/png,image/jpeg,image/jpg,image/webp,image/gif"
        onChange={handleInputChange}
        className="hidden"
        id="device-gallery-input"
      />

      {/* Main Selected Avatar Preview Card */}
      <div className="p-3.5 rounded-2xl bg-white border-2 border-[#E5E3DB] flex items-center justify-between gap-3 shadow-2xs">
        <div className="flex items-center gap-3 min-w-0">
          <div className="relative shrink-0">
            <img
              src={currentAvatar || AVATAR_PRESETS[0].url}
              alt="Profil fotoğrafı önizlemesi"
              referrerPolicy="no-referrer"
              className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl object-cover ring-3 ring-[#F4C542] shadow-xs"
            />
            {isCustomUpload ? (
              <span
                className="absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full bg-[#2D6A4F] text-white text-[10px] font-bold flex items-center justify-center shadow-xs border border-white"
                title="Galeriden Seçildi"
              >
                ✓
              </span>
            ) : (
              <span
                className="absolute -bottom-1 -right-1 w-4 h-4 rounded-full bg-[#E07A5F] text-white text-[8px] font-bold flex items-center justify-center shadow-xs"
                title="Hazır Avatar"
              >
                ★
              </span>
            )}
          </div>

          <div className="min-w-0">
            <div className="flex items-center gap-1.5 flex-wrap">
              <span className="text-[9px] font-bold px-2 py-0.5 rounded-full bg-[#2D6A4F]/10 text-[#2D6A4F] uppercase tracking-wider border border-[#2D6A4F]/20">
                {isCustomUpload ? 'Galeriden Fotoğraf ✓' : 'Karakter Avatarı 𐙚'}
              </span>
            </div>
            <h4 className="text-xs sm:text-sm font-bold text-[#1B263B] truncate mt-0.5">
              {studentName} <span className="text-[#6C7A89] font-normal">({studentHandle})</span>
            </h4>
            <p className="text-[11px] text-[#6C7A89] truncate">{subtitle}</p>
          </div>
        </div>

        {/* Quick Action Button on Preview */}
        <div className="flex flex-col sm:flex-row gap-1.5 shrink-0">
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="px-2.5 py-1.5 bg-[#FAF9F6] hover:bg-[#F4C542]/20 border border-[#E5E3DB] hover:border-[#F4C542] rounded-xl text-xs font-bold text-[#1B263B] flex items-center gap-1 transition-all cursor-pointer shadow-2xs"
            title="Cihaz galerisinden yeni fotoğraf seç"
          >
            <Camera className="w-3.5 h-3.5 text-[#E07A5F]" />
            <span className="hidden sm:inline">Değiştir</span>
          </button>

          {isCustomUpload && (
            <button
              type="button"
              onClick={handleResetToDefault}
              className="p-1.5 bg-[#FAF9F6] hover:bg-[#D4A5A5]/30 border border-[#E5E3DB] rounded-xl text-xs text-[#915050] flex items-center justify-center transition-all cursor-pointer"
              title="Varsayılan karaktere dön"
            >
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>

      {/* Device Gallery Upload Dropzone */}
      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
        className={`p-3.5 sm:p-4 rounded-2xl border-2 border-dashed transition-all cursor-pointer flex flex-col items-center justify-center text-center ${
          isDragOver
            ? 'bg-[#2D6A4F]/10 border-[#2D6A4F] scale-[1.01]'
            : 'bg-[#FAF9F6] border-[#D4A5A5] hover:bg-white hover:border-[#E07A5F]'
        }`}
      >
        <div className="w-10 h-10 rounded-2xl bg-white border border-[#E5E3DB] flex items-center justify-center text-[#E07A5F] mb-2 shadow-2xs">
          {isProcessing ? (
            <RefreshCw className="w-5 h-5 animate-spin text-[#F4C542]" />
          ) : (
            <Upload className="w-5 h-5" />
          )}
        </div>

        <div className="space-y-0.5">
          <p className="text-xs sm:text-sm font-bold text-[#1B263B]">
            {isProcessing ? 'Görsel işleniyor...' : 'Galeriden / Cihazdan Fotoğraf Seç 📷'}
          </p>
          <p className="text-[11px] text-[#6C7A89]">
            Telefonunuzun galerisinden seçin veya buraya sürükleyip bırakın
          </p>
          <p className="text-[9px] text-[#9AA5B5] uppercase tracking-wider font-semibold pt-0.5">
            PNG, JPG, WEBP • Otomatik boyutlandırılır ve kalıcı kaydedilir
          </p>
        </div>
      </div>

      {/* Error Feedback */}
      {errorMessage && (
        <div className="p-2.5 rounded-xl bg-[#D4A5A5]/20 border border-[#D4A5A5] text-xs text-[#915050] font-bold flex items-center gap-2">
          <span>⚠️</span>
          <span>{errorMessage}</span>
        </div>
      )}

      {/* Alternative Options Header */}
      <div className="flex items-center justify-between pt-1">
        <div className="flex items-center gap-1.5 text-xs font-bold text-[#1B263B]">
          <Sparkles className="w-3.5 h-3.5 text-[#F4C542]" />
          <span>Veya Hazır Stardew Karakteri Seçin:</span>
        </div>

        <button
          type="button"
          onClick={() => setShowUrlInput(!showUrlInput)}
          className="text-[10px] font-bold text-[#E07A5F] hover:underline flex items-center gap-1 cursor-pointer"
        >
          <Link className="w-3 h-3" />
          <span>{showUrlInput ? 'Bağlantıyı Gizle' : 'URL ile Ekle'}</span>
        </button>
      </div>

      {/* Preset Avatars Grid */}
      <div className={`grid ${compact ? 'grid-cols-3 sm:grid-cols-6' : 'grid-cols-3 sm:grid-cols-6'} gap-2`}>
        {AVATAR_PRESETS.map((preset) => {
          const isSelected = currentAvatar === preset.url && !isCustomUpload;
          return (
            <button
              key={preset.id}
              type="button"
              onClick={() => handleSelectPreset(preset.url)}
              className={`p-1.5 rounded-2xl border-2 flex flex-col items-center text-center transition-all cursor-pointer ${
                isSelected
                  ? 'bg-white border-[#F4C542] shadow-xs ring-2 ring-[#F4C542]/50 scale-102'
                  : 'bg-white border-[#E5E3DB] hover:bg-[#FAF9F6]'
              }`}
            >
              <div className="relative">
                <img
                  src={preset.url}
                  alt={preset.name}
                  referrerPolicy="no-referrer"
                  className="w-10 h-10 sm:w-11 sm:h-11 rounded-xl object-cover"
                />
                {isSelected && (
                  <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-[#F4C542] text-[#1B263B] text-[9px] font-bold flex items-center justify-center shadow-xs">
                    ✓
                  </span>
                )}
              </div>
              <span className="text-[10px] font-bold text-[#1B263B] mt-1 leading-tight truncate w-full">
                {preset.name.split(' ')[0]}
              </span>
              <span className="text-[8px] text-[#6C7A89] truncate w-full">{preset.tag}</span>
            </button>
          );
        })}
      </div>

      {/* Optional Web Image URL Input */}
      {showUrlInput && (
        <form onSubmit={handleApplyUrl} className="pt-1.5 flex gap-1.5 animate-in fade-in duration-150">
          <input
            type="url"
            value={customUrl}
            onChange={(e) => setCustomUrl(e.target.value)}
            placeholder="Özel görsel URL'si yapıştırın (https://...)"
            className="flex-1 px-3 py-1.5 rounded-xl bg-white border-2 border-[#E5E3DB] text-xs font-semibold text-[#1B263B] focus:border-[#E07A5F] focus:outline-hidden"
          />
          <button
            type="submit"
            className="px-3 py-1.5 bg-[#1B263B] hover:bg-[#24334d] text-white text-xs font-bold rounded-xl transition-all cursor-pointer flex items-center gap-1"
          >
            <Check className="w-3.5 h-3.5" />
            <span>Uygula</span>
          </button>
        </form>
      )}
    </div>
  );
}
