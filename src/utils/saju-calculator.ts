/**
 * 사주팔자 계산 엔진
 * 만세력 기반의 정확한 사주 계산 로직
 */

import {
  HEAVENLY_STEMS,
  EARTHLY_BRANCHES,
  STEM_ELEMENTS,
  BRANCH_ELEMENTS,
  LICHUN_DATES,
  SOLAR_TERMS_MONTH,
} from './constants';
import type {
  BirthInfo,
  SajuResult,
  Pillar,
  FourPillars,
  FiveElements,
  MajorFortunePeriod,
} from '../types/saju';

/**
 * 연주(年柱) 계산
 * 입춘 이전 출생자는 전년도로 계산
 */
function getYearPillar(birthInfo: BirthInfo): Pillar {
  let year = birthInfo.year;

  // 입춘 이전 출생 여부 확인
  const lichun = LICHUN_DATES[year] || { month: 2, day: 4 };
  if (birthInfo.month < lichun.month ||
      (birthInfo.month === lichun.month && birthInfo.day < lichun.day)) {
    year -= 1;
  }

  // 갑자년(1984)을 기준으로 계산
  const baseYear = 1984;
  const yearDiff = year - baseYear;

  const stemIndex = (yearDiff % 10 + 10) % 10;
  const branchIndex = (yearDiff % 12 + 12) % 12;

  return {
    heavenlyStem: HEAVENLY_STEMS[stemIndex].slice(0, 1),
    earthlyBranch: EARTHLY_BRANCHES[branchIndex].slice(0, 1),
  };
}

/**
 * 월주(月柱) 계산
 * 절기 기준으로 월을 결정
 */
function getMonthPillar(birthInfo: BirthInfo, yearPillar: Pillar): Pillar {
  // 절기를 기준으로 사주 월 결정
  let sajuMonth = birthInfo.month;

  // 해당 월의 절기 이전인 경우 전월로 계산
  const solarTerm = SOLAR_TERMS_MONTH.find(term => term.month === birthInfo.month);
  if (solarTerm && birthInfo.day < solarTerm.startDay) {
    sajuMonth = birthInfo.month === 1 ? 12 : birthInfo.month - 1;
  }

  // 월간 계산: 연간에 따라 정해진 공식 사용
  const yearStemIndex = HEAVENLY_STEMS.findIndex(s => s.startsWith(yearPillar.heavenlyStem));

  // 월간 기준: 갑/기년은 병인월부터, 을/경년은 무인월부터 시작
  const monthStemBase = [0, 2, 4, 6, 8]; // 갑,을,병,정,무년 시작 천간
  const baseIndex = Math.floor(yearStemIndex / 2);

  // 인월(1월)부터 시작하여 순차 증가
  const monthOffset = (sajuMonth + 1) % 12; // 1월=인월=0, 2월=묘월=1...
  const stemIndex = (monthStemBase[baseIndex] + monthOffset) % 10;
  const branchIndex = (monthOffset + 2) % 12; // 인월부터 시작

  return {
    heavenlyStem: HEAVENLY_STEMS[stemIndex].slice(0, 1),
    earthlyBranch: EARTHLY_BRANCHES[branchIndex].slice(0, 1),
  };
}

/**
 * 일주(日柱) 계산
 * 기원일로부터의 일수 차이로 계산
 */
function getDayPillar(year: number, month: number, day: number): Pillar {
  // 기준일: 1900년 1월 1일 = 경자일 (庚子日)
  const baseDate = new Date(1900, 0, 1);
  const targetDate = new Date(year, month - 1, day);

  const daysDiff = Math.floor((targetDate.getTime() - baseDate.getTime()) / (1000 * 60 * 60 * 24));

  // 경자일 기준 (천간 6=경, 지지 0=자)
  const stemIndex = (6 + daysDiff % 10 + 600) % 10;
  const branchIndex = (0 + daysDiff % 12 + 600) % 12;

  return {
    heavenlyStem: HEAVENLY_STEMS[stemIndex].slice(0, 1),
    earthlyBranch: EARTHLY_BRANCHES[branchIndex].slice(0, 1),
  };
}

/**
 * 시주(時柱) 계산
 */
function getHourPillar(hour: number, dayPillar: Pillar): Pillar {
  // 시간대를 지지 인덱스로 변환
  const branchIndex = hour;

  // 시간의 천간은 일간에 따라 결정됨
  const dayStemIndex = HEAVENLY_STEMS.findIndex(s => s.startsWith(dayPillar.heavenlyStem));

  // 시간 천간 계산 공식
  const hourStemBase = (dayStemIndex % 5) * 2;
  const stemIndex = (hourStemBase + branchIndex) % 10;

  return {
    heavenlyStem: HEAVENLY_STEMS[stemIndex].slice(0, 1),
    earthlyBranch: EARTHLY_BRANCHES[branchIndex].slice(0, 1),
  };
}

/**
 * 오행 분포 계산
 */
