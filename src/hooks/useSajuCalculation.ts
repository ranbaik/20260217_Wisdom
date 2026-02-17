/**
 * 사주 계산 커스텀 훅
 */

import { useState, useCallback } from 'react';
import { calculateSaju, getTodayPillar, sajuToString } from '../utils/saju-calculator';
import { normalizeBirthInfo } from '../utils/lunar-converter';
import type { BirthInfo, SajuResult, Pillar } from '../types/saju';

export function useSajuCalculation() {
  const [sajuResult, setSajuResult] = useState<SajuResult | null>(null);
  const [isCalculating, setIsCalculating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const calculate = useCallback((birthInfo: BirthInfo): SajuResult | null => {
    setIsCalculating(true);
    setError(null);

    try {
      // 음력인 경우 양력으로 변환
      const normalizedBirthInfo = normalizeBirthInfo(birthInfo);

      // 사주 계산
      const result = calculateSaju(normalizedBirthInfo);
      setSajuResult(result);
      setIsCalculating(false);

      // sessionStorage에 최근 분석 저장
      saveRecentAnalysis(result);

      return result;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : '사주 계산 중 오류가 발생했습니다.';
      setError(errorMessage);
      setIsCalculating(false);
      return null;
    }
  }, []);

  const reset = useCallback(() => {
    setSajuResult(null);
    setError(null);
  }, []);

  return {
    sajuResult,
    isCalculating,
    error,
    calculate,
    reset,
  };
}

/**
 * 오늘의 운세 계산
 */
export function useDailyFortune() {
  const [todayPillar, setTodayPillar] = useState<Pillar | null>(null);

  const calculateToday = useCallback(() => {
    const pillar = getTodayPillar();
    setTodayPillar(pillar);
    return pillar;
  }, []);

  return {
    todayPillar,
    calculateToday,
  };
}

/**
 * 최근 분석 이력 저장 (최대 3개)
 */
function saveRecentAnalysis(saju: SajuResult) {
  try {
    const recent = getRecentAnalyses();
    const newAnalysis = {
      id: Date.now(),
      sajuString: sajuToString(saju),
      birthInfo: saju.birthInfo,
      timestamp: new Date().toISOString(),
    };

    const updated = [newAnalysis, ...recent].slice(0, 3);
    sessionStorage.setItem('recent-saju-analyses', JSON.stringify(updated));
  } catch (error) {
    // 저장 실패 시 무시
  }
}

/**
 * 최근 분석 이력 조회
 */
export function getRecentAnalyses(): Array<{
  id: number;
  sajuString: string;
  birthInfo: BirthInfo;
  timestamp: string;
}> {
  try {
    const data = sessionStorage.getItem('recent-saju-analyses');
    return data ? JSON.parse(data) : [];
  } catch (error) {
    return [];
  }
}
