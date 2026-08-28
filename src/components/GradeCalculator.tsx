import React, { useState, useEffect } from 'react';
import { Calculator, Award, CheckCircle2, Trash2, Plus, RotateCcw, Bookmark, Sparkles } from 'lucide-react';
import { StudentProfile, EducationLevel, SavedCourseGrade } from '../types';
import PuffyStarButton from './PuffyStarButton';
import { loadSavedCourseGrades, saveSavedCourseGrades } from '../utils/storage';

interface GradeCalculatorProps {
  profile: StudentProfile;
}

export default function GradeCalculator({ profile }: GradeCalculatorProps) {
  // Education level defaults to profile's level
  const defaultLevel: EducationLevel = profile.educationLevel || 'universite';
  const [activeLevel, setActiveLevel] = useState<EducationLevel>(defaultLevel);
  const [courseName, setCourseName] = useState('');

  // 1. Ortaokul State
  const [ortaYazili1, setOrtaYazili1] = useState<number | ''>(85);
  const [ortaYazili2, setOrtaYazili2] = useState<number | ''>(90);
  const [ortaDersIci, setOrtaDersIci] = useState<number | ''>(95);
  const [ortaProje, setOrtaProje] = useState<number | ''>('');

  // 2. Lise State
  const [liseYazili1, setLiseYazili1] = useState<number | ''>(78);
  const [liseYazili2, setLiseYazili2] = useState<number | ''>(84);
  const [liseSozlu, setLiseSozlu] = useState<number | ''>(90);
  const [liseProje, setLiseProje] = useState<number | ''>(95);

  // 3. Üniversite State
  const [uniVize, setUniVize] = useState<number | ''>(75);
  const [uniVizeWeight, setUniVizeWeight] = useState<number>(40);
  const [uniFinal, setUniFinal] = useState<number | ''>(85);
  const [uniFinalWeight, setUniFinalWeight] = useState<number>(50);
  const [uniOdev, setUniOdev] = useState<number | ''>(90);
  const [uniOdevWeight, setUniOdevWeight] = useState<number>(10);
  const [uniProje, setUniProje] = useState<number | ''>('');
  const [uniProjeWeight, setUniProjeWeight] = useState<number>(0);

  // Saved course calculations
  const [savedGrades, setSavedGrades] = useState<SavedCourseGrade[]>(() => loadSavedCourseGrades());
  const [saveSuccessMsg, setSaveSuccessMsg] = useState(false);

  useEffect(() => {
    saveSavedCourseGrades(savedGrades);
  }, [savedGrades]);

  // Keep level in sync if profile changes
  useEffect(() => {
    if (profile.educationLevel) {
      setActiveLevel(profile.educationLevel);
    }
  }, [profile.educationLevel]);

  // Calculations for Ortaokul
  const calculateOrtaokul = () => {
    const scores: number[] = [];
    if (ortaYazili1 !== '') scores.push(Number(ortaYazili1));
    if (ortaYazili2 !== '') scores.push(Number(ortaYazili2));
    if (ortaDersIci !== '') scores.push(Number(ortaDersIci));
    if (ortaProje !== '') scores.push(Number(ortaProje));

    if (scores.length === 0) return { average: 0, status: 'Not Girilmedi', color: 'text-[#6C7A89]', badge: '—' };
    const avg = scores.reduce((a, b) => a + b, 0) / scores.length;

    let status = 'Geçer';
    let color = 'text-[#2D6A4F]';
    let badge = 'Geçti 🌿';

    if (avg >= 85) {
      status = 'Takdir Belgesi 🏆';
      color = 'text-[#2D6A4F]';
      badge = 'Takdir 𐙚';
    } else if (avg >= 70) {
      status = 'Teşekkür Belgesi ⭐';
      color = 'text-[#2D6A4F]';
      badge = 'Teşekkür ✧';
    } else if (avg >= 50) {
      status = 'Dersi Başarıyla Geçti 🌿';
      color = 'text-[#1B263B]';
      badge = 'Geçer ⋆';
    } else {
      status = 'Dersi Tekrar Etmeli 🍂';
      color = 'text-[#915050]';
      badge = 'Kaldı ❌';
    }

    return { average: avg, status, color, badge };
  };

  // Calculations for Lise
  const calculateLise = () => {
    const scores: number[] = [];
    if (liseYazili1 !== '') scores.push(Number(liseYazili1));
    if (liseYazili2 !== '') scores.push(Number(liseYazili2));
    if (liseSozlu !== '') scores.push(Number(liseSozlu));
    if (liseProje !== '') scores.push(Number(liseProje));

    if (scores.length === 0) return { average: 0, letter: '—', status: 'Not Girilmedi', color: 'text-[#6C7A89]', badge: '—' };
    const avg = scores.reduce((a, b) => a + b, 0) / scores.length;

    let letter = 'FF';
    let status = 'Kaldı';
    let color = 'text-[#915050]';
    let badge = 'Kaldı 🍂';

    if (avg >= 85) {
      letter = 'AA (5.0)';
      status = 'Takdir Belgesi 🏆';
      color = 'text-[#2D6A4F]';
      badge = 'Takdir 𐙚';
    } else if (avg >= 70) {
      letter = 'BB (4.0)';
      status = 'Teşekkür Belgesi ⭐';
      color = 'text-[#2D6A4F]';
      badge = 'Teşekkür ✧';
    } else if (avg >= 60) {
      letter = 'CB (3.0)';
      status = 'Orta / Başarılı 🌿';
      color = 'text-[#1B263B]';
      badge = 'Geçer ⋆';
    } else if (avg >= 50) {
      letter = 'CC (2.0)';
      status = 'Geçer Not 🌿';
      color = 'text-[#E07A5F]';
      badge = 'Geçer ᝰ.ᐟ';
    } else {
      letter = 'FF (0.0)';
      status = 'Dersi Geçemedi';
      color = 'text-[#915050]';
      badge = 'Kaldı ❌';
    }

    return { average: avg, letter, status, color, badge };
  };

  // Calculations for Üniversite
  const calculateUniversite = () => {
    const totalWeight =
      (uniVize !== '' ? uniVizeWeight : 0) +
      (uniFinal !== '' ? uniFinalWeight : 0) +
      (uniOdev !== '' ? uniOdevWeight : 0) +
      (uniProje !== '' ? uniProjeWeight : 0);

    if (totalWeight === 0) {
      return { score: 0, gpa: 0, letter: '—', status: 'Not Girilmedi', color: 'text-[#6C7A89]', badge: '—', weightWarning: false };
    }

    let weightedSum = 0;
    if (uniVize !== '') weightedSum += Number(uniVize) * (uniVizeWeight / 100);
    if (uniFinal !== '') weightedSum += Number(uniFinal) * (uniFinalWeight / 100);
    if (uniOdev !== '') weightedSum += Number(uniOdev) * (uniOdevWeight / 100);
    if (uniProje !== '') weightedSum += Number(uniProje) * (uniProjeWeight / 100);

    // Normalize if weights don't sum to 100
    const normalizedScore = totalWeight > 0 ? (weightedSum / (totalWeight / 100)) : 0;

    let letter = 'FF';
    let gpa = 0.0;
    let status = 'Kaldı 🍂';
    let color = 'text-[#915050]';
    let badge = 'FF (Kaldı)';

    if (normalizedScore >= 90) {
      letter = 'AA';
      gpa = 4.0;
      status = 'Mükemmel Başarı 𐙚';
      color = 'text-[#2D6A4F]';
      badge = 'AA (4.00)';
    } else if (normalizedScore >= 85) {
      letter = 'BA';
      gpa = 3.5;
      status = 'Çok İyi ✧';
      color = 'text-[#2D6A4F]';
      badge = 'BA (3.50)';
    } else if (normalizedScore >= 80) {
      letter = 'BB';
      gpa = 3.0;
      status = 'İyi Başarı ⋆';
      color = 'text-[#1B263B]';
      badge = 'BB (3.00)';
    } else if (normalizedScore >= 75) {
      letter = 'CB';
      gpa = 2.5;
      status = 'Orta-İyi 🌿';
      color = 'text-[#1B263B]';
      badge = 'CB (2.50)';
    } else if (normalizedScore >= 70) {
      letter = 'CC';
      gpa = 2.0;
      status = 'Geçer ᝰ.ᐟ';
      color = 'text-[#1B263B]';
      badge = 'CC (2.00)';
    } else if (normalizedScore >= 60) {
      letter = 'DC';
      gpa = 1.5;
      status = 'Koşullu / Şartlı Geçer ⚠️';
      color = 'text-[#E07A5F]';
      badge = 'DC (1.50)';
    } else if (normalizedScore >= 50) {
      letter = 'DD';
      gpa = 1.0;
      status = 'Koşullu Geçer ⚠️';
      color = 'text-[#E07A5F]';
      badge = 'DD (1.00)';
    } else {
      letter = 'FF';
      gpa = 0.0;
      status = 'Dersi Tekrar Almalı ❌';
      color = 'text-[#915050]';
      badge = 'FF (0.00)';
    }

    const weightWarning = totalWeight !== 100;
    return { score: normalizedScore, gpa, letter, status, color, badge, weightWarning, totalWeight };
  };

  const ortaResult = calculateOrtaokul();
  const liseResult = calculateLise();
  const uniResult = calculateUniversite();

  // Save current calculation
  const handleSaveCurrentCalculation = () => {
    let title = courseName.trim() || 'Genel Ders Notu';
    let score = 0;
    let letter = '';
    let details = '';

    if (activeLevel === 'ortaokul') {
      score = ortaResult.average;
      letter = ortaResult.badge;
      details = `Yazılı 1: ${ortaYazili1 || 0} | Yazılı 2: ${ortaYazili2 || 0} | Sözlü: ${ortaDersIci || 0}`;
    } else if (activeLevel === 'lise') {
      score = liseResult.average;
      letter = liseResult.letter;
      details = `1. Yazılı: ${liseYazili1 || 0} | 2. Yazılı: ${liseYazili2 || 0} | Sözlü: ${liseSozlu || 0} | Proje: ${liseProje || 0}`;
    } else {
      score = uniResult.score;
      letter = `${uniResult.letter} (${uniResult.gpa.toFixed(2)})`;
      details = `Vize: ${uniVize || 0} (%${uniVizeWeight}) | Final: ${uniFinal || 0} (%${uniFinalWeight}) | Ödev: ${uniOdev || 0} (%${uniOdevWeight})`;
    }

    const newGrade: SavedCourseGrade = {
      id: `grade-${Date.now()}`,
      courseName: title,
      level: activeLevel,
      score: Number(score.toFixed(1)),
      letter,
      details,
      date: new Date().toLocaleDateString('tr-TR'),
    };

    setSavedGrades((prev) => [newGrade, ...prev]);
    setCourseName('');
    setSaveSuccessMsg(true);
    setTimeout(() => setSaveSuccessMsg(false), 2500);
  };

  const handleDeleteSavedGrade = (id: string) => {
    setSavedGrades((prev) => prev.filter((g) => g.id !== id));
  };

  return (
    <div className="space-y-4 font-stardew">
      {/* Education Level Selector Tabs */}
      <div>
        <div className="flex items-center justify-between mb-1.5">
          <span className="text-[11px] font-bold text-[#6C7A89]">Eğitim Kademesi:</span>
          {profile.educationLevel && (
            <span className="text-[10px] text-[#2D6A4F] font-bold bg-[#2D6A4F]/10 px-2 py-0.5 rounded-full">
              Profil Kademesi: {profile.educationLevel === 'ortaokul' ? '🎒 Ortaokul' : profile.educationLevel === 'lise' ? '🏫 Lise' : '🎓 Üniversite'}
            </span>
          )}
        </div>
        <div className="grid grid-cols-3 gap-1.5 bg-[#E5E3DB]/60 p-1 rounded-2xl border border-[#E5E3DB]">
          <button
            type="button"
            id="calc-level-ortaokul"
            onClick={() => setActiveLevel('ortaokul')}
            className={`py-1.5 px-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center justify-center gap-1 ${
              activeLevel === 'ortaokul'
                ? 'bg-white text-[#1B263B] shadow-xs scale-[1.02]'
                : 'text-[#6C7A89] hover:text-[#1B263B]'
            }`}
          >
            <span>🎒</span>
            <span>Ortaokul</span>
          </button>

          <button
            type="button"
            id="calc-level-lise"
            onClick={() => setActiveLevel('lise')}
            className={`py-1.5 px-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center justify-center gap-1 ${
              activeLevel === 'lise'
                ? 'bg-white text-[#1B263B] shadow-xs scale-[1.02]'
                : 'text-[#6C7A89] hover:text-[#1B263B]'
            }`}
          >
            <span>🏫</span>
            <span>Lise</span>
          </button>

          <button
            type="button"
            id="calc-level-universite"
            onClick={() => setActiveLevel('universite')}
            className={`py-1.5 px-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center justify-center gap-1 ${
              activeLevel === 'universite'
                ? 'bg-[#E07A5F] text-white shadow-xs scale-[1.02]'
                : 'text-[#6C7A89] hover:text-[#1B263B]'
            }`}
          >
            <span>🎓</span>
            <span>Üniversite</span>
          </button>
        </div>
      </div>

      {/* Optional Course Name Input */}
      <div className="bg-white p-3 rounded-2xl border-2 border-[#E5E3DB]">
        <label className="block text-[11px] font-bold text-[#1B263B] mb-1">
          Ders Adı (Opsiyonel):
        </label>
        <input
          type="text"
          value={courseName}
          onChange={(e) => setCourseName(e.target.value)}
          placeholder={
            activeLevel === 'ortaokul'
              ? 'Örn: Türkçe, Fen Bilgisi, Matematik'
              : activeLevel === 'lise'
              ? 'Örn: Türk Dili ve Edebiyatı, Fizik, Kimya'
              : 'Örn: Biyokimya 201, Algoritmalar, Bilişsel Psikoloji'
          }
          className="w-full bg-[#FAF9F6] border border-[#E5E3DB] rounded-xl px-3 py-1.5 text-xs font-medium text-[#1B263B] focus:outline-hidden focus:ring-2 focus:ring-[#F4C542]"
        />
      </div>

      {/* 1. ORTAOKUL FIELDS */}
      {activeLevel === 'ortaokul' && (
        <div className="space-y-3 animate-fadeIn">
          <p className="text-xs text-[#6C7A89]">
            Ortaokul not sistemi: Yazılı sınavlar, ders içi etkinlik (sözlü) ve proje notları ile ortalama hesabı 🎒𐙚
          </p>

          <div className="grid grid-cols-2 gap-2.5">
            {/* 1. Yazılı */}
            <div className="bg-white p-3 rounded-2xl border-2 border-[#E5E3DB]">
              <label className="block text-[11px] font-bold text-[#1B263B] mb-1">1. Yazılı Sınav</label>
              <input
                type="number"
                min="0"
                max="100"
                value={ortaYazili1}
                onChange={(e) => setOrtaYazili1(e.target.value === '' ? '' : Number(e.target.value))}
                placeholder="0-100"
                className="w-full bg-[#FAF9F6] border border-[#E5E3DB] rounded-xl px-2.5 py-1.5 text-sm font-bold text-[#1B263B]"
              />
            </div>

            {/* 2. Yazılı */}
            <div className="bg-white p-3 rounded-2xl border-2 border-[#E5E3DB]">
              <label className="block text-[11px] font-bold text-[#1B263B] mb-1">2. Yazılı Sınav</label>
              <input
                type="number"
                min="0"
                max="100"
                value={ortaYazili2}
                onChange={(e) => setOrtaYazili2(e.target.value === '' ? '' : Number(e.target.value))}
                placeholder="0-100"
                className="w-full bg-[#FAF9F6] border border-[#E5E3DB] rounded-xl px-2.5 py-1.5 text-sm font-bold text-[#1B263B]"
              />
            </div>

            {/* Ders İçi Etkinlik / Sözlü */}
            <div className="bg-white p-3 rounded-2xl border-2 border-[#E5E3DB]">
              <label className="block text-[11px] font-bold text-[#1B263B] mb-1">Ders İçi Etkinlik / Sözlü</label>
              <input
                type="number"
                min="0"
                max="100"
                value={ortaDersIci}
                onChange={(e) => setOrtaDersIci(e.target.value === '' ? '' : Number(e.target.value))}
                placeholder="0-100"
                className="w-full bg-[#FAF9F6] border border-[#E5E3DB] rounded-xl px-2.5 py-1.5 text-sm font-bold text-[#1B263B]"
              />
            </div>

            {/* Proje Notu */}
            <div className="bg-white p-3 rounded-2xl border-2 border-[#E5E3DB]">
              <label className="block text-[11px] font-bold text-[#1B263B] mb-1">Proje Notu (İsteğe Bağlı)</label>
              <input
                type="number"
                min="0"
                max="100"
                value={ortaProje}
                onChange={(e) => setOrtaProje(e.target.value === '' ? '' : Number(e.target.value))}
                placeholder="Boş bırakılabilir"
                className="w-full bg-[#FAF9F6] border border-[#E5E3DB] rounded-xl px-2.5 py-1.5 text-sm font-bold text-[#1B263B]"
              />
            </div>
          </div>

          {/* Ortaokul Result Card */}
          <div className="p-4 rounded-2xl bg-gradient-to-br from-[#FAF9F6] to-white border-2 border-[#E5E3DB] text-center shadow-xs">
            <span className="text-xs text-[#6C7A89] font-bold">Ders Puanı &amp; Belge Durumu</span>
            <div className="text-3xl font-extrabold text-[#1B263B] mt-1 font-mono">
              {ortaResult.average.toFixed(2)}
            </div>
            <div className={`text-xs font-bold mt-1.5 px-3 py-1 rounded-full inline-block bg-[#FAF9F6] border border-[#E5E3DB] ${ortaResult.color}`}>
              {ortaResult.status}
            </div>
          </div>
        </div>
      )}

      {/* 2. LİSE FIELDS */}
      {activeLevel === 'lise' && (
        <div className="space-y-3 animate-fadeIn">
          <p className="text-xs text-[#6C7A89]">
            Lise not sistemi: 1. ve 2. Yazılı sınavlar, Sözlü/Ders içi katılım ve Proje notları 🏫✧
          </p>

          <div className="grid grid-cols-2 gap-2.5">
            {/* 1. Yazılı */}
            <div className="bg-white p-3 rounded-2xl border-2 border-[#E5E3DB]">
              <label className="block text-[11px] font-bold text-[#1B263B] mb-1">1. Yazılı Sınav</label>
              <input
                type="number"
                min="0"
                max="100"
                value={liseYazili1}
                onChange={(e) => setLiseYazili1(e.target.value === '' ? '' : Number(e.target.value))}
                placeholder="0-100"
                className="w-full bg-[#FAF9F6] border border-[#E5E3DB] rounded-xl px-2.5 py-1.5 text-sm font-bold text-[#1B263B]"
              />
            </div>

            {/* 2. Yazılı */}
            <div className="bg-white p-3 rounded-2xl border-2 border-[#E5E3DB]">
              <label className="block text-[11px] font-bold text-[#1B263B] mb-1">2. Yazılı Sınav</label>
              <input
                type="number"
                min="0"
                max="100"
                value={liseYazili2}
                onChange={(e) => setLiseYazili2(e.target.value === '' ? '' : Number(e.target.value))}
                placeholder="0-100"
                className="w-full bg-[#FAF9F6] border border-[#E5E3DB] rounded-xl px-2.5 py-1.5 text-sm font-bold text-[#1B263B]"
              />
            </div>

            {/* Sözlü / Ders İçi */}
            <div className="bg-white p-3 rounded-2xl border-2 border-[#E5E3DB]">
              <label className="block text-[11px] font-bold text-[#1B263B] mb-1">Sözlü / Ders İçi</label>
              <input
                type="number"
                min="0"
                max="100"
                value={liseSozlu}
                onChange={(e) => setLiseSozlu(e.target.value === '' ? '' : Number(e.target.value))}
                placeholder="0-100"
                className="w-full bg-[#FAF9F6] border border-[#E5E3DB] rounded-xl px-2.5 py-1.5 text-sm font-bold text-[#1B263B]"
              />
            </div>

            {/* Proje */}
            <div className="bg-white p-3 rounded-2xl border-2 border-[#E5E3DB]">
              <label className="block text-[11px] font-bold text-[#1B263B] mb-1">Proje Notu</label>
              <input
                type="number"
                min="0"
                max="100"
                value={liseProje}
                onChange={(e) => setLiseProje(e.target.value === '' ? '' : Number(e.target.value))}
                placeholder="0-100"
                className="w-full bg-[#FAF9F6] border border-[#E5E3DB] rounded-xl px-2.5 py-1.5 text-sm font-bold text-[#1B263B]"
              />
            </div>
          </div>

          {/* Lise Result Card */}
          <div className="p-4 rounded-2xl bg-gradient-to-br from-[#FAF9F6] to-white border-2 border-[#E5E3DB] text-center shadow-xs">
            <span className="text-xs text-[#6C7A89] font-bold">Lise Dönem Notu &amp; Durum</span>
            <div className="text-3xl font-extrabold text-[#1B263B] mt-1 font-mono">
              {liseResult.average.toFixed(2)}
            </div>
            <div className="flex items-center justify-center gap-2 mt-1.5">
              <span className={`text-xs font-bold px-2.5 py-0.5 rounded-full bg-[#FAF9F6] border border-[#E5E3DB] ${liseResult.color}`}>
                {liseResult.status}
              </span>
              <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-[#1B263B] text-white">
                {liseResult.letter}
              </span>
            </div>
          </div>
        </div>
      )}

      {/* 3. ÜNİVERSİTE FIELDS */}
      {activeLevel === 'universite' && (
        <div className="space-y-3 animate-fadeIn">
          <p className="text-xs text-[#6C7A89]">
            Üniversite not sistemi: Vize, Final, Ödev ve Proje ağırlıkları ile 100'lük ve 4.00'lük GANO harf notu hesabı 🎓𐙚
          </p>

          <div className="space-y-2.5">
            {/* Vize Row */}
            <div className="bg-white p-3 rounded-2xl border-2 border-[#E5E3DB] grid grid-cols-12 gap-2 items-center">
              <div className="col-span-5">
                <label className="block text-[11px] font-bold text-[#1B263B]">Vize Notu</label>
                <input
                  type="number"
                  min="0"
                  max="100"
                  value={uniVize}
                  onChange={(e) => setUniVize(e.target.value === '' ? '' : Number(e.target.value))}
                  placeholder="0-100"
                  className="w-full bg-[#FAF9F6] border border-[#E5E3DB] rounded-xl px-2 py-1 text-sm font-bold text-[#1B263B] mt-0.5"
                />
              </div>
              <div className="col-span-7">
                <div className="flex justify-between text-[11px] font-bold text-[#6C7A89] mb-1">
                  <span>Vize Etkisi:</span>
                  <span className="text-[#E07A5F]">%{uniVizeWeight}</span>
                </div>
                <input
                  type="range"
                  min="10"
                  max="60"
                  step="5"
                  value={uniVizeWeight}
                  onChange={(e) => setUniVizeWeight(Number(e.target.value))}
                  className="w-full accent-[#E07A5F]"
                />
              </div>
            </div>

            {/* Final Row */}
            <div className="bg-white p-3 rounded-2xl border-2 border-[#E5E3DB] grid grid-cols-12 gap-2 items-center">
              <div className="col-span-5">
                <label className="block text-[11px] font-bold text-[#1B263B]">Final Notu</label>
                <input
                  type="number"
                  min="0"
                  max="100"
                  value={uniFinal}
                  onChange={(e) => setUniFinal(e.target.value === '' ? '' : Number(e.target.value))}
                  placeholder="0-100"
                  className="w-full bg-[#FAF9F6] border border-[#E5E3DB] rounded-xl px-2 py-1 text-sm font-bold text-[#1B263B] mt-0.5"
                />
              </div>
              <div className="col-span-7">
                <div className="flex justify-between text-[11px] font-bold text-[#6C7A89] mb-1">
                  <span>Final Etkisi:</span>
                  <span className="text-[#E07A5F]">%{uniFinalWeight}</span>
                </div>
                <input
                  type="range"
                  min="20"
                  max="80"
                  step="5"
                  value={uniFinalWeight}
                  onChange={(e) => setUniFinalWeight(Number(e.target.value))}
                  className="w-full accent-[#E07A5F]"
                />
              </div>
            </div>

            {/* Ödev & Proje Grid */}
            <div className="grid grid-cols-2 gap-2.5">
              {/* Ödev */}
              <div className="bg-white p-3 rounded-2xl border-2 border-[#E5E3DB]">
                <div className="flex justify-between items-center mb-1">
                  <label className="text-[11px] font-bold text-[#1B263B]">Ödev Notu</label>
                  <span className="text-[10px] text-[#E07A5F] font-bold">%{uniOdevWeight}</span>
                </div>
                <input
                  type="number"
                  min="0"
                  max="100"
                  value={uniOdev}
                  onChange={(e) => setUniOdev(e.target.value === '' ? '' : Number(e.target.value))}
                  placeholder="0-100"
                  className="w-full bg-[#FAF9F6] border border-[#E5E3DB] rounded-xl px-2 py-1 text-sm font-bold text-[#1B263B]"
                />
                <input
                  type="range"
                  min="0"
                  max="30"
                  step="5"
                  value={uniOdevWeight}
                  onChange={(e) => setUniOdevWeight(Number(e.target.value))}
                  className="w-full accent-[#E07A5F] mt-1.5"
                />
              </div>

              {/* Proje / Lab */}
              <div className="bg-white p-3 rounded-2xl border-2 border-[#E5E3DB]">
                <div className="flex justify-between items-center mb-1">
                  <label className="text-[11px] font-bold text-[#1B263B]">Proje / Lab</label>
                  <span className="text-[10px] text-[#E07A5F] font-bold">%{uniProjeWeight}</span>
                </div>
                <input
                  type="number"
                  min="0"
                  max="100"
                  value={uniProje}
                  onChange={(e) => setUniProje(e.target.value === '' ? '' : Number(e.target.value))}
                  placeholder="İsteğe bağlı"
                  className="w-full bg-[#FAF9F6] border border-[#E5E3DB] rounded-xl px-2 py-1 text-sm font-bold text-[#1B263B]"
                />
                <input
                  type="range"
                  min="0"
                  max="40"
                  step="5"
                  value={uniProjeWeight}
                  onChange={(e) => setUniProjeWeight(Number(e.target.value))}
                  className="w-full accent-[#E07A5F] mt-1.5"
                />
              </div>
            </div>

            {/* Total Weight Indicator */}
            <div className="text-[10px] flex items-center justify-between text-[#6C7A89] px-1">
              <span>Yüzde Toplamı: %{uniVizeWeight + uniFinalWeight + uniOdevWeight + uniProjeWeight}</span>
              {uniVizeWeight + uniFinalWeight + uniOdevWeight + uniProjeWeight === 100 ? (
                <span className="text-[#2D6A4F] font-bold flex items-center gap-0.5">
                  <CheckCircle2 className="w-3 h-3 inline" /> Tam %100 Dengeli
                </span>
              ) : (
                <span className="text-[#E07A5F] font-bold">
                  (Otomatik normalize edilir)
                </span>
              )}
            </div>
          </div>

          {/* Uni Result Card */}
          <div className="p-4 rounded-2xl bg-gradient-to-br from-[#FAF9F6] to-white border-2 border-[#E5E3DB] shadow-xs text-center">
            <div className="grid grid-cols-2 gap-2 border-b border-[#E5E3DB] pb-3 mb-2.5">
              <div>
                <span className="text-[10px] font-bold text-[#6C7A89] uppercase">100'lük Ortalama</span>
                <div className="text-2xl font-extrabold text-[#1B263B] font-mono mt-0.5">
                  {uniResult.score.toFixed(1)}
                </div>
              </div>
              <div>
                <span className="text-[10px] font-bold text-[#6C7A89] uppercase">4.00'lük GANO</span>
                <div className="text-2xl font-extrabold text-[#2D6A4F] font-mono mt-0.5">
                  {uniResult.gpa.toFixed(2)}
                </div>
              </div>
            </div>

            <div className="flex items-center justify-center gap-2">
              <span className="text-sm font-extrabold px-3 py-1 rounded-xl bg-[#1B263B] text-white">
                Harf Notu: {uniResult.letter}
              </span>
              <span className={`text-xs font-bold ${uniResult.color}`}>
                {uniResult.status}
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Action Buttons: Save calculation */}
      <div className="flex gap-2">
        <PuffyStarButton
          variant="orange"
          size="sm"
          onClick={handleSaveCurrentCalculation}
          className="flex-1 justify-center py-2!"
        >
          <Bookmark className="w-3.5 h-3.5 mr-1 inline" />
          Hesaplamayı Kaydet 𐙚
        </PuffyStarButton>
      </div>

      {saveSuccessMsg && (
        <div className="p-2.5 rounded-xl bg-[#2D6A4F]/10 border border-[#2D6A4F]/30 text-center text-xs font-bold text-[#2D6A4F] animate-fadeIn">
          ✓ Ders notu başarıyla kaydedildi ⋆˚࿔
        </div>
      )}

      {/* Saved Course Grades List */}
      {savedGrades.length > 0 && (
        <div className="pt-2 border-t border-[#E5E3DB] space-y-2">
          <div className="flex items-center justify-between">
            <h4 className="text-xs font-bold text-[#1B263B] flex items-center gap-1.5">
              <span>📑 Kaydedilen Ders Notlarım</span>
              <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-[#E5E3DB] text-[#6C7A89]">
                {savedGrades.length}
              </span>
            </h4>
            <button
              type="button"
              onClick={() => setSavedGrades([])}
              className="text-[10px] text-[#915050] hover:underline cursor-pointer"
            >
              Tümünü Temizle
            </button>
          </div>

          <div className="space-y-1.5 max-h-40 overflow-y-auto pr-1">
            {savedGrades.map((grade) => (
              <div
                key={grade.id}
                className="p-2.5 bg-white rounded-xl border border-[#E5E3DB] flex items-center justify-between gap-2 shadow-2xs"
              >
                <div className="min-w-0">
                  <div className="flex items-center gap-1.5">
                    <span className="text-xs font-bold text-[#1B263B] truncate">{grade.courseName}</span>
                    <span className="text-[10px] font-bold px-1.5 py-0.2 rounded-md bg-[#FAF9F6] text-[#E07A5F] border border-[#E5E3DB]">
                      {grade.letter}
                    </span>
                  </div>
                  <p className="text-[10px] text-[#6C7A89] truncate mt-0.5">{grade.details}</p>
                </div>
                <div className="flex items-center gap-1.5 shrink-0">
                  <span className="text-xs font-bold font-mono text-[#2D6A4F]">{grade.score}</span>
                  <button
                    type="button"
                    onClick={() => handleDeleteSavedGrade(grade.id)}
                    className="p-1 rounded-lg text-[#6C7A89] hover:text-[#915050] transition-colors cursor-pointer"
                    title="Sil"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
