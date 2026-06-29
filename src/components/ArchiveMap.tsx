"use client";

import L, { type DivIcon } from "leaflet";
import { Car, Headphones, MapPin, Moon, Search, Sparkles, Sun } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { MapContainer, Marker, TileLayer, Tooltip, ZoomControl, useMapEvents } from "react-leaflet";
import { CarMode } from "@/components/CarMode";
import { CityDrawer } from "@/components/CityDrawer";
import { PlayerDock } from "@/components/PlayerDock";
import { allSets, getSegmentTiming, getShowTiming, showTimeline, tourCities } from "@/data/sets";
import type { ArchiveSet, ArchiveShow, PlayerSelection, TourCity } from "@/types/archive";

type Theme = "dark" | "light";
type ViewMode = "map" | "car";

const VIEW_MODE_STORAGE_KEY = "usb002-view-mode";
const THEME_STORAGE_KEY = "usb002-theme";

const center: [number, number] = [45, -56];
const bounds: L.LatLngBoundsExpression = [
  [-8, -150],
  [72, 36],
];

const tileLayers: Record<Theme, { url: string; attribution: string }> = {
  dark: {
    url: "https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png",
    attribution:
      '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> &copy; <a href="https://carto.com/attributions">CARTO</a>',
  },
  light: {
    url: "https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png",
    attribution:
      '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> &copy; <a href="https://carto.com/attributions">CARTO</a>',
  },
};

const accentClass: Record<TourCity["accent"], string> = {
  cyan: "marker-cyan",
  coral: "marker-coral",
  lime: "marker-lime",
};

const makeMarkerIcon = (city: TourCity, active: boolean): DivIcon =>
  L.divIcon({
    className: "",
    html: `<div class="archive-marker ${accentClass[city.accent]} ${active ? "is-active" : ""}">
      <span class="archive-marker__ring"></span>
      <span class="archive-marker__dot"></span>
      <span class="archive-marker__label">${city.markerLabel}</span>
    </div>`,
    iconAnchor: [12, 12],
    iconSize: [24, 24],
  });

function MapClickCloser({ onClose }: { onClose: () => void }) {
  useMapEvents({
    click: onClose,
  });

  return null;
}

const createShowSelection = (city: TourCity, show: ArchiveShow): PlayerSelection => {
  const timing = getShowTiming(show);

  return {
    city,
    show,
    id: `show:${show.id}`,
    title: `${show.name} Full Show`,
    timestamp: timing.startTimestamp,
    startSeconds: timing.startSeconds,
    endTimestamp: timing.endTimestamp,
    mode: "show",
  };
};

const createSegmentSelection = (city: TourCity, show: ArchiveShow, archiveSet: ArchiveSet): PlayerSelection => {
  const timing = getSegmentTiming(show, archiveSet);

  return {
    city,
    show,
    id: `set:${archiveSet.id}`,
    title: archiveSet.artist,
    timestamp: timing.startTimestamp,
    startSeconds: timing.startSeconds,
    endTimestamp: timing.endTimestamp,
    mode: "segment",
  };
};

