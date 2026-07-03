export type XErrorHelp = {
  title: string;
  message: string;
  userSteps: string[];
};

export function explainXApiError(raw: string): XErrorHelp {
  const lower = raw.toLowerCase();

  if (
    lower.includes('attached to a project') ||
    lower.includes('client-not-enrolled') ||
    lower.includes('client forbidden')
  ) {
    return {
      title: 'X API：プロジェクトに紐づいていないキーです',
      message:
        'Vercelに入れたキーが、X Developer Portal の「Project 内のアプリ」のものではない可能性があります。',
      userSteps: [
        'console.x.com または developer.x.com の Projects 画面を開く',
        'eic_tool が Project の中に入っているか確認（Standalone Apps だけだと失敗します）',
        'Project 内の eic_tool の鍵アイコンからキー4つを再取得',
        'Access Token を Regenerate（Read and Write になっているか確認）',
        'Vercel の X_* 4つを新しい値に更新して Redeploy',
        'この画面で「もう一度投稿する」を押す',
      ],
    };
  }

  if (lower.includes('403') || lower.includes('forbidden')) {
    return {
      title: 'X API：権限エラー（403）',
      message: '投稿権限が足りないか、トークンが古い可能性があります。',
      userSteps: [
        'アプリの User authentication を Read and Write に設定',
        'Access Token を Regenerate',
        'Vercel の X_ACCESS_TOKEN と X_ACCESS_TOKEN_SECRET を更新',
        'Redeploy 後に「もう一度投稿する」',
      ],
    };
  }

  if (lower.includes('401') || lower.includes('unauthorized')) {
    return {
      title: 'X API：認証エラー（401）',
      message: 'キーまたはトークンが間違っている可能性があります。',
      userSteps: [
        'Vercel の X_API_KEY / X_API_SECRET / X_ACCESS_TOKEN / X_ACCESS_TOKEN_SECRET を確認',
        'コピペ時の余分なスペースがないか確認',
        '鍵アイコンから再生成した値で入れ直す',
        'Redeploy',
      ],
    };
  }

  return {
    title: 'X API エラー',
    message: raw,
    userSteps: ['エラー文をそのまま送ってもらえれば、次の対処を案内します。'],
  };
}
