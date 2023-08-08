import * as cheerio from 'cheerio';
import { IPost } from "./scraping";

export async function scrap(): Promise<IPost[]> {
  const url = 'https://toss.tech/';
  const response = await fetch(url);
  const html = await response.text();
  const $ = cheerio.load(html);

  const latest = $('#__next > div.p-container.p-container--default > div > div > ul > a');
  const posts: IPost[] = [];

  for (let i = 0; i < latest.length; i++) {
    const post: IPost = {
      url: '',
      title: '',
      description: '',
      date: new Date(),
      company: 'toss'
    };
    const element = latest[i];
    // console.log('href', (element as any).attribs.href);
    post.url = 'https://toss.tech' + (element as any).attribs.href;
    $(element).children().each((i, e) => {
      if (e.tagName !== 'style' && e.tagName !== 'img') {
        const tempArr: string[] = [];
        if ($(e).children().length > 1) {
          $(e).children().each((i, e) => {
            if (e.tagName !== 'style') {
              tempArr.push($(e).text());
            }
          });
          post.description = tempArr[1];
          post.title = tempArr[0];
          post.date = new Date(tempArr[2]);
        } else {
          // 
        }
      }
      if (post.url !== '' && post.title !== '' && post.description !== '') {
        posts.push(post);
      }
    });
  }
  return posts;
}

export default { getPosts: scrap,getTotalPosts:scrap };