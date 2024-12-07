import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function restrictTo(req, res, next) {
  try {
    const { userId } = req;

    if (!userId) {
      return res.status(401).json({
        status: "error",
        msg: "Unauthorized access. Please log in.",
      });
    }

    const admin = await prisma.user.findUnique({
      where: { id: userId, role: "ADMIN" },
    });

    if (!admin) {
      return res.status(401).json({
        status: "error",
        msg: "You are not allowed to access this page",
      });
    }

    next(); // Access given
  } catch (e) {
    res.status(404).json({
      status: "failed",
      msg: "Something went wrong",
    });
  }
}
