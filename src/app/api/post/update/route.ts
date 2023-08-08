import { updateAllSites } from '@/scraping/scraping';
import { NextResponse } from 'next/server';

export const fetchCache = 'force-no-store';
export const revalidate = 0;

export async function GET() {
  const res = await updateAllSites();

  return NextResponse.json({ res });
}