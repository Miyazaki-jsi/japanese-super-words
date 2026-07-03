import { NextResponse } from 'next/server';
import { isAdminApiAuthorized } from '@/lib/adminApiAuth';
import { testXConnection } from '@/lib/social/xClient';

export async function POST() {
  if (!(await isAdminApiAuthorized())) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const result = await testXConnection();
  return NextResponse.json(result);
}
