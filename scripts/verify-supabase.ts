/**
 * Verify Supabase connection and required tables for the admin dashboard.
 * Usage: SUPABASE_URL=... SUPABASE_SERVICE_ROLE_KEY=... npx tsx scripts/verify-supabase.ts
 */
import { createClient } from '@supabase/supabase-js';

const url = process.env.SUPABASE_URL?.trim();
const key = process.env.SUPABASE_SERVICE_ROLE_KEY?.trim();

if (!url || !key) {
  console.error('Missing env: SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY are required.');
  process.exit(1);
}

const db = createClient(url, key, {
  auth: { persistSession: false, autoRefreshToken: false },
});

const REQUIRED_TABLES = ['analytics_events', 'gumroad_purchases'] as const;

async function checkTable(table: (typeof REQUIRED_TABLES)[number]): Promise<void> {
  const { error } = await db.from(table).select('*', { count: 'exact', head: true });
  if (error) {
    throw new Error(`${table}: ${error.message}`);
  }
  console.log(`  OK  ${table}`);
}

async function main(): Promise<void> {
  console.log('Checking Supabase…');
  for (const table of REQUIRED_TABLES) {
    await checkTable(table);
  }
  console.log('Supabase ready for analytics + Gumroad purchase storage.');
}

main().catch((err: unknown) => {
  const message = err instanceof Error ? err.message : String(err);
  console.error('Supabase check failed:', message);
  console.error('Run supabase/schema.sql in Supabase SQL Editor if tables are missing.');
  process.exit(1);
});
