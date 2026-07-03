import { NextResponse } from 'next/server';
import { isAdminApiAuthorized } from '@/lib/adminApiAuth';
import { getSocialPostById, upsertPostMetrics } from '@/lib/social/socialDb';

function readCount(value: unknown): number {
  const num = Number(value);
  return Number.isFinite(num) && num >= 0 ? Math.floor(num) : 0;
}

export async function POST(request: Request) {
  if (!(await isAdminApiAuthorized())) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const body = (await request.json()) as {
      postId?: number;
      likes?: number;
      reposts?: number;
      replies?: number;
      bookmarks?: number;
      impressions?: number;
      urlClicks?: number;
    };

    const postId = Number(body.postId);
    if (!Number.isFinite(postId)) {
      return NextResponse.json({ error: 'Invalid postId' }, { status: 400 });
    }

    const existing = await getSocialPostById(postId);
    if (!existing) {
      return NextResponse.json({ error: 'Post not found' }, { status: 404 });
    }

    const metrics = await upsertPostMetrics({
      socialPostId: postId,
      likes: readCount(body.likes),
      reposts: readCount(body.reposts),
      replies: readCount(body.replies),
      bookmarks: readCount(body.bookmarks),
      impressions: readCount(body.impressions),
      urlClicks: readCount(body.urlClicks),
    });

    return NextResponse.json({ ok: true, metrics });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to save metrics' },
      { status: 500 }
    );
  }
}
