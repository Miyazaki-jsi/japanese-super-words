/**
 * Backfill Gumroad sales into Supabase (for purchases before webhooks were configured).
 *
 * Usage:
 *   GUMROAD_ACCESS_TOKEN=... SUPABASE_URL=... SUPABASE_SERVICE_ROLE_KEY=... npm run sync:gumroad
 */
import { syncGumroadPurchases } from '../src/lib/gumroadSync';

async function main(): Promise<void> {
  const result = await syncGumroadPurchases();
  console.log(result.message);
  console.log(
    JSON.stringify(
      {
        ok: result.ok,
        synced: result.synced,
        skipped: result.skipped,
        totalFetched: result.totalFetched,
      },
      null,
      2
    )
  );
  if (!result.ok) process.exit(1);
}

main().catch((error: unknown) => {
  const message = error instanceof Error ? error.message : String(error);
  console.error('Sync failed:', message);
  process.exit(1);
});
