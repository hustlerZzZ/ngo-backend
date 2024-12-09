import express from "express";
import {
  createContact,
  getContact,
  getContacts,
} from "../controller/contactController.js";
const router = express.Router();

// Create contact form
router.post("/create-contact", createContact);

// Get all contact form
router.get("/get-all-contacts", getContacts);

// Get contact form
router.get("/get-contact/:id", getContact);

export default router;
