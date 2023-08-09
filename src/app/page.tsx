import { getPosts } from './api/post/route';
import { Posts } from './posts';


export default async function Home() {

  const initialData = await getPosts({ page: 0 });

  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-12 pt-0">
      <nav className='fixed flex justify-between h-20 items-center w-full p-4 bg-white border-b'>
        <h1 className='text-2xl font-semibold'>Tech Blog Hub</h1>
        {/* <Image src='/logo/stein.svg' width='24' height='24' alt='stein' /> */}
      </nav>
      <div className='mt-24'>
        <Posts initialData={initialData} />
      </div>
    </main>
  );
}
