import { getPosts } from '@/app/api/post/route';
// tossScrap();
// scrapLatest('toss').then((res) => {
//   console.log(res);
// });
// updatePosts('toss');
// function getPostsClient() {
//   return fetch('/api/posts').then((res) => res.json());
// }  
// async function getPostsClient() {

//   return posts;
// }

// updateAllSites();
export default async function Home() {
  const posts = await getPosts();
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      {
        posts.map((post, index) => (
          <div key={index}>
            <h1>{post.title}</h1>
            <p>{post.description}</p>

          </div>
        ))
      }
    </main>
  );
}
