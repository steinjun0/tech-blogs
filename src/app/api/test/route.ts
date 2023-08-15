import { updateSiteTotalPost } from '@/scraping/scraping';
import { NextResponse } from 'next/server';

export const fetchCache = 'force-no-store';
export const revalidate = 0;

export async function GET() {
  // const res = await naver.getPosts();
  // const res = await kakao.getPosts();
  // postPosts(res)
  // const res = await updateAllSites()
  const res = await updateSiteTotalPost({ company: 'naver' });

  return NextResponse.json({ res });
}