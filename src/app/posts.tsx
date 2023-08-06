'use client';

import { getPosts } from '@/api/post';
import { IPost } from '@/scraping/scraping';
import { printDate } from '@/service/util';
import { useInfiniteQuery, useQuery } from '@tanstack/react-query';
import { PropsWithChildren, ReactNode, useCallback, useEffect, useState } from 'react';

export function Posts(props: PropsWithChildren & { initialData: { posts: IPost[], page: number, isFinish: boolean; }; }) {
  const [page, setPage] = useState(props.initialData.page + 1);
  const fetchProjects = async ({ pageParam = 0 }) => {
    const res = await fetch('/api/projects?cursor=' + pageParam);
    return res.json();
  };


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
            <div key={index} className='flex flex-col gap-2 border-b pb-4'>
              <div className='flex justify-between text-gray-500 text-xs'>
                <span className=''>{post.company}</span>
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

            </div>
          ))
        ))
      }
      <div id='scrollArea' ref={observerRef} />
      {isFetchingNextPage ? <div>로딩중...</div> : null}
    </div>;
};