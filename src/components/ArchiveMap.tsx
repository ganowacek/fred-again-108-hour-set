"use client";

import L, { type DivIcon } from "leaflet";
import { Headphones, MapPin, Search, Sparkles } from "lucide-react";
import { useMemo, useState } from "react";
import { MapContainer, Marker, TileLayer, Tooltip, ZoomControl, useMapEvents } from "react-leaflet";
import { CityDrawer } from "@/components/CityDrawer";
import { PlayerDock } from "@/components/PlayerDock";
import { allSets, getSegmentTiming, getShowTiming, showTimeline, tourCities } from "@/data/sets";
import type { ArchiveSet, ArchiveShow, PlayerSelection, TourCity } from "@/types/archive";

const center: [number, number] = [45, -56];
const bounds: L.LatLngBoundsExpression = [
  [30, -135],
  [62, 20],
];

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
  const [query, setQuery] = useState("");

  const selectedCity = selectedCityId ? tourCities.find((city) => city.id === selectedCityId) ?? null : null;

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

  const totalSets = allSets.length;
  const totalShows = tourCities.reduce((count, city) => count + city.shows.length, 0);

  return (
    <main className="relative min-h-screen overflow-hidden bg-ink text-white">
      <div className="pointer-events-none absolute inset-0 z-20 bg-[linear-gradient(90deg,rgba(5,7,11,0.72),rgba(5,7,11,0.04)_36%,rgba(5,7,11,0.10)_72%,rgba(5,7,11,0.66))]" />
      <div className="pointer-events-none absolute inset-0 z-20 bg-[linear-gradient(180deg,rgba(5,7,11,0.78),rgba(5,7,11,0.02)_34%,rgba(5,7,11,0.22)_82%,rgba(5,7,11,0.78))]" />
      <div className="pointer-events-none absolute inset-0 z-30 noise-layer" />

      <MapContainer
        center={center}
        zoom={initialZoom}
        minZoom={2}
        maxZoom={8}
        maxBounds={bounds}
        maxBoundsViscosity={0.7}
        zoomControl={false}
        className="absolute inset-0 z-10 h-screen w-screen"
        scrollWheelZoom
      >
        <MapClickCloser onClose={() => setSelectedCityId(null)} />
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> &copy; <a href="https://carto.com/attributions">CARTO</a>'
          url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
        />
        <ZoomControl position="bottomleft" />
        {filteredCities.map((city) => (
          <Marker
            key={city.id}
            position={city.coordinates}
            icon={makeMarkerIcon(city, selectedCity?.id === city.id)}
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
            <span className="grid size-10 place-items-center rounded-full border border-white/15 bg-white/10 text-cyanGlow shadow-glow backdrop-blur">
              <Headphones size={18} />
            </span>
            <div>
              <p className="font-mono text-[11px] uppercase tracking-[0.34em] text-cyanGlow/75">108 hour set</p>
              <h1 className="mt-1 max-w-[12ch] text-balance text-4xl font-semibold leading-[0.92] sm:text-5xl lg:text-6xl">
                Fred again.. USB002 Live Archive
              </h1>
            </div>
          </div>

          <div className="mt-6 flex flex-wrap gap-2 text-sm text-white/74">
            <span className="inline-flex items-center gap-2 rounded-full border border-white/12 bg-white/8 px-3 py-2 backdrop-blur">
              <MapPin size={14} />
              {tourCities.length} cities
            </span>
            <span className="inline-flex items-center gap-2 rounded-full border border-white/12 bg-white/8 px-3 py-2 backdrop-blur">
              <Sparkles size={14} />
              {totalShows} shows
            </span>
            <span className="inline-flex items-center gap-2 rounded-full border border-white/12 bg-white/8 px-3 py-2 backdrop-blur">
              <Headphones size={14} />
              {totalSets} sets
            </span>
          </div>

          <label className="mt-5 flex h-12 max-w-[380px] items-center gap-3 rounded-full border border-white/12 bg-black/34 px-4 shadow-glow backdrop-blur-xl">
            <Search size={17} className="text-white/55" />
            <input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Search city or artist"
              className="min-w-0 flex-1 bg-transparent text-sm text-white outline-none placeholder:text-white/45"
            />
          </label>
        </div>

        <div className="pointer-events-auto hidden max-w-[360px] rounded border border-white/10 bg-black/28 p-4 text-sm text-white/68 backdrop-blur-xl lg:block">
          <p className="font-mono text-[10px] uppercase tracking-[0.28em] text-white/40">Now mapped</p>
          <p className="mt-2 text-base text-white">{selectedCity?.city ?? "Choose a city"}</p>
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
          currentPlaybackId={playerSelection.id}
          onPlayFullShow={(show) => setPlayerSelection(createShowSelection(selectedCity, show))}
          onPlaySegment={(show, set) => setPlayerSelection(createSegmentSelection(selectedCity, show, set))}
        />
      ) : null}

      <PlayerDock selection={playerSelection} />
    </main>
  );
}
