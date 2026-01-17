const mongoose = require('mongoose');
const slugify = require('slugify');

const postSchema = mongoose.Schema({
  title: { type: String, required: true },
  slug: { type: String, unique: true },
  content: { type: String, required: true },
  excerpt: { type: String },
  category: { type: String, default: 'General' },
  coverImage: { type: String }, // <--- Added this line
  author: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  isPublished: { type: Boolean, default: false },
}, { timestamps: true });

postSchema.pre('save', async function() {
  if (this.isModified('title') && !this.slug) {
    this.slug = slugify(this.title, { lower: true, strict: true });
  }
});

module.exports = mongoose.model('Post', postSchema);