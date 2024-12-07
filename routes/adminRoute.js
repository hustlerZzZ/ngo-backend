import express from "express";
import {
  deleteUser,
  getAllUsers,
  getUser,
} from "../controller/adminController.js";
import { restrictTo } from "../controller/authController.js";

const router = express.Router();

// Getting a user using id
router.get("/get-user/:id", restrictTo, getUser);

// Getting all the user's present on the user
router.get("/getAllUsers", restrictTo, getAllUsers);

// Delete a user
router.delete("/delete-user/:id", restrictTo, deleteUser);

export default router;
