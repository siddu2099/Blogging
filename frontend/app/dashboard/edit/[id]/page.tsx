'use client';
import { useState, useEffect, use } from 'react';
import api from '@/lib/api';
import { useRouter } from 'next/navigation';
import Editor from '@/components/Editor';
import Link from 'next/link';

export default function EditPost({ params }: { params: Promise<{ id: string }> }) {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [loading, setLoading] = useState(true);
  
  // Unwrap params for Next.js 15+
  const { id } = use(params);
  
  const router = useRouter();

  // Fetch existing data
  useEffect(() => {
    const fetchPost = async () => {
      try {
        // Fetch all user posts and find the one matching the ID
        const { data } = await api.get(`/posts/user/me`); 
        const post = data.find((p: any) => p._id === id);
        
        if (post) {
          setTitle(post.title);
          setContent(post.content);
        } else {
          alert('Post not found');
          router.push('/dashboard');
        }
      } catch (error) {
        console.error('Error fetching post');
        alert('Error loading post data');
      } finally {
        setLoading(false);
      }
    };
    fetchPost();
  }, [id, router]);

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const tempDiv = document.createElement("div");
      tempDiv.innerHTML = content;
      const plainText = tempDiv.textContent || tempDiv.innerText || "";
      const excerpt = plainText.substring(0, 100) + "...";

      await api.put(`/posts/${id}`, { title, content, excerpt });
      alert('Post Updated!');
      router.push('/dashboard');
    } catch (error) {
      alert('Update failed');
    }
  };

  if (loading) return <div className="text-center mt-10">Loading...</div>;

  return (
    <div className="max-w-4xl mx-auto py-10">
      <h1 className="text-3xl font-bold mb-8">Edit Post</h1>
      <form onSubmit={handleUpdate} className="space-y-6">
        <div>
          <label htmlFor="edit-title" className="block text-sm font-medium text-gray-700 mb-2">Title</label>
          <input 
            id="edit-title"
            type="text" 
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Content</label>
          <Editor value={content} onChange={setContent} />
        </div>
        <div className="flex gap-4">
          <button type="submit" className="bg-blue-600 text-white font-bold py-3 px-8 rounded-lg hover:bg-blue-700">
            Save Changes
          </button>
          <Link 
            href="/dashboard"
            className="bg-gray-500 text-white font-bold py-3 px-8 rounded-lg hover:bg-gray-600 text-center"
          >
            Cancel
          </Link>
        </div>
      </form>
    </div>
  );
}