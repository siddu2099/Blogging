const Post = require('../models/Post');
const Comment = require('../models/Comment');

class PostRepository {
  async findById(id) {
    return await Post.findById(id).populate('author', 'name');
  }

  async findBySlug(slug) {
    return await Post.findOne({ slug, isDeleted: false }).populate('author', 'name');
  }

  async findPosts({ cursor, limit, category }) {
    const query = { isDeleted: false, isPublished: true };
    if (category && category !== 'All') {
      query.category = category;
    }

    if (cursor) {
      if (typeof cursor === 'object' && cursor.createdAt) {
         query.createdAt = { $lt: cursor.createdAt };
      } else {
         query.createdAt = { $lt: cursor };
      }
    }

    const posts = await Post.find(query)
      .populate('author', 'name')
      .sort({ createdAt: -1, _id: -1 })
      .limit(limit + 1);

    return posts;
  }

  async create(postData) {
    return await Post.create(postData);
  }

  async update(id, updateData) {
    return await Post.findByIdAndUpdate(id, updateData, { new: true });
  }

  async softDelete(id) {
    return await Post.findByIdAndUpdate(id, { isDeleted: true }, { new: true });
  }

  async deleteWithComments(id, session) {
    await Comment.deleteMany({ post: id }).session(session);
    return await Post.findByIdAndDelete(id).session(session);
  }
}

module.exports = new PostRepository();
