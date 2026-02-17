/**
 * 에러 바운더리 컴포넌트
 */

import { Component, ReactNode } from 'react';
import { AlertTriangle } from 'lucide-react';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export default class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('Error caught by boundary:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-oriental-dark flex items-center justify-center p-4">
          <div className="bg-red-900/20 border-2 border-red-500 rounded-xl p-8 max-w-lg text-center">
            <AlertTriangle className="text-red-500 mx-auto mb-4" size={48} />
            <h2 className="text-2xl font-bold text-red-400 mb-4">
              오류가 발생했습니다
            </h2>
            <p className="text-gray-300 mb-4">
              {this.state.error?.message || '알 수 없는 오류가 발생했습니다.'}
            </p>
            <button
              onClick={() => window.location.reload()}
              className="px-6 py-2 bg-oriental-gold text-black font-semibold rounded-lg hover:bg-oriental-gold/90 transition-colors"
            >
              페이지 새로고침
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
