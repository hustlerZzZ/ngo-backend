import express from "express";
const router = express.Router();
import {
  createBlog,
  deleteBlog,
  getAllBlogs,
  getBlog,
  updateBlog,
  updateBlogStatus,
} from "../controller/blogController";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// Creating a blog
router.post("/create-blog", createBlog);

// Updating a blog
router.patch("/update-blog/:id", updateBlog);

// Making a blog visible or hidden
router.patch("/update-blog-status/:id", updateBlogStatus);

// Deleting a blog
router.delete("/delete-blog/:id", deleteBlog);

// Getting a specific blog
router.get("/get-blog/:id", getBlog);

// Getting all blogs
router.get("/get-all", getAllBlogs);

export default router;
