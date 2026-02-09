// ### PLACEHOLDER: Researcher will customize video data

export interface VideoResult {
  id: string;
  title: string;
  source: string;
  duration: string;
  views: string;
  thumbnailKey?: string;
}

// Fictional video results for research simulation
export const VIDEOS: VideoResult[] = [
  {
    id: "v1",
    title: "Michael Johnson breaks WORLD RECORD and solidifies ...",
    source: "YouTube · NBC Sports",
    duration: "5:22",
    views: "Sep 10, 2025"
  },
  {
    id: "v2",
    title: "Born Winner! Michael Johnson | All Individual Olympic Medals ...",
    source: "YouTube · Olympics",
    duration: "7:43",
    views: "Sep 17, 2025"
  },
  {
    id: "v3",
    title: "Michael Johnson re-establishes himself as the premier 400m ...",
    source: "YouTube · NBC Sports",
    duration: "6:33",
    views: "Aug 27, 2025"
  }
];

