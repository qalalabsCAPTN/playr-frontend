import { NextResponse } from 'next/server';

export async function GET() {
  const rewards = [
    { id: 'rew_10off', title: '10% Off Matchwear', pointsRequired: 500, code: 'MATCH10' },
    { id: 'rew_free_shipping', title: 'Free Express Shipping', pointsRequired: 250, code: 'FREESHIP' },
    { id: 'rew_jersey_name', title: 'Free Jersey Personalization', pointsRequired: 1000, code: 'FREECUSTOM' },
    { id: 'rew_vip_box', title: 'playR Fan Kit Box', pointsRequired: 2500, code: 'FANKIT' },
  ];

  return NextResponse.json({ rewards });
}
