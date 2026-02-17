/**
 * 사주팔자 관련 타입 정의
 */

export type CalendarType = 'solar' | 'lunar';
export type Gender = 'male' | 'female';

export interface BirthInfo {
  year: number;
  month: number;
  day: number;
  hour: number | null; // null이면 "시간 모름"
  calendarType: CalendarType;
  gender: Gender;
}

export interface Pillar {
  heavenlyStem: string;
  earthlyBranch: string;
}

export interface FourPillars {
  year: Pillar;
  month: Pillar;
  day: Pillar;
  hour: Pillar | null;
}

export type FiveElementType = 'wood' | 'fire' | 'earth' | 'metal' | 'water';

export type FiveElements = Record<FiveElementType, number>;

export interface MajorFortunePeriod {
  age: number;
  stem: string;
  branch: string;
  startYear: number;
}

export interface SajuResult {
  birthInfo: BirthInfo;
  fourPillars: FourPillars;
  fiveElements: FiveElements;
  tenGods: Record<string, string>;
  majorFortune: MajorFortunePeriod[];
}

export interface FortuneAnalysis {
  overall: string;
  wealth: string;
  career: string;
  health: string;
  love: string;
  academic: string;
}

export interface DailyFortune {
  date: Date;
  dayPillar: Pillar;
  overall: string;
  luckyColor: string;
  luckyNumber: number;
  luckyDirection: string;
  warnings: string;
}

export interface CompatibilityResult {
  person1: SajuResult;
  person2: SajuResult;
  score: number;
  analysis: string;
  strengths: string[];
  weaknesses: string[];
}

export interface GeminiResponse {
  text: string;
  isStreaming: boolean;
}

export interface ApiKeyStatus {
  isValid: boolean;
  error?: string;
}
