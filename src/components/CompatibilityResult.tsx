/**
 * 궁합 결과
 */

import { useEffect, useState } from 'react';
import { Heart, X } from 'lucide-react';
import { useGeminiStream } from '../hooks/useGemini';
import { generateCompatibilityPrompt } from '../utils/gemini-prompts';
import LoadingSpinner from './LoadingSpinner';
import type { SajuResult } from '../types/saju';

interface Props {
  person1: SajuResult;
  person2: SajuResult;
  apiKey: string;
  onClose: () => void;
}

export default function CompatibilityResult({ person1, person2, apiKey, onClose }: Props) {
  const { isStreaming, streamedText, error, generateStream } = useGeminiStream();
  const [score, setScore] = useState<number | null>(null);

  useEffect(() => {
    generateStream(apiKey, generateCompatibilityPrompt(person1, person2)).catch(() => null);
  }, []);

  useEffect(() => {
    if (streamedText) {
      const m = streamedText.match(/\uC810\uC218[:\s]*(\d+)\uC810/);
      if (m) setScore(Number(m[1]));
    }
  }, [streamedText]);

  const scoreColor =
    score === null ? 'text-gray-400'
    : score >= 80  ? 'text-green-400'
    : score >= 60  ? 'text-yellow-400'
    : 'text-red-400';

  const heartCount = score !== null ? Math.round(score / 20) : 0;

  return (
    <div className="rounded-2xl border border-pink-500/20 overflow-hidden animate-slide-up"
         style={{ background: 'linear-gradient(135deg, rgba(236,72,153,0.05) 0%, transparent 60%)' }}>
      {/* 헤더 */}
      <div className="px-5 py-4 border-b border-pink-500/15 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-pink-500/15 flex items-center justify-center">
            <Heart className="text-pink-400" size={18} />
          </div>
          <h3 className="text-base font-bold text-white">공합 분석 결과</h3>
        </div>
        <button onClick={onClose}
          className="w-8 h-8 rounded-lg flex items-center justify-center text-gray-500 hover:text-white hover:bg-white/10 transition-all">
          <X size={16} />
        </button>
      </div>

      <div className="px-5 py-5 space-y-5">
        {/* 점수 */}
        {score !== null && (
          <div className="text-center py-4 rounded-xl border border-pink-500/20 bg-pink-950/20">
            <p className="text-gray-500 text-xs mb-1">공합 점수</p>
            <p className={`text-4xl font-bold ${scoreColor}`}>{score}점</p>
            <div className="flex justify-center gap-1 mt-3">
              {Array.from({ length: 5 }).map((_, i) => (
                <Heart
                  key={i}
                  size={20}
                  className={i < heartCount ? 'text-pink-500 fill-pink-500' : 'text-gray-700'}
                />
              ))}
            </div>
          </div>
        )}

        {isStreaming && !streamedText && <LoadingSpinner message="공합을 분석 중입니다..." />}

        {error && (
          <div className="px-4 py-3 rounded-xl bg-red-950/40 border border-red-500/30">
            <p className="text-red-300 text-sm">{error}</p>
          </div>
        )}

        {streamedText && (
          <div className="text-gray-300 text-sm leading-7 whitespace-pre-wrap">
            {streamedText}
          </div>
        )}

        <button onClick={onClose}
          className="w-full py-2.5 rounded-xl text-sm font-semibold border border-white/10 text-gray-400 hover:text-white hover:border-white/20 transition-all">
          닫기
        </button>
      </div>
    </div>
  );
}
