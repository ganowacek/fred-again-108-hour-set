import type { ArchiveSet, ArchiveShow, SegmentTiming, ShowTiming, TourCity } from "@/types/archive";

const VIDEO_ID = "GiXKukOtmeE";
const ARCHIVE_END_TIMESTAMP = "108:00:00";

export const youtubeVideoId = VIDEO_ID;
export const archiveEndTimestamp = ARCHIVE_END_TIMESTAMP;

export const timestampToSeconds = (timestamp: string) => {
  const [hours, minutes, seconds] = timestamp.split(":").map(Number);
  return hours * 3600 + minutes * 60 + seconds;
};

const set = (id: string, timestamp: string, artist: string): ArchiveSet => ({
  id,
  artist,
  timestamp,
  startSeconds: timestampToSeconds(timestamp),
});

export const tourCities: TourCity[] = [
  {
    id: "glasgow",
    city: "Glasgow",
    markerLabel: "Glasgow",
    country: "Scotland",
    coordinates: [55.8642, -4.2518],
    accent: "cyan",
    shows: [
      {
        id: "glasgow",
        name: "Glasgow",
        shortName: "GLA",
        startsAt: "0:00:00",
        sets: [
          set("glasgow-fred-open", "0:00:00", "Fred"),
          set("glasgow-fred-rick-salad", "0:15:25", "Fred b2b Rick Salad"),
          set("glasgow-haai", "0:58:55", "HAAi"),
          set("glasgow-yousuke", "1:58:30", "¥ØU$UK€ ¥UK1MAT$U"),
          set("glasgow-trio", "2:42:00", "Fred b2b HAAi b2b ¥ØU$UK€ ¥UK1MAT$U"),
          set("glasgow-fred-close", "3:10:00", "Fred"),
          set("glasgow-blanco", "4:05:00", "Blanco"),
        ],
      },
    ],
  },
  {
    id: "brussels",
    city: "Brussels",
    markerLabel: "Brussels",
    country: "Belgium",
    coordinates: [50.8503, 4.3517],
    accent: "lime",
    shows: [
      {
        id: "brussels",
        name: "Brussels",
        shortName: "BRU",
        startsAt: "4:48:00",
        sets: [
          set("brussels-dc-shoplifter", "4:48:00", "DC Noises b2b SHOPLIFTER"),
          set("brussels-koma-lauravioli", "6:16:00", "KŌMA b2b LAURAVIOLI"),
          set("brussels-fred", "7:44:40", "Fred"),
        ],
      },
    ],
  },
  {
    id: "madrid",
    city: "Madrid",
    markerLabel: "Madrid",
    country: "Spain",
    coordinates: [40.4168, -3.7038],
    accent: "coral",
    shows: [
      {
        id: "madrid",
        name: "Madrid",
        shortName: "MAD",
        startsAt: "10:25:00",
        sets: [
          set("madrid-drea", "10:25:00", "DREA"),
          set("madrid-skin-on-skin", "12:34:00", "Skin On Skin"),
          set("madrid-skin-on-skin-fred", "13:59:00", "Skin On Skin b2b Fred"),
          set("madrid-fred", "15:02:00", "Fred"),
          set("madrid-toccororo", "16:55:00", "Toccororo"),
        ],
      },
    ],
  },
  {
    id: "lyon",
    city: "Lyon",
    markerLabel: "Lyon",
    country: "France",
    coordinates: [45.764, 4.8357],
    accent: "cyan",
    shows: [
      {
        id: "lyon",
        name: "Lyon",
        shortName: "LYN",
        startsAt: "17:50:00",
        sets: [
          set("lyon-trio-open", "17:50:00", "Fred b2b Floating Points b2b Caribou"),
          set("lyon-fred", "20:54:00", "Fred"),
          set("lyon-trio-close", "21:52:00", "Fred b2b Floating Points b2b Caribou"),
        ],
      },
    ],
  },
  {
    id: "dublin",
    city: "Dublin",
    markerLabel: "Dublin",
    country: "Ireland",
    coordinates: [53.3498, -6.2603],
    accent: "lime",
    shows: [
      {
        id: "dublin",
        name: "Dublin",
        shortName: "DUB",
        startsAt: "22:47:00",
        sets: [
          set("dublin-caolan-ryan", "22:47:00", "Caolan Ryan"),
          set("dublin-ema", "23:36:00", "EMA"),
          set("dublin-fdc-djs", "24:31:00", "FDC DJs"),
          set("dublin-fred", "25:00:00", "Fred"),
          set("dublin-shady-nasty", "25:57:00", "Shady Nasty"),
          set("dublin-travy-elzzz", "26:19:00", "Travy + Elzzz"),
          set("dublin-reggie", "26:31:00", "Reggie"),
          set("dublin-amyl", "27:18:00", "Amyl"),
        ],
      },
    ],
  },
  {
    id: "toronto",
    city: "Toronto",
    markerLabel: "Toronto",
    country: "Canada",
    coordinates: [43.6532, -79.3832],
    accent: "coral",
    shows: [
      {
        id: "toronto-1",
        name: "Toronto 1",
        shortName: "TO1",
        startsAt: "28:04:00",
        sets: [
          set("toronto-1-fred-open", "28:04:00", "Fred"),
          set("toronto-1-brat-star", "28:41:00", "Brat Star"),
          set("toronto-1-frossyouth", "29:20:00", "FROSSYOUTH"),
          set("toronto-1-loukeman", "30:01:00", "Loukeman"),
          set("toronto-1-fred-close", "30:53:00", "Fred"),
        ],
      },
      {
        id: "toronto-2",
        name: "Toronto 2",
        shortName: "TO2",
        startsAt: "33:37:00",
        sets: [set("toronto-2-fred-four-tet", "33:37:00", "Fred b2b Four Tet")],
      },
    ],
  },
  {
    id: "chicago",
    city: "Chicago",
    markerLabel: "Chicago",
    country: "United States",
    coordinates: [41.8781, -87.6298],
    accent: "cyan",
    shows: [
      {
        id: "chicago",
        name: "Chicago",
        shortName: "CHI",
        startsAt: "38:08:00",
        sets: [
          set("chicago-fred-sammy-open", "38:08:00", "Fred b2b Sammy Virji"),
          set("chicago-sammy-virji", "39:33:00", "Sammy Virji"),
          set("chicago-fred", "40:34:00", "Fred"),
          set("chicago-fred-sammy-close", "42:02:00", "Fred b2b Sammy Virji"),
        ],
      },
    ],
  },
  {
    id: "vancouver",
    city: "Vancouver",
    markerLabel: "Vancouver",
    country: "Canada",
    coordinates: [49.2827, -123.1207],
    accent: "lime",
    shows: [
      {
        id: "vancouver",
        name: "Vancouver",
        shortName: "VAN",
        startsAt: "43:02:00",
        sets: [
          set("vancouver-lou-nour", "43:02:00", "Lou Nour"),
          set("vancouver-skream-benga", "44:24:00", "Skream & Benga"),
          set("vancouver-fred-skream-benga", "45:23:00", "Fred b2b Skream & Benga"),
          set("vancouver-fred", "46:53:00", "Fred"),
        ],
      },
    ],
  },
  {
    id: "san-francisco",
    city: "San Francisco",
    markerLabel: "San Francisco",
    country: "United States",
    coordinates: [37.7749, -122.4194],
    accent: "coral",
    shows: [
      {
        id: "san-francisco",
        name: "San Francisco",
        shortName: "SF",
        startsAt: "49:07:00",
        sets: [
          set("sf-bad-juuju-clearcast-vertigo", "49:07:00", "bad juuju b3b Clearcast b3b Vertigo"),
          set("sf-oppidan", "50:33:00", "Oppidan"),
          set("sf-hamdi", "51:23:00", "Hamdi"),
          set("sf-fred-oppidan-hamdi", "52:15:00", "Fred b2b Oppidan b2b Hamdi"),
          set("sf-fred", "53:07:00", "Fred"),
        ],
      },
    ],
  },
  {
    id: "new-york",
    city: "New York",
    markerLabel: "New York",
    country: "United States",
    coordinates: [40.7128, -74.006],
    accent: "cyan",
    shows: [
      {
        id: "ny1",
        name: "NY1",
        shortName: "NY1",
        startsAt: "55:33:00",
        sets: [
          set("ny1-fred-romy-haai-open", "55:33:00", "Fred b2b Romy b2b HAAi"),
          set("ny1-fred", "57:32:00", "Fred"),
          set("ny1-fred-romy-haai-close", "59:29:00", "Fred b2b Romy b2b HAAi"),
        ],
      },
      {
        id: "ny2",
        name: "NY2",
        shortName: "NY2",
        startsAt: "60:58:00",
        sets: [
          set("ny2-brux", "60:58:00", "BRUX"),
          set("ny2-fred-oppidan-hamdi", "62:27:00", "Fred again.. b2b Oppidan b2b Hamdi"),
          set("ny2-fred", "63:57:00", "Fred"),
          set("ny2-romy", "65:48:00", "Romy"),
        ],
      },
      {
        id: "ny3",
        name: "NY3",
        shortName: "NY3",
        startsAt: "66:28:00",
        sets: [
          set("ny3-x3-doctor-jeep-sister-zo", "66:28:00", "X3butterfly b2b Doctor Jeep b2b Sister Zo"),
          set("ny3-x3-doctor-jeep-sister-zo-fred", "68:13:00", "X3butterfly b2b Doctor Jeep b2b Sister Zo b2b Fred"),
          set("ny3-fred", "69:18:00", "Fred"),
          set("ny3-denzel-curry", "70:20:00", "Denzel Curry"),
          set("ny3-070-shake", "71:50:00", "070 Shake"),
        ],
      },
      {
        id: "ny4",
        name: "NY4",
        shortName: "NY4",
        startsAt: "72:15:00",
        sets: [
          set("ny4-brux", "72:15:00", "BRUX"),
          set("ny4-fred-caribou-open", "73:59:00", "Fred again.. b2b Caribou"),
          set("ny4-fred", "75:59:00", "Fred"),
          set("ny4-denzel-curry", "76:04:00", "Denzel Curry"),
          set("ny4-070-shake", "76:43:00", "070 Shake"),
          set("ny4-fred-caribou-close", "76:56:00", "Fred again.. b2b Caribou"),
        ],
      },
      {
        id: "ny5",
        name: "NY5",
        shortName: "NY5",
        startsAt: "78:12:00",
        sets: [
          set("ny5-brux", "78:12:00", "BRUX"),
          set("ny5-fred", "79:34:00", "Fred"),
          set("ny5-danny-brown", "80:56:00", "Danny Brown"),
        ],
      },
      {
        id: "ny6",
        name: "NY6",
        shortName: "NY6",
        startsAt: "82:15:00",
        sets: [
          set("ny6-fred-ben-ufo-caribou-open", "82:15:00", "Fred again.. b2b Ben UFO b2b Caribou"),
          set("ny6-fred", "85:13:00", "Fred"),
          set("ny6-danny-brown", "85:35:00", "Danny Brown"),
          set("ny6-fred-ben-ufo-caribou-close", "86:21:00", "Fred again.. b2b Ben UFO b2b Caribou"),
        ],
      },
    ],
  },
  {
    id: "london",
    city: "London",
    markerLabel: "London",
    country: "England",
    coordinates: [51.5072, -0.1276],
    accent: "lime",
    shows: [
      {
        id: "ldn1",
        name: "LDN 1",
        shortName: "LDN1",
        startsAt: "87:07:00",
        sets: [
          set("ldn1-hamdi-oppidan", "87:07:00", "Hamdi b2b Oppidan"),
          set("ldn1-hamdi-oppidan-fred", "87:41:00", "Hamdi b2b Oppidan b2b Fred"),
          set("ldn1-berwyn", "89:12:00", "Berwyn"),
          set("ldn1-fred-nia-archives", "89:23:00", "Fred b2b Nia Archives"),
          set("ldn1-fred", "90:14:00", "Fred"),
          set("ldn1-blanco", "90:15:00", "Blanco"),
          set("ldn1-jamie-t", "90:43:00", "Jamie T"),
          set("ldn1-headie-one", "91:17:00", "Headie One"),
          set("ldn1-ezra-ca7riel-paco", "91:50:00", "Ezra Collective & CA7RIEL & Paco Amoroso"),
        ],
      },
      {
        id: "ldn2",
        name: "LDN 2",
        shortName: "LDN2",
        startsAt: "92:42:00",
        sets: [
          set("ldn2-mph-joy-femi-fred", "92:42:00", "MPH b2b JOY (Anonymous) b2b Femi b2b Fred"),
          set("ldn2-blanco", "94:44:00", "Blanco"),
          set("ldn2-berwyn", "95:21:00", "Berwyn"),
          set("ldn2-ezra-collective", "95:50:00", "Ezra Collective"),
          set("ldn2-romy", "96:29:00", "Romy"),
          set("ldn2-jme-d-double-e", "96:44:00", "JME & D Double E"),
          set("ldn2-the-streets", "96:58:00", "The Streets"),
          set("ldn2-underworld", "97:52:00", "Underworld"),
          set("ldn2-streets-underworld", "98:06:00", "The Streets & Underworld"),
        ],
      },
      {
        id: "ldn3",
        name: "LDN 3",
        shortName: "LDN3",
        startsAt: "98:39:00",
        sets: [
          set("ldn3-lou-nour-fred", "98:39:00", "Lou Nour b2b Fred"),
          set("ldn3-fred-skream-benga-coki-mala", "99:42:00", "Fred again.. b2b Skream b2b Benga b2b Coki b2b Mala"),
          set("ldn3-durrty-goodz-d-double-e-flowdan-jme", "100:41:00", "Durrty Goodz & D Double E & Flowdan & JME"),
          set("ldn3-fred", "101:36:00", "Fred"),
          set("ldn3-blanco", "102:05:00", "Blanco"),
          set("ldn3-berwyn", "102:39:00", "Berwyn"),
          set("ldn3-ezra-collective", "103:10:00", "Ezra Collective"),
          set("ldn3-la-roux", "103:31:00", "La Roux"),
        ],
      },
      {
        id: "ldn4",
        name: "LDN 4",
        shortName: "LDN4",
        startsAt: "104:12:00",
        sets: [
          set("ldn4-fred", "104:12:00", "Fred"),
          set("ldn4-the-streets", "104:59:00", "The Streets"),
          set("ldn4-berwyn", "105:26:00", "Berwyn"),
          set("ldn4-ezra-collective", "106:00:00", "Ezra Collective"),
          set("ldn4-kano", "106:03:00", "Kano"),
          set("ldn4-jamie-t", "106:25:00", "Jamie T"),
          set("ldn4-fred-thomas-bangalter", "106:33:00", "Fred b2b Thomas Bangalter"),
        ],
      },
    ],
  },
];

