import { useState } from 'react';
import { Sparkles, Copy, Check } from 'lucide-react';
import PuffyStarButton from './PuffyStarButton';

export const NIXI_AESTHETIC_TITLE = "⋆˚࿔ᝰ.ᐟ⋆˚࿔Nixiᝰ.ᐟ˚꩜｡. 𐙚 ˚";

export const AESTHETIC_SYMBOL_SETS = [
  {
    category: "Nixi Estetik İmzası",
    symbols: "⋆˚࿔ᝰ.ᐟ⋆˚࿔Nixiᝰ.ᐟ˚꩜｡. 𐙚 ˚",
  },
  {
    category: "Estetik Fiyonklar & Yıldızlar",
    symbols: "☃️︎ ⋆౨ৎ˚ ₊✧୨ৎ:⋆౨ৎ˚⟡˖ ࣪ ⋅˚ ₊˚✧𑁍.ೃ࿔:･⋆˚𝜗𝜚˚⋆ ⋆ ˚ ꩜ ｡ ⋆୨୧˚ .⋅˚₊‧ 🜲 ‧₊˚ ⋅ ˚⋆𐙚｡ 𖦹.ᡣ𐭩˚ ° ᡣ𐭩 . ° . 𝄞⨾𓍢ִ໋♬⋆.˚𝄢ᡣ𐭩 ₊˚ʚ ᗢ₊˚✧ ﾟ. 🎧ྀི♪⋆.✮ ོ༘₊⁺☀️︎₊⁺⋆.˚ 𓊆ྀི❤️︎𓊇ྀི 𓏲 ๋࣭ ࣪ ˖🎐 ˚˖𓍢ִ໋ ✧˚.༘⋆ 𓍯𓂃𓏧♡ .ᥫ᭡⋆˚✿˖° °❀⋆.ೃ࿔:･⋅˚₊‧ ଳ⋆.࿔:･₊˚✧𑁍.ೃ࿔:･𓆩♡𓆪✧ ੈ✩‧₊˚ ⋆♱✮♱⋆ ₊˚⊹ ᰔ ⋆⌂ ❀˖° ᰔᩚ ₊˚⊹꒷*ੈ༘⋆ ᡣ𐭩ྀིྀིྀི 𝄞⨾𓍢ִ໋♬⋆.˚𝄢ᡣ𐭩 ࣪ ִֶָ ೀ ₊˚⊹ ˖° *ੈ𑁍༘⋆ ᰔ ₊˚✧𑁍.ೃ࿔:･｡𖦹°‧ʚɞ",
  },
  {
    category: "Mini Kaomoji & Tılsımlar",
    symbols: "𐙚౨ৎྀི ୨ৎ ᡣ𐭩 ₊˚ෆᶻ 𝘇 𐰁⛇☃️︎❀ ♡ ᡣ𐭩ᵕ̈ ྀ ୨ৎ ᡣ𐭩 ᶻ 𝗓 𐰁 .ᐟ 𓍯 ᝰ.ᐟ ִ 𖤐 ʚɞ 𓍼 .ᐟ ᥫ᭡ 𐙚 𖠋 ✧˖° 𓆝 𝜗𝜚 .˚ ༘ ♡ ୭ 𖦹ᰔᩚ ꪆৎ",
  }
];

export const INDIVIDUAL_KAOMOJI_CHIPS = [
  "⋆˚࿔Nixiᝰ.ᐟ˚", "𐙚 ˚", "౨ৎ˚", "𑁍.ೃ࿔:･", "𝜗𝜚", "ᡣ𐭩", 
  "🎧ྀི♪", "🎐", "ᥫ᭡", "❀˖°", "ᰔᩚ", "𝄞⨾𓍢ִ໋♬", "𐰁⛇", "𖠋", "𓆝", "୭ 𖦹"
];

