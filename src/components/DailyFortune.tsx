/**
 * 오늘의 운세
 */

import { useState } from 'react';
import { Sun, RefreshCw } from 'lucide-react';
import { useDailyFortune } from '../hooks/useSajuCalculation';
import { useGeminiStream } from '../hooks/useGemini';
import { generateDailyFortunePrompt } from '../utils/gemini-prompts';
import LoadingSpinner from './LoadingSpinner';
import type { SajuResult } from '../types/saju';

interface Props {
  saju: SajuResult;
  apiKey: string;
}

export default function DailyFortune({ saju, apiKey }: Props) {
  const { todayPillar, calculateToday } = useDailyFortune();
  const { isStreaming, streamedText, error, generateStream, reset } = useGeminiStream();
  const [started, setStarted] = useState(false);

  const today = new Date();
  const dateStr = `${today.getFullYear()}년 ${today.getMonth() + 1}월 ${today.getDate()}일`;

  const handleAnalyze = async () => {
    reset();
    const pillar = calculateToday();
    setStarted(true);
    const pillarStr = `${pillar.heavenlyStem}${pillar.earthlyBranch}`;
    await generateStream(apiKey, generateDailyFortunePrompt(saju, pillarStr)).catch(() => null);
  };

  return (
    <div className="rounded-2xl border border-blue-500/20 overflow-hidden animate-slide-up"
         style={{ background: 'linear-gradient(135deg, rgba(59,130,246,0.05) 0%, transparent 60%)' }}>
      {/* 헤더 */}
      <div className="px-5 py-4 border-b border-blue-500/15 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-yellow-500/15 flex items-center justify-center">
            <Sun className="text-yellow-400" size={18} />
          </div>
          <div>
            <h3 className="text-base font-bold text-white">오늘의 운세</h3>
            <p className="text-gray-500 text-xs">{dateStr}</p>
          </div>
        </div>
        {todayPillar && (
          <div className="px-3 py-1.5 rounded-xl bg-yellow-950/40 border border-yellow-600/20">
            <span className="text-yellow-400 font-bold text-sm">
              일진 {todayPillar.heavenlyStem}{todayPillar.earthlyBranch}
            </span>
          </div>
        )}
      </div>

      {/* 본문 */}
      <div className="px-5 py-5">
        {!started ? (
          <div className="text-center py-6">
            <p className="text-gray-400 text-sm mb-5">
              오늘 일진과 사주를 비교하여 하루 운세를 확인하세요
            </p>
            <button
              onClick={handleAnalyze}
              className="px-6 py-2.5 rounded-xl font-bold text-sm transition-all duration-200
                         bg-yellow-500 text-black hover:bg-yellow-400 active:scale-[0.98]"
            >
              오늘의 운세 보기
            </button>
          </div>
        ) : (
          <div>
            {isStreaming && !streamedText && <LoadingSpinner message="오늘의 운세를 분석 중입니다..." />}

            {error && (
              <div className="px-4 py-3 rounded-xl bg-red-950/40 border border-red-500/30 mb-4">
                <p className="text-red-300 text-sm">{error}</p>
              </div>
            )}

            {streamedText && (
              <div className="text-gray-300 text-sm leading-7 whitespace-pre-wrap">
                {streamedText}
              </div>
            )}

            <button
              onClick={handleAnalyze}
              className="mt-4 flex items-center gap-1.5 text-xs text-gray-500 hover:text-gray-300 transition-colors"
            >
              <RefreshCw size={12} />
              다시 분석
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