export default function ArchiveMap() {
  const initialZoom = typeof window !== "undefined" && window.innerWidth < 900 ? 2 : 3;
  const [selectedCityId, setSelectedCityId] = useState<string | null>(null);
  const [playerSelection, setPlayerSelection] = useState<PlayerSelection>(() =>
    createShowSelection(showTimeline[0].city, showTimeline[0].show),
  );
  const [isPlayerActive, setIsPlayerActive] = useState(false);
  const [theme, setTheme] = useState<Theme>("dark");
  const [viewMode, setViewMode] = useState<ViewMode>("map");
  const [query, setQuery] = useState("");

  // Restore persisted preferences after mount (component is client-only).
  useEffect(() => {
    const storedView = window.localStorage.getItem(VIEW_MODE_STORAGE_KEY);
    if (storedView === "map" || storedView === "car") setViewMode(storedView);
    const storedTheme = window.localStorage.getItem(THEME_STORAGE_KEY);
    if (storedTheme === "dark" || storedTheme === "light") setTheme(storedTheme);
  }, []);

  useEffect(() => {
    window.localStorage.setItem(VIEW_MODE_STORAGE_KEY, viewMode);
  }, [viewMode]);

  useEffect(() => {
    window.localStorage.setItem(THEME_STORAGE_KEY, theme);
  }, [theme]);

  const isLight = theme === "light";
  const selectedCity = selectedCityId ? tourCities.find((city) => city.id === selectedCityId) ?? null : null;

  const playShow = (city: TourCity, show: ArchiveShow) => {
    setPlayerSelection(createShowSelection(city, show));
    setIsPlayerActive(true);
  };

  const playSegment = (city: TourCity, show: ArchiveShow, archiveSet: ArchiveSet) => {
    setPlayerSelection(createSegmentSelection(city, show, archiveSet));
    setIsPlayerActive(true);
  };

  const currentPlaybackId = isPlayerActive ? playerSelection.id : null;
  const toggleTheme = () => setTheme((current) => (current === "dark" ? "light" : "dark"));

  const filteredCities = useMemo(() => {
    const cleanQuery = query.trim().toLowerCase();
    if (!cleanQuery) return tourCities;

    return tourCities.filter((city) => {
      const haystack = [
        city.city,
        city.country,
        ...city.shows.flatMap((show) => [show.name, ...show.sets.map((set) => set.artist)]),
      ]
        .join(" ")
        .toLowerCase();

      return haystack.includes(cleanQuery);
    });
  }, [query]);

  const markerIcons = useMemo(
    () =>
      new Map(filteredCities.map((city) => [city.id, makeMarkerIcon(city, selectedCityId === city.id)])),
    [filteredCities, selectedCityId],
  );

  const totalSets = allSets.length;
  const totalShows = tourCities.reduce((count, city) => count + city.shows.length, 0);

  const chipClass = isLight
    ? "border-slate-900/10 bg-white/75 text-slate-700"
    : "border-white/12 bg-white/8 text-white/74";
  const iconBadgeClass = isLight
    ? "border-slate-900/10 bg-white/80 text-cyan-600"
    : "border-white/15 bg-white/10 text-cyanGlow";
  const eyebrowClass = isLight ? "text-cyan-600/80" : "text-cyanGlow/75";
  const mappedCardClass = isLight
    ? "border-slate-900/10 bg-white/75 text-slate-600"
    : "border-white/10 bg-black/28 text-white/68";

  return (
    <main
      data-theme={theme}
      className={`relative min-h-screen overflow-hidden ${isLight ? "theme-light bg-[#e9edf3] text-slate-900" : "theme-dark bg-ink text-white"}`}
    >
      {viewMode === "map" ? (
        <>
          {isLight ? (
            <>
              <div className="pointer-events-none absolute inset-0 z-20 bg-[linear-gradient(90deg,rgba(226,232,240,0.94),rgba(226,232,240,0.18)_40%,rgba(226,232,240,0.10)_72%,rgba(226,232,240,0.66))]" />
              <div className="pointer-events-none absolute inset-0 z-20 bg-[linear-gradient(180deg,rgba(226,232,240,0.82),rgba(226,232,240,0)_28%,rgba(226,232,240,0.22)_84%,rgba(226,232,240,0.72))]" />
            </>
          ) : (
            <>
              <div className="pointer-events-none absolute inset-0 z-20 bg-[linear-gradient(90deg,rgba(5,7,11,0.72),rgba(5,7,11,0.04)_36%,rgba(5,7,11,0.10)_72%,rgba(5,7,11,0.66))]" />
              <div className="pointer-events-none absolute inset-0 z-20 bg-[linear-gradient(180deg,rgba(5,7,11,0.78),rgba(5,7,11,0.02)_34%,rgba(5,7,11,0.22)_82%,rgba(5,7,11,0.78))]" />
              <div className="pointer-events-none absolute inset-0 z-30 noise-layer" />
            </>
          )}

          <MapContainer
            center={center}
            zoom={initialZoom}
            minZoom={2}
            maxZoom={8}
            maxBounds={bounds}
            maxBoundsViscosity={0.25}
            worldCopyJump
            zoomControl={false}
            zoomSnap={0.5}
            zoomDelta={0.5}
            wheelPxPerZoomLevel={110}
            wheelDebounceTime={28}
            className="absolute inset-0 z-10 h-screen w-screen"
            scrollWheelZoom
          >
            <MapClickCloser onClose={() => setSelectedCityId(null)} />
            <TileLayer key={theme} attribution={tileLayers[theme].attribution} url={tileLayers[theme].url} />
            <ZoomControl position="bottomleft" />
            {filteredCities.map((city) => (
              <Marker
                key={city.id}
                position={city.coordinates}
                icon={markerIcons.get(city.id)}
                eventHandlers={{
                  click: (event) => {
                    event.originalEvent.stopPropagation();
                    setSelectedCityId(city.id);
                  },
                }}
              >
                <Tooltip direction="top" offset={[0, -18]} opacity={0.95}>
                  {city.markerLabel}
                </Tooltip>
              </Marker>
            ))}
          </MapContainer>

          <section className="pointer-events-none absolute left-0 top-0 z-40 flex min-h-[42vh] w-full flex-col justify-between px-5 pb-5 pt-6 sm:px-8 lg:min-h-screen lg:w-[440px] lg:px-10 lg:py-9">
            <div className="pointer-events-auto max-w-[560px]">
              <div className="flex items-center gap-3">
                <span className={`grid size-10 shrink-0 place-items-center rounded-full border shadow-glow backdrop-blur ${iconBadgeClass}`}>
                  <Headphones size={18} />
                </span>
                <div className="flex-1">
                  <div className="flex items-center justify-between gap-2">
                    <p className={`font-mono text-[11px] uppercase tracking-[0.34em] ${eyebrowClass}`}>108 hour set</p>
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => setViewMode("car")}
                        aria-label="Switch to Car Mode"
                        className={`inline-flex items-center gap-2 rounded-full border px-3 py-1.5 text-[11px] font-medium uppercase tracking-[0.18em] backdrop-blur transition ${chipClass}`}
                      >
                        <Car size={13} />
                        Car
                      </button>
                      <button
                        type="button"
                        onClick={toggleTheme}
                        aria-label={isLight ? "Switch to dark mode" : "Switch to light mode"}
                        className={`inline-flex items-center gap-2 rounded-full border px-3 py-1.5 text-[11px] font-medium uppercase tracking-[0.18em] backdrop-blur transition ${chipClass}`}
                      >
                        {isLight ? <Moon size={13} /> : <Sun size={13} />}
                        {isLight ? "Dark" : "Light"}
                      </button>
                    </div>
                  </div>
                  <h1
                    className={`mt-1 max-w-[12ch] text-balance text-4xl font-semibold leading-[0.92] sm:text-5xl lg:text-6xl ${
                      isLight ? "text-slate-900" : "text-white drop-shadow-[0_2px_18px_rgba(0,0,0,0.55)]"
                    }`}
                  >
                    Fred again.. USB002 Live Archive
                  </h1>
                </div>
              </div>

              <div className="mt-6 flex flex-wrap gap-2 text-sm">
                <span className={`inline-flex items-center gap-2 rounded-full border px-3 py-2 backdrop-blur ${chipClass}`}>
                  <MapPin size={14} />
                  {tourCities.length} cities
                </span>
                <span className={`inline-flex items-center gap-2 rounded-full border px-3 py-2 backdrop-blur ${chipClass}`}>
                  <Sparkles size={14} />
                  {totalShows} shows
                </span>
                <span className={`inline-flex items-center gap-2 rounded-full border px-3 py-2 backdrop-blur ${chipClass}`}>
                  <Headphones size={14} />
                  {totalSets} sets
                </span>
              </div>

              <label
                className={`mt-5 flex h-12 max-w-[380px] items-center gap-3 rounded-full border px-4 shadow-glow backdrop-blur-xl ${
                  isLight ? "border-slate-300 bg-white/90" : "border-white/12 bg-black/34"
                }`}
              >
                <Search size={17} className={isLight ? "text-slate-500" : "text-white/55"} />
                <input
                  value={query}
                  onChange={(event) => setQuery(event.target.value)}
                  placeholder="Search city or artist"
                  className={`min-w-0 flex-1 bg-transparent text-sm outline-none ${
                    isLight ? "text-slate-900 placeholder:text-slate-500" : "text-white placeholder:text-white/45"
                  }`}
                />
              </label>
            </div>

            <div className={`pointer-events-auto hidden max-w-[360px] rounded border p-4 text-sm backdrop-blur-xl lg:block ${mappedCardClass}`}>
              <p className={`font-mono text-[10px] uppercase tracking-[0.28em] ${isLight ? "text-slate-500" : "text-white/40"}`}>Now mapped</p>
              <p className={`mt-2 text-base font-medium ${isLight ? "text-slate-900" : "text-white"}`}>{selectedCity?.city ?? "Choose a city"}</p>
              <p className="mt-1 leading-6">
                {selectedCity
                  ? `${selectedCity.shows.map((show) => show.name).join(" / ")} · play any timestamp from the original archive.`
                  : "Tap a glowing marker to open its grouped sets and timestamps."}
              </p>
            </div>
          </section>

          {selectedCity ? (
            <CityDrawer
              city={selectedCity}
              currentPlaybackId={currentPlaybackId}
              isLight={isLight}
              onPlayFullShow={(show) => playShow(selectedCity, show)}
              onPlaySegment={(show, set) => playSegment(selectedCity, show, set)}
            />
          ) : null}
        </>
      ) : (
        <CarMode
          cities={tourCities}
          currentPlaybackId={currentPlaybackId}
          onExit={() => setViewMode("map")}
          onPlayShow={playShow}
          onPlaySegment={playSegment}
        />
      )}

      <PlayerDock selection={playerSelection} active={isPlayerActive} />
    </main>
  );
}
