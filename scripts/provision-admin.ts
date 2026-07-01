/**
 * Provision Supabase project + schema + Vercel admin env vars.
 *
 * See scripts/provision-admin.sh for required env vars.
 */
import { readFileSync } from 'node:fs';
import { randomBytes } from 'node:crypto';
import { resolve } from 'node:path';

const SUPABASE_API = 'https://api.supabase.com/v1';
const VERCEL_API = 'https://api.vercel.com';

const VERCEL_TOKEN =
  process.env.VERCEL_TOKEN?.trim() || process.env.VERCELL_TOKEN?.trim();
const SUPABASE_ACCESS_TOKEN = process.env.SUPABASE_ACCESS_TOKEN?.trim();
const VERCEL_PROJECT = process.env.VERCEL_PROJECT?.trim() || 'japanese-super-words';
const VERCEL_TEAM_ID = process.env.VERCEL_TEAM_ID?.trim();
const SUPABASE_PROJECT_NAME = process.env.SUPABASE_PROJECT_NAME?.trim() || 'jsw-analytics';
const SUPABASE_REGION = process.env.SUPABASE_REGION?.trim() || 'ap-northeast-1';
const SKIP_SUPABASE_CREATE = process.env.SKIP_SUPABASE_CREATE === '1';

const ADMIN_PASSWORD =
  process.env.ADMIN_PASSWORD?.trim() || randomBytes(18).toString('base64url');
const ADMIN_SESSION_SECRET =
  process.env.ADMIN_SESSION_SECRET?.trim() || randomBytes(32).toString('base64');

function requireEnv(name: string, value: string | undefined): string {
  if (!value) throw new Error(`Missing ${name}`);
  return value;
}

function vercelUrl(path: string): string {
  const url = new URL(path, VERCEL_API);
  if (VERCEL_TEAM_ID) url.searchParams.set('teamId', VERCEL_TEAM_ID);
  return url.toString();
}

async function supabaseFetch(path: string, init: RequestInit = {}): Promise<Response> {
  const token = requireEnv('SUPABASE_ACCESS_TOKEN', SUPABASE_ACCESS_TOKEN);
  const headers = new Headers(init.headers);
  headers.set('Authorization', `Bearer ${token}`);
  if (!headers.has('Content-Type') && init.body) {
    headers.set('Content-Type', 'application/json');
  }
  return fetch(`${SUPABASE_API}${path}`, { ...init, headers });
}

async function vercelFetch(path: string, init: RequestInit = {}): Promise<Response> {
  const token = requireEnv('VERCEL_TOKEN', VERCEL_TOKEN);
  const headers = new Headers(init.headers);
  headers.set('Authorization', `Bearer ${token}`);
  if (!headers.has('Content-Type') && init.body) {
    headers.set('Content-Type', 'application/json');
  }
  return fetch(vercelUrl(path), { ...init, headers });
}

async function sleep(ms: number): Promise<void> {
  await new Promise((r) => setTimeout(r, ms));
}

async function listSupabaseOrganizations(): Promise<{ id: string; name: string }[]> {
  const res = await supabaseFetch('/organizations');
  if (!res.ok) throw new Error(`Supabase orgs failed: ${res.status} ${await res.text()}`);
  const data = (await res.json()) as { id: string; name: string }[];
  return data;
}

async function findSupabaseProjectByName(name: string): Promise<{ id: string; ref: string } | null> {
  const res = await supabaseFetch('/projects');
  if (!res.ok) throw new Error(`Supabase projects failed: ${res.status} ${await res.text()}`);
  const projects = (await res.json()) as { id: string; name: string; ref?: string }[];
  const hit = projects.find((p) => p.name === name);
  if (!hit) return null;
  return { id: hit.id, ref: hit.ref ?? hit.id };
}

async function createSupabaseProject(orgId: string): Promise<{ ref: string }> {
  const dbPass = randomBytes(24).toString('base64url');
  const res = await supabaseFetch('/projects', {
    method: 'POST',
    body: JSON.stringify({
      organization_id: orgId,
      name: SUPABASE_PROJECT_NAME,
      region: SUPABASE_REGION,
      db_pass: dbPass,
    }),
  });
  if (!res.ok) throw new Error(`Supabase create failed: ${res.status} ${await res.text()}`);
  const data = (await res.json()) as { id: string; ref?: string };
  const ref = data.ref ?? data.id;
  console.log(`Created Supabase project "${SUPABASE_PROJECT_NAME}" (ref=${ref})`);
  return { ref };
}

async function waitForSupabaseProject(ref: string): Promise<void> {
  console.log('Waiting for Supabase project to become healthy…');
  for (let i = 0; i < 60; i++) {
    const res = await supabaseFetch(`/projects/${ref}/health`);
    if (res.ok) {
      const health = (await res.json()) as Record<string, unknown>;
      const values = Object.values(health);
      if (values.length === 0 || values.every((v) => v === 'ACTIVE_HEALTHY' || v === true)) {
        console.log('  Supabase project is healthy.');
        return;
      }
    }
    await sleep(10_000);
  }
  throw new Error('Timed out waiting for Supabase project health');
}

