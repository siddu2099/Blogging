import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import DOMPurify from 'isomorphic-dompurify';
import Link from 'next/link';
import CommentSection from '@/components/CommentSection'; // <--- Import the component

async function getPost(slug: string) {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/posts/${slug}`, {
    cache: 'no-store', // Ensures we always get fresh data
  });

  if (!res.ok) return null;
  return res.json();
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const post = await getPost(slug);
  if (!post) return { title: 'Post Not Found' };

  return {
    title: post.title,
    description: post.excerpt,
  };
}

export default async function BlogPost({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post = await getPost(slug);

  if (!post) notFound();

  // Security: Sanitize HTML to prevent XSS attacks
  const cleanContent = DOMPurify.sanitize(post.content);

  return (
    <article className="max-w-3xl mx-auto py-10 px-4">
      <Link href="/" className="text-blue-600 hover:underline mb-6 block">
        &larr; Back to Home
      </Link>

      {/* Hero Image */}
      {post.coverImage && (
        <img 
          src={post.coverImage} 
          alt={post.title} 
          className="w-full h-64 md:h-96 object-cover rounded-xl mb-8 shadow-md" 
        />
      )}

      <header className="mb-8 border-b pb-6">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">{post.title}</h1>
        <div className="flex items-center text-gray-500 text-sm">
          <span className="font-semibold text-gray-700">By {post.author?.name}</span>
          <span className="mx-2">•</span>
          <span className="bg-gray-100 text-gray-800 px-2 py-0.5 rounded text-xs mr-2">{post.category}</span>
          <time>{new Date(post.createdAt).toLocaleDateString()}</time>
        </div>
      </header>
      
      {/* This div renders the HTML content safely */}
      <div 
        className="prose prose-lg max-w-none text-gray-800 leading-relaxed"
        dangerouslySetInnerHTML={{ __html: cleanContent }} 
      />

      {/* Comment Section */}
      <CommentSection postId={post._id} />

    </article>
  );
}