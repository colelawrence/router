import * as React from 'react'
import { createFileRoute, Link, Outlet } from '@tanstack/react-router'
import { fetchPosts } from '../utils/posts'
import { createServerFn } from '@tanstack/start'

const renderPosts = createServerFn('GET', async () => {
  const posts = await fetchPosts()

  return (
    <div className="p-2 flex gap-2">
      <ul className="list-disc pl-4">
        {[...posts, { id: 'i-do-not-exist', title: 'Non-existent Post' }]?.map(
          (post) => {
            return (
              <li key={post.id} className="whitespace-nowrap">
                <Link
                  to="/posts/$postId"
                  params={{
                    postId: post.id,
                  }}
                  className="block py-1 text-blue-800 hover:text-blue-600"
                  activeProps={{ className: 'text-black font-bold' }}
                >
                  <div>{post.title.substring(0, 20)}</div>
                </Link>
              </li>
            )
          }
        )}
      </ul>
      <hr />
      <Outlet />
    </div>
  )
})

export const Route = createFileRoute('/posts')({
  loader: async () => renderPosts(),
  component: PostsComponent,
})

function PostsComponent() {
  return Route.useLoaderData()
}
