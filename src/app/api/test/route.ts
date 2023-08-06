import { NextResponse } from 'next/server';
import { updateAllSites } from '@/scraping/scraping';
import kakaoScrp from '@/scraping/kakao';

export async function GET() {
  const res = await kakaoScrp.totalScrap();

  return NextResponse.json({ res });
}