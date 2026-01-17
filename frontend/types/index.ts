export interface User {
  _id: string;
  name: string;
  email: string;
  role: string;
}

export interface Post {
  _id: string;
  title: string;
  slug: string;
  content: string;
  excerpt: string;
  category: string;    // <--- Added this
  coverImage?: string; // <--- Added this (optional)
  author: User;
  createdAt: string;
  updatedAt: string;
}