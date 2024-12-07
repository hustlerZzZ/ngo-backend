import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function restrictTo(req, res, next) {
  try {
      const { id } = req.body;
      const admin = await prisma.user.findUnique({where :{ id, role: "ADMIN" }})
      if (!admin) {
          return res.status(401).json({
              status: "error",
              msg: "You are not allowed to access this page"
          })
      }

      next();
  } catch (e) {
      res.status(404).json({
          status: "failed",
          msg: "Something went wrong",
      });
  }
}
