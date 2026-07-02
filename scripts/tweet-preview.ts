/**
 * Print today's auto-tweet without posting.
 * Usage: npm run tweet:preview
 */
import { TWEET_TEMPLATES } from '../src/lib/dailyTweetTemplates';
import {
  buildDailyTweetText,
  getAppBaseUrl,
  getMaxTweetChars,
  pickDailyPhrase,
} from '../src/lib/dailyTweet';

const card = pickDailyPhrase();

async function main() {
  const appBaseUrl = getAppBaseUrl();
  const built = await buildDailyTweetText(card, appBaseUrl);

  console.log('--- Daily tweet preview ---');
  console.log(built.text);
  console.log('---');
  console.log(`Card: ${card.id} (${card.situation})`);
  console.log(`Template: ${built.templateId}`);
  console.log(`Link: ${built.link}`);
  console.log(`Chars: ${built.charCount} (max ${getMaxTweetChars()})`);
  console.log('');
  console.log('All templates for this phrase:');
  for (const t of TWEET_TEMPLATES) {
    const sample = t.build({ card, link: built.link });
    console.log(`\n[${t.id}] ${sample.slice(0, 120).replace(/\n/g, ' ')}...`);
  }
}

main().catch(console.error);
