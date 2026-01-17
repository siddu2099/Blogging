const express = require('express');
const { 
  getPosts, 
  createPost, 
  getPostBySlug, 
  getMyPosts, 
  deletePost, 
  updatePost 
} = require('../controllers/postController');
const { protect } = require('../middleware/authMiddleware');
const router = express.Router();

// Public Routes
router.get('/', getPosts);
router.get('/:slug', getPostBySlug);

// Protected Routes
router.post('/', protect, createPost);
router.get('/user/me', protect, getMyPosts);

// Update and Delete specific post by ID
router.route('/:id')
  .delete(protect, deletePost)
  .put(protect, updatePost);

module.exports = router;