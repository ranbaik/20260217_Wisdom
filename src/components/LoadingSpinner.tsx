/**
 * 로딩 스피너 — 태극(太極) 문양
 */

interface Props {
  message?: string;
}

export default function LoadingSpinner({ message = '사주를 분석하고 있습니다...' }: Props) {
  return (
    <div className="flex flex-col items-center justify-center py-14 gap-6">
      <div className="relative w-16 h-16 animate-taeguek">
        <div className="absolute inset-0 rounded-full border border-oriental-gold/20" />
        <div className="absolute inset-0 rounded-full overflow-hidden">
          <div className="absolute left-0 top-0 w-1/2 h-full bg-red-800/70" />
          <div className="absolute right-0 top-0 w-1/2 h-full bg-blue-800/70" />
        </div>
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-1/2 h-1/2 rounded-full bg-red-800/70" />
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-1/2 h-1/2 rounded-full bg-blue-800/70" />
        <div className="absolute inset-[32%] rounded-full bg-oriental-dark" />
      </div>
      <p className="text-oriental-gold/70 text-sm font-medium animate-pulse">{message}</p>
    </div>
  );
}
