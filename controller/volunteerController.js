import sharp from "sharp";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function createVolunteer(req, res) {
  try {
    const { name, email, phone, address, state, country, zipCode, message } =
      req.body;

    if (
      !name ||
      !email ||
      !phone ||
      !address ||
      !state ||
      !country ||
      !zipCode ||
      !message
    ) {
      return res.status(400).json({
        status: "failed",
        msg: "Kindly send all the required fields!",
      });
    }

    const volunteerForm = await prisma.volunteerForm.create({
      data: {
        name,
        email,
        phone,
        address,
        state,
        country,
        zipCode,
        message,
      },
    });

    const fileName = `volunteer-${volunteerForm.id}-${Date.now()}.jpeg`;

    if (!req.file) {
      return res.status(400).json({
        status: "failed",
        msg: "Kindly send all the required fields!",
      });
    }

    await sharp(req.file.buffer)
      .resize(1920, 1080)
      .toFormat("jpeg")
      .jpeg({ quality: 90 })
      .toFile(`uploads/blogs/${fileName}`);

    await prisma.volunteerForm.update({
      where: {
        id: volunteerForm.id,
      },
      data: {
        identityCard: fileName,
      },
    });

    res.status(201).json({
      status: "success",
      msg: "Volunteer form created successfully",
      volunteerForm,
    });
  } catch (e) {
    res.status(500).json({
      status: "failed",
      msg: "Something went wrong",
    });
  }
}

export async function getVolunteers(req, res) {
  try {
    const volunteers = await prisma.volunteerForm.findMany();

    res.status(200).json({
      status: "success",
      totalVolunteers: volunteers.length,
      volunteers,
    });
  } catch (e) {
    res.status(500).json({
      status: "failed",
      msg: "Something went wrong",
    });
  }
}

export async function getVolunteer(req, res) {
  try {
    const { id } = req.params;

    if (!id) {
      return res.status(400).json({
        status: "failed",
        msg: "Volunteer ID is required.",
      });
    }

    const volunteer = await prisma.volunteerForm.findUnique({
      where: { id },
    });

    if (!volunteer) {
      return res.status(404).json({
        status: "failed",
        msg: "Unable to find volunteer.",
      });
    }

    res.status(200).json({
      status: "success",
      volunteer,
    });
  } catch (e) {
    res.status(500).json({
      status: "failed",
      msg: "Something went wrong",
    });
  }
}
