"use client";

import { Map as MapIcon, Play } from "lucide-react";
import { useCallback } from "react";
import { getSegmentTiming, getShowTiming } from "@/data/sets";
import type { ArchiveSet, ArchiveShow, TourCity } from "@/types/archive";

type CarModeProps = {
  cities: TourCity[];
  currentPlaybackId: string | null;
  onExit: () => void;
  onPlayShow: (city: TourCity, show: ArchiveShow) => void;
  onPlaySegment: (city: TourCity, show: ArchiveShow, set: ArchiveSet) => void;
};

// Drop a trailing ":00" seconds field so timestamps read like 28:04 not 28:04:00.
const shortTime = (timestamp: string) => timestamp.replace(/:00$/, "");

export function CarMode({ cities, currentPlaybackId, onExit, onPlayShow, onPlaySegment }: CarModeProps) {
  const jumpTo = useCallback((cityId: string) => {
    const target = document.getElementById(`car-city-${cityId}`);
    if (target) target.scrollIntoView({ behavior: "smooth", block: "start" });
  }, []);

  return (
    <div className="absolute inset-0 z-40 flex flex-col bg-[#05070b] text-white">
      {/* Top bar */}
      <header className="flex items-center justify-between gap-3 border-b border-white/10 bg-[#05070b] px-4 py-4 sm:px-6">
        <div className="min-w-0">
          <p className="font-mono text-[11px] uppercase tracking-[0.34em] text-cyanGlow/80">Car Mode</p>
          <h1 className="truncate text-lg font-semibold sm:text-xl">USB002 Live Archive</h1>
        </div>
        <button
          type="button"
          onClick={onExit}
          aria-label="Exit Car Mode and return to map"
          className="inline-flex shrink-0 items-center gap-2 rounded-2xl border border-white/15 bg-white/10 px-4 py-3 text-sm font-semibold uppercase tracking-[0.12em] transition active:scale-[0.97] sm:text-base"
        >
          <MapIcon size={18} />
          Map
        </button>
      </header>

      {/* Quick-jump city navigation */}
      <nav
        aria-label="Jump to city"
        className="flex gap-2 overflow-x-auto border-b border-white/10 bg-[#05070b] px-4 py-3 [scrollbar-width:none] sm:px-6 [&::-webkit-scrollbar]:hidden"
      >
        {cities.map((city) => (
          <button
            key={city.id}
            type="button"
            onClick={() => jumpTo(city.id)}
            className="shrink-0 whitespace-nowrap rounded-full border border-white/15 bg-white/[0.06] px-4 py-2.5 text-sm font-semibold transition active:scale-[0.96] sm:text-base"
          >
            {city.city}
          </button>
        ))}
      </nav>

      {/* Scrollable city list */}
      <div className="relative flex-1 overflow-y-auto overscroll-contain px-4 pb-[300px] pt-4 sm:px-6 sm:pb-[220px]">
        <div className="mx-auto flex max-w-2xl flex-col gap-8">
          {cities.map((city) => {
            const multiShow = city.shows.length > 1;

            return (
              <section key={city.id} id={`car-city-${city.id}`} className="scroll-mt-4">
                <div className="mb-3 flex items-baseline justify-between gap-3">
                  <h2 className="text-3xl font-extrabold uppercase leading-none tracking-tight sm:text-4xl">{city.city}</h2>
                  <span className="font-mono text-xs uppercase tracking-[0.2em] text-white/45">{city.country}</span>
                </div>

                <div className="flex flex-col gap-5">
                  {city.shows.map((show) => {
                    const showTiming = getShowTiming(show);
                    const isShowPlaying = currentPlaybackId === `show:${show.id}`;

                    return (
                      <div key={show.id} className="flex flex-col gap-2.5">
                        {multiShow ? (
                          <p className="px-1 text-lg font-bold text-white/85">{show.name}</p>
                        ) : null}

                        <button
                          type="button"
                          onClick={() => onPlayShow(city, show)}
                          className={`flex min-h-[68px] w-full items-center gap-4 rounded-2xl px-5 text-left transition active:scale-[0.99] ${
                            isShowPlaying
                              ? "bg-cyanGlow text-black shadow-glow"
                              : "bg-cyanGlow/15 text-white ring-1 ring-inset ring-cyanGlow/40 hover:bg-cyanGlow/25"
                          }`}
                        >
                          <span
                            className={`grid size-12 shrink-0 place-items-center rounded-full ${
                              isShowPlaying ? "bg-black/15 text-black" : "bg-cyanGlow/25 text-cyanGlow"
                            }`}
                          >
                            <Play size={22} fill="currentColor" />
                          </span>
                          <span className="min-w-0">
                            <span className="block text-lg font-bold leading-tight">Play Full Show</span>
                            <span className={`block font-mono text-xs ${isShowPlaying ? "text-black/70" : "text-white/55"}`}>
                              {shortTime(showTiming.startTimestamp)} – {shortTime(showTiming.endTimestamp)}
                            </span>
                          </span>
                        </button>

                        <ul className="flex flex-col gap-2">
                          {show.sets.map((set) => {
                            const isPlaying = currentPlaybackId === `set:${set.id}`;
                            const segmentTiming = getSegmentTiming(show, set);

                            return (
                              <li key={set.id}>
                                <button
                                  type="button"
                                  onClick={() => onPlaySegment(city, show, set)}
                                  className={`flex min-h-[60px] w-full items-center justify-between gap-4 rounded-xl border px-5 py-3 text-left transition active:scale-[0.99] ${
                                    isPlaying
                                      ? "border-cyanGlow/70 bg-cyanGlow/15 text-cyanGlow"
                                      : "border-white/12 bg-white/[0.04] text-white hover:bg-white/[0.08]"
                                  }`}
                                  aria-label={`Play ${set.artist} at ${shortTime(set.timestamp)}`}
                                >
                                  <span className="flex min-w-0 items-center gap-3">
                                    <span
                                      className={`grid size-9 shrink-0 place-items-center rounded-full ${
                                        isPlaying ? "bg-cyanGlow text-black" : "bg-white/10 text-white/80"
                                      }`}
                                    >
                                      <Play size={15} fill="currentColor" />
                                    </span>
                                    <span className="truncate text-base font-medium sm:text-lg">{set.artist}</span>
                                  </span>
                                  <span className={`shrink-0 font-mono text-sm ${isPlaying ? "text-cyanGlow" : "text-white/45"}`}>
                                    {shortTime(segmentTiming.startTimestamp)}
                                  </span>
                                </button>
                              </li>
                            );
                          })}
                        </ul>
                      </div>
                    );
                  })}
                </div>
              </section>
            );
          })}
        </div>
      </div>
    </div>
  );
}
