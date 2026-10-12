import { NextResponse } from 'next/server';
import {
  uniwareChannelAccessToken,
  uniwareChannelCredentialsOk,
} from '@/lib/unicommerce/channel-auth';

function credentialsFrom(request: Request): { username: string; password: string } {
  const url = new URL(request.url);
  return {
    username: url.searchParams.get('username') || request.headers.get('username') || '',
    password: url.searchParams.get('password') || request.headers.get('password') || '',
  };
}

async function issueToken(request: Request) {
  let username = '';
  let password = '';
  try {
    const body = await request.clone().json();
    username = String(body?.username ?? '');
    password = String(body?.password ?? '');
  } catch {
    // Body is empty or not JSON, query and headers will be checked
  }

  const q = credentialsFrom(request);
  username = username || q.username;
  password = password || q.password;

  if (!uniwareChannelCredentialsOk(username, password)) {
    return NextResponse.json({ status: 'FAILED', errorMessage: 'Bad credentials' }, { status: 401 });
  }

  const token = uniwareChannelAccessToken() || 'playr-uniware-token';
  return NextResponse.json({
    status: 'SUCCESS',
    accessToken: token,
    access_token: token,
  });
}

export async function GET(request: Request) {
  return issueToken(request);
}

export async function POST(request: Request) {
  return issueToken(request);
}
