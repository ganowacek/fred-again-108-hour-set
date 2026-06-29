"use client";

import { ChevronDown, Clock3, ListMusic, Play, Radio } from "lucide-react";
import { useEffect, useState } from "react";
import { getSegmentTiming, getShowTiming } from "@/data/sets";
import type { ArchiveSet, ArchiveShow, TourCity } from "@/types/archive";

type CityDrawerProps = {
  city: TourCity;
  currentPlaybackId: string | null;
  isLight: boolean;
  onPlayFullShow: (show: ArchiveShow) => void;
  onPlaySegment: (show: ArchiveShow, set: ArchiveSet) => void;
};

export function CityDrawer({ city, currentPlaybackId, isLight, onPlayFullShow, onPlaySegment }: CityDrawerProps) {
  const [expandedShowIds, setExpandedShowIds] = useState<string[]>([city.shows[0].id]);

  useEffect(() => {
    setExpandedShowIds([city.shows[0].id]);
  }, [city.id, city.shows]);

  const toggleShow = (showId: string) => {
    setExpandedShowIds((current) =>
      current.includes(showId) ? current.filter((id) => id !== showId) : [...current, showId],
    );
  };

  const t = {
    shell: isLight ? "border-slate-200 bg-white/92" : "border-white/12 bg-[#080b10]/88",
    headBorder: isLight ? "border-slate-200" : "border-white/10",
    eyebrow: isLight ? "text-cyan-600" : "text-cyanGlow/70",
    cityName: isLight ? "text-slate-900" : "text-white",
    badge: isLight ? "border-slate-200 bg-slate-100 text-slate-600" : "border-white/10 bg-white/8 text-white/70",
    subtle: isLight ? "text-slate-500" : "text-white/58",
    showIdle: isLight ? "border-slate-200 bg-slate-50" : "border-white/9 bg-white/[0.055]",
    showHover: isLight ? "hover:bg-slate-100" : "hover:bg-white/[0.045]",
    showName: isLight ? "text-slate-900" : "text-white",
    showTime: isLight ? "text-slate-500" : "text-white/55",
    chevron: isLight ? "text-slate-400" : "text-white/55",
    innerBorder: isLight ? "border-slate-200" : "border-white/10",
    fullIdle: isLight
      ? "border-cyan-300 bg-cyan-50 text-slate-900 hover:border-cyan-400 hover:bg-cyan-100"
      : "border-cyanGlow/35 bg-cyanGlow/12 text-white hover:border-cyanGlow/70 hover:bg-cyanGlow/18",
    fullSub: isLight ? "text-cyan-700" : "text-cyanGlow/80",
    listLabel: isLight ? "text-slate-400" : "text-white/42",
    divide: isLight ? "divide-slate-200" : "divide-white/8",
    segIdle: isLight ? "text-slate-900" : "text-white",
    segTime: isLight ? "text-slate-500" : "text-white/50",
    segBtnIdle: isLight
      ? "border-slate-300 bg-white text-slate-700 hover:border-cyan-400 hover:text-cyan-600"
      : "border-white/12 bg-black/20 text-white hover:border-cyanGlow/55 hover:text-cyanGlow",
  };

  return (
    <aside
      className={`absolute bottom-[206px] right-4 top-auto z-50 flex max-h-[42vh] w-[calc(100%-2rem)] flex-col overflow-hidden rounded border shadow-2xl backdrop-blur-2xl sm:bottom-[220px] sm:right-6 sm:max-h-[48vh] sm:w-[420px] lg:bottom-[172px] lg:right-8 lg:top-8 lg:max-h-[calc(100vh-220px)] ${t.shell}`}
    >
      <div className={`border-b px-5 py-5 ${t.headBorder}`}>
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className={`font-mono text-[10px] uppercase tracking-[0.32em] ${t.eyebrow}`}>{city.country}</p>
            <h2 className={`mt-2 text-2xl font-semibold ${t.cityName}`}>{city.city}</h2>
          </div>
          <span className={`rounded-full border px-3 py-1.5 font-mono text-xs ${t.badge}`}>
            {city.shows.reduce((count, show) => count + show.sets.length, 0)} sets
          </span>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto px-3 py-3">
        <div className={`mb-2 flex items-center gap-2 px-2 text-sm ${t.subtle}`}>
          <Radio size={15} />
          <span>{city.shows.length === 1 ? "1 show" : `${city.shows.length} nights`} mapped from parent timestamps</span>
        </div>

        <div className="space-y-2">
          {city.shows.map((show) => {
            const timing = getShowTiming(show);
            const isExpanded = expandedShowIds.includes(show.id);
            const showPlaybackId = `show:${show.id}`;
            const isShowPlaying = currentPlaybackId === showPlaybackId;

            return (
              <article
                key={show.id}
                className={`overflow-hidden rounded border transition ${
                  isShowPlaying
                    ? isLight
                      ? "border-cyan-400 bg-cyan-50"
                      : "border-cyanGlow/50 bg-cyanGlow/10 shadow-glow"
                    : t.showIdle
                }`}
              >
                <button
                  onClick={() => toggleShow(show.id)}
                  className={`flex w-full items-center justify-between gap-3 px-4 py-3 text-left transition ${t.showHover}`}
                  aria-expanded={isExpanded}
                >
                  <span className="min-w-0">
                    <span className={`block text-base font-semibold ${t.showName}`}>{show.name}</span>
                    <span className={`mt-1 flex items-center gap-2 font-mono text-xs ${t.showTime}`}>
                      <Clock3 size={13} />
                      {timing.startTimestamp} – {timing.endTimestamp}
                    </span>
                  </span>
                  <ChevronDown size={18} className={`shrink-0 transition ${t.chevron} ${isExpanded ? "rotate-180" : ""}`} />
                </button>

                {isExpanded ? (
                  <div className={`border-t px-3 pb-3 pt-3 ${t.innerBorder}`}>
                    <button
                      onClick={() => onPlayFullShow(show)}
                      className={`mb-3 flex w-full items-center justify-between gap-3 rounded border px-4 py-3 text-left transition ${
                        isShowPlaying ? "border-cyanGlow/70 bg-cyanGlow text-black" : t.fullIdle
                      }`}
                    >
                      <span className="min-w-0">
                        <span className="block text-sm font-semibold">Play Full Show</span>
                        <span className={`mt-1 block font-mono text-xs ${isShowPlaying ? "text-black/65" : t.fullSub}`}>
                          Full Show · {timing.startTimestamp} – {timing.endTimestamp}
                        </span>
                      </span>
                      <span className="grid size-10 shrink-0 place-items-center rounded-full border border-current/30">
                        <Play size={16} fill="currentColor" />
                      </span>
                    </button>

                    <div className={`mb-2 flex items-center gap-2 px-1 text-xs font-medium uppercase tracking-[0.18em] ${t.listLabel}`}>
                      <ListMusic size={14} />
                      Tracklist / Segments
                    </div>

                    <div className={`divide-y ${t.divide}`}>
                      {show.sets.map((set) => {
                        const segmentTiming = getSegmentTiming(show, set);
                        const segmentPlaybackId = `set:${set.id}`;
                        const isSegmentPlaying = currentPlaybackId === segmentPlaybackId;

                        return (
                          <div
                            key={set.id}
                            className={`grid grid-cols-[1fr_auto] gap-3 px-1 py-3 transition ${
                              isSegmentPlaying ? (isLight ? "text-cyan-600" : "text-cyanGlow") : t.segIdle
                            }`}
                          >
                            <div className="min-w-0">
                              <h3 className="break-words text-sm font-medium leading-5">{set.artist}</h3>
                              <p className={`mt-1 inline-flex items-center gap-2 font-mono text-xs ${t.segTime}`}>
                                <Clock3 size={13} />
                                {segmentTiming.startTimestamp} – {segmentTiming.endTimestamp}
                              </p>
                            </div>
                            <button
                              onClick={() => onPlaySegment(show, set)}
                              className={`grid size-9 place-items-center rounded-full border transition ${
                                isSegmentPlaying ? "border-cyanGlow/70 bg-cyanGlow text-black" : t.segBtnIdle
                              }`}
                              aria-label={`Play ${set.artist}`}
                            >
                              <Play size={15} fill="currentColor" />
                            </button>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                ) : null}
              </article>
            );
          })}
        </div>
      </div>
    </aside>
  );
}
