import { TCompnay } from "@/interface/post";
import { IPost } from "@/scraping/scraping";

export async function getPosts({ pageParam = { page: 1, companies: [] } }): Promise<{ posts: IPost[], isFinish: boolean; }> {
  return fetch(`/api/post?page=` + pageParam.page + (pageParam.companies ? pageParam.companies.map((company: TCompnay) => `&company=${company}`).join('') : ''))
    .then((res) => res.json())
    .then((res) => {
      const temp = res;
      temp.posts = temp.posts.map((post: IPost) => {
        post.date = new Date(post.date);
        return post;
      });
      return temp;
    });
}