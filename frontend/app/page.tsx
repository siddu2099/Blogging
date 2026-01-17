'use client';
import { useEffect, useState } from 'react';
import api from '@/lib/api';
import { Post } from '@/types';
import Link from 'next/link';

const CATEGORIES = ['All', 'General', 'Tech', 'Lifestyle', 'Coding', 'Design'];

export default function Home() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [selectedCat, setSelectedCat] = useState('All');
  const [page, setPage] = useState(1);      // Current Page
  const [totalPages, setTotalPages] = useState(1); // Total Pages

  useEffect(() => {
    // Reset to page 1 when category changes
    setPage(1);
  }, [selectedCat]);

  useEffect(() => {
    const url = selectedCat === 'All' 
      ? `/posts?page=${page}` 
      : `/posts?cat=${selectedCat}&page=${page}`;
    
    api.get(url)
      .then((res) => {
        // Backend now returns an object { posts, totalPages, currentPage }
        setPosts(res.data.posts);
        setTotalPages(res.data.totalPages);
      })
      .catch((err) => console.error(err));
  }, [selectedCat, page]);

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

      {/* Pagination Controls */}
      {posts.length > 0 && (
        <div className="flex justify-center gap-4 mt-10">
          <button 
            disabled={page === 1}
            onClick={() => setPage(page - 1)}
            className={`px-4 py-2 rounded border ${page === 1 ? 'bg-gray-100 text-gray-400' : 'bg-white hover:bg-gray-50'}`}
          >
            Previous
          </button>
          
          <span className="px-4 py-2 text-gray-600">
            Page {page} of {totalPages}
          </span>

          <button 
            disabled={page === totalPages}
            onClick={() => setPage(page + 1)}
            className={`px-4 py-2 rounded border ${page === totalPages ? 'bg-gray-100 text-gray-400' : 'bg-white hover:bg-gray-50'}`}
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
}