function calculateFiveElements(fourPillars: FourPillars): FiveElements {
  const elements: FiveElements = {
    wood: 0,
    fire: 0,
    earth: 0,
    metal: 0,
    water: 0,
  };

  const elementMap: Record<string, keyof FiveElements> = {
    '木': 'wood',
    '火': 'fire',
    '土': 'earth',
    '金': 'metal',
    '水': 'water',
  };

  // 각 기둥의 천간과 지지에서 오행 추출
  const pillars = [
    fourPillars.year,
    fourPillars.month,
    fourPillars.day,
    fourPillars.hour,
  ];

  pillars.forEach(pillar => {
    if (!pillar) return;

    const stemElement = STEM_ELEMENTS[pillar.heavenlyStem];
    const branchElement = BRANCH_ELEMENTS[pillar.earthlyBranch];

    if (stemElement && elementMap[stemElement]) {
      elements[elementMap[stemElement]] += 1;
    }
    if (branchElement && elementMap[branchElement]) {
      elements[elementMap[branchElement]] += 1;
    }
  });

  return elements;
}

/**
 * 십신(十神) 관계 계산
 */
function calculateTenGods(fourPillars: FourPillars): Record<string, string> {
  const dayStem = fourPillars.day.heavenlyStem;
  const dayStemElement = STEM_ELEMENTS[dayStem];

  // 간단한 십신 관계 (실제로는 더 복잡함)
  return {
    일간: dayStem,
    일간오행: dayStemElement,
    월지: fourPillars.month.earthlyBranch,
    시지: fourPillars.hour?.earthlyBranch || '미상',
  };
}

/**
 * 대운(大運) 계산
 */
function calculateMajorFortune(
  birthInfo: BirthInfo,
  yearPillar: Pillar,
  monthPillar: Pillar
): MajorFortunePeriod[] {
  const fortune: MajorFortunePeriod[] = [];

  // 성별과 년간의 음양에 따라 순행/역행 결정
  const yearStemIndex = HEAVENLY_STEMS.findIndex(s => s.startsWith(yearPillar.heavenlyStem));
  const isYangYear = yearStemIndex % 2 === 0;
  const isForward = (birthInfo.gender === 'male' && isYangYear) ||
                    (birthInfo.gender === 'female' && !isYangYear);

  const monthStemIndex = HEAVENLY_STEMS.findIndex(s => s.startsWith(monthPillar.heavenlyStem));
  const monthBranchIndex = EARTHLY_BRANCHES.findIndex(b => b.startsWith(monthPillar.earthlyBranch));

  // 10년 단위로 8개 대운 계산
  for (let i = 0; i < 8; i++) {
    const age = 8 + (i * 10); // 대운은 보통 8세부터 시작
    const offset = isForward ? i + 1 : -i - 1;

    const stemIndex = (monthStemIndex + offset + 10) % 10;
    const branchIndex = (monthBranchIndex + offset + 12) % 12;

    fortune.push({
      age,
      stem: HEAVENLY_STEMS[stemIndex].slice(0, 1),
      branch: EARTHLY_BRANCHES[branchIndex].slice(0, 1),
      startYear: birthInfo.year + age,
    });
  }

  return fortune;
}

/**
 * 메인 사주 계산 함수
 */
export function calculateSaju(birthInfo: BirthInfo): SajuResult {
  // 1. 연주 계산
  const yearPillar = getYearPillar(birthInfo);

  // 2. 월주 계산
  const monthPillar = getMonthPillar(birthInfo, yearPillar);

  // 3. 일주 계산
  const dayPillar = getDayPillar(birthInfo.year, birthInfo.month, birthInfo.day);

  // 4. 시주 계산 (시간을 아는 경우만)
  const hourPillar = birthInfo.hour !== null
    ? getHourPillar(birthInfo.hour, dayPillar)
    : null;

  const fourPillars: FourPillars = {
    year: yearPillar,
    month: monthPillar,
    day: dayPillar,
    hour: hourPillar,
  };

  // 5. 오행 분포 계산
  const fiveElements = calculateFiveElements(fourPillars);

  // 6. 십신 계산
  const tenGods = calculateTenGods(fourPillars);

  // 7. 대운 계산
  const majorFortune = calculateMajorFortune(birthInfo, yearPillar, monthPillar);

  return {
    birthInfo,
    fourPillars,
    fiveElements,
    tenGods,
    majorFortune,
  };
}

/**
 * 오늘의 일주 계산
 */
export function getTodayPillar(): Pillar {
  const today = new Date();
  return getDayPillar(today.getFullYear(), today.getMonth() + 1, today.getDate());
}

/**
 * 사주 정보를 문자열로 변환 (디버깅/로깅용)
 */
export function sajuToString(saju: SajuResult): string {
  const { fourPillars } = saju;
  return `${fourPillars.year.heavenlyStem}${fourPillars.year.earthlyBranch} ${fourPillars.month.heavenlyStem}${fourPillars.month.earthlyBranch} ${fourPillars.day.heavenlyStem}${fourPillars.day.earthlyBranch} ${fourPillars.hour ? fourPillars.hour.heavenlyStem + fourPillars.hour.earthlyBranch : '??'}`;
}
