export type videosProps = {
  id: { videoId: string };
  snippet: {
    channelId: string;
    channelTitle: string;
    thumbnails: {
      high: { url: string };
      default: { url: string };
    };
    title: string;
    publishedAt: string;
  };
}[];

export type channelDetailsProps = {
  id: string; // Channel ID
  snippet: {
    title: string; // Channel name
    description: string; // Channel description
    thumbnails: {
      high: { url: string }; // High-resolution avatar image
      medium: { url: string };
      default: { url: string };
    };
    publishedAt: string; // Channel creation date
  };
  statistics: {
    subscriberCount: string; // Total subscribers
    videoCount: string; // Total uploaded videos
    viewCount: string; // Total video views
  };
  brandingSettings?: {
    channel: {
      title: string;
      description: string;
    };
    image: {
      bannerExternalUrl: string;
    };
  };
};
