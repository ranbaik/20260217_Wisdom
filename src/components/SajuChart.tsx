/**
 * 사주팔자 시각화 — 4柱 카드 + 오행 분포
 */

import { STEM_ELEMENTS, BRANCH_ELEMENTS, ELEMENT_COLORS } from '../utils/constants';
import type { FourPillars, FiveElements } from '../types/saju';

type ElementKey = keyof typeof ELEMENT_COLORS;

interface Props {
  fourPillars: FourPillars;
  fiveElements: FiveElements;
}

interface PillarCell {
  char: string;
  type: 'stem' | 'branch';
}

function Cell({ char, type }: PillarCell) {
  const element =
    type === 'stem' ? STEM_ELEMENTS[char] : BRANCH_ELEMENTS[char];
  const color = element ? ELEMENT_COLORS[element as ElementKey] : null;

  const bgStyle = color
    ? { backgroundColor: color.bg, color: color.text, borderColor: color.border ?? color.bg }
    : { backgroundColor: 'rgba(255,255,255,0.06)', color: '#6b7280' };

  return (
    <div
      className="flex items-center justify-center rounded-xl border text-2xl font-bold h-14 w-full
                 transition-transform hover:scale-105 duration-200"
      style={bgStyle}
      title={element ? ELEMENT_COLORS[element as ElementKey].name : ''}
    >
      {char || '?'}
    </div>
  );
}

const PILLAR_LABELS = ['시(時)', '일(日)', '월(月)', '년(年)'] as const;
const ELEMENT_ORDER: { key: keyof FiveElements; label: string; ek: ElementKey }[] = [
  { key: 'wood',  label: '목(木)', ek: '木' },
  { key: 'fire',  label: '화(火)', ek: '火' },
  { key: 'earth', label: '토(土)', ek: '土' },
  { key: 'metal', label: '금(金)', ek: '金' },
  { key: 'water', label: '수(水)', ek: '水' },
];

export default function SajuChart({ fourPillars, fiveElements }: Props) {
  const pillars = [
    fourPillars.hour,
    fourPillars.day,
    fourPillars.month,
    fourPillars.year,
  ];

  const maxCount = Math.max(...ELEMENT_ORDER.map((e) => fiveElements[e.key]), 1);

  return (
    <div className="space-y-5">
      {/* ── 사주 4柱 ── */}
      <div className="rounded-2xl border border-oriental-gold/20 overflow-hidden"
           style={{ background: 'linear-gradient(135deg, rgba(212,175,55,0.04) 0%, transparent 60%)' }}>
        <div className="px-5 py-3 border-b border-oriental-gold/15 flex items-center gap-2">
          <span className="text-oriental-gold text-sm font-bold">🎴 사주팔자 (四柱八字)</span>
        </div>
        <div className="grid grid-cols-4 divide-x divide-oriental-gold/10 px-1 py-4 gap-1">
          {pillars.map((pillar, idx) => (
            <div key={idx} className="flex flex-col items-center gap-2 px-2">
              <span className="text-xs text-gray-500 font-medium">{PILLAR_LABELS[idx]}</span>
              {pillar ? (
                <>
                  <Cell char={pillar.heavenlyStem} type="stem" />
                  <Cell char={pillar.earthlyBranch} type="branch" />
                </>
              ) : (
                <>
                  <div className="flex items-center justify-center rounded-xl border border-white/10 text-gray-600 text-2xl h-14 w-full bg-white/3">—</div>
                  <div className="flex items-center justify-center rounded-xl border border-white/10 text-gray-600 text-2xl h-14 w-full bg-white/3">—</div>
                </>
              )}
            </div>
          ))}
        </div>
        {/* 범례 */}
        <div className="px-5 py-3 border-t border-oriental-gold/10 flex flex-wrap gap-2">
          {ELEMENT_ORDER.map(({ label, ek }) => {
            const c = ELEMENT_COLORS[ek];
            return (
              <span key={ek} className="flex items-center gap-1 text-xs text-gray-400">
                <span className="w-2.5 h-2.5 rounded-sm inline-block" style={{ backgroundColor: c.bg }} />
                {label}
              </span>
            );
          })}
        </div>
      </div>

      {/* ── 오행 분포 ── */}
      <div className="rounded-2xl border border-oriental-gold/20 overflow-hidden"
           style={{ background: 'linear-gradient(135deg, rgba(212,175,55,0.04) 0%, transparent 60%)' }}>
        <div className="px-5 py-3 border-b border-oriental-gold/15">
          <span className="text-oriental-gold text-sm font-bold">📊 오행 분포 (五行)</span>
        </div>
        <div className="px-5 py-4 space-y-3">
          {ELEMENT_ORDER.map(({ key, label, ek }) => {
            const c = ELEMENT_COLORS[ek];
            const count = fiveElements[key];
            const pct = (count / maxCount) * 100;
            return (
              <div key={key}>
                <div className="flex justify-between items-center mb-1">
                  <span className="text-sm font-semibold" style={{ color: c.bg }}>{label}</span>
                  <span className="text-xs text-gray-500">{count}개</span>
                </div>
                <div className="h-5 rounded-full bg-white/5 overflow-hidden">
                  <div
                    className="h-full rounded-full flex items-center justify-end pr-2 text-[10px] font-bold transition-all duration-700"
                    style={{ width: `${Math.max(pct, 4)}%`, backgroundColor: c.bg, color: c.text }}
                  >
                    {count > 0 ? count : ''}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
