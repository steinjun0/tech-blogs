import { IPost } from '@/scraping/scraping';
import { QueryClient, QueryClientProvider, useQuery } from '@tanstack/react-query';
import { useState } from 'react';
import { Posts } from './posts';
import { getPosts } from './api/post/route';


export default async function Home() {

  const initialData = await getPosts(1);

  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-12">
      <Posts initialData={{ page: 1, ...initialData }} />
    </main>

  );
}
