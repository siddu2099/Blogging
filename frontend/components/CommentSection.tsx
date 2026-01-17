'use client';
import { useState, useEffect } from 'react';
import api from '@/lib/api';
import { useAuthStore } from '@/lib/store';
import { Trash2 } from 'lucide-react';

interface Comment {
  _id: string;
  content: string;
  author: { _id: string; name: string };
  createdAt: string;
}

export default function CommentSection({ postId }: { postId: string }) {
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState('');
  const { user } = useAuthStore();

  useEffect(() => {
    fetchComments();
  }, [postId]);

  const fetchComments = async () => {
    try {
      const { data } = await api.get(`/comments/${postId}`);
      setComments(data);
    } catch (error) {
      console.error('Failed to fetch comments');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.trim()) return;

    try {
      const { data } = await api.post(`/comments/${postId}`, { content: newComment });
      setComments([data, ...comments]); // Add new comment to top
      setNewComment('');
    } catch (error) {
      alert('Please login to comment!');
    }
  };

  const handleDelete = async (commentId: string) => {
    if (!confirm('Are you sure you want to delete this comment?')) return;
    try {
      await api.delete(`/comments/${commentId}`);
      setComments(comments.filter((c) => c._id !== commentId));
    } catch (error) {
      alert('Failed to delete comment');
    }
  };

  return (
    <div className="mt-16 border-t pt-10">
      <h3 className="text-2xl font-bold mb-6">Comments ({comments.length})</h3>

      {/* Add Comment Form */}
      {user ? (
        <form onSubmit={handleSubmit} className="mb-10">
          <textarea
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            className="w-full p-4 border rounded-lg focus:ring-2 focus:ring-blue-500 mb-2"
            placeholder="Write a thoughtful comment..."
            rows={3}
            required
          />
          <button type="submit" className="bg-blue-600 text-white px-6 py-2 rounded-lg font-medium hover:bg-blue-700">
            Post Comment
          </button>
        </form>
      ) : (
        <div className="bg-gray-50 p-6 rounded-lg mb-10 text-center">
          <p className="text-gray-600">Please <a href="/login" className="text-blue-600 font-bold hover:underline">login</a> to join the conversation.</p>
        </div>
      )}

      {/* Comment List */}
      <div className="space-y-6">
        {comments.map((comment) => (
          <div key={comment._id} className="bg-white p-4 rounded-lg shadow-sm border border-gray-100">
            <div className="flex justify-between items-start mb-2">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center font-bold text-sm">
                  {comment.author.name.charAt(0).toUpperCase()}
                </div>
                <div>
                  <span className="font-semibold text-gray-900 block leading-tight">{comment.author.name}</span>
                  <span className="text-xs text-gray-400">{new Date(comment.createdAt).toLocaleDateString()}</span>
                </div>
              </div>
              
              {/* Delete button (only if user owns the comment) */}
              {user?._id === comment.author._id && (
                <button 
                  onClick={() => handleDelete(comment._id)} 
                  className="text-gray-400 hover:text-red-500"
                  aria-label="Delete comment"
                  title="Delete comment"
                >
                  <Trash2 size={16} />
                </button>
              )}
            </div>
            <p className="text-gray-700 mt-1 ml-10">{comment.content}</p>
          </div>
        ))}
        {comments.length === 0 && <p className="text-gray-500 italic">No comments yet. Be the first!</p>}
      </div>
    </div>
  );
}