"use client";

import { Component, ReactNode } from "react";

interface Props { children: ReactNode }
interface State { hasError: boolean; message: string }

export class ErrorBoundary extends Component<Props, State> {
  state: State = { hasError: false, message: "" };

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, message: error.message };
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="flex flex-col items-center justify-center min-h-dvh gap-4 px-6 text-center">
          <div className="text-5xl">⚠️</div>
          <h2 className="font-bold text-lg">Có lỗi xảy ra</h2>
          <p className="text-sm text-muted-foreground">{this.state.message}</p>
          <button
            onClick={() => window.location.reload()}
            className="mt-2 px-6 py-3 rounded-2xl bg-primary text-primary-foreground font-medium"
          >
            Tải lại
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}
