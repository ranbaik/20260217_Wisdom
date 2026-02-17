/**
 * 생년월일시 입력 폼
 */

import { useState } from 'react';
import { Calendar, Clock, User } from 'lucide-react';
import { TWELVE_BRANCHES_TIME } from '../utils/constants';
import { isValidDate } from '../utils/lunar-converter';
import type { BirthInfo, CalendarType, Gender } from '../types/saju';

interface Props {
  onSubmit: (birthInfo: BirthInfo) => void;
  isLoading?: boolean;
}

const selectCls =
  'w-full px-3 py-2.5 rounded-xl text-white text-sm bg-white/5 border border-white/10 focus:outline-none focus:border-oriental-gold/60 transition-all duration-200 cursor-pointer';

export default function BirthInfoForm({ onSubmit, isLoading = false }: Props) {
  const [year, setYear] = useState<number>(1990);
  const [month, setMonth] = useState<number>(1);
  const [day, setDay] = useState<number>(1);
  const [hour, setHour] = useState<number | null>(null);
  const [calendarType, setCalendarType] = useState<CalendarType>('solar');
  const [gender, setGender] = useState<Gender>('male');
  const [errors, setErrors] = useState<string[]>([]);

  const getDaysInMonth = (y: number, m: number) => new Date(y, m, 0).getDate();
  const maxDay = getDaysInMonth(year, month);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrors([]);
    const errs: string[] = [];
    const today = new Date();
    if (
      year > today.getFullYear() ||
      (year === today.getFullYear() && month > today.getMonth() + 1) ||
      (year === today.getFullYear() && month === today.getMonth() + 1 && day > today.getDate())
    ) errs.push('미래 날짜는 입력할 수 없습니다.');
    if (calendarType === 'solar' && !isValidDate(year, month, day))
      errs.push('유효하지 않은 날짜입니다.');
    if (errs.length > 0) { setErrors(errs); return; }
    onSubmit({ year, month, day, hour, calendarType, gender });
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="rounded-2xl border border-oriental-gold/20 overflow-hidden animate-slide-up"
      style={{ background: 'linear-gradient(135deg, rgba(212,175,55,0.05) 0%, rgba(0,0,0,0) 60%)' }}
    >
      {/* 헤더 */}
      <div className="px-6 pt-6 pb-5 border-b border-oriental-gold/15">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-oriental-gold/15 flex items-center justify-center">
            <Calendar className="text-oriental-gold" size={18} />
          </div>
          <div>
            <h2 className="text-xl font-bold text-oriental-gold">생년월일 입력</h2>
            <p className="text-gray-500 text-xs mt-0.5">정확한 분석을 위해 생년월일시를 입력해주세요</p>
          </div>
        </div>
      </div>

      <div className="px-6 py-6 space-y-6">
        {/* 양력/음력 + 성별 */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-xs font-semibold text-gray-400 mb-2.5 uppercase tracking-wide">달력 종류</p>
            <div className="flex gap-4">
              {(['solar', 'lunar'] as CalendarType[]).map((v) => (
                <label key={v} className="flex items-center gap-2 cursor-pointer group">
                  <input
                    type="radio"
                    value={v}
                    checked={calendarType === v}
                    onChange={() => setCalendarType(v)}
                    className="w-4 h-4"
                  />
                  <span className="text-sm text-gray-300 group-hover:text-white transition-colors">
                    {v === 'solar' ? '양력' : '음력'}
                  </span>
                </label>
              ))}
            </div>
          </div>
          <div>
            <p className="text-xs font-semibold text-gray-400 mb-2.5 uppercase tracking-wide">성별</p>
            <div className="flex gap-4">
              {([['male','남성'],['female','여성']] as [Gender, string][]).map(([v, label]) => (
                <label key={v} className="flex items-center gap-2 cursor-pointer group">
                  <input
                    type="radio"
                    value={v}
                    checked={gender === v}
                    onChange={() => setGender(v)}
                    className="w-4 h-4"
                  />
                  <span className="text-sm text-gray-300 group-hover:text-white transition-colors">
                    {label}
                  </span>
                </label>
              ))}
            </div>
          </div>
        </div>

        {/* 생년월일 */}
        <div>
          <p className="text-xs font-semibold text-gray-400 mb-2.5 uppercase tracking-wide">생년월일</p>
          <div className="grid grid-cols-3 gap-2.5">
            <select value={year} onChange={(e) => setYear(Number(e.target.value))} className={selectCls}>
              {Array.from({ length: 106 }, (_, i) => 2025 - i).map((y) => (
                <option key={y} value={y}>{y}년</option>
              ))}
            </select>
            <select value={month} onChange={(e) => setMonth(Number(e.target.value))} className={selectCls}>
              {Array.from({ length: 12 }, (_, i) => i + 1).map((m) => (
                <option key={m} value={m}>{m}월</option>
              ))}
            </select>
            <select value={day} onChange={(e) => setDay(Number(e.target.value))} className={selectCls}>
              {Array.from({ length: maxDay }, (_, i) => i + 1).map((d) => (
                <option key={d} value={d}>{d}일</option>
              ))}
            </select>
          </div>
        </div>

        {/* 태어난 시간 */}
        <div>
          <div className="flex items-center justify-between mb-2.5">
            <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide flex items-center gap-1.5">
              <Clock size={12} />태어난 시간
            </p>
            {hour === null && (
              <span className="text-xs text-yellow-500/80 bg-yellow-950/40 border border-yellow-600/20 px-2 py-0.5 rounded-full">
                시주 제외 분석
              </span>
            )}
          </div>
          <select
            value={hour === null ? 'unknown' : hour}
            onChange={(e) => setHour(e.target.value === 'unknown' ? null : Number(e.target.value))}
            className={selectCls}
          >
            <option value="unknown">시간 모름</option>
            {TWELVE_BRANCHES_TIME.map((t) => (
              <option key={t.index} value={t.index}>{t.branch} ({t.range})</option>
            ))}
          </select>
        </div>

        {/* 에러 */}
        {errors.length > 0 && (
          <div className="px-4 py-3 rounded-xl bg-red-950/40 border border-red-500/30">
            {errors.map((err, i) => (
              <p key={i} className="text-red-300 text-sm">• {err}</p>
            ))}
          </div>
        )}

        {/* 제출 버튼 */}
        <button
          type="submit"
          disabled={isLoading}
          className="w-full py-3.5 rounded-xl font-bold text-base transition-all duration-200
                     bg-oriental-gold text-black hover:bg-oriental-gold-light
                     disabled:bg-gray-700 disabled:text-gray-500 disabled:cursor-not-allowed
                     active:scale-[0.99] flex items-center justify-center gap-2"
        >
          {isLoading ? (
            <>
              <span className="w-4 h-4 border-2 border-black/30 border-t-black rounded-full animate-spin" />
              분석 중...
            </>
          ) : (
            <>
              <User size={18} />
              사주팔자 분석하기
            </>
          )}
        </button>
      </div>
    </form>
  );
}
