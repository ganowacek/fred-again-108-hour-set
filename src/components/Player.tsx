"use client";

import { ChevronDown, ChevronUp, Music2, Pause, Play, RotateCcw, RotateCw, SkipBack, SkipForward, Youtube } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { youtubeVideoId } from "@/data/sets";
import type { PlayerSelection } from "@/types/archive";

/* eslint-disable @typescript-eslint/no-explicit-any */
declare global {
  interface Window {
    YT?: any;
    onYouTubeIframeAPIReady?: () => void;
  }
}

export type PlayerStage = "dock" | "mini" | "full";

type PlayerProps = {
  selection: PlayerSelection;
  active: boolean;
  stage: PlayerStage;
  canPrev: boolean;
  canNext: boolean;
  onActivate: () => void;
  onPrev: () => void;
  onNext: () => void;
  onExpand: () => void;
  onCollapse: () => void;
};

let apiPromise: Promise<void> | null = null;

// Load the YouTube IFrame Player API exactly once.
function loadYouTubeApi(): Promise<void> {
  if (typeof window === "undefined") return Promise.resolve();
  if (window.YT && window.YT.Player) return Promise.resolve();
  if (apiPromise) return apiPromise;

  apiPromise = new Promise<void>((resolve) => {
    const previous = window.onYouTubeIframeAPIReady;
    window.onYouTubeIframeAPIReady = () => {
      previous?.();
      resolve();
    };
    const script = document.createElement("script");
    script.src = "https://www.youtube.com/iframe_api";
    document.head.appendChild(script);
  });
  return apiPromise;
}

