const mongoose = require('mongoose');
const postRepository = require('../repositories/postRepository');
const slugify = require('slugify');
const logger = require('../utils/logger');
let Redis = null;
let redisClient = null;

try {
  Redis = require('ioredis');
  redisClient = new Redis(process.env.REDIS_URL || 'redis://localhost:6379', {
    maxRetriesPerRequest: 1, 
    retryStrategy(times) {
      if (times > 2) return null; // stop retrying
      return 100;
    }
  });
  redisClient.on('error', (err) => logger.warn('Redis connection failed, continuing without cache'));
} catch (error) {
  logger.warn('Failed to initialize Redis fallback');
}

class PostService {
  async getPosts({ cursor, limit = 6, category = 'All' }) {
    limit = parseInt(limit, 10);
    const key = `posts:${category}:${cursor || 'start'}:${limit}`;

    if (redisClient && redisClient.status === 'ready') {
      try {
        const cached = await redisClient.get(key);
        if (cached) return JSON.parse(cached);
      } catch (err) {
        logger.error('Redis cache error: ' + err.message);
      }
    }

    const posts = await postRepository.findPosts({ cursor, limit, category });

    const hasNextPage = posts.length > limit;
    if (hasNextPage) {
      posts.pop(); // Remove the extra item
    }

    const nextCursor = hasNextPage ? posts[posts.length - 1].createdAt : null;

    const result = {
      posts,
      nextCursor,
      hasNextPage
    };

    if (redisClient && redisClient.status === 'ready') {
      try {
        await redisClient.set(key, JSON.stringify(result), 'EX', 300); // 5 mins cache
      } catch (err) {
        logger.error('Redis caching failed: ' + err.message);
      }
    }

    return result;
  }

  async getPostBySlug(slug) {
    return await postRepository.findBySlug(slug);
  }

  async createPost(postData, authorId) {
    let slug = slugify(postData.title, { lower: true, strict: true });
    let post;
    let retries = 1;

    postData.author = authorId;
    postData.isPublished = true;

    while (retries >= 0) {
      try {
        post = await postRepository.create({ ...postData, slug });
        break;
      } catch (error) {
        // 11000 is Mongo's duplicate key error
        if (error.code === 11000 && retries > 0) {
          slug = `${slug}-${Date.now()}`;
          retries--;
        } else {
          throw error; // Rethrow if not duplication or out of retries
        }
      }
    }

    await this.invalidateCache();
    return post;
  }

  async updatePost(id, updateData, user) {
    const post = await postRepository.findById(id);
    if (!post) throw new Error('Post not found');
    if (post.author._id.toString() !== user._id.toString() && user.role !== 'admin') {
      throw new Error('Not authorized');
    }

    const updated = await postRepository.update(id, updateData);
    await this.invalidateCache();
    return updated;
  }

  async deletePost(id, user) {
    const post = await postRepository.findById(id);
    if (!post) throw new Error('Post not found');
    if (post.author._id.toString() !== user._id.toString() && user.role !== 'admin') {
      throw new Error('Not authorized');
    }

    const session = await mongoose.startSession();
    session.startTransaction();
    try {
      await postRepository.deleteWithComments(id, session);
      await session.commitTransaction();
    } catch (error) {
      await session.abortTransaction();
      throw error;
    } finally {
      session.endSession();
    }

    await this.invalidateCache();
    return { message: 'Post and comments removed permanently' };
  }

  async softDeletePost(id, user) {
    const post = await postRepository.findById(id);
    if (!post) throw new Error('Post not found');
    if (post.author._id.toString() !== user._id.toString() && user.role !== 'admin') {
      throw new Error('Not authorized');
    }

    const result = await postRepository.softDelete(id);
    await this.invalidateCache();
    return result;
  }

  async invalidateCache() {
    if (redisClient && redisClient.status === 'ready') {
      try {
        // Need to delete all posts cache
        const keys = await redisClient.keys('posts:*');
        if (keys.length > 0) {
          await redisClient.del(keys);
        }
      } catch (err) {
        logger.error('Failed to invalidate cache: ' + err.message);
      }
    }
  }
}

module.exports = new PostService();
