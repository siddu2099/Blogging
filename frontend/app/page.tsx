'use client';
import { useEffect, useState } from 'react';
import api from '@/lib/api';
import { Post } from '@/types';
import Link from 'next/link';
import { Loader2 } from 'lucide-react';

const CATEGORIES = ['All', 'General', 'Tech', 'Lifestyle', 'Coding', 'Design'];

export default function Home() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [selectedCat, setSelectedCat] = useState('All');
  
  // Cursor Pagination State
  const [nextCursor, setNextCursor] = useState<string | null>(null);
  const [hasNextPage, setHasNextPage] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState(false);

  // Fetch initial posts on mount or category change
  useEffect(() => {
    fetchPosts(null, true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedCat]);

  const fetchPosts = async (cursor: string | null = null, reset: boolean = false) => {
    setIsLoading(true);
    try {
      const url = selectedCat === 'All' 
        ? `/posts?limit=6${cursor ? `&cursor=${cursor}` : ''}` 
        : `/posts?cat=${selectedCat}&limit=6${cursor ? `&cursor=${cursor}` : ''}`;
      
      const res = await api.get(url);
      
      const data = res.data;
      if (reset) {
        setPosts(data.posts);
      } else {
        setPosts((prev) => [...prev, ...data.posts]);
      }
      setNextCursor(data.nextCursor);
      setHasNextPage(data.hasNextPage);
      
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleLoadMore = () => {
    if (hasNextPage && nextCursor) {
      fetchPosts(nextCursor);
    }
  };

  return (
    <div className="space-y-8">
      {/* Hero Section */}
      <section className="text-center py-10">
        <h1 className="text-4xl font-bold mb-4">Welcome to DevBlog</h1>
        <p className="text-gray-600 max-w-2xl mx-auto">Discover stories, thinking, and expertise from writers on any topic.</p>
      </section>

      {/* Category Filter */}
      <div className="flex justify-center gap-2 flex-wrap">
        {CATEGORIES.map((cat) => (
          <button key={cat} onClick={() => setSelectedCat(cat)}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
              selectedCat === cat ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}>
            {cat}
          </button>
        ))}
      </div>

      {/* Posts Grid */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {posts.map((post) => (
          <div key={post._id} className="bg-white rounded-lg shadow hover:shadow-lg transition border border-gray-100 flex flex-col overflow-hidden">
            {post.coverImage && (
              <div className="h-48 w-full">
                <img src={post.coverImage} alt={post.title} className="w-full h-full object-cover" />
              </div>
            )}
            <div className="p-6 flex flex-col flex-grow">
              <div className="flex justify-between items-start mb-4">
                <span className="bg-blue-100 text-blue-800 text-xs font-semibold px-2.5 py-0.5 rounded">
                  {post.category || 'General'}
                </span>
                <span className="text-gray-400 text-xs">{new Date(post.createdAt).toLocaleDateString()}</span>
              </div>
              <h2 className="text-xl font-bold mb-2 line-clamp-2">{post.title}</h2>
              <p className="text-gray-600 mb-4 line-clamp-3 flex-grow">{post.excerpt}</p>
              <div className="mt-auto pt-4 border-t flex justify-between items-center">
                <span className="text-sm text-gray-500">By {post.author?.name}</span>
                <Link href={`/blog/${post.slug}`} className="text-blue-600 font-medium hover:underline">Read more →</Link>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Load More Button (Cursor Pagination) */}
      {hasNextPage && (
        <div className="flex justify-center mt-10">
          <button 
            onClick={handleLoadMore}
            disabled={isLoading}
            className="px-6 py-3 rounded-full border border-blue-600 text-blue-600 hover:bg-blue-50 transition-colors font-medium flex items-center justify-center gap-2"
          >
            {isLoading && <Loader2 className="h-4 w-4 animate-spin" />}
            {isLoading ? 'Loading...' : 'Load More Stories'}
          </button>
        </div>
      )}
      
      {!hasNextPage && posts.length > 0 && (
        <div className="text-center text-gray-500 mt-10">
          You have reached the end.
        </div>
      )}
    </div>
  );
}