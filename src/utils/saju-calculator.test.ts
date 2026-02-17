/**
 * 사주팔자 계산 로직 유닛 테스트
 */

import { describe, it, expect } from 'vitest';
import { calculateSaju, getTodayPillar } from './saju-calculator';
import type { BirthInfo } from '../types/saju';

// 테스트용 기준 생년월일 (이하 값들은 사주 계산 검증용)
const MALE = 'male' as const;
const FEMALE = 'female' as const;

describe('사주팔자 계산 - 연주(年柱)', () => {
  it('1984년생(갑자년)의 연주는 갑자이다', () => {
    const birthInfo: BirthInfo = {
      year: 1984, month: 3, day: 15,
      hour: null, calendarType: 'solar', gender: MALE
    };
    const result = calculateSaju(birthInfo);
    expect(result.fourPillars.year.heavenlyStem).toBe('갑');
    expect(result.fourPillars.year.earthlyBranch).toBe('자');
  });

  it('입춘 이전 출생자(2월 3일)는 전년도 연주로 계산된다', () => {
    // 2024년 2월 3일 (입춘 2024년 2월 4일 이전) → 2023년으로 계산되어야 함
    const birthInfo: BirthInfo = {
      year: 2024, month: 2, day: 3,
      hour: null, calendarType: 'solar', gender: MALE
    };
    const result = calculateSaju(birthInfo);
    // 2023년은 계묘년 → 천간 계(癸), 지지 묘(卯)
    expect(result.fourPillars.year.heavenlyStem).toBe('계');
    expect(result.fourPillars.year.earthlyBranch).toBe('묘');
  });

  it('입춘 이후 출생자(2월 5일)는 해당 연도 연주로 계산된다', () => {
    // 2024년 2월 5일 (입춘 2024년 2월 4일 이후) → 2024년으로 계산
    const birthInfo: BirthInfo = {
      year: 2024, month: 2, day: 5,
      hour: null, calendarType: 'solar', gender: MALE
    };
    const result = calculateSaju(birthInfo);
    // 2024년은 갑진년 → 천간 갑(甲), 지지 진(辰)
    expect(result.fourPillars.year.heavenlyStem).toBe('갑');
    expect(result.fourPillars.year.earthlyBranch).toBe('진');
  });
});

describe('사주팔자 계산 - 사주 구조', () => {
  it('사주 결과는 FourPillars 구조를 가져야 한다', () => {
    const birthInfo: BirthInfo = {
      year: 1990, month: 6, day: 15,
      hour: 6, calendarType: 'solar', gender: FEMALE
    };
    const result = calculateSaju(birthInfo);

    expect(result.fourPillars.year).toBeDefined();
    expect(result.fourPillars.month).toBeDefined();
    expect(result.fourPillars.day).toBeDefined();
    expect(result.fourPillars.hour).toBeDefined();
  });

  it('시간 모름(null)인 경우 시주는 null이어야 한다', () => {
    const birthInfo: BirthInfo = {
      year: 1990, month: 6, day: 15,
      hour: null, calendarType: 'solar', gender: MALE
    };
    const result = calculateSaju(birthInfo);

    expect(result.fourPillars.hour).toBeNull();
  });

  it('각 기둥의 천간과 지지는 유효한 값이어야 한다', () => {
    const validStems = ['갑', '을', '병', '정', '무', '기', '경', '신', '임', '계'];
    const validBranches = ['자', '축', '인', '묘', '진', '사', '오', '미', '신', '유', '술', '해'];

    const birthInfo: BirthInfo = {
      year: 1985, month: 5, day: 20,
      hour: 4, calendarType: 'solar', gender: MALE
    };
    const result = calculateSaju(birthInfo);
    const { year, month, day, hour } = result.fourPillars;

    expect(validStems).toContain(year.heavenlyStem);
    expect(validBranches).toContain(year.earthlyBranch);
    expect(validStems).toContain(month.heavenlyStem);
    expect(validBranches).toContain(month.earthlyBranch);
    expect(validStems).toContain(day.heavenlyStem);
    expect(validBranches).toContain(day.earthlyBranch);
    if (hour) {
      expect(validStems).toContain(hour.heavenlyStem);
      expect(validBranches).toContain(hour.earthlyBranch);
    }
  });
});

