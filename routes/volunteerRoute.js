import express from "express";
import {
  createVolunteer,
  getVolunteer,
  getVolunteers,
} from "../controller/volunteerController.js";
const router = express.Router();

// Create volunteer form
router.post("/create-volunteer", createVolunteer);

// Get all volunteer form
router.get("/get-all-volunteers", getVolunteers);

// Get volunteer form
router.get("/get-volunteer/:id", getVolunteer);

export default router;
