import { NextResponse } from 'next/server';
import { isAdminApiAuthorized } from '@/lib/adminApiAuth';
import { getSocialPostById, updateSocialPostStatus } from '@/lib/social/socialDb';

export async function POST(request: Request) {
  if (!(await isAdminApiAuthorized())) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const body = (await request.json()) as {
      postId?: number;
      xTweetId?: string;
    };

    const postId = Number(body.postId);
    if (!Number.isFinite(postId)) {
      return NextResponse.json({ error: 'Invalid postId' }, { status: 400 });
    }

    const existing = await getSocialPostById(postId);
    if (!existing) {
      return NextResponse.json({ error: 'Post not found' }, { status: 404 });
    }

    const xTweetId =
      typeof body.xTweetId === 'string' && body.xTweetId.trim()
        ? body.xTweetId.trim()
        : null;

    const post = await updateSocialPostStatus(postId, {
      status: 'posted',
      xTweetId,
      postedAt: new Date().toISOString(),
      errorMessage: null,
    });

    return NextResponse.json({ ok: true, post });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to mark as posted' },
      { status: 500 }
    );
  }
}