export function Player({
  selection,
  active,
  stage,
  canPrev,
  canNext,
  onActivate,
  onPrev,
  onNext,
  onExpand,
  onCollapse,
}: PlayerProps) {
  const hostRef = useRef<HTMLDivElement | null>(null);
  const playerRef = useRef<any>(null);
  const readyRef = useRef(false);
  const pendingRef = useRef<number | null>(null);
  const loadedKeyRef = useRef<string | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);

  // Create the single persistent player instance.
  useEffect(() => {
    let cancelled = false;
    loadYouTubeApi().then(() => {
      if (cancelled || !hostRef.current || playerRef.current) return;
      playerRef.current = new window.YT.Player(hostRef.current, {
        videoId: youtubeVideoId,
        width: "100%",
        height: "100%",
        playerVars: {
          playsinline: 1,
          rel: 0,
          modestbranding: 1,
          enablejsapi: 1,
          origin: window.location.origin,
        },
        events: {
          onReady: () => {
            readyRef.current = true;
            if (pendingRef.current != null) {
              playerRef.current.loadVideoById({ videoId: youtubeVideoId, startSeconds: pendingRef.current });
              pendingRef.current = null;
            }
          },
          onStateChange: (event: any) => {
            // 1 = playing, everything else (paused/ended/buffering/cued) is not "playing".
            setIsPlaying(event.data === 1);
          },
        },
      });
    });
    return () => {
      cancelled = true;
    };
  }, []);

  // Load + play whenever the active selection changes (each change is user-initiated).
  useEffect(() => {
    if (!active) return;
    const key = `${selection.id}:${selection.startSeconds}`;
    if (loadedKeyRef.current === key) return;
    loadedKeyRef.current = key;

    if (readyRef.current && playerRef.current) {
      playerRef.current.loadVideoById({ videoId: youtubeVideoId, startSeconds: selection.startSeconds });
    } else {
      pendingRef.current = selection.startSeconds;
    }
  }, [active, selection.id, selection.startSeconds]);

  const togglePlay = () => {
    if (!active) {
      onActivate();
      return;
    }
    const player = playerRef.current;
    if (!player) return;
    if (isPlaying) player.pauseVideo();
    else player.playVideo();
  };

  // Seek relative to the current playback position (e.g. +/- 15 seconds).
  const seekBy = (deltaSeconds: number) => {
    const player = playerRef.current;
    if (!active || !readyRef.current || !player?.getCurrentTime) return;
    const next = Math.max(0, player.getCurrentTime() + deltaSeconds);
    player.seekTo(next, true);
  };

  const youtubeUrl = `https://www.youtube.com/watch?v=${youtubeVideoId}&t=${selection.startSeconds}s`;
  const youtubeMusicUrl = `https://music.youtube.com/watch?v=${youtubeVideoId}&t=${selection.startSeconds}`;

  const containerClass =
    stage === "full"
      ? "fixed inset-0 z-[70] bg-[#05070b] text-white"
      : stage === "mini"
        ? "fixed inset-x-3 bottom-3 z-[60] h-[76px] cursor-pointer overflow-hidden rounded-2xl border border-white/12 bg-[#0a0e15] text-white shadow-2xl"
        : "fixed inset-x-4 bottom-4 z-[60] h-[150px] overflow-hidden rounded-2xl border border-white/12 bg-[#06080d]/95 text-white shadow-2xl backdrop-blur-2xl sm:inset-x-6 lg:left-auto lg:right-8 lg:w-[560px]";

  const videoWrapClass =
    stage === "full"
      ? "absolute inset-x-0 top-14 z-0 h-[40vh] bg-black bg-cover bg-center"
      : stage === "mini"
        ? "absolute left-0 top-0 z-0 h-full w-[76px] bg-black bg-cover bg-center"
        : "absolute left-0 top-0 z-0 h-full w-[124px] bg-black bg-cover bg-center sm:w-[210px]";

  // A poster sits behind the player so the area is never blank before the iframe loads.
  const thumbUrl = `https://i.ytimg.com/vi/${youtubeVideoId}/hqdefault.jpg`;
  const videoWrapStyle = { backgroundImage: `url(${thumbUrl})` };

  const playPauseIcon = isPlaying ? <Pause size={stage === "full" ? 30 : 18} fill="currentColor" /> : <Play size={stage === "full" ? 30 : 18} fill="currentColor" />;

  return (
    <section
      className={containerClass}
      onClick={stage === "mini" ? onExpand : undefined}
      role={stage === "mini" ? "button" : undefined}
      aria-label={stage === "mini" ? "Expand now playing" : undefined}
    >
      {/* Persistent video stage — never unmounts, only restyles between stages. */}
      <div className={videoWrapClass} style={videoWrapStyle}>
        <div ref={hostRef} className="relative z-10 h-full w-full" />
        {!active ? (
          <div className="pointer-events-none absolute inset-0 z-20 grid place-items-center bg-black/55">
            <Play size={stage === "full" ? 40 : 22} className="text-white/85" fill="currentColor" />
          </div>
        ) : null}
      </div>

      {stage === "full" ? (
        <>
          <div className="absolute inset-x-0 top-0 z-10 flex h-14 items-center justify-between px-4">
            <button
              type="button"
              onClick={onCollapse}
              aria-label="Collapse to mini player"
              className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-4 py-2 text-sm font-semibold transition active:scale-95"
            >
              <ChevronDown size={18} />
              Close
            </button>
            <span className="font-mono text-[11px] uppercase tracking-[0.34em] text-cyanGlow/80">Now Playing</span>
            <span className="w-[84px]" />
          </div>

          <div className="absolute inset-x-0 bottom-0 top-[calc(56px+40vh)] z-10 flex flex-col px-6 pb-8 pt-5 sm:px-10">
            <div className="mx-auto flex w-full max-w-xl flex-1 flex-col">
              <div className="min-h-0 flex-1">
                <h2 className="text-2xl font-bold leading-tight sm:text-3xl">{selection.title}</h2>
                <p className="mt-2 text-base text-white/70 sm:text-lg">
                  {selection.city.city} · {selection.show.name}
                </p>
                <p className="mt-1 font-mono text-sm text-cyanGlow/80">
                  {selection.timestamp} – {selection.endTimestamp}
                </p>
              </div>

              <div className="mt-6 flex items-center justify-center gap-8">
                <button
                  type="button"
                  onClick={onPrev}
                  disabled={!canPrev}
                  aria-label="Previous segment"
                  className="grid size-14 place-items-center rounded-full text-white transition active:scale-90 disabled:opacity-30"
                >
                  <SkipBack size={30} fill="currentColor" />
                </button>
                <button
                  type="button"
                  onClick={togglePlay}
                  aria-label={isPlaying ? "Pause" : "Play"}
                  className="grid size-20 place-items-center rounded-full bg-cyanGlow text-black shadow-glow transition active:scale-95"
                >
                  {playPauseIcon}
                </button>
                <button
                  type="button"
                  onClick={onNext}
                  disabled={!canNext}
                  aria-label="Next segment"
                  className="grid size-14 place-items-center rounded-full text-white transition active:scale-90 disabled:opacity-30"
                >
                  <SkipForward size={30} fill="currentColor" />
                </button>
              </div>

              <div className="mt-5 flex items-center justify-center gap-3">
                <button
                  type="button"
                  onClick={() => seekBy(-15)}
                  disabled={!active}
                  aria-label="Rewind 15 seconds"
                  className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/[0.06] px-4 py-2.5 text-sm font-semibold text-white transition active:scale-95 disabled:opacity-30"
                >
                  <RotateCcw size={18} />
                  15s
                </button>
                <button
                  type="button"
                  onClick={() => seekBy(15)}
                  disabled={!active}
                  aria-label="Forward 15 seconds"
                  className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/[0.06] px-4 py-2.5 text-sm font-semibold text-white transition active:scale-95 disabled:opacity-30"
                >
                  15s
                  <RotateCw size={18} />
                </button>
              </div>

              <div className="mt-6 flex items-center justify-center gap-2">
                <a
                  href={youtubeUrl}
                  target="_blank"
                  rel="noreferrer"
                  onClick={(event) => event.stopPropagation()}
                  className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/[0.06] px-3 py-2 text-xs text-white/75 transition hover:text-white"
                >
                  <Youtube size={14} />
                  YouTube
                </a>
                <a
                  href={youtubeMusicUrl}
                  target="_blank"
                  rel="noreferrer"
                  onClick={(event) => event.stopPropagation()}
                  className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/[0.06] px-3 py-2 text-xs text-white/75 transition hover:text-white"
                >
                  <Music2 size={14} />
                  Music
                </a>
              </div>
            </div>
          </div>
        </>
      ) : null}

      {stage === "mini" ? (
        <div className="absolute inset-y-0 left-[76px] right-0 z-10 flex items-center justify-between gap-3 pl-3 pr-2">
          <div className="min-w-0">
            <p className="truncate text-sm font-semibold">{selection.title}</p>
            <p className="truncate text-xs text-white/55">
              {selection.city.city} · {selection.show.name}
            </p>
          </div>
          <div className="flex items-center gap-1">
            <button
              type="button"
              onClick={(event) => {
                event.stopPropagation();
                togglePlay();
              }}
              aria-label={isPlaying ? "Pause" : "Play"}
              className="grid size-12 place-items-center rounded-full bg-cyanGlow text-black transition active:scale-90"
            >
              {playPauseIcon}
            </button>
            <span className="grid size-9 place-items-center text-white/55">
              <ChevronUp size={20} />
            </span>
          </div>
        </div>
      ) : null}

      {stage === "dock" ? (
        <div className="absolute inset-y-0 left-[124px] right-0 z-10 flex flex-col justify-between gap-2 p-3 sm:left-[210px] sm:p-4">
          <div className="min-w-0">
            <p className="flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.28em] text-cyanGlow/75">
              {active ? "Now playing" : "Player ready"}
            </p>
            <h2 className="mt-1 break-words text-sm font-semibold leading-5 sm:text-lg sm:leading-6">{selection.title}</h2>
            <p className="mt-1 text-xs leading-5 text-white/58 sm:text-sm">
              {selection.city.city} · {selection.show.name} · {selection.timestamp} – {selection.endTimestamp}
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={togglePlay}
              aria-label={isPlaying ? "Pause" : "Play"}
              className="inline-flex items-center gap-2 rounded-full bg-cyanGlow px-4 py-2 text-xs font-semibold text-black transition hover:brightness-110 sm:text-sm"
            >
              {isPlaying ? <Pause size={15} fill="currentColor" /> : <Play size={15} fill="currentColor" />}
              {isPlaying ? "Pause" : "Play"}
            </button>
            <a
              href={youtubeUrl}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/[0.06] px-3 py-2 text-xs text-white/75 transition hover:text-white"
            >
              <Youtube size={14} />
              YouTube
            </a>
            <a
              href={youtubeMusicUrl}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/[0.06] px-3 py-2 text-xs text-white/75 transition hover:text-white"
            >
              <Music2 size={14} />
              Music
            </a>
          </div>
        </div>
      ) : null}
    </section>
  );
}