export default function AestheticSymbolRibbon() {
  const [copiedItem, setCopiedItem] = useState<string | null>(null);
  const [showPicker, setShowPicker] = useState(false);

  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    setCopiedItem(label);
    setTimeout(() => setCopiedItem(null), 1800);
  };

  return (
    <div className="mx-4 sm:mx-6 mb-3">
      {/* Main Stardew / Aesthetic Sparkle Banner */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-[#D4A5A5]/25 via-[#F4C542]/20 to-[#E07A5F]/25 border-2 border-[#E5E3DB] p-3 shadow-xs">
        
        {/* Decorative pixel Stardew star watermark */}
        <div className="absolute -right-2 -bottom-2 text-4xl opacity-15 pointer-events-none select-none font-stardew">
          ★
        </div>

        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2.5">
          {/* Aesthetic Title Display */}
          <div className="flex items-center gap-2 min-w-0">
            <PuffyStarButton
              isStarShape={true}
              variant="yellow"
              size="sm"
              onClick={() => copyToClipboard(NIXI_AESTHETIC_TITLE, "title")}
              title="Nixi Estetik Metnini Kopyala"
              aria-label="Nixi Estetik Metnini Kopyala"
            >
              ★
            </PuffyStarButton>
            
            <div className="min-w-0">
              <div className="flex items-center gap-1.5 flex-wrap">
                <span className="font-stardew text-xs sm:text-sm font-bold text-[#1B263B] tracking-wide select-all bg-white/75 px-2 py-0.5 rounded-lg border border-[#E5E3DB] shadow-xs">
                  {NIXI_AESTHETIC_TITLE}
                </span>
                <button
                  onClick={() => copyToClipboard(NIXI_AESTHETIC_TITLE, "title")}
                  className="text-[10px] font-stardew font-bold px-2 py-0.5 rounded-full bg-[#1B263B] text-white hover:bg-[#253550] transition-transform active:scale-95 flex items-center gap-1 cursor-pointer"
                >
                  {copiedItem === "title" ? (
                    <>
                      <Check className="w-3 h-3 text-[#F4C542]" />
                      <span>Kopyalandı!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3 h-3" />
                      <span>Kopyala</span>
                    </>
                  )}
                </button>
              </div>
              <p className="text-[10px] text-[#566573] font-stardew mt-0.5 flex items-center gap-1">
                <span>🌾 Nixi Öğrenci Estetiği &amp; Puffy Yıldız Kontrolleri</span>
              </p>
            </div>
          </div>

          {/* Toggle Charm/Kaomoji Ribbon Drawer */}
          <div className="flex items-center gap-1.5 self-end sm:self-auto">
            <button
              onClick={() => setShowPicker(!showPicker)}
              className="text-xs font-stardew font-bold px-2.5 py-1 rounded-xl bg-white/90 border border-[#E5E3DB] text-[#1B263B] hover:bg-white shadow-xs transition-colors flex items-center gap-1.5 cursor-pointer"
            >
              <Sparkles className="w-3.5 h-3.5 text-[#E07A5F]" />
              <span>{showPicker ? "Gizle" : "Semboller & Kaomojiler"}</span>
              <span className="text-[10px] px-1.5 py-0.2 bg-[#F4C542]/40 rounded-full">𐙚</span>
            </button>
          </div>
        </div>

        {/* Individual Quick-Tap Kaomoji Charms Scroll */}
        <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar pt-2.5 mt-2 border-t border-[#E5E3DB]/70">
          <span className="text-[10px] font-stardew font-bold text-[#6C7A89] shrink-0">Kopyalamak İçin Dokun:</span>
          {INDIVIDUAL_KAOMOJI_CHIPS.map((chip, idx) => (
            <button
              key={idx}
              onClick={() => copyToClipboard(chip, `chip-${idx}`)}
              className="shrink-0 px-2 py-0.5 rounded-lg bg-white/85 hover:bg-white border border-[#E5E3DB] text-[11px] text-[#1B263B] font-stardew transition-all hover:scale-105 active:scale-95 shadow-2xs flex items-center gap-1 cursor-pointer"
              title="Kopyalamak için tıkla"
            >
              <span>{chip}</span>
              {copiedItem === `chip-${idx}` && (
                <Check className="w-2.5 h-2.5 text-[#2D6A4F]" />
              )}
            </button>
          ))}
        </div>

        {/* Expanded Full Aesthetic Charms Drawer */}
        {showPicker && (
          <div className="mt-3 pt-3 border-t border-[#E5E3DB] space-y-2.5 animate-in fade-in duration-200">
            {AESTHETIC_SYMBOL_SETS.map((set, sIdx) => (
              <div key={sIdx} className="bg-white/90 p-2.5 rounded-xl border border-[#E5E3DB] shadow-xs">
                <div className="flex items-center justify-between pb-1 mb-1.5 border-b border-[#E5E3DB]">
                  <span className="text-[11px] font-bold font-stardew text-[#1B263B] flex items-center gap-1">
                    <span className="text-[#F4C542]">★</span>
                    {set.category}
                  </span>
                  <button
                    onClick={() => copyToClipboard(set.symbols, `set-${sIdx}`)}
                    className="text-[10px] font-stardew px-2 py-0.5 rounded-md bg-[#2D6A4F] text-white hover:bg-[#23533E] flex items-center gap-1 transition-transform active:scale-95 cursor-pointer"
                  >
                    {copiedItem === `set-${sIdx}` ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
                    <span>{copiedItem === `set-${sIdx}` ? "Kopyalandı" : "Seti Kopyala"}</span>
                  </button>
                </div>
                <p className="text-xs leading-relaxed text-[#1B263B] font-stardew break-all select-all bg-[#FAF9F6] p-2 rounded-lg border border-[#E5E3DB]/60">
                  {set.symbols}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
