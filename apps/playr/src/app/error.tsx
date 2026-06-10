"use client";

import { useEffect } from "react";
import Link from "next/link";
import { logger } from "@playr/nectar-core";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error("Global Error Boundary caught:", error);
    logger.captureException(error);
  }, [error]);

  return (
    <div className="min-h-[80vh] flex flex-col items-center justify-center bg-zinc-950 text-white px-4 text-center">
      <div className="w-20 h-20 mb-8 rounded-full bg-red-500/20 flex items-center justify-center">
        <span className="material-symbols-outlined text-4xl text-red-500">warning</span>
      </div>
      <h2 className="text-4xl font-black tracking-tighter mb-4">We encountered an issue.</h2>
      <p className="text-zinc-400 max-w-md mx-auto mb-8">
        Our services are currently experiencing a temporary disruption. We have logged the error and our engineers are investigating.
      </p>
      
      <div className="flex gap-4">
        <button
          onClick={() => reset()}
          className="bg-white text-black font-bold uppercase tracking-widest text-xs px-8 py-4 rounded-full hover:bg-zinc-200 transition-colors"
        >
          Try Again
        </button>
        <Link href="/">
          <button className="bg-transparent border border-zinc-800 text-white font-bold uppercase tracking-widest text-xs px-8 py-4 rounded-full hover:bg-zinc-900 transition-colors">
            Go Home
          </button>
        </Link>
      </div>
    </div>
  );
}
