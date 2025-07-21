import express from "express";
import userAuth from "../middleware/userAuth.js";
import {
  createPost,
  getAllPosts,
  updatePost,
  deletePost,
} from "../controllers/postController.js";

const router = express.Router();

router.post("/create", userAuth, createPost);
router.get("/", getAllPosts);
router.put("/:id", userAuth, updatePost);
router.delete("/:id", userAuth, deletePost);

export default router;
