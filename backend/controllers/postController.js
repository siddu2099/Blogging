const Post = require('../models/Post');

// @desc    Get all published posts with Pagination & Filtering
// @route   GET /api/posts?page=1&cat=Tech
const getPosts = async (req, res) => {
  try {
    const { cat, page = 1, limit = 6 } = req.query; // Default: Page 1, 6 posts per page
    let query = { isPublished: true };

    if (cat && cat !== 'All') {
      query.category = cat;
    }

    const posts = await Post.find(query)
      .populate('author', 'name')
      .sort({ createdAt: -1 })
      .limit(limit * 1)        // Limit results
      .skip((page - 1) * limit); // Skip previous pages

    // Get total count for frontend to know if "Next" button is needed
    const total = await Post.countDocuments(query);

    res.json({
      posts,
      totalPages: Math.ceil(total / limit),
      currentPage: Number(page)
    });
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
};

// ... (Keep the rest of the functions: getPostBySlug, createPost, etc. exactly the same)
// If you want the full file again, let me know, but updating just 'getPosts' is safer here.
const getPostBySlug = async (req, res) => {
  try {
    const post = await Post.findOne({ slug: req.params.slug }).populate('author', 'name');
    if (post) res.json(post);
    else res.status(404).json({ message: 'Post not found' });
  } catch (error) { res.status(500).json({ message: 'Server Error' }); }
};

const createPost = async (req, res) => {
  try {
    const { title, content, excerpt, category, coverImage } = req.body;
    if (!title || !content) return res.status(400).json({ message: 'Title/Content required' });

    const post = await Post.create({
      title, content, excerpt: excerpt || content.substring(0, 100),
      category: category || 'General', coverImage: coverImage || '',
      author: req.user._id, isPublished: true
    });
    res.status(201).json(post);
  } catch (error) { res.status(400).json({ message: 'Invalid data' }); }
};

const getMyPosts = async (req, res) => {
  try {
    const posts = await Post.find({ author: req.user._id }).sort({ createdAt: -1 });
    res.json(posts);
  } catch (error) { res.status(500).json({ message: 'Server Error' }); }
};

const deletePost = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).json({ message: 'Post not found' });
    if (post.author.toString() !== req.user._id.toString()) return res.status(401).json({ message: 'Not authorized' });
    await post.deleteOne();
    res.json({ message: 'Post removed' });
  } catch (error) { res.status(500).json({ message: 'Server Error' }); }
};

const updatePost = async (req, res) => {
  try {
    const { title, content, excerpt, category, coverImage } = req.body;
    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).json({ message: 'Post not found' });
    if (post.author.toString() !== req.user._id.toString()) return res.status(401).json({ message: 'Not authorized' });

    post.title = title || post.title;
    post.content = content || post.content;
    post.excerpt = excerpt || post.excerpt;
    post.category = category || post.category;
    post.coverImage = coverImage || post.coverImage;

    const updatedPost = await post.save();
    res.json(updatedPost);
  } catch (error) { res.status(500).json({ message: 'Server Error' }); }
};

module.exports = { getPosts, createPost, getPostBySlug, getMyPosts, deletePost, updatePost };