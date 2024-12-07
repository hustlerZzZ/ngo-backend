import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function createBlog(req, res) {
  try {
    const { title, content, images } = req.body;

    if (!title || !content || !images) {
      return res.status(400).json({
        status: "failed",
        msg: "Kindly send all the required fields",
      });
    }

    const newBlog = await prisma.blog.create({
      data: {
        title,
        content,
      },
    });

    res.status(201).json({
      status: "success",
      msg: "Blog created successfully",
      newBlog,
    });
  } catch (e) {
    res.status(404).json({
      status: "failed",
      msg: "Something went wrong",
    });
  }
}

export async function updateBlog(req, res) {
  try {
    const id = req.params.id;

    const blog = await prisma.blog.update({
      where: {
        id: id,
      },
      data: {
        title: req.body.title,
        content: req.body.content,
      },
    });

    if (!blog) {
      return res.status(404).json({
        status: "failed",
        msg: "Unable to update blog",
      });
    }

    res.status(200).json({
      status: "success",
      msg: "Blog updated successfully",
      blog,
    });
  } catch (e) {
    res.status(404).json({
      status: "failed",
      msg: "Something went wrong",
    });
  }
}

export async function updateBlogStatus(req, res) {
  try {
    const id = req.params.id;

    const blog = await prisma.blog.update({
      where: {
        id: id,
      },
      data: {
        published: req.body.published,
      },
    });

    if (!blog) {
      return res.status(404).json({
        status: "failed",
        msg: "Unable to update the status of blog",
      });
    }
  } catch (e) {
    res.status(404).json({
      status: "failed",
      msg: "Something went wrong",
    });
  }
}

export async function deleteBlog(req, res) {
  try {
    const id = req.params.id;

    const blog = await prisma.blog.delete({
      where: {
        id: id,
      },
    });

    if (!blog) {
      return res.status(404).json({
        status: "failed",
        msg: "Unable to delete the blog",
      });
    }

    res.status(205).json({
      status: "success",
    });
  } catch (e) {
    res.status(404).json({
      status: "failed",
      msg: "Something went wrong",
    });
  }
}

export async function getBlog(req, res) {
  try {
    const id = req.params.id;

    const blog = await prisma.blog.findUnique({
      where: {
        id: id,
      },
    });

    if (!blog) {
      return res.status(404).json({
        status: "failed",
        msg: "Unable to find blog",
      });
    }

    res.status(200).json({
      status: "success",
      blog,
    });
  } catch (e) {
    res.status(404).json({
      status: "failed",
      msg: "Something went wrong",
    });
  }
}

export async function getAllBlogs(req, res) {
  try {
    const allBlogs = await prisma.blog.findMany();

    res.status(200).json({
      status: "success",
      totalBlogs: allBlogs.length,
      allBlogs,
    });
  } catch (e) {
    res.status(404).json({
      status: "failed",
      msg: "Something went wrong",
    });
  }
}
