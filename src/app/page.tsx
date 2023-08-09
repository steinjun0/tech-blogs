import { getPosts } from './api/post/route';
import { Posts } from './posts';


export default async function Home() {

  const initialData = await getPosts({ page: 1 });

  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-12">
      <Posts initialData={{ page: 1, ...initialData }} />
    </main>

  );
}
