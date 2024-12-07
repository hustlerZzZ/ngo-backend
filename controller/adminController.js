import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function getUser(req, res) {
  try {
    const { id } = req.params;

    if (!id) {
      return res.status(400).json({
        status: "failed",
        msg: "Blog ID is required.",
      });
    }

    const user = await prisma.user.findUnique({
      where: {
        id,
      },
    });

    if (!user) {
      return res.status(400).json({
        status: "failed",
        msg: "User not found.",
      });
    }

    res.status(200).json({
      status: "success",
      user,
    });
  } catch (e) {
    res.status(500).json({
      status: "error",
      msg: "Something went wrong",
    });
  }
}

export async function getAllUsers(req, res) {
  try {
    const allUsers = await prisma.user.findMany({
      where: {
        role: "USER",
      },
    });

    res.status(200).json({
      status: "success",
      totalUsers: allUsers.length,
      data: allUsers,
    });
  } catch (e) {
    res.status(500).json({
      status: "error",
      msg: "Something went wrong",
    });
  }
}

export async function deleteUser(req, res) {
  try {
    const { id } = req.params;

    if (!id) {
      return res.status(400).json({
        status: "failed",
        msg: "User ID is required.",
      });
    }

    await prisma.user.delete({
      where: {
        id,
      },
    });

    res.status(205).json({
      status: "success",
    });
  } catch (e) {
    res.status(500).json({
      status: "error",
      msg: "Something went wrong",
    });
  }
}
