import { TCompnay, companies } from '@/interface/post';
import { getPosts, postPosts } from '@/app/api/post/route';
import { convertDateToMysqlDate } from '@/service/util';
import tossScrap from './toss';
import kakaoScrap from './kakao';


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
}

export async function scrapSite(company: TCompnay): Promise<IPost[]> {
  type TScrap = { getPosts: () => Promise<IPost[]>; };
  const companyScraps: { [key in TCompnay]: TScrap } = {
    'toss': tossScrap,
    'kakao': kakaoScrap
  };
  const posts = await companyScraps[company].getPosts();
  return posts;
}

export interface IPost {
  url: string,
  title: string,
  description: string,
  date: Date;
  company: TCompnay;
}


export function createUpdatePostsQuery(posts: IPost[]) {
  let query = 'INSERT INTO post (url, date, title, description, company) VALUES';
  posts.forEach((post) => {
    query += `('${post.url}', '${convertDateToMysqlDate(post.date)}', '${post.title}', '${post.description}', ${post.company}),`;
  });
  query = query.slice(0, -1);
  return posts;
}