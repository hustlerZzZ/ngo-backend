import sharp from "sharp";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function createBlog(req, res) {
  try {
    const { title, content } = req.body;

    if (!title || !content) {
      return res.status(400).json({
        status: "failed",
        msg: "Kindly send all the required fields: title and content",
      });
    }
    const images = [];

    const newBlog = await prisma.blog.create({
      data: {
        title,
        content,
      },
    });

    if (req.files) {
      await Promise.all(
        req.files.map(async (file, i) => {
          const fileName = `blog-${newBlog.id}-${Date.now()}-${i + 1}.jpeg`;

          await sharp(file.buffer)
            .resize(1920, 1080)
            .toFormat("jpeg")
            .jpeg({ quality: 90 })
            .toFile(`uploads/blogs/${fileName}`);

          images.push(fileName);
        }),
      );

      await prisma.blog.update({
        where: {
          id: newBlog.id,
        },
        data: {
          images,
        },
      });
    }

    res.status(201).json({
      status: "success",
      msg: "Blog created successfully",
      newBlog,
    });
  } catch (e) {
    res.status(500).json({
      status: "failed",
      msg: "Something went wrong",
    });
  }
}

export async function updateBlog(req, res) {
  try {
    const id = req.params.id;

    if (!id) {
      return res.status(400).json({
        status: "failed",
        msg: "Blog ID is required.",
      });
    }

    const existingBlog = await prisma.blog.findUnique({
      where: { id },
    });

    if (!existingBlog) {
      return res.status(404).json({
        status: "failed",
        msg: "Blog not found.",
      });
    }

    const images = existingBlog.images || [];

    if (req.files) {
      await Promise.all(
          req.files.map(async (file, i) => {
            const fileName = `blog-${id}-${Date.now()}-${i + 1}.jpeg`;

            await sharp(file.buffer)
                .resize(1920, 1080)
                .toFormat("jpeg")
                .jpeg({ quality: 90 })
                .toFile(`uploads/blogs/${fileName}`);

            images.push(fileName);
          }),
      );
    }

    const updatedBlog = await prisma.blog.update({
      where: {
        id: id,
      },
      data: {
        title: req.body.title || existingBlog.title,
        content: req.body.content || existingBlog.content,
        images
      },
    });

    res.status(200).json({
      status: "success",
      msg: "Blog updated successfully",
      updatedBlog,
    });
  } catch (e) {
    res.status(500).json({
      status: "failed",
      msg: "Something went wrong",
    });
  }
}

export async function updateBlogStatus(req, res) {
  try {
    const id = req.params.id;

    const updatedBlog = await prisma.blog.update({
      where: {
        id,
      },
      data: {
        published: req.body.published,
      },
    });

    res.status(200).json({
      status: "success",
      msg: "Blog status updated successfully",
      blog: updatedBlog,
    });
  } catch (e) {
    res.status(500).json({
      status: "failed",
      msg: "Something went wrong",
    });
  }
}

export async function deleteBlog(req, res) {
  try {
    const id = req.params.id;

    await prisma.blog.delete({
      where: {
        id,
      },
    });

    res.status(204).json({
      status: "success",
      msg: "Blog deleted successfully",
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
    res.status(500).json({
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
    res.status(500).json({
      status: "failed",
      msg: "Something went wrong",
    });
  }
}
