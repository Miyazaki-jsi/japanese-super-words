import { cookies } from 'next/headers';
import {
  ADMIN_SESSION_COOKIE,
  isAdminAuthConfigured,
  verifyAdminSessionToken,
} from '@/lib/adminAuth';

export async function isAdminApiAuthorized(): Promise<boolean> {
  if (!isAdminAuthConfigured()) return false;
  const jar = await cookies();
  const token = jar.get(ADMIN_SESSION_COOKIE)?.value;
  return verifyAdminSessionToken(token);
}
