"use client";

import { ExternalLink, Play, PlayCircle } from "lucide-react";
import { youtubeVideoId } from "@/data/sets";
import type { PlayerSelection } from "@/types/archive";

type PlayerDockProps = {
  selection: PlayerSelection;
};

export function PlayerDock({ selection }: PlayerDockProps) {
  const youtubeUrl = `https://www.youtube.com/watch?v=${youtubeVideoId}&t=${selection.startSeconds}s`;
  const thumbnailUrl = `https://i.ytimg.com/vi/${youtubeVideoId}/hqdefault.jpg`;
  const playbackLabel = selection.mode === "show" ? "Full show" : "Segment";

  return (
    <section className="absolute inset-x-4 bottom-4 z-50 overflow-hidden rounded border border-white/12 bg-[#06080d]/94 shadow-2xl backdrop-blur-2xl sm:inset-x-6 lg:left-auto lg:right-8 lg:w-[560px]">
      <div className="grid min-h-[154px] grid-cols-[132px_1fr] gap-0 sm:grid-cols-[230px_1fr]">
        <a
          href={youtubeUrl}
          target="_blank"
          rel="noreferrer"
          className="group relative isolate flex min-h-[154px] items-center justify-center overflow-hidden bg-black"
          aria-label={`Open ${selection.title} on YouTube`}
        >
          <div
            className="absolute inset-0 scale-105 bg-cover bg-center opacity-52 blur-[1px] transition group-hover:scale-110 group-hover:opacity-68"
            style={{ backgroundImage: `url(${thumbnailUrl})` }}
          />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(121,243,255,0.28),rgba(5,7,11,0.58)_45%,rgba(5,7,11,0.92))]" />
          <span className="relative grid size-14 place-items-center rounded-full border border-white/30 bg-white/12 text-white shadow-glow backdrop-blur transition group-hover:scale-105 group-hover:border-cyanGlow/70 group-hover:text-cyanGlow">
            <Play size={22} fill="currentColor" />
          </span>
          <span className="absolute bottom-3 left-3 right-3 rounded-full border border-white/12 bg-black/55 px-3 py-1.5 text-center font-mono text-[10px] uppercase tracking-[0.2em] text-white/78 backdrop-blur">
            Watch on YouTube
          </span>
        </a>
        <div className="flex min-w-0 flex-col justify-between gap-3 p-3 sm:gap-4 sm:p-4">
          <div className="min-w-0">
            <p className="flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.28em] text-cyanGlow/75">
              <PlayCircle size={14} />
              Now playing
            </p>
            <h2 className="mt-2 break-words text-sm font-semibold leading-5 text-white sm:text-lg sm:leading-6">{selection.title}</h2>
            <p className="mt-1 text-xs leading-5 text-white/58 sm:text-sm">
              {selection.city.city} · {selection.show.name} · {playbackLabel} · {selection.timestamp} – {selection.endTimestamp}
            </p>
          </div>
          <a
            href={youtubeUrl}
            target="_blank"
            rel="noreferrer"
            className="inline-flex w-fit items-center gap-2 rounded-full border border-cyanGlow/40 bg-cyanGlow/12 px-3 py-2 text-xs text-white transition hover:border-cyanGlow/70 hover:bg-cyanGlow/18 hover:text-cyanGlow sm:text-sm"
          >
            Play on YouTube
            <ExternalLink size={14} />
          </a>
        </div>
      </div>
    </section>
  );
}
