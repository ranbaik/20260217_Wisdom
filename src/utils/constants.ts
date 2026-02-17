/**
 * 사주팔자 계산에 필요한 상수 정의
 */

// 천간 (天干) - 10개
export const HEAVENLY_STEMS = [
  '갑(甲)', '을(乙)', '병(丙)', '정(丁)', '무(戊)',
  '기(己)', '경(庚)', '신(辛)', '임(壬)', '계(癸)'
] as const;

// 지지 (地支) - 12개
export const EARTHLY_BRANCHES = [
  '자(子)', '축(丑)', '인(寅)', '묘(卯)', '진(辰)', '사(巳)',
  '오(午)', '미(未)', '신(申)', '유(酉)', '술(戌)', '해(亥)'
] as const;

// 천간의 오행 매핑
export const STEM_ELEMENTS: Record<string, string> = {
  '갑': '木', '을': '木',
  '병': '火', '정': '火',
  '무': '土', '기': '土',
  '경': '金', '신': '金',
  '임': '水', '계': '水',
};

// 지지의 오행 매핑
export const BRANCH_ELEMENTS: Record<string, string> = {
  '인': '木', '묘': '木',
  '사': '火', '오': '火',
  '신': '金', '유': '金',
  '해': '水', '자': '水',
  '진': '土', '술': '土', '축': '土', '미': '土',
};

// 오행 색상 코드
export const ELEMENT_COLORS = {
  '木': { bg: '#22c55e', text: '#ffffff', name: '목(木)', border: null },
  '火': { bg: '#ef4444', text: '#ffffff', name: '화(火)', border: null },
  '土': { bg: '#eab308', text: '#000000', name: '토(土)', border: null },
  '金': { bg: '#f8fafc', text: '#000000', name: '금(金)', border: '#cbd5e1' },
  '水': { bg: '#3b82f6', text: '#ffffff', name: '수(水)', border: null },
} as const;

// 12시진 시간 매핑
export const TWELVE_BRANCHES_TIME = [
  { index: 0, branch: '자시(子時)', range: '23:30 ~ 01:29', branchOnly: '자' },
  { index: 1, branch: '축시(丑時)', range: '01:30 ~ 03:29', branchOnly: '축' },
  { index: 2, branch: '인시(寅時)', range: '03:30 ~ 05:29', branchOnly: '인' },
  { index: 3, branch: '묘시(卯時)', range: '05:30 ~ 07:29', branchOnly: '묘' },
  { index: 4, branch: '진시(辰時)', range: '07:30 ~ 09:29', branchOnly: '진' },
  { index: 5, branch: '사시(巳時)', range: '09:30 ~ 11:29', branchOnly: '사' },
  { index: 6, branch: '오시(午時)', range: '11:30 ~ 13:29', branchOnly: '오' },
  { index: 7, branch: '미시(未時)', range: '13:30 ~ 15:29', branchOnly: '미' },
  { index: 8, branch: '신시(申時)', range: '15:30 ~ 17:29', branchOnly: '신' },
  { index: 9, branch: '유시(酉時)', range: '17:30 ~ 19:29', branchOnly: '유' },
  { index: 10, branch: '술시(戌時)', range: '19:30 ~ 21:29', branchOnly: '술' },
  { index: 11, branch: '해시(亥時)', range: '21:30 ~ 23:29', branchOnly: '해' },
] as const;

// 입춘 절기 날짜 (근사값, 2월 3~5일)
export const LICHUN_DATES: Record<number, { month: number; day: number }> = {
  2020: { month: 2, day: 4 },
  2021: { month: 2, day: 3 },
  2022: { month: 2, day: 4 },
  2023: { month: 2, day: 4 },
  2024: { month: 2, day: 4 },
  2025: { month: 2, day: 3 },
  2026: { month: 2, day: 4 },
};

// 월주 결정용 절기 테이블 (근사값)
export const SOLAR_TERMS_MONTH: Array<{ month: number; startDay: number }> = [
  { month: 2, startDay: 4 },   // 입춘 (1월)
  { month: 3, startDay: 6 },   // 경칩 (2월)
  { month: 4, startDay: 5 },   // 청명 (3월)
  { month: 5, startDay: 6 },   // 입하 (4월)
  { month: 6, startDay: 6 },   // 망종 (5월)
  { month: 7, startDay: 7 },   // 소서 (6월)
  { month: 8, startDay: 8 },   // 입추 (7월)
  { month: 9, startDay: 8 },   // 백로 (8월)
  { month: 10, startDay: 8 },  // 한로 (9월)
  { month: 11, startDay: 7 },  // 입동 (10월)
  { month: 12, startDay: 7 },  // 대설 (11월)
  { month: 1, startDay: 6 },   // 소한 (12월)
];

// 십신 (十神)
export const TEN_GODS = [
  '비겁(比劫)', '식상(食傷)', '재성(財星)', '관성(官星)', '인성(印星)'
] as const;

// 오행 상생 관계
export const ELEMENT_GENERATION: Record<string, string> = {
  '木': '火', // 목생화
  '火': '土', // 화생토
  '土': '金', // 토생금
  '金': '水', // 금생수
  '水': '木', // 수생목
};

// 오행 상극 관계
export const ELEMENT_DESTRUCTION: Record<string, string> = {
  '木': '土', // 목극토
  '土': '水', // 토극수
  '水': '火', // 수극화
  '火': '金', // 화극금
  '金': '木', // 금극목
};
