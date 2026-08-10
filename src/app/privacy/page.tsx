import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowLeft, Shield } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Privacy Policy · Japanese Super Words',
  description:
    'Privacy policy for Japanese Super Words — what we collect, how we use it, and your choices.',
  robots: { index: true, follow: true },
};

const LAST_UPDATED = 'June 29, 2026';

function Section({
  titleEn,
  titleJa,
  children,
}: {
  titleEn: string;
  titleJa: string;
  children: React.ReactNode;
}) {
  return (
    <section className="space-y-3">
      <h2 className="text-lg font-extrabold text-slate-900">{titleEn}</h2>
      <p className="text-sm font-semibold text-indigo-600">{titleJa}</p>
      <div className="space-y-3 text-sm leading-relaxed text-slate-600">{children}</div>
    </section>
  );
}

export default function PrivacyPage() {
  return (
    <main className="min-h-full bg-gradient-to-b from-slate-50 to-white">
      <div className="mx-auto max-w-2xl px-5 py-8 pb-16">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-sm font-bold text-indigo-600 hover:text-indigo-700"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to app / アプリに戻る
        </Link>

        <div className="mt-6 rounded-[28px] border border-slate-100 bg-white p-6 shadow-sm sm:p-8">
          <div className="flex items-start gap-4">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-indigo-100 text-indigo-600">
              <Shield className="h-6 w-6" />
            </div>
            <div>
              <h1 className="text-2xl font-black text-slate-900">Privacy Policy</h1>
              <p className="mt-1 text-sm font-semibold text-slate-500">プライバシーポリシー</p>
              <p className="mt-2 text-xs text-slate-400">Last updated / 最終更新: {LAST_UPDATED}</p>
            </div>
          </div>

          <p className="mt-6 text-sm leading-relaxed text-slate-600">
            Japanese Super Words (&quot;the App&quot;) is a companion web app for Japanese Super
            Immersion. We keep data collection to a minimum. This policy explains what is stored,
            where it goes, and what you can control.
          </p>
          <p className="text-sm leading-relaxed text-slate-500">
            Japanese Super Words（本アプリ）は Japanese Super Immersion
            のコンパニオンアプリです。収集するデータは必要最小限に抑えています。本ポリシーでは、保存される情報、送信先、およびユーザーが管理できる内容を説明します。
          </p>

          <div className="mt-8 space-y-8">
            <Section titleEn="1. No account required" titleJa="1. アカウント登録は不要">
              <p>
                The App does not require sign-up. Progress, favorites, unlock status, and settings
                are stored in your browser&apos;s <strong>local storage</strong> on your device.
              </p>
              <p>
                本アプリにユーザー登録はありません。学習進捗、お気に入り、アンロック状態、設定などは、お使いの端末のブラウザ
                <strong>localStorage</strong> に保存されます。
              </p>
            </Section>

            <Section titleEn="2. Data stored on your device" titleJa="2. 端末内に保存されるデータ">
              <ul className="list-disc space-y-2 pl-5">
                <li>Learning progress, favorites, trip date, phrase level results</li>
                <li>Premium / Trip unlock flags (after you enter a valid code)</li>
                <li>Intro and onboarding completion flags</li>
                <li>Anonymous analytics visitor ID (random UUID)</li>
              </ul>
              <ul className="list-disc space-y-2 pl-5 text-slate-500">
                <li>学習進捗、お気に入り、旅行日、フレーズレベル診断結果</li>
                <li>有料プランのアンロック状態（コード入力後）</li>
                <li>イントロ・オンボーディングの完了状態</li>
                <li>匿名のアナリティクス用 visitor ID（ランダム UUID）</li>
              </ul>
              <p>
                You can export a backup JSON via <strong>Settings → Save backup</strong>, restore it
                later, or delete everything via <strong>Settings → Reset Saved Data</strong>.
              </p>
              <p className="text-slate-500">
                <strong>設定 → バックアップ保存</strong> でJSONを書き出せます。復元も同画面から。削除は
                <strong>設定 → 保存データをリセット</strong> です。
              </p>
            </Section>

            <Section titleEn="3. Analytics we collect" titleJa="3. 収集する利用状況データ">
              <p>
                To improve the App, we record anonymous usage events (e.g. intro completed, Day 1
                finished, unlock modal opened). Events may include:
              </p>
              <ul className="list-disc space-y-2 pl-5">
                <li>Event name and timestamp</li>
                <li>Anonymous visitor ID</li>
                <li>Optional campaign tags (e.g. utm_source, video) if you open a tagged link</li>
              </ul>
              <p className="text-slate-500">
                アプリ改善のため、匿名の利用イベント（イントロ完了、Day 1
                完了、アンロック画面表示など）を記録します。イベント名、日時、匿名 visitor
                ID、およびタグ付きリンク経由の場合は utm_source や video などの流入情報が含まれることがあります。
              </p>
              <p>
                Events are sent to our server and stored in <strong>Supabase</strong> (database
                hosting). We do not sell this data.
              </p>
              <p className="text-slate-500">
                データは当方サーバー経由で <strong>Supabase</strong>{' '}
                に保存されます。第三者への販売は行いません。
              </p>
            </Section>

            <Section titleEn="4. Contact form" titleJa="4. お問い合わせフォーム">
              <p>
                If you send a message through Settings, we receive your <strong>name</strong>,{' '}
                <strong>message text</strong>, and optionally your <strong>email</strong> (only if
                you enter it). Email is used only to reply when we can. Please do not include
                passwords or payment card numbers.
              </p>
              <p className="text-slate-500">
                設定画面からメッセージを送信した場合、<strong>お名前</strong>と
                <strong>メッセージ内容</strong>、任意で入力した<strong>メールアドレス</strong>
                がメールで運営者に届きます。メールは返信のためにのみ使います。パスワードやクレジットカード番号は入力しないでください。
              </p>
            </Section>

            <Section titleEn="5. Purchases (Gumroad)" titleJa="5. 購入（Gumroad）">
              <p>
                Paid content is sold through <strong>Gumroad</strong>, a third-party checkout. Payment
                and billing are handled by Gumroad under their privacy policy. The App only verifies
                an unlock code you enter — we do not store your payment details.
              </p>
              <p className="text-slate-500">
                有料コンテンツは第三者サービス <strong>Gumroad</strong>{' '}
                で販売されます。決済情報は Gumroad
                のポリシーに従い処理され、本アプリは入力されたアンロックコードの検証のみ行い、決済情報は保存しません。
              </p>
            </Section>

            <Section titleEn="6. Third-party services" titleJa="6. 利用している外部サービス">
              <ul className="list-disc space-y-2 pl-5">
                <li>
                  <strong>Vercel</strong> — hosts the App
                </li>
                <li>
                  <strong>Supabase</strong> — stores anonymous analytics events
                </li>
                <li>
                  <strong>Gumroad</strong> — payments (when you purchase)
                </li>
                <li>
                  <strong>Plausible</strong> — optional, privacy-friendly analytics (if enabled)
                </li>
              </ul>
            </Section>

            <Section titleEn="7. Cookies" titleJa="7. Cookie について">
              <p>
                The App uses a session cookie only for the private admin dashboard (operators
                only). The public App relies mainly on local storage, not login cookies.
              </p>
              <p className="text-slate-500">
                一般ユーザー向け機能ではログイン Cookie は使いません。管理者用ダッシュボード（/admin）のみ、運営者のセッション管理に
                Cookie を使用します。
              </p>
            </Section>

            <Section titleEn="8. Children" titleJa="8. 未成年者">
              <p>
                The App is intended for general audiences learning Japanese for travel. We do not
                knowingly collect personal information from children under 13.
              </p>
              <p className="text-slate-500">
                本アプリは旅行向け日本語学習を目的としています。13
                歳未満から故意に個人情報を収集することはありません。
              </p>
            </Section>

            <Section titleEn="9. Changes" titleJa="9. ポリシーの変更">
              <p>
                We may update this policy. The &quot;Last updated&quot; date at the top will change
                when we do.
              </p>
              <p className="text-slate-500">
                本ポリシーは予告なく変更される場合があります。変更時はページ上部の最終更新日を更新します。
              </p>
            </Section>

            <Section titleEn="10. Contact" titleJa="10. お問い合わせ">
              <p>
                Questions about privacy? Use the message form in the App&apos;s Settings, or contact
                us through the Japanese Super Immersion YouTube / social channels.
              </p>
              <p className="text-slate-500">
                プライバシーに関するご質問は、アプリの設定画面からメッセージを送るか、Japanese Super
                Immersion の YouTube / SNS からご連絡ください。
              </p>
            </Section>
          </div>
        </div>
      </div>
    </main>
  );
}
