import type { SocialTemplate, SocialTemplateId } from './types';
import { DEFAULT_TEMPLATE_SCORE } from './constants';

export function computeEngagementScore(metrics: {
  impressions?: number;
  likes?: number;
  reposts?: number;
  replies?: number;
  bookmarks?: number;
  urlClicks?: number;
}): number {
  const likes = metrics.likes ?? 0;
  const reposts = metrics.reposts ?? 0;
  const replies = metrics.replies ?? 0;
  const bookmarks = metrics.bookmarks ?? 0;
  const urlClicks = metrics.urlClicks ?? 0;
  const impressions = metrics.impressions ?? 0;

  const raw =
    likes * 3 +
    reposts * 5 +
    replies * 2 +
    bookmarks * 4 +
    urlClicks * 6 +
    impressions * 0.01;

  return Math.max(0.1, raw);
}

export function blendTemplateScore(currentScore: number, engagement: number): number {
  const normalized = Math.min(10, Math.log10(engagement + 1) * 4);
  return currentScore * 0.65 + normalized * 0.35;
}

export function pickTemplateId(templates: SocialTemplate[]): SocialTemplateId {
  if (templates.length === 0) return 'save_card';

  const exploreRoll = Math.random();
  const sorted = [...templates].sort((a, b) => b.score - a.score);

  if (exploreRoll < 0.2) {
    const random = sorted[Math.floor(Math.random() * sorted.length)];
    return random.id;
  }

  const weights = sorted.map((template) => Math.max(0.1, template.score ** 2));
  const total = weights.reduce((sum, weight) => sum + weight, 0);
  let roll = Math.random() * total;

  for (let i = 0; i < sorted.length; i++) {
    roll -= weights[i];
    if (roll <= 0) return sorted[i].id;
  }

  return sorted[0].id;
}

export function getDefaultTemplateScores(): Record<SocialTemplateId, number> {
  return {
    save_card: DEFAULT_TEMPLATE_SCORE + 0.2,
    phrase_note: DEFAULT_TEMPLATE_SCORE + 0.1,
    quick_tip: DEFAULT_TEMPLATE_SCORE,
    situation_bite: DEFAULT_TEMPLATE_SCORE + 0.05,
  };
}
