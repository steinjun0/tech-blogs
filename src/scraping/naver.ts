import * as cheerio from 'cheerio';
import puppeteer from 'puppeteer';
import { IPost } from "./scraping";

export async function scrap({pageId}={pageId:0}): Promise<IPost[]> {
  const url = (id: number) => `https://d2.naver.com/home?page=${id}`;

  const browser = await puppeteer.launch({
    args: ['--no-sandbox', '--disable-setuid-sandbox'],
  });
  const pageData = await browser.newPage();

  await pageData.goto(url(pageId));

  await pageData.setViewport({width: 1080, height: 1024});
 
  const selector = await pageData.$(
    '.contents'
  );
  const html = await selector?.evaluate((el) => el.innerHTML)
  const $ = cheerio.load(html as string);
  const postElements = $('.post_article');
  const posts: IPost[] = [];

  for(let i=0;i<postElements.length;i++){
    const post: IPost = {
      url: 'https://d2.naver.com',
      title: '',
      description: '',
      date: new Date(),
      company: 'naver'
    };

    const postElement = postElements[i];
    post.url += $(postElement).find('a').attr('href') as string;
    post.title = $(postElement).find('h2').text();
    post.description = $(postElement).find('.post_txt').text();
    post.date = new Date($(postElement).find('dl > dd').text().slice(0,10));
    posts.push(post);
  }
  browser.close();
  return posts;
}

export async function totalScrap(): Promise<IPost[]> {
  const posts: IPost[] = [];
  for(let i=20;i<=27;i++){ 
    // 수동으로 마지막페이지 설정(23.08.08 기준) 27 페이지
    // 한번에 다 돌리면 timeout 발생. 10개씩 끊어서
    console.log('pageId',i)
    posts.push(...await scrap({pageId:i}))
  }
  return posts;
}


export default { getPosts: scrap, getTotalPosts:totalScrap };