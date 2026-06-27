import { NextResponse } from 'next/server';
import nodemailer from 'nodemailer';

const CONTACT_TO = 'kangtaizhangfeng98@gmail.com';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const name = typeof body.name === 'string' ? body.name.trim() : '';
    const message = typeof body.message === 'string' ? body.message.trim() : '';

    if (!name) {
      return NextResponse.json(
        { error: '名前を入力してください。 / Please enter your name.' },
        { status: 400 }
      );
    }

    if (name.length > 100) {
      return NextResponse.json(
        { error: '名前は100文字以内で入力してください。 / Name must be 100 characters or less.' },
        { status: 400 }
      );
    }

    if (!message) {
      return NextResponse.json(
        { error: 'メッセージを入力してください。 / Please enter a message.' },
        { status: 400 }
      );
    }

    if (message.length > 2000) {
      return NextResponse.json(
        {
          error:
            'メッセージは2000文字以内で入力してください。 / Message must be 2000 characters or less.',
        },
        { status: 400 }
      );
    }

    const host = process.env.SMTP_HOST;
    const port = Number(process.env.SMTP_PORT || 587);
    const user = process.env.SMTP_USER?.trim();
    const pass = process.env.SMTP_PASS?.replace(/\s/g, '');

    if (!host || !user || !pass) {
      console.error('Contact form: SMTP environment variables are not configured.');
      return NextResponse.json(
        {
          error:
            '送信機能の設定が完了していません。しばらくしてからもう一度お試しください。 / Message delivery is not configured yet.',
        },
        { status: 503 }
      );
    }

    const transporter = nodemailer.createTransport({
      host,
      port,
      secure: port === 465,
      auth: { user, pass },
    });

    await transporter.sendMail({
      from: `"Japanese Super Words" <${user}>`,
      to: CONTACT_TO,
      subject: `[Japanese Super Words] ${name} さんからのメッセージ`,
      text: `Japanese Super Words アプリからメッセージが届きました。\n\n名前: ${name}\n\n---\n\n${message}`,
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Contact form send failed:', error);
    return NextResponse.json(
      {
        error:
          '送信に失敗しました。しばらくしてからもう一度お試しください。 / Failed to send. Please try again later.',
      },
      { status: 500 }
    );
  }
}
