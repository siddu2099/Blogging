const express = require('express');
const { getComments, addComment, deleteComment } = require('../controllers/commentController');
const { protect } = require('../middleware/authMiddleware');
const router = express.Router();

// Get comments for a post (Public)
router.get('/:postId', getComments);

// Add comment (Protected)
router.post('/:postId', protect, addComment);

// Delete comment (Protected)
router.delete('/:id', protect, deleteComment);

module.exports = router;