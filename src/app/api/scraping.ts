import * as cheerio from 'cheerio';
const { Parser } = require("htmlparser2");
import * as htmlparser2 from "htmlparser2";
import { DomHandler } from "domhandler";
import { TCompnaies, companies } from '@/interface/post';
import { getPosts, postPosts } from '@/app/api/post/route';
import { convertDateToMysqlDate } from '@/service/util';


export async function updateAllSites() {
  const missingPosts: IPost[] = [];
  for (let i = 0; i < companies.length; i++) {
    const company = companies[i];
    const dbPosts = (await getPosts([company]));
    const realPosts = (await scrapSite(company)).sort((a, b) => b.date.getTime() - a.date.getTime());

    for (let i = 0; i < realPosts.length; i++) {
      const realPost = realPosts[i];
      let isFind = false;
      for (let j = 0; j < dbPosts.length; j++) {
        const dbPost = dbPosts[j];
        if (realPost.url === dbPost.url) {
          isFind = true;
          break;
        }
        if (realPost.date.getTime() > dbPost.date.getTime()) {
          break;
        }
      }
      if (!isFind) {
        missingPosts.push(realPost);
      }
    }
  }
  if (missingPosts.length > 0) {
    postPosts(missingPosts);
  }
}

export async function scrapSite(compnay: typeof companies[number]): Promise<IPost[]> {
  switch (compnay) {
    case 'toss':
      const posts = await tossScrap();
      return posts;
  }
}

export async function scrapLatest(compnay: typeof companies[number]) {
  switch (compnay) {
    case 'toss':
      const posts = await tossScrap();
      return posts[0];
    default:
      break;
  }
}

export interface IPost {
  url: string,
  title: string,
  description: string,
  date: Date;
  company: TCompnaies[number];
}



export async function tossScrap(): Promise<IPost[]> {
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

export function createUpdatePostsQuery(posts: IPost[]) {
  let query = 'INSERT INTO post (url, date, title, description, companyName) VALUES';
  posts.forEach((post) => {
    query += `('${post.url}', '${convertDateToMysqlDate(post.date)}', '${post.title}', '${post.description}', ${post.company}),`;
  });
  query = query.slice(0, -1);
  return posts;
}