describe('사주팔자 계산 - 오행 분포', () => {
  it('오행 분포는 5가지 요소를 모두 가져야 한다', () => {
    const birthInfo: BirthInfo = {
      year: 1990, month: 6, day: 15,
      hour: 6, calendarType: 'solar', gender: MALE
    };
    const result = calculateSaju(birthInfo);

    expect(result.fiveElements).toHaveProperty('wood');
    expect(result.fiveElements).toHaveProperty('fire');
    expect(result.fiveElements).toHaveProperty('earth');
    expect(result.fiveElements).toHaveProperty('metal');
    expect(result.fiveElements).toHaveProperty('water');
  });

  it('시간 포함시 오행 개수의 합은 최대 8개이다', () => {
    const birthInfo: BirthInfo = {
      year: 1990, month: 6, day: 15,
      hour: 6, calendarType: 'solar', gender: MALE
    };
    const result = calculateSaju(birthInfo);
    const { wood, fire, earth, metal, water } = result.fiveElements;
    const total = wood + fire + earth + metal + water;

    expect(total).toBeLessThanOrEqual(8);
    expect(total).toBeGreaterThan(0);
  });

  it('시간 미포함시 오행 개수의 합은 최대 6개이다', () => {
    const birthInfo: BirthInfo = {
      year: 1990, month: 6, day: 15,
      hour: null, calendarType: 'solar', gender: MALE
    };
    const result = calculateSaju(birthInfo);
    const { wood, fire, earth, metal, water } = result.fiveElements;
    const total = wood + fire + earth + metal + water;

    expect(total).toBeLessThanOrEqual(6);
  });
});

describe('사주팔자 계산 - 대운', () => {
  it('대운은 8개 이상 계산되어야 한다', () => {
    const birthInfo: BirthInfo = {
      year: 1990, month: 6, day: 15,
      hour: 6, calendarType: 'solar', gender: MALE
    };
    const result = calculateSaju(birthInfo);

    expect(result.majorFortune).toHaveLength(8);
  });

  it('대운의 나이는 순차적으로 증가해야 한다', () => {
    const birthInfo: BirthInfo = {
      year: 1990, month: 6, day: 15,
      hour: 6, calendarType: 'solar', gender: MALE
    };
    const result = calculateSaju(birthInfo);

    for (let i = 1; i < result.majorFortune.length; i++) {
      expect(result.majorFortune[i].age).toBeGreaterThan(result.majorFortune[i - 1].age);
    }
  });
});

describe('오늘의 일주 계산', () => {
  it('오늘 일주는 천간과 지지를 모두 가져야 한다', () => {
    const validStems = ['갑', '을', '병', '정', '무', '기', '경', '신', '임', '계'];
    const validBranches = ['자', '축', '인', '묘', '진', '사', '오', '미', '신', '유', '술', '해'];

    const todayPillar = getTodayPillar();
    expect(validStems).toContain(todayPillar.heavenlyStem);
    expect(validBranches).toContain(todayPillar.earthlyBranch);
  });
});

describe('BirthInfo 검증', () => {
  it('다양한 연도에 대해 일관된 결과를 반환해야 한다', () => {
    const birthInfo1: BirthInfo = {
      year: 1950, month: 1, day: 1,
      hour: null, calendarType: 'solar', gender: MALE
    };
    const birthInfo2: BirthInfo = {
      year: 2000, month: 12, day: 31,
      hour: null, calendarType: 'solar', gender: FEMALE
    };

    const result1 = calculateSaju(birthInfo1);
    const result2 = calculateSaju(birthInfo2);

    expect(result1.fourPillars.year.heavenlyStem).toBeTruthy();
    expect(result2.fourPillars.year.heavenlyStem).toBeTruthy();
  });
});
