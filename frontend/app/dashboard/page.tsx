'use client';
import { useState, useEffect } from 'react';
import api from '@/lib/api';
import Editor from '@/components/Editor';
import { Post } from '@/types';
import { Trash2, Edit } from 'lucide-react'; 
import Link from 'next/link';

const CATEGORIES = ['General', 'Tech', 'Lifestyle', 'Coding', 'Design'];

export default function Dashboard() {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [category, setCategory] = useState('General');
  const [coverImage, setCoverImage] = useState(''); // <--- New State
  const [myPosts, setMyPosts] = useState<Post[]>([]);

  useEffect(() => { fetchMyPosts(); }, []);

  const fetchMyPosts = async () => {
    try {
      const { data } = await api.get('/posts/user/me');
      setMyPosts(data);
    } catch (error) { console.error('Failed to fetch posts'); }
  };

  const createPost = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const tempDiv = document.createElement("div");
      tempDiv.innerHTML = content;
      const plainText = tempDiv.textContent || tempDiv.innerText || "";
      const excerpt = plainText.substring(0, 100) + "...";

      // Send all data including coverImage
      await api.post('/posts', { title, content, excerpt, category, coverImage });
      
      setTitle(''); setContent(''); setCategory('General'); setCoverImage('');
      alert('Post Created!');
      fetchMyPosts();
    } catch (error) { alert('Error creating post'); }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this post?')) return;
    try {
      await api.delete(`/posts/${id}`);
      setMyPosts(myPosts.filter((post) => post._id !== id)); 
    } catch (error) { alert('Failed to delete'); }
  };

  return (
    <div className="max-w-4xl mx-auto py-10 space-y-12">
      <section className="bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-2xl font-bold mb-6 text-gray-800">Write New Story</h2>
        <form onSubmit={createPost} className="space-y-6">
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="md:col-span-2">
              <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2">Title</label>
              <input id="title" type="text" value={title} onChange={(e) => setTitle(e.target.value)}
                className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500" required />
            </div>
            
            <div>
              <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-2">Category</label>
              <select id="category" value={category} onChange={(e) => setCategory(e.target.value)}
                className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 bg-white">
                {CATEGORIES.map(cat => <option key={cat} value={cat}>{cat}</option>)}
              </select>
            </div>

            {/* Image URL Input */}
            <div>
              <label htmlFor="coverImage" className="block text-sm font-medium text-gray-700 mb-2">Cover Image URL</label>
              <input id="coverImage" type="url" placeholder="https://..." value={coverImage} onChange={(e) => setCoverImage(e.target.value)}
                className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500" />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Content</label>
            <Editor value={content} onChange={setContent} />
          </div>
          <button type="submit" className="bg-blue-600 text-white font-bold py-3 px-8 rounded-lg hover:bg-blue-700">Publish</button>
        </form>
      </section>

      <section>
        <h2 className="text-2xl font-bold mb-4 text-gray-800">My Posts</h2>
        <div className="bg-white rounded-lg shadow overflow-hidden">
          {myPosts.length === 0 ? <p className="p-6 text-gray-500">No posts yet.</p> : (
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Title</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Category</th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {myPosts.map((post) => (
                  <tr key={post._id}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{post.title}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-blue-600">{post.category}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium flex justify-end gap-3">
                      <Link href={`/dashboard/edit/${post._id}`} className="text-blue-600 flex items-center gap-1"><Edit size={16} /> Edit</Link>
                      <button onClick={() => handleDelete(post._id)} className="text-red-600 flex items-center gap-1"><Trash2 size={16} /> Delete</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </section>
    </div>
  );
}