export const allSets = tourCities.flatMap((city) =>
  city.shows.flatMap((show) =>
    show.sets.map((archiveSet) => ({
      city,
      show,
      set: archiveSet,
    })),
  ),
);

export const showTimeline = tourCities.flatMap((city) =>
  city.shows.map((show) => ({
    city,
    show,
  })),
);

export const getShowTiming = (show: ArchiveShow): ShowTiming => {
  const showIndex = showTimeline.findIndex(({ show: candidate }) => candidate.id === show.id);
  const nextShow = showTimeline[showIndex + 1]?.show;
  const endTimestamp = nextShow?.startsAt ?? archiveEndTimestamp;

  return {
    startTimestamp: show.startsAt,
    endTimestamp,
    startSeconds: timestampToSeconds(show.startsAt),
    endSeconds: timestampToSeconds(endTimestamp),
  };
};

export const getSegmentTiming = (show: ArchiveShow, archiveSet: ArchiveSet): SegmentTiming => {
  const segmentIndex = show.sets.findIndex((candidate) => candidate.id === archiveSet.id);
  const nextSegment = show.sets[segmentIndex + 1];
  const endTimestamp = nextSegment?.timestamp ?? getShowTiming(show).endTimestamp;

  return {
    startTimestamp: archiveSet.timestamp,
    endTimestamp,
    startSeconds: archiveSet.startSeconds,
    endSeconds: timestampToSeconds(endTimestamp),
  };
};
