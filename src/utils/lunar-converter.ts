/**
 * 음력-양력 변환 유틸리티
 */

import { Lunar, Solar } from 'lunar-javascript';
import type { BirthInfo } from '../types/saju';

/**
 * 음력을 양력으로 변환
 */
export function lunarToSolar(year: number, month: number, day: number): { year: number; month: number; day: number } {
  try {
    const lunar = Lunar.fromYmd(year, month, day);
    const solar = lunar.getSolar();

    return {
      year: solar.getYear(),
      month: solar.getMonth(),
      day: solar.getDay(),
    };
  } catch (error) {
    throw new Error(`음력 변환 실패: ${year}년 ${month}월 ${day}일`);
  }
}

/**
 * 양력을 음력으로 변환
 */
export function solarToLunar(year: number, month: number, day: number): { year: number; month: number; day: number } {
  try {
    const solar = Solar.fromYmd(year, month, day);
    const lunar = solar.getLunar();

    return {
      year: lunar.getYear(),
      month: lunar.getMonth(),
      day: lunar.getDay(),
    };
  } catch (error) {
    throw new Error(`양력 변환 실패: ${year}년 ${month}월 ${day}일`);
  }
}

/**
 * BirthInfo를 양력으로 정규화
 */
export function normalizeBirthInfo(birthInfo: BirthInfo): BirthInfo {
  if (birthInfo.calendarType === 'lunar') {
    const solar = lunarToSolar(birthInfo.year, birthInfo.month, birthInfo.day);
    return {
      ...birthInfo,
      year: solar.year,
      month: solar.month,
      day: solar.day,
      calendarType: 'solar',
    };
  }
  return birthInfo;
}

/**
 * 유효한 날짜인지 검증
 */
export function isValidDate(year: number, month: number, day: number): boolean {
  if (year < 1900 || year > 2050) return false;
  if (month < 1 || month > 12) return false;
  if (day < 1 || day > 31) return false;

  const date = new Date(year, month - 1, day);
  return date.getFullYear() === year &&
         date.getMonth() === month - 1 &&
         date.getDate() === day;
}
