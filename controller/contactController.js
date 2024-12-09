import { PrismaClient } from "@prisma/client";
import sharp from "sharp";

const prisma = new PrismaClient();

export async function createContact(req, res) {
  try {
    const { name, email, subject, message } = req.body;

    if (!name || !email || !message || !subject) {
      return res.status(400).json({
        status: "failed",
        msg: "Kindly send all the required fields!",
      });
    }

    const contactForm = await prisma.contactForm.create({
      data: {
        name,
        email,
        subject,
        message,
      },
    });

    res.status(201).json({
      status: "success",
      msg: "Contact form created successfully",
      contactForm,
    });
  } catch (e) {
    res.status(500).json({
      status: "failed",
      msg: "Something went wrong",
    });
  }
}

export async function getContacts(req, res) {
  try {
    const contacts = await prisma.contactForm.findMany();

    res.status(200).json({
      status: "success",
      totalContacts: contacts.length,
      contacts,
    });
  } catch (e) {
    res.status(500).json({
      status: "failed",
      msg: "Something went wrong",
    });
  }
}

export async function getContact(req, res) {
  try {
    const { id } = req.params;

    if (!id) {
      return res.status(400).json({
        status: "failed",
        msg: "Contact ID is required.",
      });
    }

    const contact = await prisma.contactForm.findUnique({
      where: { id },
    });

    if (!contact) {
      return res.status(404).json({
        status: "failed",
        msg: "Unable to find contact.",
      });
    }

    res.status(200).json({
      status: "success",
      contact,
    });
  } catch (e) {
    res.status(500).json({
      status: "failed",
      msg: "Something went wrong",
    });
  }
}
