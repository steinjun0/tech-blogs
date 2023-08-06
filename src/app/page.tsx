import { getPosts } from '@/app/api/post/route';
export default async function Home() {
  const posts = await getPosts();
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-12">
      <div className='flex flex-col gap-12 max-w-lg'>
        {
          posts.map((post, index) => (

            <div key={index} className='flex flex-col gap-2 border-b pb-4'>
              <div className='flex justify-between text-gray-500 text-xs'>
                <span className=''>{post.company}</span>
                <span className=''>{new Intl.DateTimeFormat().format(post.date)}</span>
              </div>
              <h1 className='font-semibold text-lg'>{post.title}</h1>
              <p className='text-gray-500 text-sm'
                style={
                  {
                    display: '-webkit-box',
                    WebkitLineClamp: 3,
                    WebkitBoxOrient: 'vertical',
                    overflow: 'hidden'
                  }}
              >{post.description}</p>

            </div>
          ))
        }
      </div>

    </main>
  );
}
