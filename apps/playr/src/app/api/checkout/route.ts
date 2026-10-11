import { NextRequest } from 'next/server';
import { POST as easebuzzPost } from './easebuzz/route';

export async function POST(req: NextRequest) {
  return easebuzzPost(req);
}
