/**
 * Print today's auto-tweet without posting.
 * Usage: npm run tweet:preview
 */
import { buildDailyTweetText, getAppBaseUrl, pickDailyPhrase } from '../src/lib/dailyTweet';

const card = pickDailyPhrase();
const { text, link } = buildDailyTweetText(card, getAppBaseUrl());

console.log('--- Daily tweet preview ---');
console.log(text);
console.log('---');
console.log(`Card: ${card.id} (${card.situation})`);
console.log(`Link: ${link}`);
console.log(`Chars (raw): ${text.length}`);
