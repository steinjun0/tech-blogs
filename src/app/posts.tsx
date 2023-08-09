'use client';

import { getPosts } from '@/api/post';
import { TCompany } from '@/interface/post';
import { IPost } from '@/scraping/scraping';
import { printDate } from '@/service/util';
import { useInfiniteQuery } from '@tanstack/react-query';
import Image from 'next/image';
import { PropsWithChildren, useCallback } from 'react';

function Logo({company}: {company: TCompany}){
  return <Image src={`/logo/${company}.png`} width='24' height='24' alt={company} />
}

export function Posts(props: PropsWithChildren & { initialData: { posts: IPost[], page: number, isFinish: boolean; }; }) {
  const {
    data,
    error,
    fetchNextPage,
    hasNextPage,
    isFetching,
    isFetchingNextPage,
    status,
  } = useInfiniteQuery({
    queryKey: ['posts'],
    queryFn: getPosts,
    getNextPageParam: (lastPage, pages) => {
      if (lastPage.isFinish) {
        return undefined;
      }
      return { ...lastPage, page: pages.length + 1 };
    },
  });

  const observerRef = useCallback((node: HTMLDivElement) => {
    if (node !== null) {
      let observer = new IntersectionObserver(() => fetchNextPage(), {
        rootMargin: "400px",
        threshold: 0,
      });
      observer.observe(node);
    }
  }, []);

  return status === 'loading' ?
    <div>loading</div> :
    <div id="posts-list" className='flex flex-col gap-12 max-w-lg'>
      {
        data!.pages.map((pageData, i) => (
          pageData.posts.map((post: IPost, index: number) => (
            <a key={index} className='flex flex-col gap-2 border-b pb-4 hover:underline cursor-pointer' href={post.url} >
              <div className='flex justify-between text-gray-500 text-xs'>
                <div className='flex items-center gap-2'>
                  <Logo company={post.company} />
                  <span className=''>{post.company}</span>
                </div>
                <span className=''>{printDate(post.date)}</span>
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

            </a>
          ))
        ))
      }
      <div id='scrollArea' ref={observerRef} />
      {isFetchingNextPage ? <div>로딩중...</div> : null}
    </div>;
};