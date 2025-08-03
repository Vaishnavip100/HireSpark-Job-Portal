const Post = require('../models/Post');

const getPosts = async (req, res) => {
  try {
    const posts = await Post.find({})
      .sort({ createdAt: -1 })
      .populate('author', 'name'); 
    res.json(posts);
  } catch (error) {
    console.error('Error fetching posts:', error);
    res.status(500).json({ message: 'Server Error' });
  }
};

const createPost = async (req, res) => {
  const { text } = req.body;
  if (!text) {
    return res.status(400).json({ message: 'Post text is required.' });
  }

  try {
    const post = new Post({
      text,
      author: req.user._id 
    });
    const createdPost = await post.save();

    const populatedPost = await Post.findById(createdPost._id).populate('author', 'name');
    
    res.status(201).json(populatedPost);
  } catch (error) {
    console.error('Error creating post:', error);
    res.status(500).json({ message: 'Server Error' });
  }
};

const deletePost = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);

    // 1. Check if the post exists
    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }

    // 2. Security Check: Ensure the user trying to delete is the original author
    if (post.author.toString() !== req.user._id.toString()) {
      return res.status(401).json({ message: 'User not authorized to delete this post' });
    }

    // 3. If all checks pass, remove the post from the database
    await post.deleteOne();

    res.json({ message: 'Post removed successfully' });

  } catch (error) {
    console.error('Error deleting post:', error);
    res.status(500).json({ message: 'Server Error' });
  }
};

module.exports = { 
  getPosts, 
  createPost,
  deletePost 
};