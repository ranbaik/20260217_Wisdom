/**
 * 사주 분석 결과 메인 컴포넌트
 */

import { useEffect, useState } from 'react';
import { RotateCcw } from 'lucide-react';
import SajuChart from './SajuChart';
import FortuneCategory from './FortuneCategory';
import PdfExportButton from './PdfExportButton';
import LoadingSpinner from './LoadingSpinner';
import { useGeminiStream } from '../hooks/useGemini';
import { generateFortunePrompt } from '../utils/gemini-prompts';
import type { SajuResult as SajuResultType } from '../types/saju';

interface Props {
  saju: SajuResultType;
  apiKey: string;
  onReset: () => void;
}

const CATEGORIES = [
  { key: 'overall',  title: '총운',          emoji: '📊', heading: '총운' },
  { key: 'wealth',   title: '재산운',         emoji: '💰', heading: '재산' },
  { key: 'career',   title: '직장/사업운',    emoji: '💼', heading: '직장' },
  { key: 'health',   title: '건강운',         emoji: '🏥', heading: '건강' },
  { key: 'love',     title: '연애/결혼운',    emoji: '💕', heading: '연애' },
  { key: 'academic', title: '학업운',         emoji: '📚', heading: '학업' },
] as const;

type CatKey = typeof CATEGORIES[number]['key'];

function parseCategories(text: string): Record<CatKey, string> {
  const result: Record<CatKey, string> = {
    overall: '', wealth: '', career: '', health: '', love: '', academic: '',
  };
  const sections = text.match(/##\s*\d+\.\s*.+?(?=##\s*\d+\.|\s*$)/gs) ?? [];
  sections.forEach((sec) => {
    const body = sec.replace(/^##\s*\d+\.\s*[^\n]+/, '').trim();
    if (/총운|Overall/.test(sec))    result.overall  = body;
    else if (/재산|Wealth/.test(sec)) result.wealth   = body;
    else if (/직장|사업|Career/.test(sec)) result.career = body;
    else if (/건강|Health/.test(sec)) result.health   = body;
    else if (/연애|결혼|Love/.test(sec))  result.love  = body;
    else if (/학업|Academic/.test(sec))   result.academic = body;
  });
  return result;
}

export default function SajuResult({ saju, apiKey, onReset }: Props) {
  const { isStreaming, streamedText, error, generateStream } = useGeminiStream();
  const [categories, setCategories] = useState<Record<CatKey, string>>({
    overall: '', wealth: '', career: '', health: '', love: '', academic: '',
  });

  useEffect(() => {
    generateStream(apiKey, generateFortunePrompt(saju)).catch(() => null);
  }, []);

  useEffect(() => {
    if (streamedText) setCategories(parseCategories(streamedText));
  }, [streamedText]);

  const { birthInfo } = saju;
  const birthStr = `${birthInfo.year}년 ${birthInfo.month}월 ${birthInfo.day}일` +
    (birthInfo.hour !== null ? ` · ${birthInfo.hour}시` : ' · 시간 미상');

  return (
    <div className="space-y-5 animate-slide-up">
      {/* ── 상단 정보 바 ── */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3
                      px-5 py-4 rounded-2xl border border-oriental-gold/20"
           style={{ background: 'linear-gradient(135deg, rgba(212,175,55,0.08) 0%, rgba(0,0,0,0) 70%)' }}>
        <div>
          <h2 className="text-lg font-bold text-oriental-gold">지혜의 삶 · 사주 분석</h2>
          <p className="text-gray-400 text-sm mt-0.5">
            {birthStr} · {birthInfo.gender === 'male' ? '남성' : '여성'} ·{' '}
            {birthInfo.calendarType === 'solar' ? '양력' : '음력'}
          </p>
        </div>
        <div className="flex gap-2">
          <PdfExportButton elementId="saju-result-content" />
          <button
            onClick={onReset}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-semibold
                       border border-white/10 text-gray-400 hover:text-white hover:border-white/20
                       transition-all duration-200"
          >
            <RotateCcw size={14} />
            새로 분석
          </button>
        </div>
      </div>

      {/* ── 결과 영역 (PDF 캡처 대상) ── */}
      <div id="saju-result-content" className="space-y-5">
        <SajuChart fourPillars={saju.fourPillars} fiveElements={saju.fiveElements} />

        {/* 운세 카테고리 */}
        <div className="rounded-2xl border border-oriental-gold/20 overflow-hidden"
             style={{ background: 'linear-gradient(135deg, rgba(212,175,55,0.04) 0%, transparent 60%)' }}>
          <div className="px-5 py-3.5 border-b border-oriental-gold/15">
            <span className="text-oriental-gold text-sm font-bold">✨ 상세 운세 분석</span>
          </div>

          {isStreaming && !streamedText && <LoadingSpinner />}

          {error && (
            <div className="mx-5 my-4 px-4 py-3 rounded-xl bg-red-950/40 border border-red-500/30">
              <p className="text-red-300 text-sm">{error}</p>
            </div>
          )}

          <div className="p-3 space-y-1.5">
            {CATEGORIES.map((cat, idx) => (
              <FortuneCategory
                key={cat.key}
                title={`${cat.title} (${cat.emoji})`}
                emoji={cat.emoji}
                content={categories[cat.key]}
                defaultExpanded={idx === 0}
                isStreaming={isStreaming}
              />
            ))}
          </div>
        </div>
      </div>

      {/* 면책 문구 */}
      <p className="text-center text-gray-600 text-xs py-2">
        ⚠️ 본 분석은 전통 명리학 기반 AI 해석으로, <strong className="text-gray-500">오락 및 참고 목적</strong>입니다.
      </p>
    </div>
  );
}
