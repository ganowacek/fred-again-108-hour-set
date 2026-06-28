export type ArchiveSet = {
  id: string;
  artist: string;
  timestamp: string;
  startSeconds: number;
};

export type ArchiveShow = {
  id: string;
  name: string;
  shortName: string;
  startsAt: string;
  sets: ArchiveSet[];
};

export type ShowTiming = {
  startTimestamp: string;
  endTimestamp: string;
  startSeconds: number;
  endSeconds: number;
};

export type SegmentTiming = ShowTiming;

export type TourCity = {
  id: string;
  city: string;
  markerLabel: string;
  country: string;
  coordinates: [number, number];
  accent: "cyan" | "coral" | "lime";
  shows: ArchiveShow[];
};

export type PlayerSelection = {
  city: TourCity;
  show: ArchiveShow;
  id: string;
  title: string;
  timestamp: string;
  startSeconds: number;
  endTimestamp: string;
  mode: "show" | "segment";
};
