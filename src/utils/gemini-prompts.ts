/**
 * Gemini AI 사주 해석 프롬프트 템플릿
 */

import type { SajuResult } from '../types/saju';
import { sajuToString } from './saju-calculator';

/**
 * 사주 전체 분석 프롬프트
 */
export function generateFortunePrompt(saju: SajuResult): string {
  const { fiveElements, birthInfo } = saju;

  const sajuString = sajuToString(saju);
  const currentYear = new Date().getFullYear();
  const age = currentYear - birthInfo.year + 1;

  return `당신은 40년 경력의 사주명리학 대가입니다. 다음 사주팔자 정보를 받아 6가지 영역을 상세히 분석해 주세요.

📋 사주 정보:
- 사주팔자: ${sajuString}
- 성별: ${birthInfo.gender === 'male' ? '남성' : '여성'}
- 생년월일: ${birthInfo.year}년 ${birthInfo.month}월 ${birthInfo.day}일 ${birthInfo.hour !== null ? `${birthInfo.hour}시` : '(시간 미상)'}
- 현재 나이: 만 ${age - 1}세

🔢 오행 분포:
- 목(木): ${fiveElements.wood}
- 화(火): ${fiveElements.fire}
- 토(土): ${fiveElements.earth}
- 금(金): ${fiveElements.metal}
- 수(水): ${fiveElements.water}

각 영역별로 반드시 다음 구조로 답변하세요:

## 1. 📊 총운 (Overall Fortune)
- 사주 구성의 전체적인 특성과 기운의 흐름
- 타고난 성격과 기질
- 인생 전반의 운세 흐름과 주요 전환점
- 현재 대운의 영향과 향후 3~5년 전망

## 2. 💰 재산운 (Wealth Fortune)
- 재물을 모으는 성향과 패턴
- 투자 성향 (안정형/공격형) 및 적합한 재테크 방향
- 재물이 들어오는 시기와 주의해야 할 시기
- 부동산/주식/사업 등 분야별 적합도

## 3. 💼 직장/사업운 (Career Fortune)
- 적합한 직업 분야와 업종
- 직장에서의 대인관계와 승진 가능성
- 사업 적합성과 파트너십 운
- 커리어 전환 최적 시기
- 리더십 스타일과 조직 내 역할

## 4. 🏥 건강운 (Health Fortune)
- 오행 불균형에 따른 취약 장기와 질환 주의사항
- 계절별 건강 관리 포인트
- 정신 건강 및 스트레스 관리 조언
- 건강에 좋은 음식/운동 추천

## 5. 💕 연애/결혼운 (Love & Marriage Fortune)
- 이상적인 배우자 유형 (오행/띠 기준)
- 연애 패턴과 주의점
- 결혼 적합 시기
- 가정생활 운과 자녀운

## 6. 📚 학업운 (Academic Fortune)
- 학습 성향과 적합한 공부 방법
- 집중력이 높아지는 시간대
- 적합한 전공/학문 분야
- 시험운과 합격 가능성이 높은 시기

⚡ 분석 규칙:
- 반드시 사주의 천간/지지/오행 구성을 근거로 설명할 것
- 긍정적인 면과 주의할 점을 균형 있게 제시할 것
- 구체적인 시기(나이, 연도)를 가능한 한 포함할 것
- 실생활에 적용 가능한 구체적 조언을 포함할 것
- 각 영역별 최소 4~5문장 이상 상세히 분석할 것
- 한국어로 답변하되, 전문 용어는 한자를 병기할 것

각 섹션은 반드시 "## 숫자. 이모지 제목" 형식으로 시작하고, 내용은 명확한 문단으로 구성해 주세요.`;
}

/**
 * 오늘의 운세 프롬프트
 */
export function generateDailyFortunePrompt(saju: SajuResult, todayPillar: string): string {
  const sajuString = sajuToString(saju);
  const today = new Date();

  return `당신은 사주명리학 전문가입니다. 다음 정보를 바탕으로 오늘의 운세를 분석해 주세요.

📋 본명사주: ${sajuString}
📅 오늘 날짜: ${today.getFullYear()}년 ${today.getMonth() + 1}월 ${today.getDate()}일
🌅 오늘 일진: ${todayPillar}

다음 항목으로 분석해 주세요:

## 오늘의 총운
오늘 일진과 본인 사주의 상호작용을 분석하여 하루의 전체적인 운세를 설명해 주세요.

## 행운의 요소
- 행운의 색: (구체적인 색상 1개)
- 행운의 숫자: (1~9 중 1개)
- 행운의 방위: (동/서/남/북 중 1개)

## 주의사항
오늘 특히 조심해야 할 일이나 피해야 할 행동을 알려주세요.

## 오늘의 한마디
오늘을 위한 긍정적인 조언 한 문장을 작성해 주세요.

각 섹션은 간결하고 실용적으로 작성해 주세요.`;
}

/**
 * 궁합 분석 프롬프트
 */
export function generateCompatibilityPrompt(person1: SajuResult, person2: SajuResult): string {
  const saju1 = sajuToString(person1);
  const saju2 = sajuToString(person2);

  return `당신은 사주명리학 궁합 전문가입니다. 다음 두 사람의 사주를 분석하여 궁합을 평가해 주세요.

👤 사람 1:
- 사주: ${saju1}
- 성별: ${person1.birthInfo.gender === 'male' ? '남성' : '여성'}
- 오행: 목${person1.fiveElements.wood} 화${person1.fiveElements.fire} 토${person1.fiveElements.earth} 금${person1.fiveElements.metal} 수${person1.fiveElements.water}

👥 사람 2:
- 사주: ${saju2}
- 성별: ${person2.birthInfo.gender === 'male' ? '남성' : '여성'}
- 오행: 목${person2.fiveElements.wood} 화${person2.fiveElements.fire} 토${person2.fiveElements.earth} 금${person2.fiveElements.metal} 수${person2.fiveElements.water}

다음 형식으로 분석해 주세요:

## 궁합 점수
1~100점 척도로 평가하고, 그 이유를 설명해 주세요.
형식: "점수: XX점"

## 오행 상생상극 분석
두 사람의 오행 구성이 어떻게 상호작용하는지 분석해 주세요.

## 강점 (최소 3가지)
이 커플의 긍정적인 면을 구체적으로 나열해 주세요.

## 약점 (최소 3가지)
주의해야 할 점이나 갈등 요소를 구체적으로 나열해 주세요.

## 조화로운 관계를 위한 조언
실질적인 조언 3~4가지를 제시해 주세요.

명확하고 구체적으로 작성해 주세요.`;
}
