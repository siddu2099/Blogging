const Comment = require('../models/Comment');

// @desc    Get comments for a specific post
// @route   GET /api/comments/:postId
const getComments = async (req, res) => {
  try {
    const comments = await Comment.find({ post: req.params.postId })
      .populate('author', 'name') // Get author name
      .sort({ createdAt: -1 });   // Newest first
    res.json(comments);
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
};

// @desc    Add a comment
// @route   POST /api/comments/:postId
const addComment = async (req, res) => {
  try {
    const { content } = req.body;
    if (!content) return res.status(400).json({ message: 'Content required' });

    const comment = await Comment.create({
      content,
      post: req.params.postId,
      author: req.user._id
    });

    // Return the full comment with author info
    const populatedComment = await comment.populate('author', 'name');
    res.status(201).json(populatedComment);
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
};

// @desc    Delete a comment (Optional: User can delete their own)
const deleteComment = async (req, res) => {
  try {
    const comment = await Comment.findById(req.params.id);
    if (!comment) return res.status(404).json({ message: 'Comment not found' });

    if (comment.author.toString() !== req.user._id.toString()) {
      return res.status(401).json({ message: 'Not authorized' });
    }

    await comment.deleteOne();
    res.json({ message: 'Comment deleted' });
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
};

module.exports = { getComments, addComment, deleteComment };