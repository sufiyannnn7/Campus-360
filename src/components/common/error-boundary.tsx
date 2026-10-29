/**
 * Enhanced Error Boundary Component
 * 
 * Catches unhandled React rendering errors, reports diagnostics,
 * and provides user recovery actions without a full page crash.
 */

import React, { Component, ErrorInfo, ReactNode } from "react";
import { Button } from "@/components/ui/button";
import { AlertTriangle, RefreshCw, Home } from "lucide-react";

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
    errorInfo: null,
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error, errorInfo: null };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    this.setState({ errorInfo });
    console.error("ErrorBoundary caught an unhandled error:", error, errorInfo);
  }

  public handleReset = () => {
    this.setState({ hasError: false, error: null, errorInfo: null });
  };

  public handleGoHome = () => {
    this.handleReset();
    window.location.href = "/";
  };

  public render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <div className="flex min-h-[70vh] flex-col items-center justify-center p-6 text-center bg-background text-foreground animate-in fade-in-50 duration-200">
          <div className="h-16 w-16 rounded-2xl bg-destructive/10 text-destructive flex items-center justify-center mb-4 ring-8 ring-destructive/5">
            <AlertTriangle className="h-8 w-8" />
          </div>

          <h1 className="text-2xl font-black tracking-tight mb-2">Something unexpected happened</h1>
          <p className="text-sm text-muted-foreground max-w-md mb-6 leading-relaxed">
            {this.state.error?.message || "An unexpected error occurred while rendering this view."}
          </p>

          <div className="flex items-center gap-3">
            <Button
              onClick={this.handleReset}
              variant="default"
              size="sm"
              className="font-bold text-xs gap-2 shadow-sm"
            >
              <RefreshCw className="h-3.5 w-3.5" /> Try Again
            </Button>
            <Button
              onClick={this.handleGoHome}
              variant="outline"
              size="sm"
              className="font-bold text-xs gap-2"
            >
              <Home className="h-3.5 w-3.5" /> Return Home
            </Button>
          </div>

          {process.env.NODE_ENV !== "production" && this.state.errorInfo && (
            <details className="mt-8 text-left max-w-xl w-full p-4 rounded-xl bg-muted/60 border text-xs font-mono text-muted-foreground overflow-auto max-h-48">
              <summary className="font-semibold cursor-pointer mb-2 text-foreground">Stack Trace Details</summary>
              <pre className="whitespace-pre-wrap">{this.state.error?.stack}</pre>
              <pre className="whitespace-pre-wrap mt-2">{this.state.errorInfo.componentStack}</pre>
            </details>
          )}
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
