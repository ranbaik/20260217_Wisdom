# ✨ 지혜의 삶 — AI 사주팔자 운세 분석

Google Gemini AI를 활용한 전통 사주명리학 기반 운세 분석 웹 애플리케이션입니다.
React 18 + TypeScript 5 + Vite 5로 구축된 현대적이고 반응형인 SPA입니다.

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

## 🔑 API Key 설정

### 옵션 1: `.env` 파일 (권장 - 자동 로그인)

1. 프로젝트 루트에 `.env` 파일 생성
2. [Google AI Studio](https://aistudio.google.com/apikey)에서 API Key 발급
3. `.env` 파일에 다음과 같이 입력:
   ```
   VITE_GEMINI_API_KEY=AIzaSyXXXXXXXXXXXXXXXXXXXX
   ```
4. 개발 서버 재시작: `npm run dev`

### 옵션 2: 웹 인터페이스에서 입력

- 앱 시작 시 "Gemini API Key" 입력 폼에 직접 입력
- 자동으로 검증되며 세션 스토리지에 저장

> ⚠️ **보안 주의**:
> - `.env` 파일은 `.gitignore`에 포함되어 Git에 커밋되지 않습니다
> - API Key는 **클라이언트 측에서만 처리**되며 서버로 전송되지 않습니다
> - 민감한 정보이므로 절대 GitHub에 노출시키지 마세요

## 🛠️ 기술 스택

- **프레임워크**: React 18 + TypeScript 5
- **빌드 도구**: Vite 5
- **스타일링**: Tailwind CSS 3 (다크 테마 + 금색 강조)
- **AI 모델**: Google Gemini 2.5 Flash (REST API)
- **테스트**: Vitest + jsdom (13개 유닛 테스트)
- **라이브러리**:
  - `lunar-javascript`: 음력/양력 변환
  - `html2canvas` + `jspdf`: PDF 생성
  - `lucide-react`: 아이콘

## 📁 프로젝트 구조

```
src/
├── components/                 # React 컴포넌트
│   ├── ApiKeyInput.tsx         # API 키 입력 + 유효성 검사
│   ├── BirthInfoForm.tsx       # 생년월일 입력 폼
│   ├── SajuResult.tsx          # 사주 결과 + 6가지 운세 분석
│   ├── SajuChart.tsx           # 사주팔자 시각화
│   ├── FortuneCategory.tsx     # 운세 카테고리 (아코디언)
│   ├── DailyFortune.tsx        # 오늘의 운세
│   ├── CompatibilityForm.tsx   # 궁합 입력 폼
│   ├── CompatibilityResult.tsx # 궁합 결과
│   ├── PdfExportButton.tsx     # PDF 다운로드 버튼
│   ├── LoadingSpinner.tsx      # 로딩 애니메이션 (태극)
│   └── ErrorBoundary.tsx       # 에러 처리
├── hooks/                      # 커스텀 훅
│   ├── useGemini.ts            # Gemini API (fetch 기반)
│   └── useSajuCalculation.ts   # 사주 계산 로직
├── utils/                      # 유틸리티 함수
│   ├── saju-calculator.ts      # 사주 계산 엔진 (만세력)
│   ├── lunar-converter.ts      # 음력/양력 변환
│   ├── gemini-prompts.ts       # AI 프롬프트 템플릿
│   ├── pdf-export.ts           # PDF 생성
│   └── constants.ts            # 천간/지지/오행 상수
├── types/                      # TypeScript 타입
│   ├── saju.ts                 # 사주 관련 타입
│   ├── lunar-javascript.d.ts   # lunar-javascript 타입 선언
│   └── vite-env.d.ts           # Vite 환경변수 타입
├── App.tsx                     # 메인 앱 (상태 관리)
├── main.tsx                    # 엔트리 포인트
└── index.css                   # 글로벌 스타일
```

## 📝 사주 계산 알고리즘

- **연주(年柱)**: 입춘(立春) 기준으로 계산
- **월주(月柱)**: 절기(節氣) 기준으로 계산
- **일주(日柱)**: 기원일(1900.1.1 경자일)로부터 일수 차이로 계산
- **시주(時柱)**: 일간과 시간대로 계산
- **대운(大運)**: 성별과 연간 음양에 따라 순행/역행 결정

## 🎨 디자인 & UI

### 색상 테마
- **배경**: 검정 (#0a0a0a) — 고급스럽고 신비로운 분위기
- **강조색**: 황금색 (#d4af37) — 동양적 우아함
- **오행별 색상**:
  - 木(목): 초록색 (#10b981)
  - 火(화): 빨강색 (#ef4444)
  - 土(토): 황색 (#eab308)
  - 金(금): 흰색 (#f5f5f5)
  - 水(수): 파랑색 (#3b82f6)

### 폰트
- **한글**: Noto Serif KR (명조체, 전통미)
- **기본 스택**: 'Noto Serif KR', serif

### 애니메이션
- 태극 회전 (로딩 스피너)
- 스트리밍 텍스트 커서
- 슬라이드 업 진입 애니메이션
- 페이드 인/아웃

## ⚠️ 주의사항

- 본 앱은 **오락 및 참고 목적**으로 제작되었습니다.
- 전통 명리학을 기반으로 하지만 AI 해석이므로 실제 전문가 상담을 대체하지 않습니다.
- API Key는 사용자가 직접 관리해야 하며, 외부 서버로 전송되지 않습니다.
- Gemini API Free Tier 제한에 유의하세요.

## 📄 라이선스

MIT License

## 🧪 테스트

```bash
# 유닛 테스트 실행
npm test

# 테스트 결과 (13개 모두 통과)
# ✓ saju-calculator.test.ts (13)
```

## 🚢 배포

### 로컬 프로덕션 빌드
```bash
npm run build
npm run preview
```

### Netlify/Vercel 배포
```bash
npm run build
# dist/ 폴더를 배포 대상으로 설정
```

## 🔍 주요 특징

### 정확한 사주 계산
- **만세력 기반**: 정통 사주 계산 알고리즘
- **입춘 기준**: 연주(年柱) 정확한 계산
- **절기 기준**: 월주(月柱) 절기로 계산
- **기원일 기준**: 일주(日柱)는 1900.1.1 경자일 기준

### AI 스트리밍 분석
- **Gemini 2.5 Flash**: 빠르고 정확한 분석
- **REST API**: SDK 헤더 오류 제거로 안정적
- **스트리밍**: 실시간 텍스트 생성으로 반응성 향상

### 사용자 친화적 UI
- **반응형 디자인**: 모바일/데스크톱 완벽 지원
- **다크 테마**: 눈 건강을 배려한 설계
- **한국어 지원**: 전체 UI/프롬프트 한국어

## 🙏 크레딧

- [Google Gemini API](https://ai.google.dev)
- [lunar-javascript](https://github.com/yangyixi/lunar-javascript) - 음력 변환
- [Tailwind CSS](https://tailwindcss.com) - 스타일링
- [Lucide Icons](https://lucide.dev) - 아이콘
- 전통 명리학 이론

---

**Made with ❤️ using React 18 + TypeScript 5 + Vite 5 + Gemini AI**

© 2025 지혜의 삶 (The Way of Wisdom)
