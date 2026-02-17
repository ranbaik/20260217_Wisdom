# 🎴 사주팔자 운세 분석 웹 앱

Google Gemini AI를 활용한 전통 사주명리학 기반 운세 분석 웹 애플리케이션입니다.

## ✨ 주요 기능

- **사주팔자 계산**: 생년월일시를 기반으로 정확한 사주 계산 (만세력 기반)
- **AI 운세 분석**: Gemini AI가 6가지 카테고리로 상세 분석
  - 📊 총운
  - 💰 재산운
  - 💼 직장/사업운
  - 🏥 건강운
  - 💕 연애/결혼운
  - 📚 학업운
- **오늘의 운세**: 일일 운세 확인
- **궁합 보기**: 두 사람의 사주 궁합 분석
- **PDF 저장**: 분석 결과를 PDF로 다운로드
- **음력/양력 지원**: 음력 생일 자동 변환
- **시간 모름 옵션**: 태어난 시간을 모르는 경우 대응

## 🚀 시작하기

### 1. 패키지 설치

```bash
npm install
```

### 2. 개발 서버 실행

```bash
npm run dev
```

브라우저에서 자동으로 `http://localhost:3000`이 열립니다.

### 3. 빌드

```bash
npm run build
```

빌드된 파일은 `dist` 폴더에 생성됩니다.

## 🔑 API Key 발급

1. [Google AI Studio](https://aistudio.google.com/apikey)에 접속
2. Google 계정으로 로그인
3. "Get API Key" 또는 "Create API Key" 버튼 클릭
4. 생성된 API Key를 앱에 입력

> ⚠️ **참고**: API Key는 브라우저 세션에만 저장되며 외부로 전송되지 않습니다.

## 🛠️ 기술 스택

- **프레임워크**: React 18 + TypeScript 5
- **빌드 도구**: Vite 5
- **스타일링**: Tailwind CSS 3
- **AI 모델**: Google Gemini 2.0 Flash
- **라이브러리**:
  - `@google/generative-ai`: Gemini API 연동
  - `korean-lunar-calendar`: 음력/양력 변환
  - `html2canvas` + `jspdf`: PDF 생성
  - `lucide-react`: 아이콘

## 📁 프로젝트 구조

```
src/
├── components/          # React 컴포넌트
│   ├── ApiKeyInput.tsx
│   ├── BirthInfoForm.tsx
│   ├── SajuResult.tsx
│   ├── SajuChart.tsx
│   ├── FortuneCategory.tsx
│   ├── DailyFortune.tsx
│   ├── CompatibilityForm.tsx
│   └── ...
├── hooks/              # 커스텀 훅
│   ├── useGemini.ts
│   └── useSajuCalculation.ts
├── utils/              # 유틸리티 함수
│   ├── saju-calculator.ts    # 사주 계산 엔진
│   ├── lunar-converter.ts    # 음력 변환
│   ├── gemini-prompts.ts     # AI 프롬프트
│   ├── pdf-export.ts
│   └── constants.ts
├── types/              # TypeScript 타입 정의
│   └── saju.ts
├── App.tsx             # 메인 앱
└── main.tsx            # 엔트리 포인트
```

## 📝 사주 계산 알고리즘

- **연주(年柱)**: 입춘(立春) 기준으로 계산
- **월주(月柱)**: 절기(節氣) 기준으로 계산
- **일주(日柱)**: 기원일(1900.1.1 경자일)로부터 일수 차이로 계산
- **시주(時柱)**: 일간과 시간대로 계산
- **대운(大運)**: 성별과 연간 음양에 따라 순행/역행 결정

## 🎨 디자인 테마

- **색상**: 동양적 분위기의 다크 테마
  - 배경: 검정 계열
  - 강조: 금색 (#d4af37)
  - 오행별 색상: 木(초록), 火(빨강), 土(노랑), 金(흰색), 水(파랑)
- **폰트**: Noto Serif KR (한글 명조체)

## ⚠️ 주의사항

- 본 앱은 **오락 및 참고 목적**으로 제작되었습니다.
- 전통 명리학을 기반으로 하지만 AI 해석이므로 실제 전문가 상담을 대체하지 않습니다.
- API Key는 사용자가 직접 관리해야 하며, 외부 서버로 전송되지 않습니다.
- Gemini API Free Tier 제한에 유의하세요.

## 📄 라이선스

MIT License

## 🙏 크레딧

- Google Gemini AI
- 전통 명리학 이론
- korean-lunar-calendar 라이브러리

---

**Made with ❤️ using React + TypeScript + Gemini AI**
