import { NextResponse } from 'next/server';
import { updateAllSites } from '../../scraping';

export async function GET() {
  const res = await updateAllSites();

  return NextResponse.json({ res });
}