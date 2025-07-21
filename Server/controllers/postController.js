import Post from "../models/postModel.js";
import User from "../models/userModel.js";

// CREATE a post
export const createPost = async (req, res) => {
  try {
    const { content } = req.body;

    if (!content || !req.userId) {
      return res
        .status(400)
        .json({ success: false, message: "Missing content or user ID" });
    }

    const newPost = await Post.create({ content, userId: req.userId });
    res.json({ success: true, post: newPost });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// GET all posts
export const getAllPosts = async (req, res) => {
  try {
    const posts = await Post.find()
      .sort({ createdAt: -1 })
      .populate("userId", "name"); // show user name

    res.json({ success: true, posts });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// UPDATE post
export const updatePost = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).json({ message: "Post not found" });

    if (post.userId.toString() !== req.userId)
      return res.status(403).json({ message: "Unauthorized" });

    post.content = req.body.content;
    await post.save();
    res.json({ success: true, post });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// DELETE post
export const deletePost = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).json({ message: "Post not found" });

    if (post.userId.toString() !== req.userId)
      return res.status(403).json({ message: "Unauthorized" });

    await post.deleteOne();
    res.json({ success: true, message: "Post deleted" });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};
