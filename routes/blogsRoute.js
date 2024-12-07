import express from "express";
const router = express.Router();
import {
  createBlog,
  deleteBlog,
  getAllBlogs,
  getBlog,
  updateBlog,
  updateBlogStatus,
} from "../controller/blogController.js";
import { restrictTo } from "../controller/authController.js";

// Creating a blog
router.post("/create-blog", restrictTo, createBlog);

// Updating a blog
router.patch("/update-blog/:id", restrictTo, updateBlog);

// Making a blog visible or hidden
router.patch("/update-blog-status/:id", restrictTo, updateBlogStatus);

// Deleting a blog
router.delete("/delete-blog/:id", restrictTo, deleteBlog);

// Getting a specific blog
router.get("/get-blog/:id", getBlog);

// Getting all blogs
router.get("/get-all", getAllBlogs);

export default router;
