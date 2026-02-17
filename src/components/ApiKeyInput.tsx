/**
 * Gemini API Key 입력 컴포넌트
 */

import { useState } from 'react';
import { Key, ExternalLink, AlertCircle, CheckCircle, Eye, EyeOff } from 'lucide-react';
import type { ApiKeyStatus } from '../types/saju';

interface Props {
  status: ApiKeyStatus;
  isValidating: boolean;
  onValidate: (key: string) => Promise<boolean>;
  onClear: () => void;
  apiKey: string;
}

export default function ApiKeyInput({ status, isValidating, onValidate, onClear, apiKey }: Props) {
  const [inputValue, setInputValue] = useState('');
  const [showKey, setShowKey] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (inputValue.trim()) {
      await onValidate(inputValue.trim());
    }
  };

  /* ── 인증 완료 상태 ── */
  if (apiKey && status.isValid) {
    return (
      <div className="flex items-center justify-between px-5 py-4 rounded-2xl border border-green-500/40 bg-green-950/30 animate-fade-in">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-green-500/20 flex items-center justify-center">
            <CheckCircle className="text-green-400" size={18} />
          </div>
          <div>
            <p className="text-green-300 font-semibold text-sm">API Key 인증 완료</p>
            <p className="text-green-500/70 text-xs">Gemini AI와 연결되었습니다</p>
          </div>
        </div>
        <button
          onClick={onClear}
          className="text-xs text-gray-500 hover:text-red-400 transition-colors underline underline-offset-2"
        >
          제거
        </button>
      </div>
    );
  }

  /* ── 입력 폼 ── */
  return (
    <div className="rounded-2xl border border-oriental-gold/25 overflow-hidden animate-fade-in"
         style={{ background: 'linear-gradient(135deg, rgba(212,175,55,0.06) 0%, rgba(0,0,0,0) 60%)' }}>

      {/* 헤더 */}
      <div className="px-6 pt-6 pb-4 border-b border-oriental-gold/15">
        <div className="flex items-center gap-3 mb-1">
          <div className="w-9 h-9 rounded-xl bg-oriental-gold/15 flex items-center justify-center">
            <Key className="text-oriental-gold" size={18} />
          </div>
          <h2 className="text-xl font-bold text-oriental-gold">Gemini API Key</h2>
        </div>
        <p className="text-gray-400 text-sm ml-12">
          사주 분석을 위해 Google AI Studio API Key가 필요합니다
        </p>
      </div>

      {/* 입력 영역 */}
      <div className="px-6 py-5 space-y-4">
        <form onSubmit={handleSubmit} className="space-y-3">
          {/* 키 입력 필드 */}
          <div className="relative">
            <input
              type={showKey ? 'text' : 'password'}
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder="AIza..."
              className="w-full px-4 py-3 pr-12 rounded-xl text-white placeholder-gray-600
                         bg-white/5 border border-white/10
                         focus:outline-none focus:border-oriental-gold/60
                         transition-all duration-200 text-sm"
              disabled={isValidating}
            />
            <button
              type="button"
              onClick={() => setShowKey(!showKey)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-300 transition-colors"
            >
              {showKey ? <EyeOff size={16} /> : <Eye size={16} />}
            </button>
          </div>

          {/* 에러 메시지 */}
          {status.error && (
            <div className="flex items-start gap-2 px-4 py-3 rounded-xl bg-red-950/40 border border-red-500/30">
              <AlertCircle className="text-red-400 flex-shrink-0 mt-0.5" size={16} />
              <p className="text-red-300 text-sm leading-relaxed">{status.error}</p>
            </div>
          )}

          {/* 버튼 행 */}
          <div className="flex gap-2">
            <button
              type="submit"
              disabled={isValidating || !inputValue.trim()}
              className="flex-1 py-3 rounded-xl font-bold text-sm transition-all duration-200
                         bg-oriental-gold text-black hover:bg-oriental-gold-light
                         disabled:bg-gray-700 disabled:text-gray-500 disabled:cursor-not-allowed
                         active:scale-[0.98]"
            >
              {isValidating ? (
                <span className="flex items-center justify-center gap-2">
                  <span className="w-3.5 h-3.5 border-2 border-black/30 border-t-black rounded-full animate-spin" />
                  검증 중...
                </span>
              ) : '확인'}
            </button>

            <a
              href="https://aistudio.google.com/apikey"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 px-4 py-3 rounded-xl text-sm font-semibold
                         border border-white/10 text-gray-300 hover:text-white hover:border-white/20
                         transition-all duration-200"
            >
              <ExternalLink size={14} />
              발급
            </a>
          </div>
        </form>

        {/* 안내 */}
        <div className="px-4 py-3 rounded-xl bg-white/3 border border-white/8">
          <p className="text-gray-500 text-xs leading-5">
            🔒 API Key는 브라우저 세션에만 저장되며 외부 서버로 전송되지 않습니다.
            <br />
            발급 → <span className="text-oriental-gold">aistudio.google.com/apikey</span> 에서 무료 발급 가능
          </p>
        </div>
      </div>
    </div>
  );
}
