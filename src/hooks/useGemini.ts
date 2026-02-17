/**
 * Gemini AI API 연동 커스텀 훅
 * - @google/generative-ai SDK 대신 fetch REST API 직접 호출
 *   (SDK의 non-ISO-8859-1 헤더 오류 우회)
 */

import { useState, useCallback } from 'react';
import type { ApiKeyStatus } from '../types/saju';

const MODEL_NAME = 'gemini-2.0-flash';
const API_BASE   = 'https://generativelanguage.googleapis.com/v1beta/models';

/** .env VITE_GEMINI_API_KEY (빌드 시 주입) — 플레이스홀더는 무시 */
const _rawEnvKey = (import.meta.env.VITE_GEMINI_API_KEY as string) || '';
const ENV_API_KEY = _rawEnvKey.startsWith('AIza') ? _rawEnvKey : '';

/* ─────────────────────────────────────────
   내부 유틸: fetch 기반 단순 생성
───────────────────────────────────────── */
async function geminiGenerate(apiKey: string, prompt: string): Promise<string> {
  const url = `${API_BASE}/${MODEL_NAME}:generateContent?key=${apiKey}`;
  const res = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      contents: [{ parts: [{ text: prompt }] }],
    }),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error((err as { error?: { message?: string } }).error?.message ?? `HTTP ${res.status}`);
  }
  const data = await res.json() as {
    candidates?: { content?: { parts?: { text?: string }[] } }[];
  };
  return data.candidates?.[0]?.content?.parts?.[0]?.text ?? '';
}

/* ─────────────────────────────────────────
   내부 유틸: fetch 기반 스트리밍 생성
───────────────────────────────────────── */
async function* geminiStream(apiKey: string, prompt: string): AsyncGenerator<string> {
  const url = `${API_BASE}/${MODEL_NAME}:streamGenerateContent?alt=sse&key=${apiKey}`;
  const res = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      contents: [{ parts: [{ text: prompt }] }],
    }),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error((err as { error?: { message?: string } }).error?.message ?? `HTTP ${res.status}`);
  }
  const reader  = res.body!.getReader();
  const decoder = new TextDecoder();
  let buffer = '';

  while (true) {
    const { done, value } = await reader.read();
    if (done) break;
    buffer += decoder.decode(value, { stream: true });

    const lines = buffer.split('\n');
    buffer = lines.pop() ?? '';           // 마지막 미완성 줄은 버퍼에 보관

    for (const line of lines) {
      if (!line.startsWith('data: ')) continue;
      const json = line.slice(6).trim();
      if (json === '[DONE]') return;
      try {
        const chunk = JSON.parse(json) as {
          candidates?: { content?: { parts?: { text?: string }[] } }[];
        };
        const text = chunk.candidates?.[0]?.content?.parts?.[0]?.text ?? '';
        if (text) yield text;
      } catch {
        // JSON 파싱 실패 줄은 무시
      }
    }
  }
}

/* ─────────────────────────────────────────
   훅: API Key 관리 및 검증
───────────────────────────────────────── */
export function useGeminiApiKey() {
  const [apiKey, setApiKey] = useState<string>(() =>
    sessionStorage.getItem('gemini-api-key') || ENV_API_KEY
  );

  const [status, setStatus] = useState<ApiKeyStatus>(() => ({
    isValid: !!(sessionStorage.getItem('gemini-api-key') || ENV_API_KEY),
  }));

  const [isValidating, setIsValidating] = useState(false);

  const saveApiKey = useCallback((key: string) => {
    setApiKey(key);
    sessionStorage.setItem('gemini-api-key', key);
  }, []);

  const clearApiKey = useCallback(() => {
    sessionStorage.removeItem('gemini-api-key');
    if (ENV_API_KEY) {
      setApiKey(ENV_API_KEY);
      setStatus({ isValid: true });
    } else {
      setApiKey('');
      setStatus({ isValid: false });
    }
  }, []);

  const validateApiKey = useCallback(async (key: string): Promise<boolean> => {
    setIsValidating(true);
    try {
      const text = await geminiGenerate(key, 'Hello');
      if (text) {
        setStatus({ isValid: true });
        saveApiKey(key);
        return true;
      }
      setStatus({ isValid: false, error: 'API 응답이 올바르지 않습니다.' });
      return false;
    } catch (error) {
      const msg = error instanceof Error ? error.message : 'API Key 검증 실패';
      setStatus({ isValid: false, error: msg });
      return false;
    } finally {
      setIsValidating(false);
    }
  }, [saveApiKey]);

  return { apiKey, status, isValidating, saveApiKey, clearApiKey, validateApiKey };
}

/* ─────────────────────────────────────────
   훅: 스트리밍 응답 처리
───────────────────────────────────────── */
export function useGeminiStream() {
  const [isStreaming, setIsStreaming]   = useState(false);
  const [streamedText, setStreamedText] = useState('');
  const [error, setError]               = useState<string | null>(null);

  const generateStream = useCallback(async (
    apiKey: string,
    prompt: string,
    onChunk?: (text: string) => void,
  ): Promise<string> => {
    setIsStreaming(true);
    setStreamedText('');
    setError(null);

    try {
      let fullText = '';
      for await (const chunk of geminiStream(apiKey, prompt)) {
        fullText += chunk;
        setStreamedText(fullText);
        onChunk?.(fullText);
      }
      setIsStreaming(false);
      return fullText;
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'AI 분석 중 오류가 발생했습니다.';
      setError(msg);
      setIsStreaming(false);
      throw new Error(msg);
    }
  }, []);

  const reset = useCallback(() => {
    setStreamedText('');
    setError(null);
    setIsStreaming(false);
  }, []);

  return { isStreaming, streamedText, error, generateStream, reset };
}
