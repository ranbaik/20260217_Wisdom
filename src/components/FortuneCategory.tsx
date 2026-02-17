/**
 * 운세 카테고리 아코디언 카드
 */

import { useState } from 'react';
import { ChevronDown } from 'lucide-react';

interface Props {
  title: string;
  emoji: string;
  content: string;
  defaultExpanded?: boolean;
  isStreaming?: boolean;
}

export default function FortuneCategory({
  title, emoji, content, defaultExpanded = false, isStreaming = false,
}: Props) {
  const [isOpen, setIsOpen] = useState(defaultExpanded);

  return (
    <div className="rounded-xl border border-white/8 overflow-hidden transition-all duration-200
                    hover:border-oriental-gold/25"
         style={{ background: 'rgba(255,255,255,0.02)' }}>
      {/* 헤더 */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between px-5 py-4
                   hover:bg-oriental-gold/5 transition-colors duration-150"
      >
        <div className="flex items-center gap-3">
          <span className="text-xl">{emoji}</span>
          <span className="font-semibold text-white text-sm">{title}</span>
        </div>
        <ChevronDown
          size={18}
          className={`text-oriental-gold/60 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`}
        />
      </button>

      {/* 본문 */}
      {isOpen && (
        <div className="px-5 pb-5 pt-1 border-t border-white/5">
          {content ? (
            <div className={`text-gray-300 text-sm leading-7 whitespace-pre-wrap${isStreaming ? ' streaming-cursor' : ''}`}>
              {content}
            </div>
          ) : (
            <div className="flex items-center gap-2 text-gray-600 text-sm py-2">
              <span className="w-3 h-3 border border-oriental-gold/30 border-t-oriental-gold rounded-full animate-spin" />
              분석 중...
            </div>
          )}
        </div>
      )}
    </div>
  );
}
