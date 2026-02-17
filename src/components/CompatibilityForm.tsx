/**
 * 궁합 입력 폼
 */

import { useState } from 'react';
import { Heart } from 'lucide-react';
import { TWELVE_BRANCHES_TIME } from '../utils/constants';
import type { BirthInfo } from '../types/saju';

interface Props {
  onSubmit: (p1: BirthInfo, p2: BirthInfo) => void;
  isLoading?: boolean;
}

type PartialBirth = Partial<BirthInfo>;

const selectCls =
  'w-full px-2.5 py-2 rounded-lg text-white text-xs bg-white/5 border border-white/10 focus:outline-none focus:border-oriental-gold/50 transition-all duration-200 cursor-pointer';

function PersonForm({
  label, person, setPerson,
}: {
  label: string;
  person: PartialBirth;
  setPerson: React.Dispatch<React.SetStateAction<PartialBirth>>;
}) {
  return (
    <div className="rounded-xl border border-white/8 p-4 space-y-3"
         style={{ background: 'rgba(255,255,255,0.02)' }}>
      <p className="text-sm font-bold text-oriental-gold">{label}</p>

      {/* 달력/성별 */}
      <div className="flex gap-4 text-xs text-gray-400">
        {[['solar','양력'],['lunar','음력']].map(([v,l]) => (
          <label key={v} className="flex items-center gap-1.5 cursor-pointer">
            <input type="radio" checked={person.calendarType === v}
              onChange={() => setPerson(p => ({ ...p, calendarType: v as 'solar'|'lunar' }))} />
            {l}
          </label>
        ))}
        <span className="text-white/10">|</span>
        {[['male','남'],['female','여']].map(([v,l]) => (
          <label key={v} className="flex items-center gap-1.5 cursor-pointer">
            <input type="radio" checked={person.gender === v}
              onChange={() => setPerson(p => ({ ...p, gender: v as 'male'|'female' }))} />
            {l}
          </label>
        ))}
      </div>

      {/* 생년월일 */}
      <div className="grid grid-cols-3 gap-1.5">
        <select value={person.year} onChange={e => setPerson(p => ({ ...p, year: Number(e.target.value) }))} className={selectCls}>
          {Array.from({ length: 106 }, (_, i) => 2025 - i).map(y => <option key={y} value={y}>{y}</option>)}
        </select>
        <select value={person.month} onChange={e => setPerson(p => ({ ...p, month: Number(e.target.value) }))} className={selectCls}>
          {Array.from({ length: 12 }, (_, i) => i + 1).map(m => <option key={m} value={m}>{m}월</option>)}
        </select>
        <select value={person.day} onChange={e => setPerson(p => ({ ...p, day: Number(e.target.value) }))} className={selectCls}>
          {Array.from({ length: 31 }, (_, i) => i + 1).map(d => <option key={d} value={d}>{d}일</option>)}
        </select>
      </div>

      {/* 시간 */}
      <select
        value={person.hour === null || person.hour === undefined ? 'unknown' : person.hour}
        onChange={e => setPerson(p => ({ ...p, hour: e.target.value === 'unknown' ? null : Number(e.target.value) }))}
        className={selectCls}
      >
        <option value="unknown">시간 모름</option>
        {TWELVE_BRANCHES_TIME.map(t => <option key={t.index} value={t.index}>{t.branch}</option>)}
      </select>
    </div>
  );
}

export default function CompatibilityForm({ onSubmit, isLoading = false }: Props) {
  const [p1, setP1] = useState<PartialBirth>({ year:1990, month:1, day:1, hour:null, calendarType:'solar', gender:'male' });
  const [p2, setP2] = useState<PartialBirth>({ year:1992, month:6, day:15, hour:null, calendarType:'solar', gender:'female' });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (p1.year && p1.month && p1.day && p1.calendarType && p1.gender &&
        p2.year && p2.month && p2.day && p2.calendarType && p2.gender) {
      onSubmit(p1 as BirthInfo, p2 as BirthInfo);
    }
  };

  return (
    <form onSubmit={handleSubmit}
      className="rounded-2xl border border-pink-500/20 overflow-hidden animate-slide-up"
      style={{ background: 'linear-gradient(135deg, rgba(236,72,153,0.05) 0%, transparent 60%)' }}>
      <div className="px-5 py-4 border-b border-pink-500/15 flex items-center gap-3">
        <div className="w-9 h-9 rounded-xl bg-pink-500/15 flex items-center justify-center">
          <Heart className="text-pink-400" size={18} />
        </div>
        <div>
          <h3 className="text-base font-bold text-white">궁합 보기</h3>
          <p className="text-gray-500 text-xs">두 사람의 사주 궁합을 분석합니다</p>
        </div>
      </div>

      <div className="px-5 py-5 space-y-4">
        <div className="grid md:grid-cols-2 gap-3">
          <PersonForm label="👤 사람 1" person={p1} setPerson={setP1} />
          <PersonForm label="👥 사람 2" person={p2} setPerson={setP2} />
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className="w-full py-3 rounded-xl font-bold text-sm transition-all duration-200
                     bg-pink-500 text-white hover:bg-pink-400
                     disabled:bg-gray-700 disabled:text-gray-500 disabled:cursor-not-allowed
                     active:scale-[0.99] flex items-center justify-center gap-2"
        >
          {isLoading ? (
            <><span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />분석 중...</>
          ) : (
            <><Heart size={16} />궁합 분석하기</>
          )}
        </button>
      </div>
    </form>
  );
}
