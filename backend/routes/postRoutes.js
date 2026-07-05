const express = require('express');
const { 
  getPosts, 
  createPost, 
  getPostBySlug, 
  getMyPosts, 
  deletePost, 
  updatePost 
} = require('../controllers/postController');
const { protect, authorize } = require('../middleware/authMiddleware');
const Post = require('../models/Post');
const router = express.Router();

// Public Routes
router.get('/', getPosts);
router.get('/:slug', getPostBySlug);

// Protected Routes
router.post('/', protect, createPost);
router.get('/user/me', protect, getMyPosts);

// Update and Delete specific post by ID
// Using Hybrid RBAC: admin can edit/delete ANY post, author can edit/delete THEIR post.
router.route('/:id')
  .delete(protect, authorize({ roles: ['admin'], allowOwner: true, model: Post }), deletePost)
  .put(protect, authorize({ roles: ['admin'], allowOwner: true, model: Post }), updatePost);

module.exports = router;