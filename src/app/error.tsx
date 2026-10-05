"use client";

import { useEffect } from "react";
import Link from "next/link";
import { AlertTriangle, RotateCcw } from "lucide-react";

export default function ErrorBoundary({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log the error to an error reporting service in production
    console.error("Global Error Boundary caught:", error);
  }, [error]);

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center p-4 text-center">
      <div className="bg-secondary/30 border border-border rounded-2xl p-8 max-w-md w-full backdrop-blur-md shadow-2xl">
        <div className="mx-auto bg-red-500/10 w-16 h-16 rounded-full flex items-center justify-center mb-6">
          <AlertTriangle className="h-8 w-8 text-red-500" />
        </div>
        <h1 className="text-2xl font-bold text-white mb-2">Oops! Something went wrong.</h1>
        <p className="text-muted-foreground mb-6 text-sm">
          We encountered an unexpected error on our servers. This usually happens if the database is temporarily unreachable.
        </p>
        
        {error.digest && (
          <div className="mb-6 bg-black/40 p-3 rounded-md border border-white/5 text-xs text-left overflow-hidden">
            <span className="text-gray-500 block mb-1">Error Digest:</span>
            <code className="text-red-400">{error.digest}</code>
          </div>
        )}

        <div className="flex flex-col space-y-3">
          <button
            onClick={() => reset()}
            className="w-full flex items-center justify-center py-3 px-4 bg-primary hover:bg-primary/90 text-white rounded-md font-semibold transition-all shadow-lg hover:shadow-primary/50"
          >
            <RotateCcw className="h-4 w-4 mr-2" />
            Try Again
          </button>
          
          <Link
            href="/"
            className="w-full flex items-center justify-center py-3 px-4 bg-transparent border border-border hover:bg-secondary text-white rounded-md font-medium transition-all"
          >
            Return to Home
          </Link>
        </div>
      </div>
    </div>
  );
}
