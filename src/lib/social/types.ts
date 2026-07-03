export type SocialTemplateId =
  | 'save_card'
  | 'phrase_note'
  | 'quick_tip'
  | 'situation_bite';

export type SocialPostStatus = 'draft' | 'posted' | 'failed';

export type SocialTemplate = {
  id: SocialTemplateId;
  name: string;
  description: string;
  score: number;
  useCount: number;
  lastUsedAt: string | null;
};

export type SocialPost = {
  id: number;
  status: SocialPostStatus;
  templateId: SocialTemplateId;
  wordId: string;
  situation: string;
  tweetText: string;
  linkUrl: string;
  xTweetId: string | null;
  postedAt: string | null;
  scheduledFor: string;
  errorMessage: string | null;
  createdAt: string;
};

export type SocialPostMetrics = {
  id: number;
  socialPostId: number;
  fetchedAt: string;
  impressions: number;
  likes: number;
  reposts: number;
  replies: number;
  bookmarks: number;
  urlClicks: number;
};

export type GeneratedTweet = {
  templateId: SocialTemplateId;
  wordId: string;
  situation: string;
  tweetText: string;
  linkUrl: string;
};

export type DailyTweetResult = {
  ok: boolean;
  dryRun: boolean;
  post?: SocialPost;
  message: string;
};
