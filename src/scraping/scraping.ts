import { getPosts, postPosts } from '@/app/api/post/route';
import { TCompany, companies } from '@/interface/post';
import { convertDateToMysqlDate } from '@/service/util';
import kakaoScrap from './kakao';
import naverScrap from './naver';
import tossScrap from './toss';


export async function updateAllSites() {
  const missingPosts: IPost[] = [];
  for (let i = 0; i < companies.length; i++) {
    const company = companies[i];
    const dbPosts = (await getPosts({companies:[company]}));
    const realPosts = (await scrapSite(company)).sort((a, b) => b.date.getTime() - a.date.getTime());

    for (let i = 0; i < realPosts.length; i++) {
      const realPost = realPosts[i];
      let isFind = false;
      for (let j = 0; j < dbPosts.posts.length; j++) {
        const dbPost = dbPosts.posts[j];
        if (realPost.url === dbPost.url) {
          isFind = true;
          break;
        }
        if (realPost.date.getTime() > dbPost.date.getTime() + 1000 * 60 * 60 * 48) {
          break;
        }
      }
      if (!isFind) {
        missingPosts.push(realPost);
      }
    }
  }
  console.log('missingPosts', missingPosts);
  if (missingPosts.length > 0) {
    postPosts(missingPosts);
  }
  missingPosts.length = 0
}

export async function updateSiteTotalPost({company}:{company:TCompany}) {
  const missingPosts: IPost[] = [];
  const dbPosts = (await getPosts({companies:[company]}));
  const realPosts = (await scrapSiteTotal(company)).sort((a, b) => b.date.getTime() - a.date.getTime());

  for (let i = 0; i < realPosts.length; i++) {
    const realPost = realPosts[i];
    let isFind = false;
    for (let j = 0; j < dbPosts.posts.length; j++) {
      const dbPost = dbPosts.posts[j];
      if (realPost.url === dbPost.url) {
        isFind = true;
        break;
      }
      if (realPost.date.getTime() > dbPost.date.getTime() + 1000 * 60 * 60 * 48) {
        break;
      }
    }
    if (!isFind) {
      missingPosts.push(realPost);
    }
  }
  if (missingPosts.length > 0) {
    postPosts(missingPosts);
  }
  dbPosts.posts.length = 0
  realPosts.length = 0
}

export async function scrapSite(company: TCompany): Promise<IPost[]> {
  type TScrap = { getPosts: (param?:any) => Promise<IPost[]>; };
  const companyScraps: { [key in TCompany]: TScrap } = {
    'toss': tossScrap,
    'kakao': kakaoScrap,
    'naver': naverScrap,
  };
  const posts = await companyScraps[company].getPosts();
  return posts;
}

export async function scrapSiteTotal(company: TCompany): Promise<IPost[]> {
  type TScrap = { getPosts: (param?:any) => Promise<IPost[]>, getTotalPosts: (param?:any) => Promise<IPost[]>};
  const companyScraps: { [key in TCompany]: TScrap } = {
    'toss': tossScrap,
    'kakao': kakaoScrap,
    'naver': naverScrap,
  };
  const posts = await companyScraps[company].getTotalPosts();
  return posts;
}

export interface IPost {
  url: string,
  title: string,
  description: string,
  date: Date;
  company: TCompany;
}


export function createUpdatePostsQuery(posts: IPost[]) {
  let query = 'INSERT INTO post (url, date, title, description, company) VALUES';
  posts.forEach((post) => {
    query += `('${post.url}', '${convertDateToMysqlDate(post.date)}', '${post.title}', '${post.description}', ${post.company}),`;
  });
  query = query.slice(0, -1);
  return posts;
}