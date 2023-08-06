import * as cheerio from 'cheerio';
const { Parser } = require("htmlparser2");
import * as htmlparser2 from "htmlparser2";
// import * as domhandler from "domhandler";
// const { DomHandler } = require("domhandler");
import { DomHandler } from "domhandler";
import { companies } from '@/interface/post';
// const htmlparser2 = require('htmlparser2');


export function scrapAllSite() {
  companies.forEach((company) => {
    const latest = scrapLatest(company);
    // const dbLatestUrl = db.found(company).url
    // if(latest.url === dbLatestUrl) return;
    // db.push(latest)
  });
  // db의 최신 row를 체크
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
    console.log('posts', posts);
  }
  return posts;
}

export async function updatePosts(company: typeof companies[number]) {
  switch (company) {
    case 'toss':
      const posts = await tossScrap();
      let query = 'INSERT INTO post (url, date, title, description, company_name) VALUES';
      posts.forEach((post) => {
        query += `('${post.url}', '${convertDateToMysqlDate(post.date)}', '${post.title}', '${post.description}', 'toss'),`;
      });
      query = query.slice(0, -1);
      console.log(query);
      return posts;
    default:
      break;
  }
}

function convertDateToMysqlDate(date: Date) {
  return date.toISOString().slice(0, 10);
}