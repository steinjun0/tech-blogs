import * as cheerio from 'cheerio';
import { IPost } from "./scraping";

export async function scrap(): Promise<IPost[]> {
  // https://tech.kakao.com/blog/#posts
  const url = 'https://tech.kakao.com/blog/#posts';
  const response = await fetch(url);
  const html = await response.text();
  const $ = cheerio.load(html);

  const latest = $('body > div.elementor.elementor-14340.elementor-location-single.post-2040.page.type-page.status-publish.hentry > div > section.elementor-section.elementor-top-section.elementor-element.elementor-element-150ab43d.elementor-section-boxed.elementor-section-height-default.elementor-section-height-default > div > div > div.elementor-column.elementor-col-66.elementor-top-column.elementor-element.elementor-element-5764dc96 > div > div > div.elementor-element.elementor-element-e059563.elementor-grid-1.elementor-posts--thumbnail-none.elementor-grid-tablet-2.elementor-grid-mobile-1.elementor-widget.elementor-widget-posts > div > div.elementor-posts-container.elementor-posts.elementor-posts--skin-classic.elementor-grid > article > div');
  // console.log(latest.html());
  const posts: IPost[] = [];


  for (let i = 0; i < latest.length; i++) {
    const post: IPost = {
      url: '',
      title: '',
      description: '',
      date: new Date(),
      company: 'kakao'
    };
    const element = latest[i];
    const titleA = $(element).find('h3 > a');
    const date = $(element).find('div.elementor-post__meta-data > span.elementor-post-date');
    const description = $(element).find('div.elementor-post__excerpt');

    post.title = titleA.text().replaceAll('\n', '').replaceAll('\t', '');
    post.url = titleA.attr('href') as string;
    post.date = new Date(date.text());
    post.description = description.text().replaceAll('\n', '').replaceAll('\t', '');
    posts.push(post);
  }
  return posts;
}

export async function totalScrap(): Promise<IPost[]> {

  const url = (id: number) => `https://tech.kakao.com/blog/page/${id}/#posts`;

  const response = await fetch(url(2));

  // get last page index
  const html = await response.text();
  const $ = cheerio.load(html);
  const lastPageIndex = $('body > div.elementor.elementor-14340.elementor-location-single.post-2040.page.type-page.status-publish.hentry > div > section.elementor-section.elementor-top-section.elementor-element.elementor-element-150ab43d.elementor-section-boxed.elementor-section-height-default.elementor-section-height-default > div > div > div.elementor-column.elementor-col-66.elementor-top-column.elementor-element.elementor-element-5764dc96 > div > div > div.elementor-element.elementor-element-e059563.elementor-grid-1.elementor-posts--thumbnail-none.elementor-grid-tablet-2.elementor-grid-mobile-1.elementor-widget.elementor-widget-posts > div > nav > a:nth-child(7)');
  const lastPage = parseInt(lastPageIndex.text().replace('Page', ''));
  // 

  const posts: IPost[] = [];

  // first page
  const recentPosts = await scrap();
  posts.push(...recentPosts);

  // second page
  for (let page = 2; page <= lastPage; page++) {
    const response = await fetch(url(page));
    const html = await response.text();
    const $ = cheerio.load(html);
    const latest = $('body > div.elementor.elementor-14340.elementor-location-single.post-2040.page.type-page.status-publish.hentry > div > section.elementor-section.elementor-top-section.elementor-element.elementor-element-150ab43d.elementor-section-boxed.elementor-section-height-default.elementor-section-height-default > div > div > div.elementor-column.elementor-col-66.elementor-top-column.elementor-element.elementor-element-5764dc96 > div > div > div.elementor-element.elementor-element-e059563.elementor-grid-1.elementor-posts--thumbnail-none.elementor-grid-tablet-2.elementor-grid-mobile-1.elementor-widget.elementor-widget-posts > div > div.elementor-posts-container.elementor-posts.elementor-posts--skin-classic.elementor-grid > article > div');
    for (let i = 0; i < latest.length; i++) {
      const post: IPost = {
        url: '',
        title: '',
        description: '',
        date: new Date(),
        company: 'kakao'
      };
      const element = latest[i];
      const titleA = $(element).find('h3 > a');
      const date = $(element).find('div.elementor-post__meta-data > span.elementor-post-date');
      const description = $(element).find('div.elementor-post__excerpt');

      post.title = titleA.text().replaceAll('\n', '').replaceAll('\t', '');
      post.url = titleA.attr('href') as string;
      post.date = new Date(date.text());
      post.description = description.text().replaceAll('\n', '').replaceAll('\t', '');
      posts.push(post);
    }
    console.log(`kakao page ${page} done`);
  }

  return posts;
}


export default { getPosts: scrap, totalScrap };