async function runSupabaseSchema(ref: string): Promise<void> {
  const schemaPath = resolve(process.cwd(), 'supabase/schema.sql');
  const query = readFileSync(schemaPath, 'utf8');
  const res = await supabaseFetch(`/projects/${ref}/database/query`, {
    method: 'POST',
    body: JSON.stringify({ query }),
  });
  if (!res.ok) throw new Error(`Supabase schema failed: ${res.status} ${await res.text()}`);
  console.log('  Applied supabase/schema.sql');
}

async function getSupabaseCredentials(ref: string): Promise<{ url: string; serviceRoleKey: string }> {
  const res = await supabaseFetch(`/projects/${ref}/api-keys?reveal=true`);
  if (!res.ok) throw new Error(`Supabase api-keys failed: ${res.status} ${await res.text()}`);

  const keys = (await res.json()) as {
    name?: string;
    api_key?: string;
    type?: string;
  }[];

  let serviceRoleKey = '';
  for (const key of keys) {
    const name = (key.name ?? '').toLowerCase();
    if (name === 'service_role' || name.includes('service_role')) {
      serviceRoleKey = key.api_key ?? '';
      break;
    }
  }

  if (!serviceRoleKey) {
    for (const key of keys) {
      if (key.api_key && key.api_key.length > 100) {
        serviceRoleKey = key.api_key;
        break;
      }
    }
  }

  if (!serviceRoleKey) {
    throw new Error('Could not find service_role API key in Supabase project');
  }

  const url = `https://${ref}.supabase.co`;
  return { url, serviceRoleKey };
}

async function upsertVercelEnv(key: string, value: string): Promise<void> {
  const targets = ['production', 'preview', 'development'];
  const res = await vercelFetch(`/v10/projects/${VERCEL_PROJECT}/env?upsert=true`, {
    method: 'POST',
    body: JSON.stringify({
      key,
      value,
      type: 'encrypted',
      target: targets,
    }),
  });
  if (!res.ok) {
    throw new Error(`Vercel env ${key} failed: ${res.status} ${await res.text()}`);
  }
  console.log(`  Vercel env set: ${key}`);
}

async function triggerRedeploy(): Promise<void> {
  console.log('\nRedeploy: open Vercel dashboard → Deployments → Redeploy (or push to main).');
}

async function main(): Promise<void> {
  console.log('== Provision admin + Supabase ==\n');

  let supabaseUrl = process.env.SUPABASE_URL?.trim() ?? '';
  let serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY?.trim() ?? '';

  if (!SKIP_SUPABASE_CREATE || !supabaseUrl || !serviceRoleKey) {
    const orgs = await listSupabaseOrganizations();
    if (orgs.length === 0) throw new Error('No Supabase organizations found on this account');
    console.log(`Using Supabase org: ${orgs[0].name} (${orgs[0].id})`);

    let project = await findSupabaseProjectByName(SUPABASE_PROJECT_NAME);
    if (!project) {
      project = await createSupabaseProject(orgs[0].id);
    } else {
      console.log(`Reusing Supabase project "${SUPABASE_PROJECT_NAME}" (ref=${project.ref})`);
    }

    await waitForSupabaseProject(project.ref);
    await runSupabaseSchema(project.ref);
    const creds = await getSupabaseCredentials(project.ref);
    supabaseUrl = creds.url;
    serviceRoleKey = creds.serviceRoleKey;
  }

  console.log('\nSetting Vercel environment variables…');
  await upsertVercelEnv('SUPABASE_URL', supabaseUrl);
  await upsertVercelEnv('SUPABASE_SERVICE_ROLE_KEY', serviceRoleKey);
  await upsertVercelEnv('ADMIN_PASSWORD', ADMIN_PASSWORD);
  await upsertVercelEnv('ADMIN_SESSION_SECRET', ADMIN_SESSION_SECRET);

  console.log('\nVerifying Supabase tables…');
  process.env.SUPABASE_URL = supabaseUrl;
  process.env.SUPABASE_SERVICE_ROLE_KEY = serviceRoleKey;
  const { execSync } = await import('node:child_process');
  execSync('npx tsx scripts/verify-supabase.ts', { stdio: 'inherit' });

  console.log('\n== Done ==');
  console.log(`Admin login: https://japanese-super-words.vercel.app/admin/login`);
  console.log(`ADMIN_PASSWORD: ${ADMIN_PASSWORD}`);
  console.log('ADMIN_SESSION_SECRET: (stored in Vercel — not printed again)');
  console.log('\nRedeploy the Vercel project if admin.ready is still false.');
  await triggerRedeploy();
}

main().catch((err: unknown) => {
  console.error(err instanceof Error ? err.message : err);
  process.exit(1);
});
