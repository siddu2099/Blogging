const postService = require('../services/postService');
const { postSchema } = require('../utils/validators');
const logger = require('../utils/logger');

// @desc    Get all published posts with Pagination (Cursor) & Filtering
// @route   GET /api/posts?cursor=xyz&limit=6&cat=Tech
const getPosts = async (req, res, next) => {
  try {
    const { cat, cursor, limit } = req.query;
    const postsResult = await postService.getPosts({ 
      cursor, 
      limit, 
      category: cat 
    });
    
    res.json(postsResult);
  } catch (error) {
    next(error);
  }
};

// @desc    Get post by slug
// @route   GET /api/posts/:slug
const getPostBySlug = async (req, res, next) => {
  try {
    const post = await postService.getPostBySlug(req.params.slug);
    if (!post) return res.status(404).json({ message: 'Post not found' });
    res.json(post);
  } catch (error) { 
    next(error); 
  }
};

// @desc    Create a new post
// @route   POST /api/posts
// @access  Private
const createPost = async (req, res, next) => {
  try {
    // strict Zod validation + strips out mass-assigned fields
    const validatedData = postSchema.parse(req.body);
    
    const post = await postService.createPost(validatedData, req.user._id);
    res.status(201).json(post);
  } catch (error) { 
    // Handled by errorMiddleware (if ZodError)
    next(error); 
  }
};

// @desc    Get logged in user's posts
// @route   GET /api/posts/me
// @access  Private 
const getMyPosts = async (req, res, next) => {
  try {
    // Reusing the service for custom logic, though this could be more optimized
    // For now we can fetch via direct repo if we want, or add to service
    // Wait, the original code fetched my posts sorted by createdAt. 
    // We'll update postService to handle this properly.
    const postRepository = require('../repositories/postRepository');
    const posts = await postRepository.findPosts({ category: 'All', limit: 100 }); // simplified for me
    // Filter out only my posts or let's just make a service function for it later.
    // Actually, let's fix it properly using postRepository:
    const myPosts = await require('../models/Post').find({ author: req.user._id, isDeleted: false }).sort({ createdAt: -1 });
    res.json(myPosts);
  } catch (error) { 
    next(error); 
  }
};

// @desc    Delete post
// @route   DELETE /api/posts/:id
// @access  Private
const deletePost = async (req, res, next) => {
  try {
    // Let's use soft delete or hard delete depending on requirement
    // Service handles ownership checks now!
    await postService.softDeletePost(req.params.id, req.user);
    // await postService.deletePost(req.params.id, req.user); // if hard delete
    
    res.json({ message: 'Post soft deleted safely' });
  } catch (error) { 
    next(error); 
  }
};

// @desc    Update post
// @route   PUT /api/posts/:id
// @access  Private
const updatePost = async (req, res, next) => {
  try {
    const validatedData = postSchema.partial().parse(req.body);
    const updatedPost = await postService.updatePost(req.params.id, validatedData, req.user);
    res.json(updatedPost);
  } catch (error) { 
    next(error); 
  }
};

module.exports = { getPosts, createPost, getPostBySlug, getMyPosts, deletePost, updatePost };