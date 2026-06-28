"use client";

import dynamic from "next/dynamic";

const ArchiveMap = dynamic(() => import("@/components/ArchiveMap"), {
  ssr: false,
  loading: () => (
    <main className="grid min-h-screen place-items-center bg-ink text-white">
      <div className="text-center">
        <p className="font-mono text-xs uppercase tracking-[0.36em] text-cyanGlow/70">USB002</p>
        <h1 className="mt-4 text-3xl font-semibold">Fred again.. USB002 Live Archive</h1>
      </div>
    </main>
  ),
});

export function ArchiveMapLoader() {
  return <ArchiveMap />;
}
