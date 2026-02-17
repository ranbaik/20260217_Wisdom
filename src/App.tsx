/**
 * 메인 앱 컴포넌트
 */

import { useState } from 'react';
import { Sparkles, Sun, Heart, Settings } from 'lucide-react';
import ErrorBoundary from './components/ErrorBoundary';
import ApiKeyInput from './components/ApiKeyInput';
import BirthInfoForm from './components/BirthInfoForm';
import SajuResult from './components/SajuResult';
import DailyFortune from './components/DailyFortune';
import CompatibilityForm from './components/CompatibilityForm';
import CompatibilityResult from './components/CompatibilityResult';
import { useGeminiApiKey } from './hooks/useGemini';
import { useSajuCalculation } from './hooks/useSajuCalculation';
import type { BirthInfo, SajuResult as SajuResultType } from './types/saju';

type ViewMode = 'main' | 'daily' | 'compatibility';

function App() {
  const { apiKey, status, isValidating, validateApiKey, clearApiKey } = useGeminiApiKey();
  const { sajuResult, calculate, reset } = useSajuCalculation();
  const [viewMode, setViewMode] = useState<ViewMode>('main');
  const [compatibilityPair, setCompatibilityPair] = useState<{
    person1: SajuResultType; person2: SajuResultType;
  } | null>(null);

  const handleBirthInfoSubmit = (info: BirthInfo) => {
    const r = calculate(info);
    if (r) setViewMode('main');
  };

  const handleCompatibilitySubmit = (b1: BirthInfo, b2: BirthInfo) => {
    const r1 = calculate(b1);
    const r2 = calculate(b2);
    if (r1 && r2) setCompatibilityPair({ person1: r1, person2: r2 });
  };

  const handleReset = () => { reset(); setViewMode('main'); setCompatibilityPair(null); };

  /* ── API Key 미인증 ── */
  if (!apiKey || !status.isValid) {
    return (
      <ErrorBoundary>
        <div className="min-h-screen flex flex-col items-center justify-center px-4"
             style={{ background: 'radial-gradient(ellipse at 50% 0%, rgba(212,175,55,0.08) 0%, #0a0a0a 60%)' }}>
          {/* 로고 영역 */}
          <div className="text-center mb-10 animate-fade-in">
            <div className="inline-flex items-center justify-center w-20 h-20 rounded-3xl mb-5"
                 style={{ background: 'linear-gradient(135deg, rgba(212,175,55,0.2), rgba(212,175,55,0.05))' }}>
              <Sparkles className="text-oriental-gold" size={40} />
            </div>
            <h1 className="text-4xl font-bold text-oriental-gold tracking-tight">지혜의 삶</h1>
            <p className="text-gray-500 mt-2 text-sm">AI로 분석하는 당신의 운명 · Gemini 2.5 Flash</p>
          </div>

          {/* API Key 입력 */}
          <div className="w-full max-w-md animate-slide-up">
            <ApiKeyInput
              apiKey={apiKey}
              status={status}
              isValidating={isValidating}
              onValidate={validateApiKey}
              onClear={clearApiKey}
            />
          </div>

          <p className="mt-8 text-gray-700 text-xs text-center">
            © 2026 지혜의 삶 · Powered by Google Gemini AI
          </p>
        </div>
      </ErrorBoundary>
    );
  }

  /* ── 메인 앱 ── */
  return (
    <ErrorBoundary>
      <div className="min-h-screen" style={{ background: '#0a0a0a' }}>

        {/* ── 헤더 ── */}
        <header className="sticky top-0 z-20 border-b border-oriental-gold/10 backdrop-blur-md"
                style={{ background: 'rgba(10,10,10,0.85)' }}>
          <div className="container mx-auto px-4 max-w-3xl h-14 flex items-center justify-between">
            {/* 로고 */}
            <div className="flex items-center gap-2">
              <Sparkles className="text-oriental-gold" size={22} />
              <span className="text-base font-bold text-oriental-gold">지혜의 삶</span>
            </div>

            {/* 탭 네비게이션 */}
            {sajuResult && (
              <nav className="flex items-center gap-1">
                {([
                  { mode: 'main' as ViewMode,          icon: <Sparkles size={14} />, label: '사주' },
                  { mode: 'daily' as ViewMode,         icon: <Sun size={14} />,      label: '오늘' },
                  { mode: 'compatibility' as ViewMode, icon: <Heart size={14} />,    label: '궁합' },
                ] as { mode: ViewMode; icon: React.ReactNode; label: string }[]).map(({ mode, icon, label }) => (
                  <button
                    key={mode}
                    onClick={() => { setViewMode(mode); setCompatibilityPair(null); }}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all duration-200
                      ${viewMode === mode
                        ? 'bg-oriental-gold text-black'
                        : 'text-gray-400 hover:text-white hover:bg-white/8'}`}
                  >
                    {icon}{label}
                  </button>
                ))}
                <button
                  onClick={clearApiKey}
                  title="API Key 변경"
                  className="ml-1 w-7 h-7 flex items-center justify-center rounded-lg text-gray-600 hover:text-gray-300 hover:bg-white/8 transition-all"
                >
                  <Settings size={13} />
                </button>
              </nav>
            )}
          </div>
        </header>

        {/* ── 메인 콘텐츠 ── */}
        <main className="container mx-auto px-4 py-8 max-w-3xl">
          {!sajuResult ? (
            <BirthInfoForm onSubmit={handleBirthInfoSubmit} />
          ) : (
            <>
              {viewMode === 'main' && (
                <SajuResult saju={sajuResult} apiKey={apiKey} onReset={handleReset} />
              )}
              {viewMode === 'daily' && (
                <DailyFortune saju={sajuResult} apiKey={apiKey} />
              )}
              {viewMode === 'compatibility' && (
                !compatibilityPair
                  ? <CompatibilityForm onSubmit={handleCompatibilitySubmit} />
                  : <CompatibilityResult
                      person1={compatibilityPair.person1}
                      person2={compatibilityPair.person2}
                      apiKey={apiKey}
                      onClose={() => setCompatibilityPair(null)}
                    />
              )}
            </>
          )}
        </main>

        {/* ── 푸터 ── */}
        <footer className="border-t border-white/5 py-6 mt-8">
          <p className="text-center text-gray-700 text-xs">
            © 2026 지혜의 삶 · Powered by Google Gemini AI ·
            <span className="ml-1">오락 및 참고 목적</span>
          </p>
        </footer>
      </div>
    </ErrorBoundary>
  );
}

export default App;
